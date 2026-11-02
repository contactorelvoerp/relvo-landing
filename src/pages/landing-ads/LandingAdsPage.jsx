import { useEffect, useState } from 'react'
import { BandTexture } from '../../components/BandTexture'
import { LeadForm } from '../../components/LeadForm'
import { LpFooter } from '../../components/LpFooter'
import { Heading, IntegrationsSection } from '../../blocks/Shared'
import { Check } from '../../visuals/cards'
import { HeroShowcase } from './HeroShowcase'
import { OneEngine } from './OneEngine'
import { copy as homeCopy } from '../home/copy'
import { copy as pricingCopy } from '../pricing/copy'
import { IndustriesCarousel } from './IndustriesCarousel'
import { CalEmbed } from './CalEmbed'
import { SHOW_CASE_TGP } from './config'
import { captureAdsClick, getAdsClick } from './ads-click'
import { GOOGLE_ADS_CONVERSIONS, fireAdsConversion } from './ads-conversion'
import { trackMarketingEvent } from '../../analytics.js'
import { SHOW_PENDING } from '../../env'
import { copy, isPending } from './copy'
import '../../styles/blocks.css'
import '../../landing/landing.css'
import '../home/home.css'
import './landing-ads.css'

// Caso de cliente preparado detrás de un flag (src/pages/landing-ads/config.js → SHOW_CASE_TGP):
// no hay contenido aprobado todavía, así que no se publica nada (CLAUDE.md: nunca inventar
// clientes ni citas). Cuando Ricardo entregue texto, logo y cita, van acá.
const CASE_CONTENT = null

// Los 6 links "Agenda una demo" de la página saltan a #agenda con scroll propio, no el salto nativo
// del navegador (Ricardo, 2026-11-02: en producción aterrizaban en "Preguntas frecuentes", la
// sección de arriba — el salto nativo mide la posición al click, y el embed diferido de Cal.com más
// las animaciones de entrada todavía podían mover el alto de la página después de esa medición).
// scrollIntoView en vez de calcular la Y a mano (así respeta scroll-margin-top de landing-ads.css),
// y 3 reintentos espaciados que corrigen la posición si algo debajo del click sigue cambiando de alto.
function scrollToAgenda(event) {
  event.preventDefault()
  const target = document.getElementById('agenda')
  if (!target) return
  if (window.location.hash !== '#agenda') window.history.pushState(null, '', '#agenda')
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  for (const delay of [400, 900, 1600]) {
    setTimeout(() => {
      if (Math.abs(target.getBoundingClientRect().top) > 4) target.scrollIntoView({ behavior: 'auto', block: 'start' })
    }, delay)
  }
}

// Formulario de contacto como alternativa secundaria al calendario: en mobile va colapsado (acordeón)
// debajo de Cal.com, en desktop siempre abierto (lpads-demo__form-body--closed solo actúa bajo los
// 900px del grid, ver landing-ads.css).
function DemoFormPanel({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="lpads-demo__form">
      <button type="button" className="lpads-demo__form-toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <svg className={`lpads-demo__form-chevron${open ? ' lpads-demo__form-chevron--open' : ''}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
      </button>
      <div className={`lpads-demo__form-body${open ? '' : ' lpads-demo__form-body--closed'}`}>
        {children}
      </div>
    </div>
  )
}

// Landing de la primera campaña de Google Ads (docs/landing-ads-b2b.md). Solo ES, sin nav ni links
// de salida (Ricardo, 2026-11-02: el logo del header ya tampoco es link): una sola conversión
// principal (agendar demo) y una secundaria (formulario de contacto), las dos en la última sección.
export function LandingAdsPage({ t, locale }) {
  const c = copy[locale]
  const plan = pricingCopy.es.plans[0] // Startup
  const faq = c.faq.items.filter((item) => SHOW_PENDING || !isPending(item.a))
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
        <img src="/logo-logotype-dark.svg" alt="Relvo" width="102" height="26" />
        <a className="btn btn--primary btn--md lpads-top__cta" href="#agenda" onClick={scrollToAgenda}>{c.hero.cta}</a>
      </header>

      <section className="section band band--first hero lpads-hero" aria-labelledby="lpads-h1">
        <div className="hero__top">
          <div className="hero__copy">
            <p className="hero__eyebrow">{c.hero.eyebrow}</p>
            <h1 id="lpads-h1" className="hero__title">{c.hero.h1}</h1>
            <p className="hero__subtitle">{c.hero.subtitle}</p>
            <div className="hero__ctas">
              <a className="btn btn--lg btn--primary" href="#agenda" onClick={scrollToAgenda}>{c.hero.cta}</a>
            </div>
            <p className="lpads-hero__microcopy">{c.hero.microcopy}</p>
          </div>
          <div className="hero__visual">
            <HeroShowcase tabs={c.heroTabs} saasStage={homeCopy[locale].hero.stage} locale={locale} />
          </div>
        </div>
      </section>

      <section className="section band band--neutral lpads-pain" aria-labelledby="lpads-pain">
        <Heading id="lpads-pain" title={c.pain.title} />
        <ul className="lpads-pain__list">
          {c.pain.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p className="lpads-pain__closing">{c.pain.closing}</p>
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
        <p className="lpads-resuelve__cta"><span>{c.queResuelve.ctaQuestion}</span> <a className="link" href="#agenda" onClick={scrollToAgenda}>{c.queResuelve.ctaLink}</a></p>
      </section>

      <section className="section band band--mint" aria-labelledby="lpads-motor">
        <BandTexture kind="orbitsEdge" />
        <Heading id="lpads-motor" title={c.oneEngine.title} />
        <OneEngine c={c.oneEngine} />
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
        <p className="lpads-cifras__cta"><a className="btn btn--md btn--secondary" href="#agenda" onClick={scrollToAgenda}>{c.stats.cta}</a></p>
      </section>

      {SHOW_CASE_TGP && CASE_CONTENT && (
        <section className="section band band--neutral" aria-labelledby="lpads-caso">
          <Heading id="lpads-caso" title={CASE_CONTENT.title} />
        </section>
      )}

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
          <a className="btn btn--lg btn--primary" href="#agenda" onClick={scrollToAgenda}>{c.precio.cta}</a>
        </article>
        <p className="lpads-plan__volume"><a className="link" href="#agenda" onClick={scrollToAgenda}>{c.precio.volume}</a></p>
      </section>

      {faq.length > 0 && (
        <section className="section band band--neutral" aria-labelledby="lpads-faq">
          <Heading id="lpads-faq" title={c.faq.title} />
          <div className="faq">
            {faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                {isPending(item.a) ? <p><span className="pending__tag">{item.a}</span></p> : <p>{item.a}</p>}
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="section band band--neutral lpads-demo" id="agenda" aria-labelledby="lpads-demo-h2">
        <BandTexture kind="dotsGutter" />
        <Heading id="lpads-demo-h2" title={c.demo.title} />
        <p className="lpads-lead">{c.demo.lead}</p>
        <div className="lpads-demo__grid">
          <div className="lpads-demo__cal">
            <CalEmbed onBooked={handleBooked} prefill={prefill} />
          </div>
          <DemoFormPanel title={c.demo.formTitle}>
            <LeadForm locale={locale} fuente="lp-facturacion-b2b" submit={c.demo.formSubmit} adsClick={adsClick} adsConversion={GOOGLE_ADS_CONVERSIONS.form} onPrefillChange={setPrefill} roleOptions={c.demo.roleOptions} />
          </DemoFormPanel>
        </div>
      </section>

      <LpFooter t={t} locale={locale} showIllustrative tagline={c.footer.tagline} />
    </div>
  )
}
