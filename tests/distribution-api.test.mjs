import { afterEach, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import lead from '../api/lead.js'
import event from '../api/distribution-event.js'
import outcome from '../api/distribution-outcome.js'

const originalFetch = globalThis.fetch
const savedEnv = { ...process.env }
let calls
beforeEach(() => {
  calls = []
  process.env.SUPABASE_URL = 'https://storage.example.test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-server-key'
  process.env.DISTRIBUTION_OUTCOME_SECRET = 'test-webhook-secret'
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options, body: JSON.parse(options.body) })
    return new Response(JSON.stringify([{ id: 'lead-id' }]), { status: 201 })
  }
})
afterEach(() => { globalThis.fetch = originalFetch; process.env = { ...savedEnv } })
const uuid = 'c4dc7f9c-3daa-4d7d-a287-c00865ccefb1'
const reference = `v1.${'a'.repeat(64)}`
function response() {
  return { statusCode: 200, body: null, status(code) { this.statusCode = code; return this }, json(body) { this.body = body; return this }, end() { return this } }
}
const validLead = { nombre: 'Test', email: 'test@example.test', empresa: 'Example', cargo: 'RevOps', submission_id: uuid, fuente: 'agendar_demo', url_origen: 'https://getrelvo.ai/agendar-demo?client_id=secret', attribution: { first_touch: { utm_source: 'prefactura', utm_medium: 'pdf', utm_campaign: 'powered_by_relvo', reference } } }

test('lead storage preserves campaign attribution and submission identity, strips private URLs, and ignores unknown fields', async () => {
  const res = response()
  await lead({ method: 'POST', body: { ...validLead, secret: 'ignored' } }, res)
  assert.equal(res.statusCode, 200)
  assert.equal(res.body.duplicate, false)
  assert.match(calls[0].url, /on_conflict=submission_id/)
  assert.equal(calls[0].body.attribution.first_touch.reference, reference)
  assert.equal(calls[0].body.url_origen, 'https://getrelvo.ai/agendar-demo')
  assert.equal(calls[0].body.secret, undefined)
})

test('a retry confirms the existing lead while honeypot acknowledgments never confirm storage', async () => {
  globalThis.fetch = async () => new Response('[]', { status: 201 })
  const res = response()
  await lead({ method: 'POST', body: validLead }, res)
  assert.equal(res.body.duplicate, true)
  assert.equal(res.body.recorded, true)
  const trapped = response()
  await lead({ method: 'POST', body: { website: 'bot' } }, trapped)
  assert.equal(trapped.body.duplicate, true)
  assert.equal(trapped.body.recorded, false)
})

test('older deployed forms remain valid after the additive schema migration', async () => {
  const body = { ...validLead }; delete body.submission_id; delete body.attribution
  const res = response()
  await lead({ method: 'POST', body }, res)
  assert.equal(res.statusCode, 200)
  assert.equal(calls[0].url, 'https://storage.example.test/rest/v1/leads')
})

test('first-party events are origin checked, deduplicated, and cannot claim a conversion', async () => {
  const request = { method: 'POST', headers: { origin: 'https://getrelvo.ai' }, body: { event_name: 'powered_by_landing', reference, visitor_id: uuid, email: 'not-stored@example.test' } }
  const res = response(); await event(request, res)
  assert.equal(res.statusCode, 204)
  assert.deepEqual(calls[0].body, { event_name: 'powered_by_landing', reference, visitor_id: uuid })
  assert.match(calls[0].url, /on_conflict=reference,visitor_id,event_name/)
  const blocked = response(); await event({ ...request, headers: { origin: 'https://other.test' } }, blocked)
  assert.equal(blocked.statusCode, 403)
  const forged = response(); await event({ ...request, body: { ...request.body, event_name: 'customer' } }, forged)
  assert.equal(forged.statusCode, 400)
})

test('CRM milestones require authentication and preserve exact decimal revenue with currency', async () => {
  const request = { method: 'POST', headers: { authorization: 'Bearer test-webhook-secret' }, body: { event_id: 'attio:change:123', submission_id: uuid, stage: 'customer', customer_reference: 'attio:company:1', revenue_amount: '123456789.123456', currency: 'CLP' } }
  const blocked = response(); await outcome({ ...request, headers: {} }, blocked)
  assert.equal(blocked.statusCode, 401)
  assert.equal(calls.length, 0)
  const res = response(); await outcome(request, res)
  assert.equal(res.statusCode, 200)
  assert.equal(calls[0].body.revenue_amount, '123456789.123456')
  const rounded = response(); await outcome({ ...request, body: { ...request.body, revenue_amount: 123.45 } }, rounded)
  assert.equal(rounded.statusCode, 400)
})

test('tracking outages fail visibly without exposing storage responses', async () => {
  globalThis.fetch = async () => { throw new Error('network unavailable') }
  const res = response()
  await event({ method: 'POST', headers: { origin: 'https://getrelvo.ai' }, body: { event_name: 'powered_by_landing', reference, visitor_id: uuid } }, res)
  assert.equal(res.statusCode, 502)
})
