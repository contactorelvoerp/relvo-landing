import { useEffect, useRef, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { captureAdsClick, getAdsClick } from '../adsClick'
import { CAL_LINK, CAL_LINK_FALLBACK } from '../config/cal'
import './cal-embed.css'

// Embed inline de Cal.com con @calcom/embed-react (Ricardo, 2026-11-02: reemplaza el snippet a
// mano que teníamos antes — mismo comportamiento, pero sin mantenerlo nosotros). CAL_LINK siempre
// tiene un valor real (src/config/cal.js), así que este componente ya no depende de que
// VITE_CALCOM_LINK esté configurada en Vercel para mostrar el calendario: el link de respaldo
// (botón a cal.com) queda solo para cuando el embed de verdad falla al cargar — evento linkFailed
// de Cal.com, o 10s sin que dispare linkReady.
// gclid/gbraid/wbraid viajan como metadata del booking (`metadata[clave]`, formato de la
// documentación de prefill de Cal.com — un objeto anidado `metadata: {...}` no funciona); utm_* va
// en la URL del calLink, que Cal.com usa para su propio tracking. De ahí a Attio depende de cómo
// Ricardo conecte el webhook de Cal.com, fuera de este repo.
// Compartido por /lp/facturacion-b2b, /agendar-demo y /powered-by-relvo (movido fuera de
// src/pages/landing-ads en la rama web3/powered-by-relvo-conversion, mismo comportamiento).
const NAMESPACE = 'demo-relvo'
const ELEMENT_ID = 'cal-inline-demo'
const LOAD_TIMEOUT_MS = 10000

// `prefill` (nombre/email, por ejemplo desde el formulario alternativo de la misma página): lo que
// la persona ya haya escrito, por si prefiere terminar por el calendario. Se aplica una sola vez,
// la primera vez que llega con algo — remontando el embed con un id nuevo (`key`, más abajo),
// no actualizándolo en vivo en cada tecla: eso recargaría el calendario mientras escriben, y si ya
// habían elegido un horario ahí, se lo haría perder. Probado en vivo: un segundo "inline" sobre el
// mismo elemento no actualiza nada, Cal.com lo ignora ("Inline embed already exists") — @calcom/
// embed-react tiene la misma limitación (no vuelve a aplicar `config` si ya montó una vez), por eso
// sigue haciendo falta el remonte con `key`.
export function CalEmbed({ onBooked, prefill }) {
  const bookedRef = useRef(onBooked)
  bookedRef.current = onBooked
  const adsClickRef = useRef(null)
  const bookedUids = useRef(new Set())
  const wrapperRef = useRef(null)
  const appliedPrefill = useRef(false)
  const [elementId, setElementId] = useState(ELEMENT_ID)
  const [visible, setVisible] = useState(false)
  const [failed, setFailed] = useState(false)

  // Carga diferida: el script de Cal.com es de terceros y pesado — se pide recién cuando la
  // sección entra al viewport (con margen, para que ya esté listo al llegar), no al cargar la
  // página, para no afectar el LCP del hero. gclid/utm se capturan acá mismo, de forma síncrona,
  // antes de que `visible` dispare el primer render del embed: si se capturaran en un efecto
  // aparte, el embed podría montar su "inline" antes de que estuvieran listos, y como se explica
  // arriba, un segundo "inline" con la metadata correcta ya no haría nada.
  useEffect(() => {
    if (visible || !wrapperRef.current) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      captureAdsClick()
      adsClickRef.current = getAdsClick()
      setVisible(true)
    }, { rootMargin: '400px 0px' })
    io.observe(wrapperRef.current)
    return () => io.disconnect()
  }, [visible])

  // Tema, color de marca y los eventos de Cal.com (listo, falló, reserva hecha): una sola vez, en
  // cuanto el embed empieza a cargar. `window.Cal.ns[NAMESPACE]` es un singleton del script de
  // Cal.com, no de este componente — sigue sirviendo aunque el <Cal> de abajo se remonte después
  // (prefill), así que no hace falta volver a registrar nada en cada remonte.
  useEffect(() => {
    if (!visible) return
    let cancelled = false
    const timeout = setTimeout(() => {
      if (cancelled) return
      console.error(`[CalEmbed] Cal.com no terminó de cargar en ${LOAD_TIMEOUT_MS / 1000}s: muestro el link de respaldo en vez del calendario embebido.`)
      setFailed(true)
    }, LOAD_TIMEOUT_MS)
    ;(async () => {
      const cal = await getCalApi({ namespace: NAMESPACE })
      if (cancelled) return
      cal('ui', { theme: 'light', cssVarsPerTheme: { light: { 'cal-brand': '#186666' } }, hideEventTypeDetails: false, layout: 'month_view' })
      cal('on', { action: 'linkReady', callback: () => clearTimeout(timeout) })
      cal('on', {
        action: 'linkFailed',
        callback: (event) => {
          console.error('[CalEmbed] Cal.com no pudo cargar el embed', event?.detail?.data)
          clearTimeout(timeout)
          if (!cancelled) setFailed(true)
        },
      })
      cal('on', {
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
    })()
    return () => { cancelled = true; clearTimeout(timeout) }
  }, [visible])

  useEffect(() => {
    // Nombre y email, los dos: si solo exige uno, la primera vez que la persona sale del campo
    // Nombre (con el email todavía vacío) gasta el único remonte sin alcanzar a llevar el email.
    if (appliedPrefill.current || !prefill || !prefill.name || !prefill.email) return
    appliedPrefill.current = true
    setElementId(`${ELEMENT_ID}-prefilled`)
  }, [prefill])

  // Antes del viewport: una caja vacía del mismo tamaño (la reserva real de 680px viene de
  // cal-embed.css), para no afectar el alto de la página cuando el embed por fin cargue.
  if (!visible) return <div ref={wrapperRef} className="cal-embed" />

  if (failed) {
    return (
      <div className="cal-embed cal-embed--fallback">
        <p>Agenda directo en Cal.com:</p>
        <a className="btn btn--primary btn--lg" href={CAL_LINK_FALLBACK} target="_blank" rel="noopener noreferrer">Agenda tu demo</a>
      </div>
    )
  }

  const adsClick = adsClickRef.current
  const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term'].filter((k) => adsClick?.[k])
  const query = new URLSearchParams(Object.fromEntries(utm.map((k) => [k, adsClick[k]])))
  const calLink = query.toString() ? `${CAL_LINK}?${query}` : CAL_LINK
  const prefillApplied = elementId !== ELEMENT_ID

  return (
    <Cal
      key={elementId}
      namespace={NAMESPACE}
      calLink={calLink}
      calOrigin="https://cal.com"
      className="cal-embed"
      config={{
        theme: 'light',
        layout: 'month_view',
        ...(prefillApplied && prefill?.name ? { name: prefill.name } : {}),
        ...(prefillApplied && prefill?.email ? { email: prefill.email } : {}),
        ...(adsClick?.gclid ? { 'metadata[gclid]': adsClick.gclid } : {}),
        ...(adsClick?.gbraid ? { 'metadata[gbraid]': adsClick.gbraid } : {}),
        ...(adsClick?.wbraid ? { 'metadata[wbraid]': adsClick.wbraid } : {}),
      }}
    />
  )
}
