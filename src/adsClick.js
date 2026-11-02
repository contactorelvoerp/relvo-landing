import { cleanAttribution } from '../shared/attribution.js'

// Google Ads click identifiers: capturados de la URL al llegar y guardados en una cookie propia
// por 90 días (enhanced conversions e importaciones offline necesitan que el gclid sobreviva entre
// el click y la demo agendada, que puede ser días después). Separado de la atribución del sitio
// (src/attribution.js, localStorage, 30 días, otra forma) para que las necesidades de esta cookie
// no cambien la retención ni la validación de ese sistema.
// Compartido por las páginas con calendario de Cal.com (CalEmbed.jsx): /lp/facturacion-b2b y
// /agendar-demo, cada una con su propia cuenta de Google Ads o ninguna (el gclid solo se usa si existe).
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
