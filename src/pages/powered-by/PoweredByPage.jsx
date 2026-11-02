import { useEffect, useState } from 'react'
import { hrefFor } from '../../routes'
import { copy as homeCopy } from '../home/copy'
import { Case } from '../../blocks/Case'
import { Heading } from '../../blocks/Shared'
import { BandTexture } from '../../components/BandTexture'
import { CalPanel } from '../../blocks/CalPanel'
import { LeadForm } from '../../components/LeadForm'
import { Timeline } from './Timeline'
import { copy } from './copy'
import { referrerFromSearch } from './referrer'
import { scrollToSection } from '../../scrollToSection'
import { trackMarketingEvent } from '../../analytics'
import '../../styles/blocks.css'
import '../../landing/landing.css'
import '../home/home.css'
import './powered-by.css'

const scrollToAgenda = scrollToSection('agenda')
const scrollToHistoria = scrollToSection('historia')

// Página de adquisición a la que llega quien hace click en "Powered by Relvo" dentro de una
// factura, un recordatorio o una confirmación de pago que Relvo envía en nombre de un cliente.
// Rediseñada para convertir a ese visitante (brief de Ricardo, 2026-11-02). Solo ES: sin copy EN
// aprobado para este rediseño, /en/powered-by-relvo no tiene ruta (404 con redirect 301 a la
// versión ES, ver vercel.json y src/pages/registry.js) hasta que llegue la traducción.
export function PoweredByPage({ t }) {
  const c = copy.es
  // El nombre del cliente referente (si `?cliente=` viene en la URL y está en el allowlist) solo
  // se conoce en el navegador: este sitio es prerenderizado en build (sin servidor por request,
  // ver src/entry-server.jsx), así que el primer render siempre muestra el copy genérico y se
  // actualiza apenas monta. No hay forma de evitar ese instante sin agregar una función con SSR
  // real solo para esta página — fuera de alcance de esta tarea.
  const [referrer, setReferrer] = useState({ slug: null, name: null })
  useEffect(() => { setReferrer(referrerFromSearch(window.location.search)) }, [])
  // Se guarda junto al lead (fuente) sin agregar una columna nueva (Ricardo, 2026-11-02): ver
  // variant="short" de LeadForm.jsx. Sin cliente referente, queda igual que hoy ("powered_by_relvo").
  const fuente = referrer.slug ? `powered_by_relvo:${referrer.slug}` : 'powered_by_relvo'

  // powered_by_demo_click: antes la disparaba sola el listener global de analytics.js al navegar a
  // /agendar-demo (destination.pathname). Acá el CTA ya no navega, ancla a #agenda en la misma
  // página, así que ese listener nunca vería el click — se dispara a mano para no perder la señal
  // que alimenta distribution_events (atribución de ingresos real, shared/attribution.js).
  const handleDemoClick = (placement) => (e) => {
    trackMarketingEvent('powered_by_cta_primary', { locale: 'es', placement })
    trackMarketingEvent('powered_by_demo_click', { placement: 'powered_by_page' })
    scrollToAgenda(e)
  }
  const handleCtaSecondary = (e) => { trackMarketingEvent('powered_by_cta_secondary', { locale: 'es' }); scrollToHistoria(e) }
  const handleBooked = () => trackMarketingEvent('demo_agendada', { form: 'powered_by_relvo', locale: 'es' })

  const planesHref = hrefFor('planes', 'es')
  const hibridoHref = hrefFor('hibrido', 'es')
  const homeHref = hrefFor('home', 'es')

  return (
    <div className="pb">
      <div className="pb-notice"><p>{c.notice}</p></div>
      <header className="standalone-top">
        <img src="/logo-logotype-dark.svg" alt="Relvo" width="102" height="26" />
        <a className="btn btn--primary btn--md standalone-top__cta" href="#agenda" onClick={handleDemoClick('header')}>{t.nav.demo}</a>
      </header>

      <section className="section band band--first lp-hero" aria-labelledby="pb-title">
        <div className="lp-head">
          <h1 id="pb-title" className="lp-head__title">{c.hero.title}</h1>
          <p className="lp-head__lead">{c.hero.lead(referrer.name)}</p>
          <div className="lp-head__ctas">
            <a className="btn btn--lg btn--primary pb-cta" href="#agenda" onClick={handleDemoClick('hero')}>{c.hero.ctaPrimary}</a>
            <a className="btn btn--lg btn--secondary pb-cta" href="#historia" onClick={handleCtaSecondary}>{c.hero.ctaSecondary}</a>
          </div>
        </div>
      </section>

      <section id="historia" className="section band band--mint" aria-labelledby="pb-historia">
        <BandTexture kind="orbitsEdge" />
        <Heading id="pb-historia" title={c.timeline.heading} />
        <Timeline steps={c.timeline.steps} />
      </section>

      <section className="section band band--neutral" aria-labelledby="pb-case">
        <Heading id="pb-case" title={homeCopy.es.case.title} />
        <Case c={homeCopy.es.case} />
        <div className="stats stats--2 pb-case-stats">
          {c.stats.map(([value, label]) => (
            <div key={label}><b className="stats__value num">{value}</b><p className="stats__label">{label}</p></div>
          ))}
        </div>
      </section>

      <section className="section band" aria-labelledby="pb-fit">
        <Heading id="pb-fit" title={c.fit.heading} />
        <div className="pb-fit">
          {planesHref && <p>{c.fit.recurring} <a className="link" href={planesHref}>{homeCopy.es.bridge.plans.link}</a></p>}
          {hibridoHref && <p>{c.fit.hybrid} <a className="link" href={hibridoHref}>{homeCopy.es.bridge.contracts.link}</a></p>}
        </div>
      </section>

      <section id="agenda" className="section band band--neutral" aria-labelledby="pb-agenda">
        <BandTexture kind="dotsGutter" />
        <Heading id="pb-agenda" title={c.closing.heading} />
        <CalPanel onBooked={handleBooked} formTitle={c.closing.formTitle}>
          <LeadForm
            locale="es"
            fuente={fuente}
            variant="short"
            submit={c.closing.formSubmit}
            cobroLabel={c.closing.cobroLabel}
            cobroPlaceholder={c.closing.cobroPlaceholder}
            cobroOptions={c.closing.cobroOptions}
          />
        </CalPanel>
      </section>

      <footer className="footer">
        <div className="footer__brand">
          <img src="/logo-logotype-light.svg" alt="Relvo" width="102" height="26" loading="lazy" />
        </div>
        <div className="footer__legal">
          <span>{t.footer.legal}</span>
          {homeHref && <a href={homeHref}>{t.notFound.home}</a>}
        </div>
      </footer>
    </div>
  )
}
