import { useState } from 'react'
import { Texture } from '../../components/Texture'
import { Usage } from '../../visuals/cards'
import { labelsFor } from '../../visuals/labels'
import { Toast, Window } from '../../visuals/HeroApp'
import { useSequence } from '../../visuals/useSequence'
import { INDUSTRY_ICONS } from './industry-icons'

// Mockup del hero con 3 casos (Ricardo, 2026-11-01): antes era 100% SaaS/tokens y no conectaba con
// logística ni staffing. Logística y Staffing viven en copy.js → heroTabs; SaaS e IA reusa tal cual
// el objeto del hero de la home (homeCopy.es.hero.stage), sin duplicar esos datos aprobados.
// Mismas 4 piezas que el hero de la home (ventana, tarjeta de uso, factura, aviso) y la misma
// secuencia de aparición una sola vez al cargar: cambiar de tab solo reemplaza el contenido de esas
// piezas, no las vuelve a animar.
// Tokens de ejemplo del caso SaaS e IA (últimos 30 días), igual que el hero de la home.
const DAYS = [8, 12, 18, 15, 24, 30, 22, 26, 14, 10, 28, 25, 33, 38, 30, 52, 70, 42, 35, 26, 30, 34, 32, 44, 50, 56, 62, 48, 36, 40]

// Reemplaza la tarjeta de consumo (Usage) en los tabs sin cap/serie diaria (Logística, Staffing):
// mismas clases .usage__plan/.usage__big del DS, sin el ícono, el medidor ni el histograma, que son
// específicos del consumo de tokens.
function Metric({ d }) {
  return (
    <>
      <div className="usage__plan"><div><b>{d.label}</b><small>{d.unit}</small></div></div>
      <div className="usage__big"><b className="num">{d.value}</b></div>
    </>
  )
}

export function HeroShowcase({ tabs, saasStage, locale }) {
  const [active, setActive] = useState(tabs.items[0].key)
  const [stage, paid] = useSequence(2)
  const current = tabs.items.find((t) => t.key === active) ?? tabs.items[0]
  const isSaas = current.key === 'saas'
  const data = isSaas ? saasStage : current
  const usageIndex = data.invoice.usageIndex ?? 1

  const rows = data.window.rows.map(([id, amount, status], i) => ({ cols: [id, amount], status: i === 0 && paid ? data.window.paid : status }))

  return (
    <div>
      <div className="hero-tabs" role="tablist" aria-label={tabs.tablistLabel}>
        {tabs.items.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.key === active}
            className={`hero-tabs__tab${t.key === active ? ' hero-tabs__tab--on' : ''}`}
            onClick={() => setActive(t.key)}
          >
            <svg className="hero-tabs__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {INDUSTRY_ICONS[t.key]}
            </svg>
            {t.tabLabel}
          </button>
        ))}
      </div>
      <div ref={stage} className="stage hero-stage">
        <Texture kind="orbits" />
        <Window url={data.window.url} nav={data.window.nav} section={data.window.nav[0]} kpi={{ label: data.window.label, value: data.window.name, badge: data.window.status }} columns={data.window.columns} rows={rows} />
        <div className="hc hc--usage">
          {isSaas ? <Usage d={{ ...saasStage.usage, series: DAYS }} l={labelsFor(locale)} /> : <Metric d={current.metric} />}
        </div>
        <div className="hc hc--invoice">
          <div className="inv__head"><span>{data.invoice.title}</span><span>{data.invoice.meta}</span></div>
          <p className="inv__total num">{data.invoice.total}</p>
          {data.invoice.rows.map(([label, amount], i) => (
            <div key={label} className="hc__row"><span>{label}</span><span className={i === usageIndex ? 'num hc__uso' : 'num'}>{amount}</span></div>
          ))}
          <div className="hc__row hc__row--total"><span>{data.invoice.totalLabel}</span><span className="num">{data.invoice.total}</span></div>
        </div>
        <Toast title={data.toast.title} sub={data.toast.meta} />
      </div>
    </div>
  )
}
