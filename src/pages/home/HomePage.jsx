import { useEffect, useRef } from 'react'
import { SHOW_PENDING } from '../../env'
import { hrefFor } from '../../routes'
import { Texture } from '../../components/Texture'
import { ThreeLayers } from './ThreeLayers'
import { HeroStage } from './HeroStage'
import { Integrations } from './Integrations'
import { Rails } from './Rails'
import { Agents } from './Agents'
import { Intelligence } from './Intelligence'
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

// Titular en dos tonos: número (opcional) + titular + continuación más suave.
function Heading({ n, title, soft }) {
  return (
    <h2 className="h2">
      {n && <span className="h2__n">{n}</span>}
      {title}{soft && <> <span className="h2__soft">{soft}</span></>}
    </h2>
  )
}

export function HomePage({ locale }) {
  const c = copy[locale]
  const demo = hrefFor('demo', locale)
  const plans = hrefFor('planes', locale)
  const contracts = hrefFor('hibrido', locale)
  const agencies = hrefFor('agencias', locale)

  return (
    <>
      <section className="section band band--first hero">
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
            <HeroStage c={c.hero.stage} example={c.example} />
          </div>
        </div>
        <LogoStrip label={c.hero.logos} />
      </section>

      <section id="como-funciona" className="section band band--mint">
        <Heading title={c.layers.title} soft={c.layers.soft} />
        <ThreeLayers c={c.layers} example={c.example} />
      </section>

      <section id="rieles" className="section band">
        <Heading n="01" title={c.rails.title} soft={c.rails.soft} />
        <Rails c={c.rails} example={c.example} />
      </section>

      <section id="agentes" className="section band band--ink">
        <Heading n="02" title={c.agents.title} soft={c.agents.soft} />
        <Agents c={c.agents} example={c.example} />
      </section>

      <section id="inteligencia" className="section band band--neutral">
        <Heading n="03" title={c.intel.title} soft={c.intel.soft} />
        <Intelligence c={c.intel} example={c.example} />
      </section>

      <section className="section band">
        <Heading title={c.bridge.title} soft={c.bridge.soft} />
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
        <section id="clientes" className="section band">
          <Pending label={c.pending.optional}>{c.pending.casesNote}</Pending>
          <Heading title={c.pending.casesTitle} />
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

      <section className="section band band--ink">
        <Heading title={c.latam.title} soft={c.latam.soft} />
        <ol className="latam__list">
          {c.latam.points.map((p, i) => (
            <li key={p}><span className="latam__n">{String(i + 1).padStart(2, '0')}</span><span className="latam__text">{p}</span></li>
          ))}
        </ol>
      </section>

      <section className="section band band--neutral">
        <Heading title={c.integrations.title} soft={c.integrations.soft} />
        <Integrations c={c.integrations} />
      </section>

      <section className="section section--cta band band--green">
        <div className="cta">
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
