import { afterEach, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import lead from '../api/lead.js'
import outcome from '../api/distribution-outcome.js'
import adsFeed, { conversionRows } from '../api/ads-conversions.js'
import { POST as calBooking, leadFromBooking, submissionIdForBooking } from '../api/cal-booking.js'
import { createHmac } from 'node:crypto'
import { UUID_PATTERN } from '../server/distribution.js'
import { companyDomain, noteContent, syncLeadToAttio } from '../supabase/functions/lead-to-attio/attio.js'

const originalFetch = globalThis.fetch
const savedEnv = { ...process.env }
const uuid = 'c4dc7f9c-3daa-4d7d-a287-c00865ccefb1'
let calls
beforeEach(() => {
  calls = []
  process.env.SUPABASE_URL = 'https://storage.example.test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-server-key'
  process.env.DISTRIBUTION_OUTCOME_SECRET = 'test-webhook-secret'
})
afterEach(() => { globalThis.fetch = originalFetch; process.env = { ...savedEnv } })
function response() {
  return {
    statusCode: 200, body: null, headers: {},
    status(code) { this.statusCode = code; return this }, json(body) { this.body = body; return this },
    send(body) { this.body = body; return this }, setHeader(key, value) { this.headers[key] = value }, end() { return this },
  }
}
const validLead = { nombre: 'Ana Pérez', email: 'ana@empresa.test', empresa: 'Empresa', cargo: 'CFO', submission_id: uuid }

test('outcomes accept the lead email from the CRM and prefer the lead with an ads click', async () => {
  const other = '0a5b6c7d-1e2f-4a3b-8c4d-5e6f7a8b9c0d'
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options })
    if (String(url).includes('/rest/v1/leads?')) return Response.json([{ submission_id: other, attribution: {} }, { submission_id: uuid, attribution: { ads_click: { gclid: 'abc' } } }])
    return new Response(null, { status: 201 })
  }
  const res = response()
  await outcome({ method: 'POST', headers: { authorization: 'Bearer test-webhook-secret' }, body: { stage: 'qualified_lead', email: 'Ana_P@Empresa.test', event_id: 'attio:deal:1:qualified' } }, res)
  assert.equal(res.statusCode, 200)
  const lookup = new URL(calls[0].url)
  assert.equal(lookup.searchParams.get('email'), 'ilike.Ana\\_P@Empresa.test')
  assert.equal(JSON.parse(calls[1].options.body).submission_id, uuid)
})

test('an outcome for an unknown email is a 404, and one without email or submission is rejected', async () => {
  globalThis.fetch = async () => Response.json([])
  const missing = response()
  await outcome({ method: 'POST', headers: { authorization: 'Bearer test-webhook-secret' }, body: { stage: 'qualified_lead', email: 'nobody@x.test', event_id: 'e1' } }, missing)
  assert.equal(missing.statusCode, 404)
  const invalid = response()
  await outcome({ method: 'POST', headers: { authorization: 'Bearer test-webhook-secret' }, body: { stage: 'qualified_lead', event_id: 'e1' } }, invalid)
  assert.equal(invalid.statusCode, 400)
})

test('the Ads feed exports only outcomes with a gclid inside the 90-day click window', () => {
  const rows = conversionRows([
    { stage: 'qualified_lead', recorded_at: '2026-11-10T15:00:00.000Z', leads: { attribution: { ads_click: { gclid: 'G1', recorded_at: '2026-11-01T00:00:00.000Z' } } } },
    { stage: 'customer', recorded_at: '2026-11-10T15:00:00.000Z', revenue_amount: '1200.50', currency: 'USD', leads: { attribution: { ads_click: { gclid: 'G2' } } } },
    { stage: 'demo_booked', recorded_at: '2026-11-10T15:00:00.000Z', leads: { attribution: {} } },
    { stage: 'demo_booked', recorded_at: '2026-11-10T15:00:00.000Z', leads: { attribution: { ads_click: { gclid: 'OLD', recorded_at: '2026-06-01T00:00:00.000Z' } } } },
  ], { ADS_VALUE_QUALIFIED_LEAD: '50' })
  assert.deepEqual(rows, [
    ['G1', 'Relvo - Lead calificado', '2026-11-10 15:00:00+0000', '50', 'USD'],
    ['G2', 'Relvo - Cliente', '2026-11-10 15:00:00+0000', '1200.50', 'USD'],
  ])
})

test('the Ads feed requires basic auth and serves the Google Ads CSV template', async () => {
  process.env.ADS_FEED_USER = 'ads'
  process.env.ADS_FEED_PASSWORD = 'secret'
  globalThis.fetch = async () => Response.json([{ stage: 'demo_booked', recorded_at: '2026-11-10T15:00:00.000Z', leads: { attribution: { ads_click: { gclid: 'G1' } } } }])
  const denied = response()
  await adsFeed({ method: 'GET', headers: { authorization: 'Basic d3Jvbmc6d3Jvbmc=' } }, denied)
  assert.equal(denied.statusCode, 401)
  const res = response()
  await adsFeed({ method: 'GET', headers: { authorization: `Basic ${Buffer.from('ads:secret').toString('base64')}` } }, res)
  assert.equal(res.statusCode, 200)
  assert.equal(res.body, 'Parameters:TimeZone=+0000\nGoogle Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency\nG1,Relvo - Demo agendada (CRM),2026-11-10 15:00:00+0000,,\n')
})

test('with a Turnstile secret, leads need a valid token; without it the form works as before', async () => {
  globalThis.fetch = async (url, options = {}) => {
    calls.push(String(url))
    if (String(url).includes('turnstile')) return Response.json({ success: options.body.get('response') === 'good' })
    return Response.json([{ id: 'x' }], { status: 201 })
  }
  const open = response()
  await lead({ method: 'POST', body: validLead }, open)
  assert.equal(open.statusCode, 200)
  process.env.TURNSTILE_SECRET_KEY = 'ts-secret'
  const blocked = response()
  await lead({ method: 'POST', body: { ...validLead, turnstile_token: 'bad' } }, blocked)
  assert.equal(blocked.statusCode, 403)
  const missing = response()
  await lead({ method: 'POST', body: validLead }, missing)
  assert.equal(missing.statusCode, 403)
  const ok = response()
  await lead({ method: 'POST', body: { ...validLead, turnstile_token: 'good' }, headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.1' } }, ok)
  assert.equal(ok.statusCode, 200)
})

test('Attio sync asserts company by work domain, person by email, and adds a context note', async () => {
  const requests = []
  const fetcher = async (url, options) => {
    requests.push({ url, method: options.method, data: JSON.parse(options.body).data })
    const id = url.includes('companies') ? 'company-1' : url.includes('people') ? 'person-1' : 'note-1'
    return Response.json({ data: { id: { record_id: id, note_id: id } } })
  }
  const result = await syncLeadToAttio({ ...validLead, fuente: 'agendar_demo', problema: 'Cobro por uso', attribution: { ads_click: { gclid: 'G1', utm_campaign: 'b2b' } } }, { apiKey: 'k', fetcher })
  assert.deepEqual(result, { person: 'person-1', company: 'company-1' })
  assert.match(requests[0].url, /companies\/records\?matching_attribute=domains$/)
  assert.deepEqual(requests[0].data.values, { domains: [{ domain: 'empresa.test' }] })
  assert.deepEqual(requests[1].data.values.email_addresses, [{ email_address: 'ana@empresa.test' }])
  assert.deepEqual(requests[1].data.values.job_title, [{ value: 'CFO' }])
  assert.equal(requests[1].data.values.company[0].target_record_id, 'company-1')
  assert.equal(requests[1].data.values.name[0].last_name, 'Pérez')
  assert.equal(requests[2].data.parent_record_id, 'person-1')
  assert.match(requests[2].data.content, /Campaña de Google Ads: b2b/)
})

test('personal email domains never create a company', async () => {
  assert.equal(companyDomain('ana@gmail.com'), null)
  assert.equal(companyDomain('ana@Relvo.AI'), 'relvo.ai')
  const requests = []
  const fetcher = async (url, options) => { requests.push(url); return Response.json({ data: { id: { record_id: 'p' } } }, { status: options.method === 'POST' ? 200 : 200 }) }
  const result = await syncLeadToAttio({ ...validLead, email: 'ana@gmail.com' }, { apiKey: 'k', fetcher })
  assert.equal(result.company, null)
  assert.ok(!requests.some((url) => url.includes('companies')))
  assert.ok(!noteContent({}).length)
})

test('Attio errors surface without lead data', async () => {
  const fetcher = async () => new Response('{"message":"bad"}', { status: 400 })
  await assert.rejects(syncLeadToAttio(validLead, { apiKey: 'k', fetcher }), (error) => !error.message.includes('ana@') && /Attio PUT/.test(error.message))
})

test('Attio rate limits and outages are retried, honoring Retry-After', async () => {
  const waits = []
  let calls = 0
  const fetcher = async () => {
    calls++
    if (calls === 1) return new Response('{}', { status: 429, headers: { 'retry-after': '2' } })
    if (calls === 2) return new Response('{}', { status: 503 })
    return Response.json({ data: { id: { record_id: `r${calls}` } } })
  }
  const result = await syncLeadToAttio(validLead, { apiKey: 'k', fetcher, sleep: async (ms) => { waits.push(ms) } })
  assert.equal(result.company, 'r3')
  assert.deepEqual(waits, [2000, 2000])
  const failing = async () => new Response('{}', { status: 503 })
  await assert.rejects(syncLeadToAttio(validLead, { apiKey: 'k', fetcher: failing, sleep: async () => {} }), /failed \(503\)/)
})

const booking = {
  uid: 'bk_123', additionalNotes: 'Cobramos por uso',
  attendees: [{ name: 'Ana Pérez', email: 'ana@empresa.test' }],
  responses: { name: { value: 'Ana Pérez' }, email: { value: 'ana@empresa.test' }, empresa: { value: 'Empresa SpA' } },
  metadata: { gclid: 'Cj0KCQ_abc-1', utm_campaign: 'b2b', recorded_at: '2026-11-01T00:00:00.000Z' },
}

test('booking context is kept with the lead without treating it as ad attribution', () => {
  const lead = leadFromBooking({ ...booking, metadata: { ...booking.metadata, plan: 'startup', intent: 'demo', locale: 'en' } })
  assert.equal(lead.problema, 'Plan: startup\nRequest: demo\nCobramos por uso')
  assert.equal(lead.attribution.ads_click.plan, undefined)
  const invalid = leadFromBooking({ ...booking, metadata: { plan: '<script>', intent: 'unknown' } })
  assert.equal(invalid.problema, 'Cobramos por uso')
})
function signed(body, secret = 'cal-secret') {
  const raw = JSON.stringify(body)
  return new Request('https://getrelvo.ai/api/cal-booking', { method: 'POST', body: raw, headers: { 'x-cal-signature-256': createHmac('sha256', secret).update(raw).digest('hex') } })
}

test('a Cal.com booking becomes one lead with its ads click plus a demo_booked stage, idempotently', async () => {
  process.env.CAL_WEBHOOK_SECRET = 'cal-secret'
  const writes = []
  globalThis.fetch = async (url, options) => { writes.push({ url: String(url), body: JSON.parse(options.body), prefer: options.headers.Prefer }); return new Response(null, { status: 201 }) }
  const res = await calBooking(signed({ triggerEvent: 'BOOKING_CREATED', payload: booking }))
  assert.equal(res.status, 200)
  const [lead, stage] = writes
  assert.match(lead.url, /leads\?on_conflict=submission_id$/)
  assert.match(lead.prefer, /ignore-duplicates/)
  assert.equal(lead.body.submission_id, submissionIdForBooking('bk_123'))
  assert.ok(UUID_PATTERN.test(lead.body.submission_id))
  assert.equal(lead.body.empresa, 'Empresa SpA')
  assert.equal(lead.body.fuente, 'cal_booking')
  assert.equal(lead.body.problema, 'Cobramos por uso')
  assert.deepEqual(lead.body.attribution.ads_click, { gclid: 'Cj0KCQ_abc-1', utm_campaign: 'b2b', recorded_at: '2026-11-01T00:00:00.000Z' })
  assert.deepEqual(stage.body, { event_id: 'cal:bk_123:demo_booked', submission_id: lead.body.submission_id, stage: 'demo_booked' })
  assert.equal(submissionIdForBooking('bk_123'), submissionIdForBooking('bk_123'))
})

test('the Cal.com webhook rejects bad signatures and ignores pings and other triggers', async () => {
  process.env.CAL_WEBHOOK_SECRET = 'cal-secret'
  globalThis.fetch = async () => { throw new Error('must not write') }
  assert.equal((await calBooking(signed({ triggerEvent: 'BOOKING_CREATED', payload: booking }, 'wrong'))).status, 401)
  const unsigned = new Request('https://getrelvo.ai/api/cal-booking', { method: 'POST', body: '{}' })
  assert.equal((await calBooking(unsigned)).status, 401)
  assert.deepEqual(await (await calBooking(signed({ triggerEvent: 'PING' }))).json(), { skipped: true })
  assert.deepEqual(await (await calBooking(signed({ triggerEvent: 'BOOKING_CANCELLED', payload: booking }))).json(), { skipped: true })
  assert.equal((await calBooking(signed({ triggerEvent: 'BOOKING_CREATED', payload: { uid: 'x', attendees: [] } }))).status, 400)
  delete process.env.CAL_WEBHOOK_SECRET
  assert.equal((await calBooking(signed({ triggerEvent: 'BOOKING_CREATED', payload: booking }))).status, 503)
})

test('a booking without an ads click keeps its campaign as the last touch', () => {
  const lead = leadFromBooking({ ...booking, responses: {}, metadata: { utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'lanzamiento' } })
  assert.equal(lead.attribution.ads_click, null)
  assert.equal(lead.attribution.last_touch.utm_source, 'linkedin')
  assert.equal(lead.empresa, null)
  assert.equal(lead.nombre, 'Ana Pérez')
})
