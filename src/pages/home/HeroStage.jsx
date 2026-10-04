import { useEffect, useRef, useState } from 'react'
import { Texture } from '../../components/Texture'

// Hero (prototipo home v2): ventana de la app → tokens del mes → factura → pago conciliado,
// sobre la textura Órbitas. Las piezas aparecen en secuencia una sola vez al cargar; con
// movimiento reducido, todas a la vez. Sin JavaScript se ven todas (la clase .js del <html>
// es la que las oculta al inicio). En mobile se apilan.
const CHECK = (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 7.5 6 10l5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const MARK = (
  <svg viewBox="0 0 20 20" aria-hidden="true" fill="#186666">
    <circle cx="6" cy="5" r="3.2" /><circle cx="14.5" cy="6.5" r="3.2" /><circle cx="5" cy="13.5" r="3.2" /><circle cx="12.5" cy="15" r="3.2" />
  </svg>
)
// Tokens por día de los últimos 30 días (ejemplo), en % del día más alto de la escala
const DAYS = [8, 12, 18, 15, 24, 30, 22, 26, 14, 10, 28, 25, 33, 38, 30, 52, 70, 42, 35, 26, 30, 34, 32, 44, 50, 56, 62, 48, 36, 40]

export function HeroStage({ c, example }) {
  const stage = useRef(null)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    const el = stage.current
    const cards = [...el.querySelectorAll('.hc')]
    const show = (i) => cards[i].classList.add('hc--in')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((_, i) => show(i))
      setPaid(true)
      return undefined
    }
    const timers = cards.map((_, i) => setTimeout(() => show(i), 300 + i * 650))
    timers.push(setTimeout(() => setPaid(true), 300 + 2 * 650 + 500))
    return () => timers.forEach(clearTimeout)
  }, [])

  const w = c.window
  return (
    <div ref={stage} className="stage hero-stage">
      <Texture kind="orbits" />

      <div className="hc hc--window">
        <div className="win__bar" aria-hidden="true"><i /><i /><i /><span className="win__url">{w.url}</span></div>
        <div className="win__body">
          <div className="win__side">
            <span className="win__brand">{MARK}{w.brand}</span>
            {w.nav.map((item, i) => <span key={item} className={i === 0 ? 'win__nav win__nav--on' : 'win__nav'}>{item}</span>)}
          </div>
          <div className="win__main">
            <div className="win__head">
              <div><small>{w.label}</small><b>{w.name}</b></div>
              <span className="chip">{w.status}</span>
            </div>
            <table className="win__table">
              <thead><tr>{w.columns.map((col) => <th key={col}>{col}</th>)}</tr></thead>
              <tbody>
                {w.rows.map(([id, amount, status], i) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td className="num">{amount}</td>
                    <td><span className="chip">{i === 0 && paid ? w.paid : status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="hc hc--usage">
        <div className="usage__plan">
          <span className="usage__icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2 1.5" /></svg>
          </span>
          <div><b>{c.usage.title}</b><small>{c.usage.price}</small></div>
        </div>
        <div className="usage__big"><b className="num">{c.usage.amount}</b><small>{c.usage.of}</small></div>
        <div className="meter meter--uso" aria-hidden="true"><i style={{ width: '80%' }} /></div>
        <div className="usage__hist" aria-hidden="true">{DAYS.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
        <p className="usage__period">{c.usage.period}</p>
      </div>

      <div className="hc hc--invoice">
        <div className="inv__head"><span>{c.invoice.title}</span><span>{c.invoice.meta}</span></div>
        <p className="inv__total num">{c.invoice.total}</p>
        {c.invoice.rows.map(([label, amount], i) => (
          <div key={label} className="hc__row"><span>{label}</span><span className={i === 1 ? 'num hc__uso' : 'num'}>{amount}</span></div>
        ))}
        <div className="hc__row hc__row--total"><span>{c.invoice.totalLabel}</span><span className="num">{c.invoice.total}</span></div>
      </div>

      <div className="hc hc--toast">
        <span className="hc__mark">{CHECK}</span>
        <div><b>{c.toast.title}</b><small>{c.toast.meta}</small></div>
      </div>

      <span className="example-tag hero-stage__tag">{example}</span>
    </div>
  )
}
