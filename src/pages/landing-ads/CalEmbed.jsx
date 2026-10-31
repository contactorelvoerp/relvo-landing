import { useEffect, useRef } from 'react'
import { captureAdsClick, getAdsClick } from './ads-click'

// Embed inline de Cal.com para "Agenda tu demo". TODO(Ricardo): reemplazar CAL_LINK por el link
// real del evento "Demo Relvo" (docs/landing-ads-b2b.md, pendiente #1) — sin él, este componente no
// pinta nada y la sección queda solo con el formulario de abajo. gclid/utm viajan al booking como
// metadata y como utm_* en la URL del calLink (Cal.com los usa para su propio tracking); de ahí a
// Attio depende de cómo Ricardo conecte ese webhook de Cal.com, fuera de este repo.
// No se pudo probar en vivo (sin cuenta de Cal.com todavía): verificar con Tag Assistant/DebugView
// en cuanto el link real esté puesto.
export const CAL_LINK = ''
const NAMESPACE = 'demo-relvo'

function loadEmbedScript() {
  if (window.Cal) return
  const C = window, A = 'https://app.cal.com/embed/embed.js', L = 'init'
  const p = (a, ar) => { a.q.push(ar) }
  const d = C.document
  C.Cal = C.Cal || function (...ar) {
    const cal = C.Cal
    if (!cal.loaded) {
      cal.ns = {}
      cal.q = cal.q || []
      d.head.appendChild(d.createElement('script')).src = A
      cal.loaded = true
    }
    if (ar[0] === L) {
      const api = function (...apiAr) { p(api, apiAr) }
      const namespace = ar[1]
      api.q = api.q || []
      if (typeof namespace === 'string') {
        cal.ns[namespace] = cal.ns[namespace] || api
        p(cal.ns[namespace], ar)
        p(cal, ['initNamespace', namespace])
      } else p(cal, ar)
      return
    }
    p(cal, ar)
  }
}

export function CalEmbed({ onBooked }) {
  const elementId = 'cal-inline-demo'
  const bookedRef = useRef(onBooked)
  bookedRef.current = onBooked

  useEffect(() => {
    if (!CAL_LINK) return
    // Propia, no vía prop: así el primer render del embed (este efecto) ya la tiene, sin esperar
    // a que el componente padre actualice su estado.
    captureAdsClick()
    const adsClick = getAdsClick()
    loadEmbedScript()
    const Cal = window.Cal
    Cal('init', NAMESPACE, { origin: 'https://cal.com' })
    const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'].filter((k) => adsClick?.[k])
    const query = new URLSearchParams(Object.fromEntries(utm.map((k) => [k, adsClick[k]])))
    const calLink = query.toString() ? `${CAL_LINK}?${query}` : CAL_LINK
    Cal.ns[NAMESPACE]('inline', {
      elementOrSelector: `#${elementId}`,
      config: {
        layout: 'month_view',
        metadata: { gclid: adsClick?.gclid, gbraid: adsClick?.gbraid, wbraid: adsClick?.wbraid },
      },
      calLink,
    })
    Cal.ns[NAMESPACE]('ui', { cssVarsPerTheme: { light: { 'cal-brand': '#186666' } }, hideEventTypeDetails: false, layout: 'month_view' })
    Cal.ns[NAMESPACE]('on', {
      action: 'bookingSuccessful',
      callback: (event) => {
        const email = event?.detail?.data?.booking?.attendees?.[0]?.email ?? event?.detail?.data?.attendees?.[0]?.email
        bookedRef.current?.(email)
      },
    })
    // El script del embed queda cargado para toda la sesión: no hay cleanup que lo retire.
  }, [])

  if (!CAL_LINK) return null
  return <div id={elementId} className="lpads-cal" />
}
