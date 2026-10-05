import { hrefFor } from '../routes'
import { Check, TaskIcon } from './cards'

// Tarjetas de producto del bento (prototipo home v2): título, una línea y un mini gráfico sin filas
// de texto. Las usan el bento de la home y el bloque related de la plantilla. Toda la tarjeta es el
// link cuando la página del producto existe en este build; si aún no se publica, va sin link.
// Tokens por día de octubre (ejemplo), en % del día más alto
const DAYS = [12, 18, 15, 22, 30, 26, 34, 28, 40, 36, 45, 38, 50, 44, 58, 52, 63, 55, 70, 61, 74, 66, 80, 72, 86, 78, 90, 84, 95, 88]
// Mezcla del total del período y antigüedad de cuentas por cobrar (ejemplo), con colores del DS
const MIX = [[16, '#13131E'], [8, '#8CC7C7'], [76, '#633BF2']]
const AGING = [[70, '#186666'], [22, '#8A5A00'], [8, '#A3302A']]

function Figure({ amount, label, delta }) {
  return <div className="mini__figure"><b className="num">{amount}</b><small>{label}</small>{delta && <span className="mini__delta">{delta}</span>}</div>
}

function Stack({ parts, legend }) {
  return (
    <>
      <div className="stack" aria-hidden="true">{parts.map(([w, color]) => <i key={color} style={{ width: `${w}%`, background: color }} />)}</div>
      <div className="stack__legend">{legend.map((name, i) => <span key={name + i}><i style={{ background: parts[i][1] }} />{name}</span>)}</div>
    </>
  )
}

const MINIS = {
  contratos: (c) => <><Figure {...c} /><Stack parts={MIX} legend={c.legend} /></>,
  medicion: (c) => <><Figure {...c} /><div className="mini__hist" aria-hidden="true">{DAYS.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div></>,
  aprobaciones: (c) => (
    <>
      <div className="nodes" aria-hidden="true">
        <span className="nodes__ok"><Check /></span><i /><span className="nodes__ok"><Check /></span><i /><span className="nodes__ok"><Check /></span><i className="nodes__off" /><span className="nodes__now" />
      </div>
      <div className="nodes__labels">{c.steps.map((s) => <span key={s}>{s}</span>)}</div>
    </>
  ),
  cxc: (c) => <><Figure {...c} /><Stack parts={AGING} legend={c.legend} /></>,
  agentes: (c) => (
    <>
      <Figure {...c} />
      <div className="mini__tasks" aria-hidden="true">{['doc', 'mail', 'hash', 'plug'].map((icon) => <span key={icon}><TaskIcon icon={icon} /></span>)}</div>
    </>
  ),
  reporteria: (c) => (
    <>
      <Figure {...c} />
      <svg className="mini__area" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 58 L57 54 L114 52 L171 46 L228 40 L285 34 L342 26 L400 18 L400 70 L0 70Z" fill="#DFF4EB" />
        <polyline points="0,58 57,54 114,52 171,46 228,40 285,34 342,26 400,18" fill="none" stroke="#186666" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </>
  ),
}

// `card` es la tarjeta del bento en el copy de la home (desc y datos del mini gráfico)
export function ProductCard({ id, name, card, locale, wide, heading: Heading = 'h3' }) {
  const href = hrefFor(id, locale)
  const content = (
    <>
      <Heading className="product__title">{name}</Heading>
      <p className="product__desc">{card.desc}</p>
      <div className="mini">{MINIS[id](card)}</div>
    </>
  )
  const className = `product${wide ? ' product--wide' : ''}`
  return href ? <a className={className} href={href}>{content}</a> : <article className={className}>{content}</article>
}
