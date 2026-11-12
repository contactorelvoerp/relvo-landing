import { CalEmbed } from '../components/CalEmbed'
import { copy } from '../pages/demo/copy'
import '../styles/blocks.css'

// Native disclosure keeps email contact secondary on desktop and mobile.
function FormPanel({ title, children, contactOpen, intro }) {
  return (
    <details className="cal-panel__form" id="consulta" open={contactOpen || undefined}>
      <summary className="cal-panel__form-toggle">
        <span>{title}</span>
        <svg className="cal-panel__form-chevron" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
      </summary>
      <div className="cal-panel__form-body"><p className="cal-panel__form-intro">{intro}</p>{children}</div>
    </details>
  )
}

// The same scheduling flow serves organic, paid and referral visitors.
// formFirst: quien pidió una propuesta ve el formulario antes que el calendario.
export function CalPanel({ onBooked, prefill, formTitle, children, locale = 'es', contactOpen = false, requestContext, formFirst = false }) {
  const c = copy[locale]
  return (
    <div className={`cal-panel__grid${formFirst ? ' cal-panel__grid--form-first' : ''}`}>
      <div className="cal-panel__cal">
        <div className="cal-panel__heading"><h2>{c.calendarTitle}</h2><p>{c.meetingDetails}</p></div>
        <CalEmbed onBooked={onBooked} prefill={prefill} locale={locale} requestContext={requestContext} />
      </div>
      <FormPanel title={formTitle ?? c.formTitle} contactOpen={contactOpen} intro={c.formIntro}>{children}</FormPanel>
    </div>
  )
}
