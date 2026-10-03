import { hrefFor } from '../../routes'

// Bento de productos (prototipo home v1). Cada tarjeta enlaza a su página cuando existe en este
// build; si la página aún no se publica, la tarjeta se muestra sin link.
const STATUS = { ok: 'chip', review: 'chip chip--run', plain: 'chip chip--plain' }

function Lines({ lines, total }) {
  return (
    <div className="mini">
      {lines.map(([label, value, status]) => (
        <div key={label} className="mini__row">
          <span>{label}</span>
          {status ? <span className={STATUS[status]}>{value}</span> : <span className="num">{value}</span>}
        </div>
      ))}
      {total && <div className="mini__row mini__row--total"><span>{total[0]}</span><span className="num">{total[1]}</span></div>}
    </div>
  )
}

function Card({ id, layer, wide, locale, t, go, children }) {
  const href = hrefFor(id, locale)
  const content = (
    <>
      <span className="product__layer">{layer}</span>
      <h3 className="product__title">{t.name}</h3>
      <p className="product__desc">{t.desc}</p>
      {children}
      {href && <span className="product__go">{go}</span>}
    </>
  )
  const className = `product${wide ? ' product--wide' : ''}`
  return href ? <a className={className} href={href}>{content}</a> : <article className={className}>{content}</article>
}

export function Products({ c, pages, locale }) {
  const card = (id, layer, wide) => ({ id, layer: c.layers[layer], wide, locale, t: pages[id], go: c[id].go })
  return (
    <div className="bento">
      <Card {...card('contratos', 'rails', true)}><Lines lines={c.contratos.lines} total={c.contratos.total} /></Card>
      <Card {...card('medicion', 'rails')}>
        <div className="mini">
          <div className="spark" aria-hidden="true">{[30, 42, 38, 55, 61, 74, 88].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
          <p className="mini__note">{c.medicion.note}</p>
        </div>
      </Card>
      <Card {...card('aprobaciones', 'rails')}><Lines lines={c.aprobaciones.lines} /></Card>
      <Card {...card('cxc', 'rails', true)}><Lines lines={c.cxc.lines} /></Card>
      <Card {...card('agentes', 'agents')}><Lines lines={c.agentes.lines} /></Card>
      <Card {...card('reporteria', 'intelligence', true)}>
        <div className="mini mini--metrics">
          {c.reporteria.metrics.map(([label, value]) => (
            <div key={label}><span>{label}</span><b className="num">{value}</b></div>
          ))}
        </div>
      </Card>
    </div>
  )
}
