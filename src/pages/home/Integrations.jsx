import { useEffect, useRef } from 'react'
import { hrefFor } from '../../routes'

// Integraciones (prototipo home v1): carrusel de nombres en texto y dos líneas de salida.
// "Conecta Relvo vía MCP" queda sin link hasta que exista su documentación.
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
            <li key={`${group}-${name}`} aria-hidden={group === 1 ? 'true' : undefined} className={group === 1 ? 'ints__dup' : undefined}>{name}</li>
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
