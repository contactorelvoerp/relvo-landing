import { analyticsUrl, isPoweredBy, touchFromUrl } from '../shared/attribution.js'
import { captureAttribution } from './attribution.js'
import { captureAdsClick } from './adsClick.js'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
let visitor
const recorded = new Set()

// Consent Mode v2 (docs/medicion-y-aprendizaje.md §Consentimiento). El sitio apunta a LatAm y no
// tiene banner de consentimiento (sin copy ni decisión legal todavía): en el EEE, Reino Unido y
// Suiza todo arranca denegado, así Google solo recibe pings sin cookies desde esas regiones.
// Fuera de ellas Google asume "granted" (sin región = sin default).
const CONSENT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT',
  'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
]
// Para los scripts que no entienden Consent Mode (Apollo) y la cookie propia del click de Ads: el
// navegador no sabe en qué país está, la zona horaria es la mejor señal disponible sin servidor.
function inConsentRegion() {
  try { return /^(Europe|Atlantic\/(Reykjavik|Canary|Madeira))\//.test(Intl.DateTimeFormat().resolvedOptions().timeZone) } catch { return false }
}

// Eventos del embudo de distribución ("Powered by Relvo") que también se guardan en Supabase.
// form_start es el evento genérico de todos los formularios; en una visita de distribución se
// guarda como powered_by_form_start.
const DISTRIBUTION_EVENTS = { powered_by_landing: 'powered_by_landing', powered_by_demo_click: 'powered_by_demo_click', form_start: 'powered_by_form_start' }

function sessionId() {
  const now = Date.now()
  let stored
  try { stored = JSON.parse(sessionStorage.getItem('relvo.distribution.session')) } catch { /* restricted or old storage */ }
  if (!stored || !UUID.test(stored.id ?? '') || now - stored.last_at >= 30 * 60 * 1000 || !Number.isFinite(stored.last_at)) visitor = crypto.randomUUID()
  else visitor = stored.id
  try { sessionStorage.setItem('relvo.distribution.session', JSON.stringify({ id: visitor, last_at: now })) } catch { /* memory still works for this document */ }
  return visitor
}

export function trackMarketingEvent(name, parameters = {}) {
  if (!window.__RELVO_ANALYTICS__) return
  const attribution = captureAttribution()
  const touch = isPoweredBy(attribution.last_touch) ? attribution.last_touch : isPoweredBy(attribution.first_touch) ? attribution.first_touch : null
  // Only bounded dimensions enter GA. No reference, customer/document IDs or PII.
  window.gtag?.('event', name, { ...parameters, ...(touch ? { distribution_channel: 'powered_by_relvo', distribution_surface: touch.surface ?? 'unknown' } : {}) })
  const distributionName = DISTRIBUTION_EVENTS[name]
  if (!touch?.reference || !distributionName) return
  const key = `${touch.reference}:${distributionName}`
  if (recorded.has(key)) return
  recorded.add(key)
  void fetch('/api/distribution-event', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
    body: JSON.stringify({ event_name: distributionName, reference: touch.reference, visitor_id: sessionId() }),
  }).then((response) => { if (!response.ok) recorded.delete(key) }).catch(() => { recorded.delete(key) })
}

// Dónde está un link: la sección con id más cercana, o la zona del layout. Valores acotados (ids
// del propio sitio), nunca texto libre.
function placementOf(element) {
  const section = element.closest?.('section[id], [data-placement]')
  if (section) return section.dataset?.placement ?? section.id
  // La primera banda de cada página es su hero (home, producto, soluciones, precios).
  if (element.closest?.('.band--first, .hero')) return 'hero'
  if (element.closest?.('header, nav')) return 'nav'
  if (element.closest?.('footer')) return 'footer'
  const labelled = element.closest?.('section[aria-labelledby]')
  return labelled ? labelled.getAttribute('aria-labelledby') : 'page'
}

const DEMO_PATHS = ['/agendar-demo', '/en/book-a-demo']

function trackClicks() {
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a[href]')
    if (!anchor) return
    const destination = new URL(anchor.href, location.href)
    const sameOrigin = destination.origin === location.origin
    if (sameOrigin && DEMO_PATHS.includes(destination.pathname)) trackMarketingEvent('powered_by_demo_click', { placement: location.pathname === '/powered-by-relvo' ? 'powered_by_page' : 'site' })
    // Botones (CTA) y cualquier link a la demo: qué CTA funciona y desde qué sección.
    if (!anchor.classList.contains('btn') && !(sameOrigin && DEMO_PATHS.includes(destination.pathname))) return
    trackMarketingEvent('cta_click', {
      placement: placementOf(anchor),
      destination: sameOrigin ? (destination.hash && destination.pathname === location.pathname ? destination.hash : destination.pathname) : destination.hostname,
    })
  }, { capture: true })
}

// Profundidad de scroll por página (25/50/75/100). GA4 ya manda "scroll" al 90 % con la medición
// mejorada; esto da la curva completa para ver hasta dónde se lee la home y precios.
const SCROLL_THRESHOLDS = [25, 50, 75, 100]
function trackScroll() {
  const sent = new Set()
  let queued = false
  const measure = () => {
    queued = false
    const max = document.documentElement.scrollHeight - innerHeight
    const percent = max <= 0 ? 100 : Math.round((scrollY / max) * 100)
    for (const threshold of SCROLL_THRESHOLDS) {
      if (percent < threshold || sent.has(threshold)) continue
      sent.add(threshold)
      trackMarketingEvent('scroll_depth', { percent: threshold })
    }
    if (sent.size === SCROLL_THRESHOLDS.length) removeEventListener('scroll', onScroll)
  }
  const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(measure) } }
  addEventListener('scroll', onScroll, { passive: true })
}

// Core Web Vitals de usuarios reales (receta de la librería web-vitals para GA4): un evento por
// métrica, con el valor redondeado (CLS × 1000 para que sea entero) y su rating.
function trackWebVitals() {
  import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    const send = ({ name, delta, value, id, rating }) => window.gtag?.('event', name, {
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      metric_id: id, metric_value: value, metric_delta: delta, metric_rating: rating,
      page_path: location.pathname, non_interaction: true,
    })
    for (const on of [onCLS, onINP, onLCP, onFCP, onTTFB]) on(send)
  }).catch(() => { /* métricas opcionales: nunca rompen la página */ })
}

export function initializeMarketing() {
  captureAttribution()
  const config = window.__RELVO_ANALYTICS__
  if (!config) return
  const consentRegion = inConsentRegion()
  // Click de Google Ads (gclid) en cualquier página, no solo en la landing de Ads: cualquier
  // formulario del sitio lo guarda con el lead para importar después las etapas del CRM.
  if (!consentRegion) captureAdsClick()
  window.dataLayer ??= []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', region: CONSENT_REGIONS })
  window.gtag('set', 'ads_data_redaction', true)
  window.gtag('js', new Date())
  window.gtag('config', config.measurementId, {
    page_location: analyticsUrl(window.location.href),
    page_referrer: analyticsUrl(document.referrer),
  })
  // Mismo gtag.js, un segundo destino: las conversiones de Google Ads de /lp/facturacion-b2b
  // (src/pages/landing-ads/ads-conversion.js) se disparan con gtag('event','conversion',...) y
  // necesitan esta cuenta configurada para que Google las reciba y pueda mejorarlas con user_data.
  if (config.googleAdsId) window.gtag('config', config.googleAdsId, { allow_enhanced_conversions: true })
  // Strip old PDFs' raw IDs before any third-party script loads.
  const visible = new URL(window.location.href)
  for (const key of ['organization_id', 'client_id', 'contract_id', 'document_id']) visible.searchParams.delete(key)
  history.replaceState(history.state, '', visible)
  if (isPoweredBy(touchFromUrl(location.href, new Date()))) trackMarketingEvent('powered_by_landing')
  trackClicks()
  trackScroll()
  // Load GA early without blocking rendering; defer prospecting and vitals until after load.
  const addScript = (src, onload) => {
    const script = document.createElement('script'); script.src = src; script.async = true
    if (onload) script.onload = onload
    document.head.appendChild(script)
  }
  addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.measurementId)}`)
  const afterLoad = () => {
    trackWebVitals()
    // Apollo no entiende Consent Mode: no se carga donde el consentimiento es obligatorio.
    if (!consentRegion) setTimeout(() => addScript('https://assets.apollo.io/micro/website-tracker/tracker.iife.js', () => window.trackingFunctions?.onLoad({ appId: config.apolloAppId })), 1500)
  }
  if (document.readyState === 'complete') afterLoad()
  else addEventListener('load', afterLoad, { once: true })
}
