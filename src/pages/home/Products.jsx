import { hrefFor } from '../../routes'

// Bento de productos (prototipo home v2): título, una línea y un mini gráfico sin filas de texto.
// Toda la tarjeta es el link cuando la página del producto existe en este build; si aún no se
// publica, la tarjeta se muestra sin link.
const CHECK = (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 7.5 6 10l5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const TASKS = [
  <g key="doc"><path d="M4 1.5h5l3 3v10H4z" /><path d="M9 1.5v3h3M6 8h4M6 10.5h4" /></g>,
  <g key="mail"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" /><path d="m2 4.5 6 4.5 6-4.5" /></g>,
  <path key="channel" d="M6 2 4.5 14M11.5 2 10 14M2.5 5.5h11M2 10.5h11" />,
  <path key="plug" d="M5.5 1.5v3M10.5 1.5v3M3.5 4.5h9v3a4.5 4.5 0 0 1-9 0zM8 12v2.5" />,
]
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

function Card({ id, wide, locale, name, desc, children }) {
  const href = hrefFor(id, locale)
  const content = (
    <>
      <h3 className="product__title">{name}</h3>
      <p className="product__desc">{desc}</p>
      <div className="mini">{children}</div>
    </>
  )
  const className = `product${wide ? ' product--wide' : ''}`
  return href ? <a className={className} href={href}>{content}</a> : <article className={className}>{content}</article>
}

export function Products({ c, pages, locale }) {
  const card = (id, wide) => ({ id, wide, locale, name: pages[id].name, desc: c[id].desc })
  return (
    <div className="bento">
      <Card {...card('contratos', true)}>
        <Figure {...c.contratos} />
        <Stack parts={MIX} legend={c.contratos.legend} />
      </Card>
      <Card {...card('medicion')}>
        <Figure {...c.medicion} />
        <div className="mini__hist" aria-hidden="true">{DAYS.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
      </Card>
      <Card {...card('aprobaciones')}>
        <div className="nodes" aria-hidden="true">
          <span className="nodes__ok">{CHECK}</span><i /><span className="nodes__ok">{CHECK}</span><i /><span className="nodes__ok">{CHECK}</span><i className="nodes__off" /><span className="nodes__now" />
        </div>
        <div className="nodes__labels">{c.aprobaciones.steps.map((s) => <span key={s}>{s}</span>)}</div>
      </Card>
      <Card {...card('cxc', true)}>
        <Figure {...c.cxc} />
        <Stack parts={AGING} legend={c.cxc.legend} />
      </Card>
      <Card {...card('agentes')}>
        <Figure {...c.agentes} />
        <div className="mini__tasks" aria-hidden="true">
          {TASKS.map((icon, i) => <span key={i}><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">{icon}</svg></span>)}
        </div>
      </Card>
      <Card {...card('reporteria', true)}>
        <Figure {...c.reporteria} />
        <svg className="mini__area" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 58 L57 54 L114 52 L171 46 L228 40 L285 34 L342 26 L400 18 L400 70 L0 70Z" fill="#DFF4EB" />
          <polyline points="0,58 57,54 114,52 171,46 228,40 285,34 342,26 400,18" fill="none" stroke="#186666" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </Card>
    </div>
  )
}
