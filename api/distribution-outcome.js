// Authenticated CRM webhook. Attio/booking automation supplies a stable event_id
// and the lead submission_id; retries append a milestone at most once.
import { timingSafeEqual } from 'node:crypto'
import { UUID_PATTERN, storageConfig } from '../server/distribution.js'

const STAGES = new Set(['qualified_lead', 'demo_booked', 'customer'])
function authorized(req) {
  const secret = process.env.DISTRIBUTION_OUTCOME_SECRET
  const header = req.headers?.authorization
  if (!secret || typeof header !== 'string') return false
  const expected = Buffer.from(`Bearer ${secret}`)
  const actual = Buffer.from(header)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' })
  const body = req.body
  if (!body || !STAGES.has(body.stage) || !UUID_PATTERN.test(body.submission_id ?? '') || typeof body.event_id !== 'string' || !/^[a-zA-Z0-9_.:-]{1,160}$/.test(body.event_id)) return res.status(400).json({ error: 'Invalid outcome' })
  if (body.stage === 'customer' && (typeof body.customer_reference !== 'string' || !/^[a-zA-Z0-9_.:-]{1,160}$/.test(body.customer_reference))) return res.status(400).json({ error: 'Invalid customer reference' })
  // Decimal strings throughout; never pass revenue through a JS number.
  const hasRevenue = body.revenue_amount !== undefined || body.currency !== undefined
  if (hasRevenue && (body.stage !== 'customer' || typeof body.revenue_amount !== 'string' || !/^\d{1,14}(\.\d{1,6})?$/.test(body.revenue_amount) || typeof body.currency !== 'string' || !/^[A-Z]{3}$/.test(body.currency))) return res.status(400).json({ error: 'Invalid revenue' })
  const config = storageConfig()
  if (!config) return res.status(503).json({ error: 'Outcome storage not configured' })
  try {
    const result = await fetch(`${config.url}/rest/v1/distribution_outcomes?on_conflict=${body.stage === 'customer' ? 'customer_reference' : 'submission_id,stage'}`, {
      method: 'POST', headers: { ...config.headers, Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify({ event_id: body.event_id, submission_id: body.submission_id, stage: body.stage, ...(body.stage === 'customer' ? { customer_reference: body.customer_reference } : {}), ...(hasRevenue ? { revenue_amount: body.revenue_amount, currency: body.currency } : {}) }),
      signal: AbortSignal.timeout(5000),
    })
    if (!result.ok) return res.status(502).json({ error: 'Could not record outcome' })
    return res.status(200).json({ ok: true })
  } catch { return res.status(502).json({ error: 'Could not record outcome' }) }
}
