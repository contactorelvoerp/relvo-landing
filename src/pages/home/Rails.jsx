import { useTabs } from './useTabs'

// 01 Rieles (prototipo home v1): 4 tabs verticales, cada una con su pantalla de producto.
function Rows({ rows, total }) {
  return (
    <table className="ui__rows">
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <td>{r.label}{r.detail && <small>{r.detail}</small>}</td>
            <td className={r.exact ? 'ui__exact' : undefined}>{r.amount}</td>
          </tr>
        ))}
        {total && <tr className="ui__total"><td>{total.label}</td><td>{total.amount}</td></tr>}
      </tbody>
    </table>
  )
}

function Chips({ chips, example, status }) {
  return (
    <div className="ui__chips">
      {status && <span className="chip">{status}</span>}
      {chips.map((c) => <span key={c} className="chip chip--plain">{c}</span>)}
      <span className="example-tag">{example}</span>
    </div>
  )
}

function Top({ title, meta }) {
  return <div className="ui__top"><b>{title}</b><span>{meta}</span></div>
}

export function Rails({ c, example }) {
  const tabs = useTabs('rieles', c.tabs.length)
  const { pricing, approvals, split, collection } = c
  const screens = [
    <>
      <Top {...pricing} />
      <Rows rows={pricing.rows} total={pricing.total} />
      <Chips chips={pricing.chips} example={example} />
    </>,
    <>
      <Top {...approvals} />
      <ul className="ui__steps">
        {approvals.steps.map((s) => (
          <li key={s.label} className={s.done ? 'ui__step--done' : undefined}>
            <span className="ui__dot" aria-hidden="true" />
            <span>{s.label}<small>{s.detail}</small></span>
            <span className={`chip${s.done ? '' : ' chip--run'}`}>{s.done ? approvals.done : approvals.running}</span>
          </li>
        ))}
      </ul>
      <Chips chips={[]} example={example} />
    </>,
    <>
      <Top {...split} />
      <div className="ui__entities">
        {split.entities.map((e) => (
          <div key={e.name} className="ui__entity"><small>{e.name}</small><b>{e.share}</b><span className="num">{e.amount}</span></div>
        ))}
      </div>
      <div className="ui__glosa"><small>{split.glosaLabel}</small>{split.glosa}</div>
      <Chips chips={split.chips} example={example} />
    </>,
    <>
      <Top {...collection} />
      <Rows rows={collection.rows} />
      <div className="ui__balance"><span>{collection.balance.label}</span><span className="num">{collection.balance.amount}</span></div>
      <Chips chips={collection.chips} status={collection.status} example={example} />
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
      </div>
    </div>
  )
}
