import { REFERENCE_PATTERN, UUID_PATTERN, sameOrigin, storageConfig } from '../server/distribution.js'

const EVENTS = new Set(['powered_by_landing', 'powered_by_demo_click', 'powered_by_form_start'])

// Record bounded first-party funnel events. A recipient cannot write conversion
// outcomes here; successful leads and CRM milestones have separate authorities.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Invalid origin' })
  const body = req.body
  if (!body || !EVENTS.has(body.event_name) || !REFERENCE_PATTERN.test(body.reference ?? '') || !UUID_PATTERN.test(body.visitor_id ?? '')) return res.status(400).json({ error: 'Invalid event' })
  const config = storageConfig()
  if (!config) return res.status(503).json({ error: 'Event storage not configured' })
  try {
    const result = await fetch(`${config.url}/rest/v1/distribution_events?on_conflict=reference,visitor_id,event_name`, {
      method: 'POST', headers: { ...config.headers, Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify({ reference: body.reference, visitor_id: body.visitor_id, event_name: body.event_name }),
      signal: AbortSignal.timeout(5000),
    })
    if (!result.ok) return res.status(502).json({ error: 'Could not record event' })
    return res.status(204).end()
  } catch { return res.status(502).json({ error: 'Could not record event' }) }
}
