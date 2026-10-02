import { useEffect, useRef } from 'react'

// Integraciones en órbita: portado de relvo-integraciones-orbita.html.
// Solo integraciones en vivo. Los nombres van como texto hasta tener los logos oficiales en monocromo.
const INNER = ['Stripe', 'Toku', 'Fintoc'] // cobro y banco
const OUTER = ['HubSpot', 'Sintropix', 'Slack', 'Google Chat', 'MCP'] // ventas, ERP, equipo, IA (gira al revés)

export function Integrations({ c }) {
  const orbit = useRef(null)

  // Las órbitas se detienen fuera de pantalla.
  useEffect(() => {
    const el = orbit.current
    const io = new IntersectionObserver(([e]) => el.classList.toggle('orbit--offscreen', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="integrations">
      <div>
        <h2 className="integrations__title">{c.title}</h2>
        <p className="integrations__lede">{c.lede}</p>
      </div>
      <div ref={orbit} className="orbit" role="img" aria-label={c.label}>
        <span className="orbit__ring orbit__ring--1" />
        <span className="orbit__ring orbit__ring--2" />
        <div className="orbit__core">relvo</div>
        {INNER.map((name, i) => (
          <span key={name} className="orbit__item orbit__item--1" style={{ '--at': i / INNER.length }}><span className="orbit__chip">{name}</span></span>
        ))}
        {OUTER.map((name, i) => (
          <span key={name} className="orbit__item orbit__item--2" style={{ '--at': i / OUTER.length }}><span className="orbit__chip">{name}</span></span>
        ))}
      </div>
    </div>
  )
}
