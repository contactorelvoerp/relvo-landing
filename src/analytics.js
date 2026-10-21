import { analyticsUrl, isPoweredBy, touchFromUrl } from '../shared/attribution.js'
import { captureAttribution } from './attribution.js'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
let visitor
const recorded = new Set()

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
  if (!touch?.reference || !['powered_by_landing', 'powered_by_demo_click', 'powered_by_form_start'].includes(name)) return
  const key = `${touch.reference}:${name}`
  if (recorded.has(key)) return
  recorded.add(key)
  void fetch('/api/distribution-event', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
    body: JSON.stringify({ event_name: name, reference: touch.reference, visitor_id: sessionId() }),
  }).then((response) => { if (!response.ok) recorded.delete(key) }).catch(() => { recorded.delete(key) })
}

export function initializeMarketing() {
  captureAttribution()
  const config = window.__RELVO_ANALYTICS__
  if (!config) return
  window.dataLayer ??= []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', config.measurementId, {
    page_location: analyticsUrl(window.location.href),
    page_referrer: analyticsUrl(document.referrer),
  })
  // Strip old PDFs' raw IDs before any third-party script loads.
  const visible = new URL(window.location.href)
  for (const key of ['organization_id', 'client_id', 'contract_id', 'document_id']) visible.searchParams.delete(key)
  history.replaceState(history.state, '', visible)
  if (isPoweredBy(touchFromUrl(location.href, new Date()))) trackMarketingEvent('powered_by_landing')
  document.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a[href]')
    if (!anchor) return
    const destination = new URL(anchor.href, location.href)
    if (destination.origin === location.origin && ['/agendar-demo', '/en/book-a-demo'].includes(destination.pathname)) trackMarketingEvent('powered_by_demo_click', { placement: location.pathname === '/powered-by-relvo' ? 'powered_by_page' : 'site' })
  }, { capture: true })
  // Load GA early without blocking rendering; defer prospecting until after load.
  const addScript = (src, onload) => {
    const script = document.createElement('script'); script.src = src; script.async = true
    if (onload) script.onload = onload
    document.head.appendChild(script)
  }
  addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.measurementId)}`)
  const loadProspecting = () => setTimeout(() => addScript('https://assets.apollo.io/micro/website-tracker/tracker.iife.js', () => window.trackingFunctions?.onLoad({ appId: config.apolloAppId })), 1500)
  if (document.readyState === 'complete') loadProspecting()
  else addEventListener('load', loadProspecting, { once: true })
}
