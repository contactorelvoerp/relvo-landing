import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { cleanAttribution } from '../shared/attribution.js'
import { storageConfig } from '../server/distribution.js'

// Webhook de Cal.com (BOOKING_CREATED) → lead en Supabase + etapa demo_booked.
// El evento del embed (bookingSuccessfulV2) no trae nombre ni email de quien reserva, así que la
// reserva solo se puede registrar desde el servidor. Con la fila en `leads` corren los mismos
// webhooks que con un formulario (Slack en api/lead-notify.js, Attio en supabase/functions/lead-to-attio)
// y el gclid de la metadata del booking (src/components/CalEmbed.jsx) llega al feed de Google Ads.
// Configuración: docs/medicion-y-aprendizaje.md §Reservas de Cal.com.
//
// Variables de entorno: CAL_WEBHOOK_SECRET (el "secret" del webhook en Cal.com), SUPABASE_URL y
// SUPABASE_SERVICE_ROLE_KEY.
//
// Firma web (Request → Response) porque la verificación HMAC necesita el cuerpo tal cual llegó.

const MAX_BODY = 256 * 1024
const ADS_KEYS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
const text = (value, max = 2000) => (typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null)

function validSignature(raw, header, secret) {
  if (typeof header !== 'string' || !/^[a-f0-9]{64}$/i.test(header)) return false
  const expected = createHmac('sha256', secret).update(raw).digest()
  return timingSafeEqual(expected, Buffer.from(header, 'hex'))
}

// Mismo booking → mismo submission_id (UUID v4 derivado del uid): los reintentos de Cal.com no
// duplican el lead ni la etapa.
export function submissionIdForBooking(uid) {
  const hex = createHash('sha256').update(`cal:${uid}`).digest('hex')
  const variant = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}

// Respuesta de un campo del formulario de reserva de Cal.com (`responses.<slug>.value` o el valor directo).
function response(responses, pattern) {
  for (const [key, entry] of Object.entries(responses ?? {})) {
    if (!pattern.test(key)) continue
    const value = typeof entry === 'object' && entry !== null ? entry.value : entry
    if (typeof value === 'string' && value.trim()) return value
  }
  return null
}

// Booking metadata values are strings. Revalidate referral touches before saving them.
function referralTouch(value) {
  if (typeof value !== 'string' || value.length > 2000) return null
  try { return JSON.parse(value) } catch { return null }
}

export function leadFromBooking(booking) {
  const attendee = booking.attendees?.[0] ?? {}
  const responses = booking.responses ?? {}
  const email = text(attendee.email ?? response(responses, /^email$/i), 320)
  if (!booking.uid || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  const metadata = booking.metadata ?? {}
  const adsClick = Object.fromEntries(ADS_KEYS.filter((key) => typeof metadata[key] === 'string').map((key) => [key, metadata[key]]))
  const recordedAt = typeof metadata.recorded_at === 'string' ? metadata.recorded_at : undefined
  // Con gclid/gbraid/wbraid es un click de Ads; si solo hay UTM, es la campaña de la visita.
  const isAdsClick = ['gclid', 'gbraid', 'wbraid'].some((key) => adsClick[key])
  return {
    submission_id: submissionIdForBooking(booking.uid),
    nombre: text(attendee.name ?? response(responses, /^name$/i), 200) ?? email.split('@')[0],
    email,
    empresa: text(response(responses, /company|empresa|organi[sz]ation/i), 200),
    cargo: text(response(responses, /cargo|role|title|puesto/i), 200),
    problema: text([
      ['startup', 'custom', 'undecided'].includes(metadata.plan) && `Plan: ${metadata.plan}`,
      ['demo', 'proposal'].includes(metadata.intent) && `Request: ${metadata.intent}`,
      text(response(responses, /^notes$|problema|message|mensaje/i) ?? booking.additionalNotes),
    ].filter(Boolean).join('\n')),
    fuente: 'cal_booking',
    attribution: cleanAttribution({
      first_touch: referralTouch(metadata.relvo_first_touch),
      last_touch: referralTouch(metadata.relvo_last_touch) ?? (!isAdsClick ? { ...adsClick, recorded_at: recordedAt } : null),
      ads_click: isAdsClick ? { ...adsClick, recorded_at: recordedAt } : null,
    }),
  }
}

const json = (body, status = 200) => Response.json(body, { status })

export async function POST(request) {
  const secret = process.env.CAL_WEBHOOK_SECRET
  if (!secret) return json({ error: 'Webhook not configured' }, 503)
  const raw = await request.text()
  if (raw.length > MAX_BODY) return json({ error: 'Payload too large' }, 413)
  if (!validSignature(raw, request.headers.get('x-cal-signature-256'), secret)) return json({ error: 'Invalid signature' }, 401)

  let event
  try { event = JSON.parse(raw) } catch { return json({ error: 'Invalid JSON' }, 400) }
  // Cal.com manda un ping al guardar el webhook; las demás etapas (reprogramación, cancelación) no son una demo nueva.
  if (event?.triggerEvent !== 'BOOKING_CREATED') return json({ skipped: true })
  const lead = leadFromBooking(event.payload ?? {})
  if (!lead) return json({ error: 'Booking without attendee email' }, 400)

  const config = storageConfig()
  if (!config) return json({ error: 'Lead storage not configured' }, 503)
  try {
    const insert = await fetch(`${config.url}/rest/v1/leads?on_conflict=submission_id`, {
      method: 'POST', headers: { ...config.headers, Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify(lead), signal: AbortSignal.timeout(5000),
    })
    if (!insert.ok) {
      console.error('[cal-booking] lead insert failed', insert.status)
      return json({ error: 'Could not save lead' }, 502)
    }
    const outcome = await fetch(`${config.url}/rest/v1/distribution_outcomes?on_conflict=submission_id,stage`, {
      method: 'POST', headers: { ...config.headers, Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify({ event_id: `cal:${event.payload.uid}:demo_booked`.slice(0, 160), submission_id: lead.submission_id, stage: 'demo_booked' }),
      signal: AbortSignal.timeout(5000),
    })
    if (!outcome.ok) {
      console.error('[cal-booking] outcome insert failed', outcome.status)
      return json({ error: 'Could not record booking' }, 502)
    }
    return json({ ok: true })
  } catch {
    console.error('[cal-booking] storage unavailable')
    return json({ error: 'Storage unavailable' }, 502)
  }
}
