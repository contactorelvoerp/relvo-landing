import { cleanAttribution } from '../../../shared/attribution.js'

// Google Ads click identifiers for this campaign's landing page: captured from the URL on
// arrival and kept in a dedicated first-party cookie for 90 days (brief: enhanced conversions
// and offline imports need gclid to survive the time between the click and the booked demo).
// Separate from the site-wide attribution in src/attribution.js (localStorage, 30 days, a
// different shape) so this page's needs don't change that system's retention or validation.
const COOKIE = 'relvo_ads_click'
const DAYS = 90
const KEYS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

function readCookie() {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`))
  if (!match) return null
  try { return JSON.parse(decodeURIComponent(match[1])) } catch { return null }
}

function writeCookie(value) {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(value))}; max-age=${DAYS * 24 * 60 * 60}; path=/; SameSite=Lax${secure}`
}

// Call once when the page mounts. A click with no tracking params (e.g. a direct repeat visit)
// never overwrites an existing cookie from the original ad click.
export function captureAdsClick() {
  const params = new URLSearchParams(window.location.search)
  const found = {}
  for (const key of KEYS) {
    const value = params.get(key)
    if (value) found[key] = value
  }
  if (Object.keys(found).length === 0) return
  writeCookie({ ...found, recorded_at: new Date().toISOString() })
}

// Sanitized the same way the server does, so what the form sends and what Supabase stores match.
export function getAdsClick() {
  return cleanAttribution({ ads_click: readCookie() }).ads_click
}
