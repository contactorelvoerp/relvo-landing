import { chipClass } from './labels'
import { useSequence } from './useSequence'

// Ventana de la app (barra con URL, menú lateral, cifra y tabla con encabezado gris) y la
// secuencia de aparición de las piezas del hero. Las usan el hero de la home y el visual heroApp.
const CHECK = (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 7.5 6 10l5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Window({ url, nav, section, kpi, columns, rows, className = '' }) {
  return (
    <div className={`hc hc--window ${className}`}>
      <div className="win__bar" aria-hidden="true"><i /><i /><i /><span className="win__url">{url}</span></div>
      <div className="win__body">
        <div className="win__side">
          <img className="win__brand" src="/logo-logotype-dark.svg" alt="Relvo" width="55" height="14" />
          {nav.map((item) => <span key={item} className={item === section ? 'win__nav win__nav--on' : 'win__nav'}>{item}</span>)}
        </div>
        <div className="win__main">
          <div className="win__head">
            <div><small>{kpi.label}</small><b className="num">{kpi.value}</b></div>
            {kpi.badge && <span className="chip">{kpi.badge}</span>}
          </div>
          <table className="win__table">
            {columns && <thead><tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr></thead>}
            <tbody>
              {rows.map((r) => (
                <tr key={r.cols[0]}>
                  {r.cols.map((col, i) => <td key={i} className={/\d/.test(col) && i > 0 ? 'num' : undefined}>{col}</td>)}
                  <td><span className={chipClass(r.tone)}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function Toast({ title, sub }) {
  return (
    <div className="hc hc--toast">
      <span className="hc__mark">{CHECK}</span>
      <div><b>{title}</b><small>{sub}</small></div>
    </div>
  )
}

// Visual heroApp (plantilla): ventana + tarjeta de cobro opcional + notificación
export function HeroApp({ d, l }) {
  const [stage] = useSequence(2)
  return (
    <div ref={stage} className="hero-app">
      <Window url={d.url} nav={l.appNav} section={d.section} kpi={d.kpi} columns={d.columns} rows={d.rows} className="hero-app__window" />
      {d.card && (
        <div className="hc hero-app__card">
          <div className="inv__head"><span>{d.card.title}</span>{d.card.meta && <span>{d.card.meta}</span>}</div>
          <p className="inv__total num">{d.card.amount}</p>
          {d.card.progress != null && <div className="meter meter--card" aria-hidden="true"><i style={{ width: `${Math.round(d.card.progress * 100)}%` }} /></div>}
          {d.card.line && <div className="hc__row"><span>{d.card.line[0]}</span><span className="num">{d.card.line[1]}</span></div>}
        </div>
      )}
      <Toast {...d.toast} />
    </div>
  )
}
