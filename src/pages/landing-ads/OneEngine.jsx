// Reemplaza "Tres capas, un solo motor" (que hablaba de nuestra arquitectura: Rieles, Agentes,
// Inteligencia) por el mismo beneficio contado para el cliente, con el mismo diseño de 3 tarjetas
// (src/pages/home/home.css → .layers*, sin tocar ese archivo ni el componente ThreeLayers.jsx que
// usa la home). Estático, sin el riel animado de ThreeLayers.jsx: esa coreografía está hecha a
// medida para los montos de la home (USD, MRR) y no para los de acá (UF), y una landing de campaña
// no necesita esa complejidad — las tarjetas ya se ven completas sin ella.
// Ejemplos dentro de las tarjetas: caso de Logística (Ricardo, 2026-11-01, instrucción explícita:
// "el mismo caso del tab activo del hero (o el de Logística)"). Coherente con copy.js → heroTabs.logistica.
export function OneEngine({ c }) {
  return (
    <div className="layers layers--wide">
      <div className="layers__grid">
        <article className="layers__card">
          <div className="layers__head"><span className="layers__num">01</span><h3 className="layers__name">{c.calcula.title}</h3></div>
          <p className="layers__sub">{c.calcula.sub}</p>
          <div className="layers__body layers__calc">
            <div className="layers__row"><span>{c.calcula.plan}</span><span className="layers__amount">{c.calcula.planAmount}</span></div>
            <div className="layers__row layers__row--tight"><span>{c.calcula.usage}</span><span className="layers__amount layers__amount--exact">{c.calcula.usageAmount}</span></div>
            <div className="layers__detail">{c.calcula.detail}</div>
            <div className="layers__row layers__row--total"><span>{c.calcula.total}</span><span className="layers__amount">{c.calcula.totalAmount}</span></div>
          </div>
        </article>
        <article className="layers__card">
          <div className="layers__head"><span className="layers__num">02</span><h3 className="layers__name">{c.opera.title}</h3></div>
          <p className="layers__sub">{c.opera.sub}</p>
          <div className="layers__body layers__event">
            <div className="layers__sender">
              <span className="layers__mark"><svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7.5 6 10l5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              {c.opera.sender}
            </div>
            <strong className="layers__event-title">{c.opera.event}</strong>
            <span className="layers__event-context">{c.opera.context}</span>
            <span className="layers__chip">{c.opera.done}</span>
          </div>
        </article>
        <article className="layers__card">
          <div className="layers__head"><span className="layers__num">03</span><h3 className="layers__name">{c.teMuestra.title}</h3></div>
          <p className="layers__sub">{c.teMuestra.sub}</p>
          <div className="layers__body">
            <div className="layers__mrr-label">{c.teMuestra.facturadoLabel}</div>
            <div className="layers__mrr">{c.teMuestra.facturado}</div>
            <div className="layers__row layers__row--tight"><span>{c.teMuestra.recaudadoLabel}</span><span className="layers__amount">{c.teMuestra.recaudado}</span></div>
            <div className="layers__row"><span>{c.teMuestra.porCobrarLabel}</span><span className="layers__amount">{c.teMuestra.porCobrar}</span></div>
          </div>
        </article>
      </div>
    </div>
  )
}
