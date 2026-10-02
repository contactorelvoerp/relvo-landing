import { useEffect, useRef } from 'react'
import { SHOW_PENDING } from '../../env'

// Diagrama de integraciones con Relvo al centro (brief 7.3): lo que entra arriba,
// cobro y banco a los lados, lo que sale abajo. Cada conexión dice qué dato viaja.
// Solo integraciones en vivo; los nombres van como texto hasta tener logos oficiales en monocromo.

function Node({ kind, name }) {
  return (
    <div className="hub__node">
      {kind && <span className="hub__kind">{kind}</span>}
      <span className="hub__name">{name}</span>
    </div>
  )
}

function Flow({ children }) {
  if (children) return <span className="hub__flow">{children}</span>
  // Dato sin definir en el brief (qué viaja hacia el ERP): visible solo en previews.
  return SHOW_PENDING ? <span className="hub__flow hub__flow--pending">[PENDIENTE]</span> : null
}

const Wire = ({ dir }) => <span className={`hub__wire hub__wire--${dir}`} aria-hidden="true" />

export function Integrations({ c }) {
  const root = useRef(null)

  // Los pulsos se detienen fuera de pantalla.
  useEffect(() => {
    const el = root.current
    const io = new IntersectionObserver(([e]) => el.classList.toggle('hub--offscreen', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={root} className="hub">
      <div className="hub__lanes hub__lanes--in">
        {c.inputs.map((n) => (
          <div key={n.name} className="hub__lane">
            <Node name={n.name} />
            <Wire dir="down" />
            <Flow>{n.flow}</Flow>
            <Wire dir="down" />
          </div>
        ))}
      </div>
      <span className="hub__bus hub__bus--3" aria-hidden="true" />
      <Wire dir="down" />

      <div className="hub__row">
        <div className="hub__side">
          <Node kind={c.collection.kind} name={c.collection.name} />
          <Wire dir="left" />
          <span className="hub__flows"><Flow>{c.collection.out}</Flow><Flow>{c.collection.back}</Flow></span>
          <Wire dir="right" />
        </div>
        <div className="hub__core">
          <img src="/logo-logotype-light.svg" alt="Relvo" width="126" height="32" loading="lazy" />
          <ul className="hub__layers">
            {c.layers.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
        <div className="hub__side hub__side--right">
          <Wire dir="left" />
          <Flow>{c.bank.back}</Flow>
          <Wire dir="left" />
          <Node kind={c.bank.kind} name={c.bank.name} />
        </div>
      </div>

      <Wire dir="down" />
      <span className="hub__bus hub__bus--4" aria-hidden="true" />
      <div className="hub__lanes hub__lanes--out">
        {c.outputs.map((n) => (
          <div key={n.name} className="hub__lane">
            <Wire dir="down" />
            <Flow>{n.flow}</Flow>
            <Wire dir="down" />
            <Node kind={n.kind} name={n.name} />
          </div>
        ))}
      </div>
    </div>
  )
}
