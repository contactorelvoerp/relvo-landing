import { useEffect, useRef } from 'react'
import { hrefFor } from '../../routes'
import { Texture } from '../../components/Texture'
import { BandTexture } from '../../components/BandTexture'
import { ThreeLayers } from './ThreeLayers'
import { HeroStage } from './HeroStage'
import { Integrations } from './Integrations'
import { Rails } from './Rails'
import { Agents } from './Agents'
import { Intelligence } from './Intelligence'
import { Products } from './Products'
import { Case } from './Case'
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
// Titular en dos tonos: número (opcional) + titular + continuación más suave.
function Heading({ n, title, soft }) {
  return (
    <h2 className="h2">
      {n && <span className="h2__n">{n}</span>}
      {title}{soft && <> <span className="h2__soft">{soft}</span></>}
    </h2>
  )
}

export function HomePage({ t, locale }) {
  const c = copy[locale]
  const demo = hrefFor('demo', locale)
  const plans = hrefFor('planes', locale)
  const contracts = hrefFor('hibrido', locale)
  const pricing = hrefFor('precios', locale)
  const usage = hrefFor('uso', locale)
  const docs = hrefFor('docs', locale)

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
        <Rails c={c.rails} example={c.example} />
      </section>

      <section id="agentes" className="section band band--ink">
        <Heading n="02" title={c.agents.title} soft={c.agents.soft} />
        <Agents c={c.agents} example={c.example} />
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
        <div className="latam">
          {c.latam.points.map(([title, line], i) => (
            <div key={i}><h3 className="latam__title">{title}</h3><p className="latam__line">{line}</p></div>
          ))}
        </div>
      </section>

      <section className="section band band--neutral">
        <BandTexture kind="linesEdge" />
        <Heading title={c.integrations.title} soft={c.integrations.soft} />
        <Integrations c={c.integrations} locale={locale} />
      </section>

      <section className="section section--cta band band--green">
        <div className="cta">
          <Texture kind="periods" />
          <div className="cta__content">
            <h2 className="cta__title">{c.cta.title}</h2>
            <div className="cta__actions">
              {demo && <a className="cta__button" href={demo}>{c.cta.demo}</a>}
              {pricing && <a className="link" href={pricing}>{c.cta.pricing}</a>}
              {docs && <a className="link" href={docs}>{c.cta.docs}</a>}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
