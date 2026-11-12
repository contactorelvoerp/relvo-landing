import { useEffect, useState } from 'react'
import { copy } from './copy'
import { LeadForm } from '../../components/LeadForm'
import { CalPanel } from '../../blocks/CalPanel'
import { LogoStrip } from '../../components/LogoStrip'
import { copy as homeCopy } from '../home/copy'
import { trackMarketingEvent } from '../../analytics.js'
import { bookingContext } from '../../booking'
import './demo.css'

export function DemoPage({ locale }) {
  const c = copy[locale]
  const [context, setContext] = useState(() => bookingContext(''))
  useEffect(() => { setContext(bookingContext(window.location.search)) }, [])
  const requestContext = { plan: context.plan, intent: context.intent }
  const handleBooked = () => trackMarketingEvent('demo_agendada', { form: 'agendar_demo', locale, ...requestContext })
  useEffect(() => {
    if (!context.contact) return
    const frame = requestAnimationFrame(() => {
      document.getElementById('consulta')?.scrollIntoView({ block: 'start' })
      document.getElementById('lead-nombre')?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [context.contact])
  return (
    <section className="demo demo--cal">
      <div className="demo__intro">
        <h1 className="demo__title">{context.intent === 'proposal' ? c.proposalTitle : c.title}</h1>
        <p className="demo__lede">{context.intent === 'proposal' ? c.proposalLede : c.lede}</p>
        {context.plan !== 'undecided' && <p className="demo__context">{c.planLabel}: <strong>{c.planNames[context.plan]}</strong></p>}
      </div>
      <CalPanel locale={locale} onBooked={handleBooked} contactOpen={context.contact} requestContext={requestContext} formFirst={context.intent === 'proposal'}>
        <LeadForm locale={locale} fuente="agendar_demo" requestContext={requestContext} submit={context.intent === 'proposal' ? c.proposalSubmit : c.formSubmit} />
      </CalPanel>
      <LogoStrip label={homeCopy[locale].hero.logos} />
    </section>
  )
}
