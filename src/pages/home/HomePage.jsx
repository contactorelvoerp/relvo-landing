import { useEffect, useRef } from 'react'
import { hrefFor } from '../../routes'
import { BandTexture } from '../../components/BandTexture'
import { ThreeLayers } from './ThreeLayers'
import { HeroStage } from './HeroStage'
import { Rails } from './Rails'
import { Agents } from './Agents'
import { Intelligence } from './Intelligence'
import { Products } from './Products'
import { Case } from '../../blocks/Case'
import { CtaSection, Heading, IntegrationsSection } from '../../blocks/Shared'
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
// Íconos de línea de LatAm (prototipo v2.1), en el mismo orden que las frases
const LATAM_ICONS = [
  <g key="einvoice"><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></g>,
  <path key="bank" d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" />,
  <g key="card"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h4" /></g>,
  <g key="currency"><circle cx="9" cy="10" r="5" /><path d="M14.5 6.2A5 5 0 1 1 13 17.6" /></g>,
  <path key="entities" d="M4 20V8l5-3v15M9 20V10l6-3v13M15 20V11l5 2v7M3 20h18" />,
  <g key="po"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 12l2 2 4-4" /></g>,
]


export function HomePage({ t, locale }) {
  const c = copy[locale]
  const demo = hrefFor('demo', locale)
  const plans = hrefFor('planes', locale)
  const contracts = hrefFor('hibrido', locale)
  const pricing = hrefFor('precios', locale)
  const usage = hrefFor('uso', locale)

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
            <HeroStage c={c.hero.stage} locale={locale} example={c.example} />
          </div>
        </div>
        <LogoStrip label={c.hero.logos} />
      </section>

      <section id="como-funciona" className="section band band--mint">
        <BandTexture kind="orbitsEdge" />
        <Heading title={c.layers.title} soft={c.layers.soft} />
        <ThreeLayers c={c.layers} example={c.example} />
      </section>

      <section className="section band manifesto" aria-label={c.manifesto.label}>
        <BandTexture kind="ridgesSoft" />
        <p className="manifesto__text">{c.manifesto.lines[0]}<br />{c.manifesto.lines[1]}</p>
      </section>

      <section id="rieles" className="section band">
        <Heading n="01" title={c.rails.title} soft={c.rails.soft} />
        <Rails c={c.rails} locale={locale} example={c.example} />
      </section>

      <section id="agentes" className="section band band--ink">
        <Heading n="02" title={c.agents.title} soft={c.agents.soft} />
        <Agents c={c.agents} locale={locale} example={c.example} />
      </section>

      <section id="inteligencia" className="section band band--neutral">
        <BandTexture kind="ridgesSoft" />
        <Heading n="03" title={c.intel.title} soft={c.intel.soft} />
        <Intelligence c={c.intel} example={c.example} />
      </section>

      <section className="section band">
        <Heading title={c.products.title} soft={c.products.soft} />
        <Products c={c.products} pages={t.pages} locale={locale} />
      </section>

      <section id="soluciones" className="section band band--neutral">
        <BandTexture kind="dotsGutter" />
        <Heading title={c.bridge.title} soft={c.bridge.soft} />
        <div className="paths">
          <div className="path">
            <h3 className="path__title">{c.bridge.plans.title}</h3>
            <p className="path__body">{c.bridge.plans.body}</p>
            <div className="path__actions">
              {pricing && <a className="btn btn--primary btn--md" href={pricing}>{c.bridge.plans.cta}</a>}
              {plans && <a className="link" href={plans}>{c.bridge.plans.link}</a>}
            </div>
          </div>
          <div className="path">
            <h3 className="path__title">{c.bridge.contracts.title}</h3>
            <p className="path__body">{c.bridge.contracts.body}</p>
            <div className="path__actions">
              {demo && <a className="btn btn--primary btn--md" href={demo}>{c.bridge.contracts.cta}</a>}
              {contracts && <a className="link" href={contracts}>{c.bridge.contracts.link}</a>}
            </div>
          </div>
        </div>
        {usage && <p className="paths__usage">{c.bridge.usageQuestion} <a className="link" href={usage}>{c.bridge.usageLink}</a></p>}
      </section>

      <section id="clientes" className="section band">
        <Heading title={c.case.title} />
        <Case c={c.case} />
      </section>

      <section className="section band band--ink">
        <BandTexture kind="orbitsDark" />
        <Heading title={c.latam.title} soft={c.latam.soft} />
        <ul className="latam">
          {c.latam.points.map((point, i) => <li key={i}><svg viewBox="0 0 24 24" aria-hidden="true">{LATAM_ICONS[i]}</svg>{point}</li>)}
        </ul>
      </section>

      <IntegrationsSection c={c.integrations} locale={locale} />

      <CtaSection c={c.cta} locale={locale} />
    </>
  )
}
