import { hrefForPath } from '../routes'
import { Texture } from '../components/Texture'
import { BandTexture } from '../components/BandTexture'
import { Heading } from '../blocks/Shared'
import { FeatureTabs } from '../blocks/FeatureTabs'
import { Case } from '../blocks/Case'
import { Check } from '../visuals/cards'
import { Chart, Visual } from '../visuals/Visual'
import { ProductCard } from '../visuals/Bento'
import { caseProps } from './caseProps'

// Bloques de la plantilla de landing (content/SCHEMA.md §2). Cada uno recibe su bloque del archivo
// de contenido (`b`) y el contexto de la página (`p`: idioma, etiquetas, caso, copy de la home).

function Breadcrumbs({ items, label }) {
  return (
    <nav aria-label={label}>
      <ol className="crumbs">
        {items.map((item, i) => {
          const href = item.href && hrefForPath(item.href)
          const last = i === items.length - 1
          return <li key={item.label} aria-current={last ? 'page' : undefined}>{href && !last ? <a href={href}>{item.label}</a> : item.label}</li>
        })}
      </ol>
    </nav>
  )
}

// Hero centrado (todas las páginas internas): migas, H1, lead y CTAs centrados; el visual a todo el
// ancho del contenedor debajo y la intro centrada bajo el visual.
export function Hero({ b, p, breadcrumb }) {
  const ctas = b.ctas.map((c) => ({ ...c, href: hrefForPath(c.href) })).filter((c) => c.href)
  const wide = b.visual.id === 'heroApp' || b.visual.id === 'composition'
  return (
    <section className="section band band--first lp-hero" aria-labelledby="lp-h1">
      <div className="lp-head">
        <Breadcrumbs items={breadcrumb} label={p.l.breadcrumb} />
        <h1 id="lp-h1" className="lp-head__title">{b.h1}</h1>
        <p className="lp-head__lead">{b.lead}</p>
        {ctas.length > 0 && (
          <div className="lp-head__ctas">
            {ctas.map((c) => <a key={c.label} className={`btn btn--lg ${c.style === 'primary' ? 'btn--primary' : 'btn--secondary'}`} href={c.href}>{c.label}</a>)}
          </div>
        )}
      </div>
      <div className="lp-hero__visual">
        <div className={`stage lp-stage${wide ? ' lp-stage--wide' : ''}`}>
          <Texture kind="orbits" />
          <Visual visual={b.visual} locale={p.locale} caseData={p.caseData} label={b.h1} />
        </div>
      </div>
      {b.intro && <p className="lp-intro">{b.intro}</p>}
    </section>
  )
}

// Barra secundaria fija bajo el menú: nombre de la página, anclas a cada sección con h2 y Docs
export function Subnav({ name, anchors, docs, l }) {
  return (
    <div className="subnav">
      <div className="subnav__inner">
        <b className="subnav__name">{name}</b>
        <nav className="subnav__links" aria-label={l.sections}>
          {anchors.map((a) => <a key={a.id} href={`#${a.id}`}>{a.label}</a>)}
          {docs && <a className="subnav__docs" href={docs}>{l.docs}</a>}
        </nav>
      </div>
    </div>
  )
}

// Capacidades: grilla de 2 o 3 columnas, título en negrita y una línea, sin íconos ni tarjetas
export function Capabilities({ b, id }) {
  return (
    <section className="section band" aria-labelledby={id}>
      <Heading id={id} title={b.h2} soft={b.h2Soft} />
      <div className={`caps${b.items.length === 4 ? ' caps--2' : ''}`}>
        {b.items.map((item) => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}
      </div>
    </section>
  )
}

export function BeforeAfter({ b, id, p }) {
  const items = (list, done) => (
    <ul>{list.map((text) => <li key={text}><i aria-hidden="true">{done && <Check />}</i><span>{text}</span></li>)}</ul>
  )
  return (
    <section className="section band" aria-labelledby={id}>
      <Heading id={id} title={b.h2} soft={b.h2Soft} />
      <div className="ba">
        <div className="ba__side ba__side--before"><h3>{p.l.before}</h3>{items(b.before)}</div>
        <div className="ba__side ba__side--after"><h3>{p.l.after}</h3>{items(b.after, true)}</div>
      </div>
    </section>
  )
}

export function Steps({ b, id }) {
  return (
    <section className="section band band--mint" aria-labelledby={id}>
      <BandTexture kind="orbitsEdge" />
      <Heading id={id} title={b.h2} soft={b.h2Soft} />
      <ol className="steps3">
        {b.steps.map((s, i) => (
          <li key={s.title} className="steps3__step"><span className="steps3__n">{String(i + 1).padStart(2, '0')}</span><h3>{s.title}</h3><p>{s.text}</p></li>
        ))}
      </ol>
      <div className="steps3__rail" aria-hidden="true"><span /><span /><span /></div>
    </section>
  )
}

export function Features({ b, id, p }) {
  const tabs = b.tabs.map((t) => ({ label: t.label, desc: t.desc, visual: t.visual }))
  return (
    <section className="section band" aria-labelledby={id}>
      <Heading id={id} title={b.h2} soft={b.h2Soft} />
      <FeatureTabs prefix="funciones" tablist={b.h2} tabs={tabs} locale={p.locale} />
    </section>
  )
}

export function Metrics({ b, id, p }) {
  const kpis = (
    <div className={b.chart ? 'kpis' : 'kpis kpis--row'}>
      {b.kpis.map((k) => <div key={k.label} className="kpi"><span className="kpi__label">{k.label}</span><b className="kpi__value num">{k.value}</b></div>)}
      {b.note && <p className="kpi__note">{b.note}</p>}
    </div>
  )
  return (
    <section className="section band band--neutral" aria-labelledby={id}>
      <BandTexture kind="ridgesSoft" />
      <Heading id={id} title={b.h2} soft={b.h2Soft} />
      <div className={`report${b.chart ? '' : ' report--kpis'}`}>
        <div className="report__panel">
          {kpis}
          {b.chart && <div className="report__chart"><Chart id={b.chart.id} data={b.chart.data} label={b.h2} locale={p.numberLocale} /></div>}
        </div>
      </div>
    </section>
  )
}

export function CaseBlock({ b, id, p }) {
  const c = p.getCase(b.ref)
  if (!c) return null
  return (
    <section className="section band" aria-labelledby={id}>
      <Heading id={id} title={b.h2} />
      <Case c={caseProps(c, p.l)} />
    </section>
  )
}

export function Related({ b, id, p }) {
  return (
    <section className="section band band--neutral" aria-labelledby={id}>
      <Heading id={id} title={b.h2} soft={b.h2Soft} />
      <div className="related">
        {b.items.map((item) => <ProductCard key={item} id={item} name={p.t.pages[item].name} card={p.home.products[item]} locale={p.locale} />)}
      </div>
    </section>
  )
}

export function Faq({ b, id }) {
  return (
    <section className="section band" aria-labelledby={id}>
      <Heading id={id} title={b.h2} />
      <div className="faq">
        {b.items.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function Quote({ b, p }) {
  const c = p.getCase(b.ref)
  if (!c) return null
  return (
    <section className="section band">
      <figure className="lp-quote">
        <blockquote>“{b.variant === 'full' ? c.quote.full : c.quote.short}”</blockquote>
        <figcaption>{c.quote.author}<span>{c.quote.role}</span></figcaption>
      </figure>
    </section>
  )
}
