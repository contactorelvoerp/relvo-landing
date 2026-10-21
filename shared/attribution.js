// Public references identify attribution only: they never authorize document access.
export const REFERENCE_PATTERN = /^v1\.[a-f0-9]{64}$/
const CAMPAIGN_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
const TOKEN = /^[a-zA-Z0-9_. -]{1,100}$/
const SURFACES = new Set(['billing_cycle_preview', 'invoice_next', 'invoice_next_occurrence'])

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
  if (typeof value.recorded_at === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value.recorded_at) && Number.isFinite(Date.parse(value.recorded_at))) touch.recorded_at = value.recorded_at
  return touch.utm_source || touch.reference ? touch : null
}

export function cleanAttribution(value) {
  return { first_touch: cleanTouch(value?.first_touch), last_touch: cleanTouch(value?.last_touch) }
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
