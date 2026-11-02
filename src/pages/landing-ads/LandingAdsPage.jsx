import { useEffect, useState } from 'react'
import { BandTexture } from '../../components/BandTexture'
import { LeadForm } from '../../components/LeadForm'
import { LpFooter } from '../../components/LpFooter'
import { Heading, IntegrationsSection } from '../../blocks/Shared'
import { Check } from '../../visuals/cards'
import { ThreeLayers } from '../home/ThreeLayers'
import { HeroStage } from '../home/HeroStage'
import { copy as homeCopy } from '../home/copy'
import { copy as pricingCopy } from '../pricing/copy'
import { hrefFor } from '../../routes'
import { IndustriesCarousel } from './IndustriesCarousel'
import { CalEmbed } from './CalEmbed'
import { CAL_LINK } from './config'
import { captureAdsClick, getAdsClick } from './ads-click'
import { GOOGLE_ADS_CONVERSIONS, fireAdsConversion } from './ads-conversion'
import { trackMarketingEvent } from '../../analytics.js'
import { SHOW_PENDING } from '../../env'
import { copy } from './copy'
import '../../styles/blocks.css'
import '../../landing/landing.css'
import '../home/home.css'
import './landing-ads.css'

// Landing de la primera campaña de Google Ads (docs/landing-ads-b2b.md). Solo ES, sin nav ni
// links de salida (src/pages/standalone.js): una sola conversión principal (agendar demo) y una
// secundaria (formulario de contacto), las dos en la última sección.
export function LandingAdsPage({ t, locale }) {
  const c = copy[locale]
  const plan = pricingCopy.es.plans[0] // Startup
  const home = hrefFor('home', locale)
  const [adsClick, setAdsClick] = useState(null)
  const [prefill, setPrefill] = useState(null)

  useEffect(() => {
    captureAdsClick()
    setAdsClick(getAdsClick())
  }, [])

  const handleBooked = ({ email, uid } = {}) => {
    fireAdsConversion({ ...GOOGLE_ADS_CONVERSIONS.demo, transactionId: uid, email })
    trackMarketingEvent('demo_agendada', { form: 'lp-facturacion-b2b', locale })
  }

  return (
    <div className="lpads">
      <header className="lpads-top">
        {home ? (
          <a href={home} aria-label="Ir a la página principal de Relvo">
            <img src="/logo-logotype-dark.svg" alt="Relvo" width="102" height="26" />
          </a>
        ) : (
          <img src="/logo-logotype-dark.svg" alt="Relvo" width="102" height="26" />
        )}
      </header>

      <section className="section band band--first hero lpads-hero" aria-labelledby="lpads-h1">
        <div className="hero__top">
          <div className="hero__copy">
            <p className="hero__eyebrow">{c.hero.eyebrow}</p>
            <h1 id="lpads-h1" className="hero__title">{c.hero.h1}</h1>
            <p className="hero__subtitle">{c.hero.subtitle}</p>
            <div className="hero__ctas">
              <a className="btn btn--lg btn--primary" href="#agenda">{c.hero.cta}</a>
            </div>
          </div>
          <div className="hero__visual">
            <HeroStage c={homeCopy[locale].hero.stage} locale={locale} />
          </div>
        </div>
      </section>

      <section className="section band" aria-labelledby="lpads-quien">
        <Heading id="lpads-quien" title={c.industrias.title} />
        <p className="lpads-lead">{c.industrias.lead}</p>
        <IndustriesCarousel items={c.industrias.items} label={c.industrias.title} />
      </section>

      <section className="section band band--neutral" aria-labelledby="lpads-resuelve">
        <Heading id="lpads-resuelve" title={c.queResuelve.title} />
        <p className="lpads-bridge">{c.queResuelve.bridge}</p>
        <div className="paths lpads-paths">
          <div className="path">
            <img className="path__shot" src="/product/plan-recurrente.webp" width="1400" height="286" alt="Panel de ingresos de Relvo con el MRR, la facturación neta y la recaudación de los planes recurrentes, en vivo." loading="lazy" />
            <h3 className="path__title">{c.queResuelve.plans.title}</h3>
            <p className="path__body">{c.queResuelve.plans.body}</p>
            <div className="path__stat">
              <b className="num">{c.queResuelve.plans.stat[0]}</b>
              <span>{c.queResuelve.plans.stat[1]}</span>
            </div>
          </div>
          <div className="path">
            <img className="path__shot" src="/product/pricing-hibrido.webp" width="1400" height="492" alt="Etapas y cargos de un contrato con pricing híbrido en Relvo, combinando cargos fijos y cargos por uso." loading="lazy" />
            <h3 className="path__title">{c.queResuelve.contracts.title}</h3>
            <p className="path__body">{c.queResuelve.contracts.body}</p>
            <div className="path__stat">
              <b className="num">{c.queResuelve.contracts.stat[0]}</b>
              <span>{c.queResuelve.contracts.stat[1]}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section band band--mint" aria-labelledby="lpads-agentes">
        <BandTexture kind="orbitsEdge" />
        <Heading id="lpads-agentes" title={homeCopy[locale].layers.title} soft={homeCopy[locale].layers.soft} />
        <ThreeLayers c={homeCopy[locale].layers} />
      </section>

      <section className="section band" aria-labelledby="lpads-cifras">
        <BandTexture kind="ridgesSoft" />
        <Heading id="lpads-cifras" title={c.stats.title} />
        <div className="lpads-stats">
          {c.stats.items.map(([value, label]) => (
            <div key={label}><b className="lpads-stats__value num">{value}</b><p className="lpads-stats__label">{label}</p></div>
          ))}
        </div>
        <img className="lpads-dashboard" src="/product/panel-ingresos.webp" width="1400" height="351" alt="Cartera de cuentas por cobrar de Relvo, con el detalle de mora al día, 1-30, 31-60, 61-90 y más de 90 días por cliente." loading="lazy" />
      </section>

      <IntegrationsSection c={{ ...homeCopy[locale].integrations, names: c.integrationNames }} locale={locale} />

      <section className="section band lpads-price" aria-labelledby="lpads-precio">
        <BandTexture kind="ridgesSoft" />
        <Heading id="lpads-precio" title={c.precio.title} />
        <article className="lpads-plan">
          <div className="lpads-plan__intro">
            <h3 className="lpads-plan__name">{plan.name}</h3>
            <p className="lpads-plan__who">{c.precio.who}</p>
          </div>
          <p className="lpads-plan__price">
            <span className="lpads-plan__amount num">{plan.price}</span>
            <span className="lpads-plan__period">{plan.period}</span>
          </p>
          <ul className="lpads-plan__includes">
            {plan.includes.map((item) => <li key={item}><Check />{item}</li>)}
            <li className="lpads-plan__highlight"><Check />{c.precio.implementation}</li>
          </ul>
          <a className="btn btn--lg btn--primary" href="#agenda">{c.precio.cta}</a>
        </article>
      </section>

      <section className="section band band--neutral lpads-demo" id="agenda" aria-labelledby="lpads-demo-h2">
        <BandTexture kind="dotsGutter" />
        <Heading id="lpads-demo-h2" title={c.demo.title} />
        <p className="lpads-lead">{c.demo.lead}</p>
        <div className="lpads-demo__grid">
          <div className="lpads-demo__cal">
            <CalEmbed onBooked={handleBooked} prefill={prefill} />
            {!CAL_LINK && SHOW_PENDING && <p className="pending__tag">Cal.com: falta el link del evento &quot;Demo Relvo&quot;</p>}
          </div>
          <div className="lpads-demo__form">
            <p className="lpads-demo__alt">{c.demo.altQuestion}</p>
            <LeadForm locale={locale} fuente="lp-facturacion-b2b" submit={c.demo.formSubmit} adsClick={adsClick} adsConversion={GOOGLE_ADS_CONVERSIONS.form} onPrefillChange={setPrefill} />
          </div>
        </div>
      </section>

      <LpFooter t={t} locale={locale} showIllustrative />
    </div>
  )
}
