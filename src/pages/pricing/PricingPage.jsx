import { SHOW_PENDING } from '../../env'
import { Texture } from '../../components/Texture'
import { LeadForm } from '../../components/LeadForm'
import { PendingPage } from '../PendingPage'
import { ContractHistory } from './ContractHistory'
import { copy, isPending } from './copy'
import '../../styles/blocks.css'
import '../../landing/landing.css'
import './pricing.css'

const FORM_ID = 'propuesta'
const FAQ_FIRST = 'que-es-un-contrato'

// La etiqueta "Contratos" de los planes lleva a la primera pregunta frecuente y la abre
const openFirstFaq = () => {
  const first = document.getElementById(FAQ_FIRST)
  if (first) first.open = true
}

function Check() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3.5 9.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Plan({ plan, c, n }) {
  const keys = Object.keys(c.limits)
  return (
    <article className="pr-plan" aria-labelledby={`plan-${n}`}>
      <div className="pr-plan__intro">
        <h3 className="pr-plan__name" id={`plan-${n}`}>{plan.name}</h3>
        <p className="pr-plan__who">{plan.who}</p>
      </div>
      <p className="pr-plan__price">
        <span className="pr-plan__amount num">{plan.price}</span>
        {plan.period && <span className="pr-plan__period">{plan.period}</span>}
      </p>
      <dl className="pr-plan__limits">
        {keys.map((k, i) => (
          <div key={k}>
            <dt>{k === 'contracts' ? <a href={`#${FAQ_FIRST}`} onClick={openFirstFaq}>{c.limits[k]}</a> : c.limits[k]}</dt>
            <dd className="num">{plan.limits[i]}</dd>
          </div>
        ))}
      </dl>
      {plan.pay ? (
        <div className="pr-plan__pay">
          <p className="pr-plan__pay-label">{plan.payLabel}</p>
          <ul className="pr-plan__chips">{plan.pay.map((p) => <li key={p}>{p}</li>)}</ul>
          <p className="pr-plan__note">{plan.note}</p>
        </div>
      ) : (
        <p className="pr-plan__note pr-plan__note--body">{plan.note}</p>
      )}
      <div><a className="btn btn--lg btn--primary" href={`#${FORM_ID}`}>{c.cta}</a></div>
      <ul className="pr-plan__includes">
        {plan.includes.map((item) => <li key={item}><Check />{item}</li>)}
      </ul>
    </article>
  )
}

export function PricingPage({ locale, route }) {
  const c = copy[locale]
  if (!c) return <PendingPage route={route} />
  // Preguntas sin respuesta aprobada: placeholder visible en preview, fuera de producción
  const faq = c.faq.items.filter((item) => SHOW_PENDING || !isPending(item.a))
  return (
    <div className="pricing">
      <section className="section band band--first pr-hero" aria-labelledby="pr-h1">
        <h1 id="pr-h1" className="pr-hero__title">{c.hero.h1}</h1>
        <p className="pr-hero__lead">{c.hero.lead}</p>
      </section>

      <section className="pr-plans" aria-labelledby="pr-plans">
        <h2 className="pr-sr" id="pr-plans">{c.plansLabel}</h2>
        <div className="pr-plangrid">
          {c.plans.map((plan, n) => <Plan key={plan.name} plan={plan} c={c} n={n} />)}
        </div>
      </section>

      <section className="section band pr-grow" aria-labelledby="pr-grow">
        <div className="pr-split">
          <h2 className="h2" id="pr-grow">{c.grow.h2}</h2>
          <p className="pr-split__text">{c.grow.text}</p>
        </div>
        <ContractHistory c={c.grow} />
      </section>

      <section className="section band band--neutral pr-form" id={FORM_ID} aria-labelledby="pr-form">
        <div className="pr-form__intro">
          <h2 className="h2" id="pr-form">{c.form.h2}</h2>
          <p className="pr-split__text">{c.form.text}</p>
        </div>
        <div className="pr-form__box">
          <LeadForm locale={locale} fuente="precios" submit={c.form.submit} success={null} />
        </div>
      </section>

      <section className="section band pr-faq" aria-labelledby="pr-faq">
        <h2 className="h2" id="pr-faq">{c.faq.h2}</h2>
        <div className="faq">
          {faq.map((item, i) => (
            <details key={item.q} id={i === 0 ? FAQ_FIRST : undefined} open={i === 0}>
              <summary>{item.q}</summary>
              {isPending(item.a) ? <p><span className="pending__tag">{item.a}</span></p> : <p>{item.a}</p>}
            </details>
          ))}
        </div>
      </section>

      <section className="section section--cta band" aria-labelledby="pr-final">
        <div className="cta">
          <Texture kind="periods" />
          <div className="cta__content">
            <h2 className="cta__title" id="pr-final">{c.final.h2}</h2>
            <div className="cta__actions">
              <a className="cta__button" href={`#${FORM_ID}`}>{c.cta}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
