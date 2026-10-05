import { useEffect, useRef, useState } from 'react'
import { SHOW_PENDING } from '../../env'
import { hrefFor } from '../../routes'
import { Texture } from '../../components/Texture'
import { FeatureCard } from '../../components/FeatureCard'
import { ThreeLayers } from './ThreeLayers'
import { Integrations } from './Integrations'
import { DsoDti, MrrUsageChart, MrrWaterfall } from './Charts'
import { copy } from './copy'
import './home.css'

// Logos de la versión anterior del sitio, recortados a su contenido. El alto iguala el peso
// óptico (OpticalLogo del DS, base 30). Carrusel aprobado por Ricardo (2026-10-02).
const LOGOS = [
  { src: '/logos/clients/tgp.webp', alt: 'TGP', width: 99, height: 27 },
  { src: '/logos/clients/lidz.webp', alt: 'Lidz', width: 107, height: 25 },
  { src: '/logos/clients/relif.webp', alt: 'Relif', width: 81, height: 33 },
  { src: '/logos/clients/bulk.webp', alt: 'Bulk', width: 41, height: 40 },
  { src: '/logos/clients/skyward.webp', alt: 'Skyward', width: 128, height: 21 },
]
// Cada mitad del carrusel repite los logos hasta tener al menos 8 celdas.
const REPEAT = Math.ceil(8 / LOGOS.length)
const SET = Array.from({ length: REPEAT }, () => LOGOS).flat()
const CHARTS = [MrrUsageChart, DsoDti, MrrWaterfall]

function LogoStrip({ label }) {
  const ref = useRef(null)
  // El carrusel se detiene fuera de pantalla.
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => el.classList.toggle('logo-strip--offscreen', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="logo-strip">
      <p className="logo-strip__label">{label}</p>
      <div className="logo-strip__window">
        <div className="logo-strip__track">
          {[0, 1].map((group) => (
            <div key={group} className="logo-strip__group" aria-hidden={group === 1 ? 'true' : undefined}>
              {SET.map((logo, i) => {
                const repeat = group === 1 || i >= LOGOS.length
                return (
                  <div key={i} className={`logo-strip__cell${i >= LOGOS.length ? ' logo-strip__cell--repeat' : ''}`}>
                    <img src={logo.src} alt={repeat ? '' : logo.alt} width={logo.width} height={logo.height} loading="lazy" draggable="false" />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
function Pending({ label, children }) {
  return <p className="pending-note"><span className="pending-note__tag">{label}</span>{children && <span>{children}</span>}</p>
}

export function HomePage({ locale }) {
  const c = copy[locale]
  const [tab, setTab] = useState(0)
  const demo = hrefFor('demo', locale)
  const plans = hrefFor('planes', locale)
  const contracts = hrefFor('hibrido', locale)
  const agencies = hrefFor('agencias', locale)

  return (
    <>
      <section className="section hero">
        <div className="hero__top">
          <div className="hero__copy">
            <p className="hero__eyebrow">{c.hero.eyebrow}</p>
            <h1 className="hero__title">{c.hero.title}</h1>
            <p className="hero__subtitle">{c.hero.subtitle}</p>
            <div className="hero__ctas">
              {demo && <a className="btn btn--primary btn--lg" href={demo}>{c.hero.demo}</a>}
              <a className="btn btn--secondary btn--lg" href="#como-funciona">{c.hero.how}</a>
            </div>
          </div>
          <div className="hero__visual">
            <div className="stage stage--hero">
              <Texture kind="orbits" />
              <div className="stage__card"><FeatureCard {...c.hero.card} /></div>
              <span className="stage__example">{c.example}</span>
            </div>
          </div>
        </div>
        <LogoStrip label={c.hero.logos} />
      </section>

      {SHOW_PENDING && (
        <section className="section divider">
          <Pending label={c.pending.optional}>{c.pending.proofNote}</Pending>
          <div className="proof">
            <div className="proof__figure">
              <span className="pending-note__tag">{c.pending.measure}</span>
              <span className="proof__value">{c.pending.value}</span>
            </div>
            <div className="proof__context">
              <span>{c.pending.compare}</span>
              <span>{c.pending.judgement}</span>
            </div>
          </div>
        </section>
      )}

      <section id="como-funciona" className="section divider">
        <ThreeLayers c={c.layers} example={c.example} />
      </section>

      <section id="rieles" className="section section--tint divider">
        <div className="split">
          <div className="split__copy">
            <div className="numbered"><span className="numbered__n">01</span><h2 className="h2">{c.rails.title}</h2></div>
            <p className="lede">{c.rails.lede}</p>
            <ul className="points">
              {c.rails.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
          {SHOW_PENDING && (
            <div className="split__visual">
              <div className="panel panel--pending"><Pending label="[PENDIENTE]">{c.rails.pendingVisual}</Pending></div>
            </div>
          )}
        </div>
      </section>

      <section id="agentes" className="section divider">
        <div className="band band--ink">
          <Texture kind="pulse" />
          <div className="band__head">
            <div className="numbered band__title"><span className="numbered__n numbered__n--on-ink">02</span><h2 className="h2 h2--on-ink">{c.agents.title}</h2></div>
            <div className="band__text">
              <p className="lede lede--on-ink">{c.agents.lede}</p>
              <p className="band__punch">{c.agents.punch}</p>
            </div>
          </div>
          <div className="stage stage--band">
            <div className="stage__card"><FeatureCard tone="dark" {...c.agents.card} /></div>
            <span className="stage__example stage__example--on-ink">{c.example}</span>
          </div>
        </div>
      </section>

      <section id="inteligencia" className="section section--tint divider">
        <div className="split">
          <div className="split__copy">
            <div className="numbered"><span className="numbered__n">03</span><h2 className="h2">{c.intel.title}</h2></div>
            <p className="lede">{c.intel.lede}</p>
            <p className="support">{c.intel.support}</p>
          </div>
          <div className="split__visual">
            <div className="panel-tabs">
              <Texture kind="ridges" />
              <div className="panel-tabs__list" role="tablist">
                {c.intel.tabs.map((t, i) => (
                  <button key={t.label} type="button" role="tab" id={`intel-tab-${i}`} aria-selected={tab === i} aria-controls="intel-panel" className="panel-tabs__tab" onClick={() => setTab(i)}>{t.label}</button>
                ))}
              </div>
              <div className="panel-tabs__panel" role="tabpanel" id="intel-panel" aria-labelledby={`intel-tab-${tab}`}>
                <p className="panel-tabs__desc">{c.intel.tabs[tab].desc}</p>
                {(() => { const Chart = CHARTS[tab]; return <Chart c={c.charts} /> })()}
                <span className="example-tag panel-tabs__example">{c.example}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section divider">
        <div className="heading-row">
          <h2 className="h2 heading-row__title">{c.bridge.title}</h2>
          <p className="lede heading-row__lede">{c.bridge.lede}</p>
        </div>
        <div className="bridge">
          <div className="bridge__col">
            <h3 className="bridge__title">{c.bridge.plans.title}</h3>
            <p className="bridge__body">{c.bridge.plans.body}</p>
            <div className="bridge__actions">
              {demo && <a className="btn btn--primary btn--md" href={demo}>{c.bridge.demo}</a>}
              {plans && <a className="arrow-link" href={plans}>{c.bridge.plans.title} →</a>}
            </div>
          </div>
          <div className="bridge__col">
            <h3 className="bridge__title">{c.bridge.contracts.title}</h3>
            <p className="bridge__body">{c.bridge.contracts.body}</p>
            <div className="bridge__actions">
              {demo && <a className="btn btn--primary btn--md" href={demo}>{c.bridge.demo}</a>}
              {contracts && <a className="arrow-link" href={contracts}>{c.bridge.contracts.title} →</a>}
            </div>
          </div>
        </div>
        {agencies && (
          <p className="bridge__agency">{c.bridge.agencyQuestion} <a className="arrow-link" href={agencies}>{c.bridge.agencyLink}</a></p>
        )}
      </section>

      {SHOW_PENDING && (
        <section id="clientes" className="section divider">
          <Pending label={c.pending.optional}>{c.pending.casesNote}</Pending>
          <h2 className="h2">{c.pending.casesTitle}</h2>
          <article className="case">
            <img className="case__logo" src="/logos/clients/tgp.webp" alt="TGP" width="102" height="28" loading="lazy" />
            <div className="case__figure">
              <span className="case__value">{c.pending.value} → {c.pending.value}</span>
              <span className="case__measure">{c.pending.measure}</span>
            </div>
            <span className="case__context">{c.pending.compare}</span>
          </article>
        </section>
      )}

      <section className="section divider">
        <div className="band band--ink">
          <div className="heading-row">
            <h2 className="h2 h2--on-ink heading-row__title">{c.latam.title}</h2>
            <div className="heading-row__lede latam">
              <p className="lede lede--on-ink">{c.latam.lede}</p>
              <ol className="latam__list">
                {c.latam.points.map((p, i) => (
                  <li key={p}><span className="latam__n">{String(i + 1).padStart(2, '0')}</span><span className="latam__text">{p}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint divider">
        <h2 className="h2">{c.integrations.title}</h2>
        <Integrations c={c.integrations} />
      </section>

      <section className="section divider">
        <div className="band band--green cta">
          <Texture kind="periods" />
          <div className="cta__content">
            <h2 className="cta__title">{c.cta.title}</h2>
            {demo && <a className="cta__button" href={demo}>{c.cta.demo}</a>}
          </div>
        </div>
      </section>
    </>
  )
}
