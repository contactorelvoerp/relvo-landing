import { useEffect, useRef } from 'react'
import { hrefFor } from '../../routes'
import { BandTexture } from '../../components/BandTexture'
import { LogoStrip } from '../../components/LogoStrip'
import { ThreeLayers } from './ThreeLayers'
import { Rails } from './Rails'
import { Agents } from './Agents'
import { Intelligence } from './Intelligence'
import { Products } from './Products'
import { Case } from '../../blocks/Case'
import { CtaSection, Heading, IntegrationsSection } from '../../blocks/Shared'
import { copy } from './copy'
import './home.css'

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

  // El tramo final del H1 (después de la última coma) va en verde; el texto no cambia.
  const cut = c.hero.title.lastIndexOf(', ')
  const heroRef = useRef(null)
  // La figura del hero se pausa fuera de pantalla.
  useEffect(() => {
    const el = heroRef.current
    const io = new IntersectionObserver(([e]) => el.classList.toggle('hero--offscreen', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <section ref={heroRef} className="section band band--first hero hero--centered hero--amanecer">
        <div className="hero__top">
          <div className="hero__copy">
            <p className="hero__eyebrow">{c.hero.eyebrow}</p>
            <h1 className="hero__title">
              {cut < 0 ? c.hero.title : <>{c.hero.title.slice(0, cut + 1)} <span className="hero__title-em">{c.hero.title.slice(cut + 2)}</span></>}
            </h1>
            <p className="hero__subtitle">{c.hero.subtitle}</p>
            <div className="hero__ctas">
              {demo && <a className="btn btn--primary btn--lg" href={demo}>{c.hero.demo}</a>}
              <a className="btn btn--secondary btn--lg" href="#como-funciona">{c.hero.how}</a>
            </div>
          </div>
        </div>
        {/* Figura de marca (rosa, brand book) que asoma desde la línea del carrusel de logos */}
        <div className="hero__horizonte" aria-hidden="true">
          <div className="hero__cielo">
            <img className="hero__sol" src="/brand/figuras/rosa-verde.svg" alt="" width="216" height="216" decoding="async" />
          </div>
        </div>
        <LogoStrip label={c.hero.logos} />
      </section>

      <section className="section band home-metrics" aria-labelledby="cifras">
        <Heading id="cifras" title={c.stats.title} soft={c.stats.soft} />
        <dl className="home-metrics__grid">
          {c.stats.items.map(([value, label], index) => (
            <div className={`home-metrics__card${index === 2 ? ' home-metrics__card--featured' : ''}`} key={label}>
              <dt className="home-metrics__label">{label}</dt>
              <dd className="home-metrics__value num">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="clientes" className="section band band--mint">
        <Heading title={c.case.proofTitle} />
        <Case c={c.case} link={hrefFor('tgp', locale) ? { href: hrefFor('tgp', locale), label: c.case.link } : null} />
      </section>

      <section id="como-funciona" className="section band">
        <BandTexture kind="orbitsEdge" />
        <Heading title={c.layers.title} soft={c.layers.soft} />
        <ThreeLayers c={c.layers} />
      </section>

      <section className="section band band--ink manifesto" aria-label={c.manifesto.label}>
        <BandTexture kind="orbitsDark" />
        <p className="manifesto__text">{c.manifesto.lines[0]}<br />{c.manifesto.lines[1]}</p>
      </section>

      <section id="rieles" className="section band">
        <Heading n="01" title={c.rails.title} soft={c.rails.soft} />
        <Rails c={c.rails} locale={locale} />
      </section>

      <section id="agentes" className="section band band--ink">
        <Heading n="02" title={c.agents.title} soft={c.agents.soft} />
        <Agents c={c.agents} locale={locale} />
      </section>

      <section id="inteligencia" className="section band band--neutral">
        <BandTexture kind="ridgesSoft" />
        <Heading n="03" title={c.intel.title} soft={c.intel.soft} />
        <Intelligence c={c.intel} />
      </section>

      <section className="section band">
        <Heading title={c.products.title} />
        <Products c={c.products} pages={t.pages} locale={locale} />
      </section>

      <section id="soluciones" className="section band band--mint">
        <BandTexture kind="dotsGutter" />
        <Heading title={c.bridge.title} />
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

      <section className="section band">
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
