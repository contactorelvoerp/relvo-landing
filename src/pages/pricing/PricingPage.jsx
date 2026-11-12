import { PendingPage } from '../PendingPage'
import { copy as homeCopy } from '../home/copy'
import { trackMarketingEvent } from '../../analytics'
import { hrefFor } from '../../routes'
import { bookingHref } from '../../booking'
import { LogoStrip } from '../../components/LogoStrip'
import { copy } from './copy'
import '../../styles/blocks.css'
import '../../landing/landing.css'
import './pricing.css'

const FORM_ID = 'propuesta'
const FAQ_FIRST = 'que-es-un-contrato'

function Arrow() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function Feature({ feature, c, locale }) {
  const product = hrefFor(feature.page, locale)
  return (
    <li>
      <details className="pr-feature">
        <summary>
          <svg className="pr-feature__check" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="pr-sr">{c.featureIncluded}: </span>
          <span className="pr-feature__name">{feature.title}</span>
          <span className="pr-feature__info"><span className="pr-sr">. {c.featureDetails}</span><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" /><path d="M8 7v4m0-6v.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg></span>
        </summary>
        <div className="pr-feature__detail"><p>{feature.detail}</p>{product && <a href={product}>{c.featureLink}<Arrow /></a>}</div>
      </details>
    </li>
  )
}

function Plan({ plan, c, locale }) {
  return (
    <article className={`pr-plan pr-plan--${plan.id}`} id={`plan-${plan.id}`} aria-labelledby={`plan-${plan.id}-name`}>
      <div className="pr-plan__intro">
        <h3 className="pr-plan__name" id={`plan-${plan.id}-name`}>{plan.name}</h3>
      </div>
      <div className="pr-plan__pricing">
        <p className="pr-plan__price"><span className="pr-plan__amount num">{plan.price}</span>{plan.period && <span className="pr-plan__period">{plan.period}</span>}</p>
        {plan.note && <p className="pr-plan__note">{plan.note}</p>}
      </div>
      <dl className="pr-plan__limits">
        {Object.keys(c.limits).map((key, i) => <div key={key}><dt>{c.limits[key]}</dt><dd className="num">{plan.limits[i]}</dd></div>)}
      </dl>
      <a className={`btn btn--lg ${plan.id === 'custom' ? 'btn--secondary' : 'btn--primary'} pr-plan__cta`} href={bookingHref(locale, { plan: plan.id, intent: plan.intent })} onClick={() => trackMarketingEvent('pricing_plan_select', { plan: plan.id, intent: plan.intent, locale })}>{plan.cta}<Arrow /></a>
    </article>
  )
}

export function PricingPage({ locale, route }) {
  const c = copy[locale]
  if (!c) return <PendingPage route={route} />
  const customer = homeCopy[locale].case
  const faq = c.faq.items
  return (
    <div className="pricing">
      <section className="section band band--first pr-hero" aria-labelledby="pr-h1">
        <h1 id="pr-h1" className="pr-hero__title">{c.hero.h1} <span>{c.hero.emphasis}</span></h1>
      </section>
      <section className="pr-plans" aria-labelledby="pr-plans-title" data-placement="pricing_plans">
        <h2 className="pr-sr" id="pr-plans-title">{c.plansLabel}</h2>
        <nav className="pr-summary" aria-label={c.summaryLabel}>
          {c.plans.map((item) => <a key={item.id} href={`#plan-${item.id}`}><span>{item.summary}</span><strong>{item.price}{item.period && <small>{item.period}</small>}</strong><Arrow /></a>)}
        </nav>
        <div className="pr-packages">
          <div className="pr-plangrid">{c.plans.map((item) => <Plan key={item.id} plan={item} c={c} locale={locale} />)}</div>
          <section className="pr-shared" aria-labelledby="pr-shared-title">
            <h3 id="pr-shared-title">{c.sharedFeaturesLabel}</h3>
            <ul className="pr-shared__features" style={{ '--feature-rows': Math.ceil(c.features.length / 2) }}>{c.features.map((feature) => <Feature key={feature.title} feature={feature} c={c} locale={locale} />)}</ul>
          </section>
        </div>
        <p className="pr-fit">{c.fit} <a href={bookingHref(locale)}>{c.fitLink}<Arrow /></a></p>
        <LogoStrip label={homeCopy[locale].hero.logos} />
      </section>
      <section className="section band band--mint pr-proof" aria-labelledby="pr-proof-title">
        <h2 id="pr-proof-title" className="pr-sr">{c.proof.title}</h2>
        <img src="/logos/clients/tgp.webp" width="88" height="40" alt="TGP" loading="lazy" />
        <div className="pr-proof__result"><p className="pr-proof__metric"><strong className="num">{customer.big}</strong><span>{customer.bigLabel}</span></p><p className="pr-proof__context">{customer.bigSub}</p></div>
        <div className="pr-proof__link"><a className="pr-text-link" href={hrefFor('tgp', locale) ?? hrefFor('tgp', 'es')}>{c.proof.link}<Arrow /></a>{c.proof.linkNote && <span className="pr-proof__language">{c.proof.linkNote}</span>}</div>
      </section>
      <section className="section band pr-faq" aria-labelledby="pr-faq-title">
        <h2 id="pr-faq-title">{c.faq.h2}</h2>
        <div className="faq">{faq.map((item, i) => <details key={item.q} id={i === 0 ? FAQ_FIRST : undefined}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>
      <section className="section band pr-contact" id={FORM_ID} aria-labelledby="pr-form-title">
        <div className="pr-contact__intro"><h2 id="pr-form-title" tabIndex={-1}>{c.form.h2}</h2><p>{c.form.text}</p></div>
        <div className="pr-contact__actions">
          <a className="btn btn--primary btn--lg" href={bookingHref(locale)}>{c.form.demo}<Arrow /></a>
          <a className="pr-contact__email" href={bookingHref(locale, { contact: true })}>{c.form.email}</a>
        </div>
      </section>
    </div>
  )
}
