import { useTabs } from './useTabs'

// 01 Rieles (prototipo home v2): 4 tabs verticales, cada una con su pantalla de producto:
// plan con tramos de tokens, aprobación con checks, factura dividida y cobro parcial.
const CHECK = (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 7.5 6 10l5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function Timeline({ steps, compact }) {
  return (
    <ol className={`tline${compact ? ' tline--compact' : ''}`}>
      {steps.map((s) => (
        <li key={s.label} className={s.done ? undefined : 'tline__now'}>
          <span className="tline__icon">{s.done && CHECK}</span>
          <div><b>{s.label}</b><small>{s.detail}</small></div>
        </li>
      ))}
    </ol>
  )
}

function Head({ title, children }) {
  return <div className="ui__head"><b>{title}</b>{children}</div>
}

export function Rails({ c, example }) {
  const tabs = useTabs('rieles', c.tabs.length)
  const { pricing, approvals, split, collection } = c
  const screens = [
    <>
      <div className="plan">
        <span className="plan__mark" aria-hidden="true">{pricing.mark}</span>
        <div><b>{pricing.plan}</b><small>{pricing.meta}</small></div>
        <span className="plan__price num">{pricing.price}<small>{pricing.per}</small></span>
      </div>
      <div className="plan__line"><div className="plan__row"><span>{pricing.seats[0]}</span><span className="num">{pricing.seats[1]}</span></div></div>
      <div className="plan__line">
        <div className="plan__row"><span>{pricing.tokens[0]}</span><span className="num">{pricing.tokens[1]}</span></div>
        <div className="tiers" aria-hidden="true"><i className="tiers__t1" style={{ width: '66%' }} /><i className="tiers__t2" style={{ width: '14%' }} /></div>
        <div className="tiers__labels"><span>{pricing.tiers[0]}</span><span>{pricing.tiers[1]}</span></div>
      </div>
      <div className="plan__line"><div className="plan__row"><span>{pricing.discount[0]}</span><span className="num">{pricing.discount[1]}</span></div></div>
      <div className="plan__sum"><span>{pricing.total[0]}</span><span className="num">{pricing.total[1]}</span></div>
    </>,
    <>
      <Head title={approvals.title}><span>{approvals.meta}</span></Head>
      <Timeline steps={approvals.steps} />
    </>,
    <>
      <Head title={split.title}><span className="num">{split.meta}</span></Head>
      <div className="splitbar" aria-hidden="true">{split.entities.map((e) => <i key={e.name} style={{ width: e.share }} />)}</div>
      <div className="splitbar__legend">
        {split.entities.map((e) => <div key={e.name}><small>{e.name}</small><b className="num">{e.amount}</b><span>{e.share}</span></div>)}
      </div>
      <div className="ui__glosa"><small>{split.glosaLabel}</small>{split.glosa}</div>
    </>,
    <>
      <Head title={collection.title}><span className="chip chip--run">{collection.status}</span></Head>
      <div className="paid"><span className="num">{collection.paid}</span><small>{collection.of}</small></div>
      <div className="meter meter--lg" aria-hidden="true"><i style={{ width: '65%' }} /></div>
      <Timeline steps={collection.steps} compact />
    </>,
  ]

  return (
    <div className="rails">
      <div className="vtabs" role="tablist" aria-label={c.tablist} aria-orientation="vertical">
        {c.tabs.map((t, i) => (
          <button key={t.title + i} className="vtab" {...tabs.tab(i)}>
            <b>{t.title}</b>
            <span>{t.desc}</span>
          </button>
        ))}
      </div>
      <div className="rails__panel">
        {screens.map((screen, i) => <div key={i} className="ui" {...tabs.panel(i)}>{screen}</div>)}
        <span className="example-tag rails__tag">{example}</span>
      </div>
    </div>
  )
}
