import { useEffect, useState } from 'react'
import { Texture } from '../../components/Texture'
import { BandTexture } from '../../components/BandTexture'
import { LeadForm } from '../../components/LeadForm'
import { LpFooter } from '../../components/LpFooter'
import { Heading, IntegrationsSection } from '../../blocks/Shared'
import { Check } from '../../visuals/cards'
import { ThreeLayers } from '../home/ThreeLayers'
import { copy as homeCopy } from '../home/copy'
import { copy as pricingCopy } from '../pricing/copy'
import { CalEmbed, CAL_LINK } from './CalEmbed'
import { captureAdsClick, getAdsClick } from './ads-click'
import { trackMarketingEvent } from '../../analytics.js'
import { SHOW_PENDING } from '../../env'
import { copy } from './copy'
import '../../styles/blocks.css'
import '../../landing/landing.css'
import './landing-ads.css'

// Landing de la primera campaña de Google Ads (docs/landing-ads-b2b.md). Solo ES, sin nav ni
// links de salida (src/pages/standalone.js): una sola conversión principal (agendar demo) y una
// secundaria (formulario de contacto), las dos en la última sección.
export function LandingAdsPage({ t, locale }) {
  const c = copy[locale]
  const plan = pricingCopy.es.plans[0] // Startup
  const [adsClick, setAdsClick] = useState(null)

  useEffect(() => {
    captureAdsClick()
    setAdsClick(getAdsClick())
  }, [])

  const handleBooked = (email) => {
    if (typeof window.gtag === 'function') window.gtag('set', 'user_data', email ? { email } : {})
    trackMarketingEvent('demo_agendada', { form: 'lp-facturacion-b2b', locale })
  }

  return (
    <div className="lpads">
      <header className="lpads-top">
        <img src="/logo-logotype-dark.svg" alt="Relvo" width="102" height="26" />
      </header>

      <section className="section band band--first lp-hero lpads-hero" aria-labelledby="lpads-h1">
        <div className="lp-head">
          <h1 id="lpads-h1" className="lp-head__title">{c.hero.h1}</h1>
          <p className="lp-head__lead">{c.hero.subtitle}</p>
          <div className="lp-head__ctas">
            <a className="btn btn--lg btn--primary" href="#agenda">{c.hero.cta}</a>
          </div>
        </div>
        <div className="lp-hero__visual">
          <div className="stage lp-stage lpads-stage">
            <Texture kind="ridges" />
            <div className="lpads-invoice">
              <div className="lpads-invoice__row">
                <span className="lpads-invoice__number">{c.hero.invoice.number}</span>
                <span className="lpads-invoice__chip">{c.hero.invoice.status}</span>
              </div>
              <p className="lpads-invoice__client">{c.hero.invoice.client}</p>
              <p className="lpads-invoice__total num">{c.hero.invoice.total}</p>
            </div>
          </div>
          <p className="lpads-stat">{c.hero.stat}</p>
        </div>
      </section>

      <section className="section band" aria-labelledby="lpads-quien">
        <Heading id="lpads-quien" title={c.paraQuien.title} />
        <p className="lpads-lead">{c.paraQuien.lead}</p>
      </section>

      <section className="section band band--mint" aria-labelledby="lpads-resuelve">
        <BandTexture kind="orbitsEdge" />
        <Heading id="lpads-resuelve" title={c.queResuelve.title} />
        <p className="lpads-bridge">{c.queResuelve.bridge}</p>
        <div className="paths lpads-paths">
          <div className="path">
            <h3 className="path__title">{c.queResuelve.plans.title}</h3>
            <p className="path__body">{c.queResuelve.plans.body}</p>
          </div>
          <div className="path">
            <h3 className="path__title">{c.queResuelve.contracts.title}</h3>
            <p className="path__body">{c.queResuelve.contracts.body}</p>
          </div>
        </div>
        <ThreeLayers c={homeCopy[locale].layers} />
      </section>

      <section className="section band band--neutral" aria-labelledby="lpads-cifras">
        <BandTexture kind="ridgesSoft" />
        <Heading id="lpads-cifras" title={c.stats.title} />
        <div className="lpads-stats">
          {c.stats.items.map(([value, label]) => (
            <div key={label}><b className="lpads-stats__value num">{value}</b><p className="lpads-stats__label">{label}</p></div>
          ))}
        </div>
      </section>

      <IntegrationsSection c={{ ...homeCopy[locale].integrations, names: c.integrationNames }} locale={locale} />

      <section className="section band lpads-price" aria-labelledby="lpads-precio">
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
            <CalEmbed onBooked={handleBooked} />
            {!CAL_LINK && SHOW_PENDING && <p className="pending__tag">Cal.com: falta el link del evento &quot;Demo Relvo&quot;</p>}
          </div>
          <div className="lpads-demo__form">
            <p className="lpads-demo__alt">{c.demo.altQuestion}</p>
            <LeadForm locale={locale} fuente="lp-facturacion-b2b" submit={c.demo.formSubmit} adsClick={adsClick} enhancedConversions />
          </div>
        </div>
      </section>

      <LpFooter t={t} locale={locale} showIllustrative />
    </div>
  )
}
