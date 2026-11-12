// Public references identify attribution only: they never authorize document access.
export const REFERENCE_PATTERN = /^v1\.[a-f0-9]{64}$/
const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
const TOKEN = /^[a-zA-Z0-9_. -]{1,100}$/
const SURFACES = new Set(['billing_cycle_preview', 'invoice_next', 'invoice_next_occurrence'])
// Google Ads click identifiers (paid landing pages): kept separate from first/last touch
// because they identify one specific ad click, not a marketing channel, and have their own
// 90-day retention in a dedicated cookie (src/pages/landing-ads/ads-click.js), not the 30-day
// localStorage window above.
const ADS_CLICK_KEYS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
// gclid/gbraid/wbraid: Google no fija un largo máximo y los reales pasan a veces de 100 caracteres;
// un click descartado acá es una conversión offline perdida (api/ads-conversions.js).
const CLICK_IDS = new Set(['gclid', 'gbraid', 'wbraid'])
const CLICK_ID = /^[a-zA-Z0-9_-]{1,512}$/
const RECORDED_AT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

function cleanTouch(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const touch = {}
  for (const key of CAMPAIGN_KEYS) {
    if (typeof value[key] === 'string' && TOKEN.test(value[key])) touch[key] = value[key]
  }
  if (typeof value.reference === 'string' && REFERENCE_PATTERN.test(value.reference)) touch.reference = value.reference
  if (SURFACES.has(value.surface)) touch.surface = value.surface
  // Record a route, never a full URL containing billing IDs or form data.
  if (typeof value.landing_path === 'string' && /^\/[a-zA-Z0-9/_-]{0,180}$/.test(value.landing_path)) touch.landing_path = value.landing_path
  if (typeof value.recorded_at === 'string' && RECORDED_AT.test(value.recorded_at) && Number.isFinite(Date.parse(value.recorded_at))) touch.recorded_at = value.recorded_at
  return touch.utm_source || touch.reference ? touch : null
}

function cleanAdsClick(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const click = {}
  for (const key of ADS_CLICK_KEYS) {
    if (typeof value[key] === 'string' && (CLICK_IDS.has(key) ? CLICK_ID : TOKEN).test(value[key])) click[key] = value[key]
  }
  if (typeof value.recorded_at === 'string' && RECORDED_AT.test(value.recorded_at) && Number.isFinite(Date.parse(value.recorded_at))) click.recorded_at = value.recorded_at
  return Object.keys(click).length ? click : null
}

export function cleanAttribution(value) {
  return { first_touch: cleanTouch(value?.first_touch), last_touch: cleanTouch(value?.last_touch), ads_click: cleanAdsClick(value?.ads_click) }
}

export function touchFromUrl(href, now) {
  const url = new URL(href)
  return cleanTouch({ ...Object.fromEntries(url.searchParams), reference: url.searchParams.get('ref'), landing_path: url.pathname, recorded_at: now.toISOString() })
}

export function analyticsUrl(href) {
  try {
    const url = new URL(href)
    const params = new URLSearchParams()
    for (const key of CAMPAIGN_KEYS) {
      const value = url.searchParams.get(key)
      if (TOKEN.test(value ?? '')) params.set(key, value)
    }
    return `${url.origin}${url.pathname}${params.size ? `?${params}` : ''}`
  } catch { return '' }
}

export function isPoweredBy(touch) {
  return touch?.utm_source === 'prefactura' && touch?.utm_medium === 'pdf' && touch?.utm_campaign === 'powered_by_relvo'
}
