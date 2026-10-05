import { useEffect, useRef } from 'react'
import { hrefFor } from '../routes'

// Integraciones: carrusel de logos y dos líneas de salida. "Conecta Relvo vía MCP" queda sin link
// hasta que exista su documentación.
// Logos en public/logos/integrations (PNG de 64px de alto, recortados de los SVG de marca). El alto
// de cada uno iguala su peso visual; el nombre va como texto alternativo. Sintropix, aún no.
const LOGOS = {
  HubSpot: { file: 'hubspot', w: 222, h: 36 },
  Stripe: { file: 'stripe', w: 152, h: 34 },
  Toku: { file: 'toku', w: 250, h: 28 },
  Fintoc: { file: 'fintoc', w: 290, h: 25 },
  Slack: { file: 'slack', w: 252, h: 28 },
  'Google Chat': { file: 'google-chat', w: 177, h: 38 },
}
const size = ({ w, h }) => ({ width: Math.round((w * h) / 64), height: h })
export function Integrations({ c, locale }) {
  const ref = useRef(null)
  const docs = hrefFor('docs', locale)

  // El carrusel se detiene fuera de pantalla.
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => el.classList.toggle('ints--offscreen', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div ref={ref} className="ints">
        <ul className="ints__track" aria-label={`${c.label}: ${c.names.join(', ')}`}>
          {[0, 1].map((group) => c.names.map((name) => (
            <li key={`${group}-${name}`} aria-hidden={group === 1 ? 'true' : undefined} className={group === 1 ? 'ints__dup' : undefined}>
              <img src={`/logos/integrations/${LOGOS[name].file}.png`} alt={group === 1 ? '' : name} {...size(LOGOS[name])} loading="lazy" draggable="false" />
            </li>
          )))}
        </ul>
      </div>
      <div className="ints__more">
        <span>{c.api[0]} {docs ? <a className="link" href={docs}>{c.api[1]}</a> : c.api[1]}</span>
        <span>{c.mcp[0]} {c.mcp[1]}</span>
      </div>
    </>
  )
}
