import { useEffect, useRef, useState } from 'react'
import { captureAdsClick, getAdsClick } from './ads-click'
import { CAL_LINK } from './config'

// Embed inline de Cal.com para "Agenda tu demo" (CAL_LINK: src/pages/landing-ads/config.js). Sin
// ella, este componente no pinta nada y la sección queda solo con el formulario de abajo.
// gclid/gbraid/wbraid viajan como metadata del booking (`metadata[clave]`, formato de la
// documentación de prefill de Cal.com — un objeto anidado `metadata: {...}` no funciona); utm_* va
// en la URL del calLink, que Cal.com usa para su propio tracking. De ahí a Attio depende de cómo
// Ricardo conecte el webhook de Cal.com, fuera de este repo.
// Probado en vivo con el evento real: el calendario carga, el tema claro y el color de marca se
// ven bien, y tanto gclid/utm (iframe src) como el prefill de nombre+email (ver más abajo)
// llegan correctos. Lo que falta probar es el otro lado: completar una reserva real para confirmar
// la forma exacta del payload de bookingSuccessfulV2 (de dónde sale el email del asistente) — no
// se agendó una reunión real para no dejarle una cita falsa a Ricardo en su calendario.
const NAMESPACE = 'demo-relvo'
const ELEMENT_ID = 'cal-inline-demo'

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

// Probado en vivo (con el link real): un segundo `inline` al mismo elemento no actualiza nada,
// Cal.com lo ignora ("Inline embed already exists"). Por eso esto renderiza con un id de elemento
// nuevo cada vez que hay algo que prefillear, en vez de intentar actualizar el embed ya montado.
function render(elementId, adsClick, prefill) {
  const Cal = window.Cal
  const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'].filter((k) => adsClick?.[k])
  const query = new URLSearchParams(Object.fromEntries(utm.map((k) => [k, adsClick[k]])))
  const calLink = query.toString() ? `${CAL_LINK}?${query}` : CAL_LINK
  Cal.ns[NAMESPACE]('inline', {
    elementOrSelector: `#${elementId}`,
    calLink,
    config: {
      theme: 'light',
      layout: 'month_view',
      ...(prefill?.name ? { name: prefill.name } : {}),
      ...(prefill?.email ? { email: prefill.email } : {}),
      ...(adsClick?.gclid ? { 'metadata[gclid]': adsClick.gclid } : {}),
      ...(adsClick?.gbraid ? { 'metadata[gbraid]': adsClick.gbraid } : {}),
      ...(adsClick?.wbraid ? { 'metadata[wbraid]': adsClick.wbraid } : {}),
    },
  })
  Cal.ns[NAMESPACE]('ui', { cssVarsPerTheme: { light: { 'cal-brand': '#186666' } }, hideEventTypeDetails: false, layout: 'month_view' })
}

// `prefill` (nombre/email, src/pages/landing-ads/LandingAdsPage.jsx): lo que la persona ya haya
// escrito en el formulario de abajo, por si prefiere terminar por el calendario. Se aplica una sola
// vez, la primera vez que llega con algo — remontando el embed con un id nuevo (ver `render`), no
// actualizándolo en vivo en cada tecla: eso recargaría el calendario mientras escriben, y si ya
// habían elegido un horario ahí, se lo haría perder.
export function CalEmbed({ onBooked, prefill }) {
  const bookedRef = useRef(onBooked)
  bookedRef.current = onBooked
  const adsClickRef = useRef(null)
  const listenerBound = useRef(false)
  const appliedPrefill = useRef(false)
  const bookedUids = useRef(new Set())
  const wrapperRef = useRef(null)
  const [elementId, setElementId] = useState(ELEMENT_ID)
  const [visible, setVisible] = useState(false)

  // Carga diferida (Ricardo, 2026-11-01): el script de Cal.com es de terceros y pesado — se pide
  // recién cuando la sección entra al viewport (con margen, para que ya esté listo al llegar), no
  // al cargar la página, para no afectar el LCP del hero.
  useEffect(() => {
    if (!CAL_LINK || visible || !wrapperRef.current) return
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true) }, { rootMargin: '400px 0px' })
    io.observe(wrapperRef.current)
    return () => io.disconnect()
  }, [visible])

  useEffect(() => {
    if (!CAL_LINK || !visible) return
    captureAdsClick()
    adsClickRef.current = getAdsClick()
    loadEmbedScript()
    const Cal = window.Cal
    Cal('init', NAMESPACE, { origin: 'https://cal.com' })
    render(elementId, adsClickRef.current, elementId === ELEMENT_ID ? null : prefill)
    if (!listenerBound.current) {
      listenerBound.current = true
      Cal.ns[NAMESPACE]('on', {
        // bookingSuccessful está deprecado por Cal.com en favor de bookingSuccessfulV2.
        action: 'bookingSuccessfulV2',
        callback: (event) => {
          const data = event?.detail?.data
          const uid = data?.uid
          // Cal.com puede reenviar el mismo evento (reintento de red, doble render del embed):
          // la conversión de Google Ads solo se dispara una vez por reserva.
          if (uid) {
            if (bookedUids.current.has(uid)) return
            bookedUids.current.add(uid)
          }
          const email = data?.attendees?.[0]?.email ?? data?.responses?.email ?? data?.email
          bookedRef.current?.({ email, uid })
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementId, visible])

  useEffect(() => {
    // Nombre y email, los dos: si solo exige uno, la primera vez que la persona sale del campo
    // Nombre (con el email todavía vacío) gasta el único remonte sin alcanzar a llevar el email.
    if (!CAL_LINK || appliedPrefill.current || !prefill || !prefill.name || !prefill.email) return
    appliedPrefill.current = true
    setElementId(`${ELEMENT_ID}-prefilled`)
  }, [prefill])

  if (!CAL_LINK) return null
  // `key` fuerza un nodo del DOM nuevo (no solo un id nuevo en el mismo nodo): el iframe anterior
  // de Cal.com, si lo había, queda realmente reemplazado, no apilado dentro del mismo contenedor.
  return <div ref={wrapperRef} key={elementId} id={elementId} className="lpads-cal" />
}
