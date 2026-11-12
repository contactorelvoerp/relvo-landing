import { timingSafeEqual } from 'node:crypto'
import { storageConfig } from '../server/distribution.js'

// Feed CSV de conversiones offline para Google Ads (subidas programadas por HTTPS). Cada etapa del
// CRM que llega a distribution_outcomes (api/distribution-outcome.js, desde Attio) vuelve a Google
// Ads atada al gclid del click que trajo al lead, para que la puja optimice por leads calificados,
// demos y clientes, no por formularios. Guía de configuración: docs/medicion-y-aprendizaje.md.
//
// Variables de entorno (Vercel):
//   ADS_FEED_USER / ADS_FEED_PASSWORD   usuario y contraseña que se cargan en Google Ads (Basic auth)
//   ADS_CONVERSION_<ETAPA>              nombre exacto de la acción de conversión en Google Ads
//   ADS_VALUE_<ETAPA>                   valor fijo opcional (USD) cuando la etapa no trae ingreso
//   <ETAPA> = QUALIFIED_LEAD | DEMO_BOOKED | CUSTOMER

const STAGES = {
  qualified_lead: { name: 'Relvo - Lead calificado', env: 'QUALIFIED_LEAD' },
  demo_booked: { name: 'Relvo - Demo agendada (CRM)', env: 'DEMO_BOOKED' },
  customer: { name: 'Relvo - Cliente', env: 'CUSTOMER' },
}
// Google rechaza conversiones de clicks con más de 90 días.
const CLICK_WINDOW_MS = 90 * 24 * 60 * 60 * 1000
const HEADER = ['Google Click ID', 'Conversion Name', 'Conversion Time', 'Conversion Value', 'Conversion Currency']

function authorized(req) {
  const user = process.env.ADS_FEED_USER
  const password = process.env.ADS_FEED_PASSWORD
  const header = req.headers?.authorization
  if (!user || !password || typeof header !== 'string') return false
  const expected = Buffer.from(`Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`)
  const actual = Buffer.from(header)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

const csvField = (value) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)
// "yyyy-MM-dd HH:mm:ssZ" en UTC. La zona va en cada fila y también en Parameters:TimeZone: la ayuda
// de Google Ads lo recomienda porque la zona faltante es la causa de error más común en las cargas.
const adsTime = (iso) => `${new Date(iso).toISOString().replace('T', ' ').slice(0, 19)}+0000`

export function conversionRows(outcomes, env = process.env) {
  const rows = []
  for (const outcome of outcomes) {
    const stage = STAGES[outcome.stage]
    const click = outcome.leads?.attribution?.ads_click
    if (!stage || typeof click?.gclid !== 'string' || !Number.isFinite(Date.parse(outcome.recorded_at))) continue
    const clickedAt = Date.parse(click.recorded_at ?? '')
    if (Number.isFinite(clickedAt) && Date.parse(outcome.recorded_at) - clickedAt > CLICK_WINDOW_MS) continue
    const fixedValue = env[`ADS_VALUE_${stage.env}`]
    const value = outcome.revenue_amount != null && outcome.currency ? [String(outcome.revenue_amount), outcome.currency]
      : /^\d{1,12}(\.\d{1,2})?$/.test(fixedValue ?? '') ? [fixedValue, 'USD'] : ['', '']
    rows.push([click.gclid, env[`ADS_CONVERSION_${stage.env}`] || stage.name, adsTime(outcome.recorded_at), ...value])
  }
  return rows
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).json({ error: 'Method not allowed' })
  if (!authorized(req)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="ads-conversions"')
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const config = storageConfig()
  if (!config) return res.status(503).json({ error: 'Outcome storage not configured' })
  const since = new Date(Date.now() - CLICK_WINDOW_MS).toISOString()
  const query = new URLSearchParams({ select: 'stage,recorded_at,revenue_amount,currency,leads(attribution)', recorded_at: `gte.${since}`, order: 'recorded_at.asc' })
  try {
    const result = await fetch(`${config.url}/rest/v1/distribution_outcomes?${query}`, { headers: config.headers, signal: AbortSignal.timeout(10000) })
    if (!result.ok) return res.status(502).json({ error: 'Could not read outcomes' })
    const lines = ['Parameters:TimeZone=+0000', HEADER.join(','), ...conversionRows(await result.json()).map((row) => row.map(csvField).join(','))]
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('X-Robots-Tag', 'noindex')
    return res.status(200).send(`${lines.join('\n')}\n`)
  } catch { return res.status(502).json({ error: 'Could not read outcomes' }) }
}
