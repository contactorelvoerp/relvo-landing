import { useRef } from 'react'

// Cloudflare Turnstile (anti-spam de los formularios, además del honeypot). Opcional: sin
// VITE_TURNSTILE_SITE_KEY no se carga nada y el formulario funciona igual que antes. El servidor
// (api/lead.js) solo exige el token cuando tiene TURNSTILE_SECRET_KEY: las dos variables se
// configuran juntas (docs/medicion-y-aprendizaje.md §Anti-spam).
// Modo "interaction-only": invisible salvo que Cloudflare necesite una interacción. El script se
// pide recién cuando la persona empieza a llenar el formulario, no al cargar la página.
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
// Cuánto espera un envío a que Cloudflare entregue el token (autocompletado o envío muy rápido).
const WAIT_MS = 8000
let loading

function loadScript() {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT; script.async = true; script.defer = true
    script.onload = resolve; script.onerror = reject
    document.head.appendChild(script)
  })
  return loading
}

export function useTurnstile() {
  const container = useRef(null)
  const widget = useRef(null)
  const token = useRef('')
  const waiters = useRef([])
  const settle = (value) => {
    token.current = value
    if (value) { waiters.current.forEach((resolve) => resolve(value)); waiters.current = [] }
  }

  const start = () => {
    if (!SITE_KEY || widget.current !== null || !container.current) return
    widget.current = 'pending'
    loadScript().then(() => {
      widget.current = window.turnstile.render(container.current, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only',
        size: 'flexible',
        callback: (value) => settle(value),
        'expired-callback': () => settle(''),
        'error-callback': () => settle(''),
      })
    }).catch(() => { widget.current = null })
  }
  // Los tokens son de un solo uso: después de un envío fallido se pide otro.
  const reset = () => {
    token.current = ''
    if (typeof widget.current === 'string' && widget.current !== 'pending') window.turnstile?.reset(widget.current)
  }

  // El token actual o, si todavía no llegó, el primero que llegue (máximo WAIT_MS). Sin token el
  // servidor rechaza el envío y el formulario muestra el error con "Reintentar".
  const ready = () => {
    if (!SITE_KEY) return Promise.resolve('')
    start()
    if (token.current) return Promise.resolve(token.current)
    return new Promise((resolve) => {
      waiters.current.push(resolve)
      setTimeout(() => resolve(token.current), WAIT_MS)
    })
  }

  return { enabled: Boolean(SITE_KEY), container, start, reset, ready }
}
