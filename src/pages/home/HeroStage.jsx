import { useEffect, useRef, useState } from 'react'
import { Texture } from '../../components/Texture'

// Hero (prototipo home v1): contrato → factura → pago conciliado → MRR sobre la textura Órbitas.
// Las piezas aparecen en secuencia una sola vez al cargar; con movimiento reducido, todas a la vez.
// Sin JavaScript se ven todas (la clase .js del <html> es la que las oculta al inicio).
const CHECK = (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 7.5 6 10l5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function HeroStage({ c, example }) {
  const stage = useRef(null)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    const el = stage.current
    const cards = [...el.querySelectorAll('.hc')]
    const show = (i) => { cards[i].classList.add('hc--in'); el.classList.add(`hero-stage--s${i}`) }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((_, i) => show(i))
      setPaid(true)
      return undefined
    }
    const timers = cards.map((_, i) => setTimeout(() => show(i), 300 + i * 650))
    timers.push(setTimeout(() => setPaid(true), 300 + 3 * 650 + 700))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div ref={stage} className="stage hero-stage">
      <Texture kind="orbits" />
      <svg className="hero-stage__flow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M33 30 C 33 38, 38 41, 42 43" />
        <path d="M68 55 C 68 60, 64 62, 63 64" />
      </svg>

      <div className="hc hc--contract">
        <div className="hc__top"><b>{c.contract.title}</b><span>{c.contract.meta}</span></div>
        <div className="hc__row"><span>{c.contract.plan}</span><span className="num">{c.contract.planAmount}</span></div>
        <div className="hc__row"><span>{c.contract.usage}</span><span className="num hc__exact">{c.contract.usageAmount}</span></div>
        <div className="hc__row hc__row--total"><span>{c.contract.total}</span><span className="num">{c.contract.totalAmount}</span></div>
      </div>

      <div className="hc hc--invoice">
        <div className="hc__top"><b>{c.invoice.title}</b><span className="chip">{c.invoice.chip}</span></div>
        <div className="hc__row"><span>{c.invoice.po}</span><span className="hc__ok">{c.invoice.poState}</span></div>
        <div className="hc__row"><span>{c.invoice.sent}</span><span className="hc__ok">{c.invoice.sentState}</span></div>
      </div>

      <div className="hc hc--paid">
        <div className="hc__sender"><span className="hc__mark">{CHECK}</span>{c.paid.sender}</div>
        <p className="hc__title">{c.paid.title}</p>
        <p className="hc__context">{c.paid.context}</p>
        <p className="hc__amount num">{c.paid.amount}</p>
        <span className={`chip${paid ? '' : ' chip--run'}`}>{paid ? c.paid.done : c.paid.running}</span>
      </div>

      <div className="hc hc--mrr">
        <span className="hc__label">{c.mrr.label}</span>
        <b className="hc__mrr num">{c.mrr.amount}</b>
        <span className="hc__up">{c.mrr.delta}</span>
      </div>

      <span className="example-tag hero-stage__tag">{example}</span>
    </div>
  )
}
