// Lead (fila nueva de public.leads) → Attio: empresa por dominio, persona por email (enlazada a la
// empresa) y una nota con el contexto del formulario. Sin dependencias de Deno ni de Node: lo usa
// la Edge Function (index.ts) y lo prueban los tests (tests/growth-loop.test.mjs).
// API: https://docs.attio.com/rest-api — "upsert" (PUT con matching_attribute) crea o actualiza según
// el atributo único. Los valores van en el formato de objetos del esquema de Attio (domains →
// {domain}, email_addresses → {email_address}, job_title → {value}). Scopes del token:
// record_permission:read-write, object_configuration:read y note:read-write.

const API = 'https://api.attio.com/v2'

// Correos personales: no identifican a la empresa, así que no se crea una empresa con ese dominio.
const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'hotmail.com', 'hotmail.es', 'outlook.com', 'outlook.es', 'live.com', 'live.cl',
  'msn.com', 'yahoo.com', 'yahoo.es', 'yahoo.com.ar', 'yahoo.com.mx', 'icloud.com', 'me.com', 'mac.com',
  'proton.me', 'protonmail.com', 'aol.com', 'gmx.com', 'zoho.com', 'yandex.com',
])

export function companyDomain(email) {
  const domain = String(email ?? '').trim().toLowerCase().split('@')[1]
  return domain && !PERSONAL_DOMAINS.has(domain) && /^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain) ? domain : null
}

export function personName(nombre, email) {
  const full = String(nombre ?? '').trim() || String(email).split('@')[0]
  const [first, ...rest] = full.split(/\s+/)
  return [{ first_name: first, last_name: rest.join(' '), full_name: full }]
}

const campaign = (touch) => (touch ? [touch.utm_source, touch.utm_medium, touch.utm_campaign].filter(Boolean).join(' / ') : null)

export function noteContent(lead) {
  const attribution = lead.attribution ?? {}
  const lines = [
    ['Empresa (formulario)', lead.empresa],
    ['Cargo', lead.cargo],
    ['Teléfono', lead.telefono],
    ['Problema', lead.problema],
    ['Formulario', lead.fuente],
    ['Página', lead.url_origen],
    ['Primera campaña', campaign(attribution.first_touch)],
    ['Última campaña', campaign(attribution.last_touch)],
    ['Campaña de Google Ads', attribution.ads_click ? [attribution.ads_click.utm_campaign, attribution.ads_click.utm_term].filter(Boolean).join(' / ') || 'sí (gclid)' : null],
    ['ID de solicitud', lead.submission_id],
  ]
  return lines.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join('\n')
}

const recordId = (record) => {
  const id = record?.id?.record_id
  if (typeof id !== 'string') throw new Error('Attio response without record id')
  return id
}

// Los webhooks de base de datos de Supabase no reintentan: un 429 o un 5xx de Attio se reintenta
// acá (respetando Retry-After, máximo 3 intentos). Las escrituras son upserts, así que repetir es seguro;
// la nota solo se reintenta si Attio no la procesó (429/5xx).
const ATTEMPTS = 3
const RETRYABLE = new Set([429, 500, 502, 503, 504])

async function attio(fetcher, apiKey, method, path, data, sleep) {
  for (let attempt = 1; ; attempt++) {
    const response = await fetcher(`${API}${path}`, {
      method,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    })
    if (response.ok) return (await response.json()).data
    if (!RETRYABLE.has(response.status) || attempt === ATTEMPTS) throw new Error(`Attio ${method} ${path.split('?')[0]} failed (${response.status})`)
    const retryAfter = Number(response.headers.get('retry-after'))
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter, 10) * 1000 : 500 * 2 ** attempt)
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function syncLeadToAttio(lead, { apiKey, fetcher = fetch, sleep = wait }) {
  if (!lead?.email) throw new Error('Lead without email')
  const domain = companyDomain(lead.email)
  // Solo el dominio: Attio completa nombre, logo y datos de la empresa por su cuenta, y así no se
  // pisa un nombre ya curado en el CRM con lo que alguien escribió en el formulario.
  const company = domain
    ? await attio(fetcher, apiKey, 'PUT', '/objects/companies/records?matching_attribute=domains', { values: { domains: [{ domain }] } }, sleep)
    : null
  const person = await attio(fetcher, apiKey, 'PUT', '/objects/people/records?matching_attribute=email_addresses', {
    values: {
      email_addresses: [{ email_address: lead.email.trim() }],
      name: personName(lead.nombre, lead.email),
      ...(lead.cargo && lead.cargo !== 'Otro' ? { job_title: [{ value: lead.cargo }] } : {}),
      ...(company ? { company: [{ target_object: 'companies', target_record_id: recordId(company) }] } : {}),
    },
  }, sleep)
  await attio(fetcher, apiKey, 'POST', '/notes', {
    parent_object: 'people',
    parent_record_id: recordId(person),
    title: lead.fuente === 'cal_booking' ? 'Reserva de demo (Cal.com)' : `Formulario web: ${lead.fuente ?? 'sitio'}`,
    format: 'plaintext',
    content: noteContent(lead),
  }, sleep)
  return { person: recordId(person), company: company ? recordId(company) : null }
}
