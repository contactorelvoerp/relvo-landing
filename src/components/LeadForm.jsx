import { useEffect, useRef, useState } from 'react'
import { captureAttribution } from '../attribution.js'
import { trackMarketingEvent } from '../analytics.js'
import { getAdsClick } from '../adsClick.js'
import { useTurnstile } from '../turnstile.js'
import { fireAdsConversion } from '../pages/landing-ads/ads-conversion.js'
import { copy } from '../pages/demo/copy'
import '../pages/demo/demo.css'

const EMPTY = { nombre: '', email: '', empresa: '', problema: '', website: '' }
const REQUIRED = ['nombre', 'email', 'empresa']

// Shared email enquiry form; actual bookings use the calendar.
// Preserve deduplication, attribution, spam protection and Ads conversion handling.
export function LeadForm({ locale, fuente, submit: submitLabel, success, adsClick, adsConversion, onPrefillChange, requestContext }) {
  const submissionId = useRef(null)
  const started = useRef(false)
  const converted = useRef(false)
  const c = copy[locale]
  const [data, setData] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const successRef = useRef(null)
  const requiredFields = REQUIRED
  const turnstile = useTurnstile()

  useEffect(() => {
    if (status === 'success') successRef.current?.focus()
  }, [status])

  const change = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    requiredFields.forEach((k) => { if (!data[k].trim()) next[k] = c.required })
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = c.invalidEmail
    setErrors(next)
    if (Object.keys(next).length > 0) {
      trackMarketingEvent('form_error', { form: fuente, locale, reason: 'validation' })
      requestAnimationFrame(() => document.getElementById(`lead-${Object.keys(next)[0]}`)?.focus())
      return
    }

    if (status === 'loading') return
    submissionId.current ??= crypto.randomUUID()
    setStatus('loading')
    try {
      const attribution = { ...captureAttribution(), ads_click: adsClick ?? getAdsClick() }
      // Storage still requires a role; use its established neutral value rather
      // than asking a qualification question before the conversation.
      const payload = { ...data, cargo: 'Otro', problema: [
        requestContext && `Plan: ${requestContext.plan ?? 'undecided'}`,
        requestContext && `Request: ${requestContext.intent ?? 'demo'}`,
        data.problema,
      ].filter(Boolean).join('\n') }
      const turnstileToken = turnstile.enabled ? await turnstile.ready() : null
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, url_origen: window.location.href, fuente, attribution, submission_id: submissionId.current, ...(turnstileToken !== null ? { turnstile_token: turnstileToken } : {}) }),
      })
      if (!res.ok) throw new Error(String(res.status))
      // Evento de conversión (métrica de éxito del sitio). Sin datos personales, salvo en esta
      // landing (adsConversion), donde Google Ads los necesita para la conversión y para mejorarla.
      const result = await res.json()
      // A lost first response can leave a saved lead: a confirmed retry still
      // converts once in this browser. Honeypot acknowledgments never convert.
      if (result.recorded !== false && !converted.current) {
        converted.current = true
        // submissionId: mismo id en cada reintento de este envío, para que Google no la cuente dos veces.
        if (adsConversion) fireAdsConversion({ ...adsConversion, transactionId: submissionId.current, email: data.email })
        trackMarketingEvent('generate_lead', { form: fuente, locale, ...requestContext })
      }
      setStatus('success')
    } catch {
      turnstile.reset()
      trackMarketingEvent('form_error', { form: fuente, locale, reason: 'server' })
      setStatus('error')
    }
  }

  const field = (name, label, control) => (
    <div className="form__field">
      <label htmlFor={`lead-${name}`}>{label}</label>
      {control}
      {errors[name] && <p className="form__error" id={`lead-${name}-error`}>{errors[name]}</p>}
    </div>
  )
  const props = (name) => ({
    id: `lead-${name}`,
    name,
    value: data[name],
    onChange: change,
    required: requiredFields.includes(name),
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `lead-${name}-error` : undefined,
  })
  const reportPrefill = () => onPrefillChange?.({ name: data.nombre, email: data.email })

  if (status === 'success') {
    return (
      <div ref={successRef} className="demo__success" role="status" tabIndex={-1}>
        <p className="demo__success-title">{c.successTitle}</p>
        {success === undefined ? <p>{c.successBody}</p> : success && <p>{success}</p>}
      </div>
    )
  }
  return (
    <form className="form" onSubmit={submit} noValidate aria-busy={status === 'loading'} onFocus={() => {
      // form_start: en una visita de distribución también queda en Supabase como powered_by_form_start
      if (!started.current) { started.current = true; trackMarketingEvent('form_start', { form: fuente, locale }); turnstile.start() }
    }}>
      {requestContext?.plan && requestContext.plan !== 'undecided' && <p className="form__context">{c.planLabel}: <strong>{c.planNames[requestContext.plan]}</strong></p>}
      {field('nombre', `${c.name} *`, <input type="text" autoComplete="name" placeholder={c.namePlaceholder} onBlur={reportPrefill} maxLength={200} {...props('nombre')} />)}
      {field('email', `${c.email} *`, <input type="email" autoComplete="email" placeholder={c.emailPlaceholder} onBlur={reportPrefill} maxLength={320} {...props('email')} />)}
      {field('empresa', `${c.company} *`, <input type="text" autoComplete="organization" placeholder={c.companyPlaceholder} maxLength={200} {...props('empresa')} />)}
      {field('problema', <>{c.problem} <span className="form__optional">{c.problemOptional}</span></>, <textarea rows={3} placeholder={c.problemPlaceholder} maxLength={1500} {...props('problema')} />)}
      {/* Honeypot anti-spam: invisible para personas, los bots lo completan. */}
      <div className="form__trap" aria-hidden="true">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={data.website} onChange={change} />
      </div>
      {turnstile.enabled && <div ref={turnstile.container} className="form__turnstile" />}
      {status === 'error' && <p className="form__error" role="alert">{c.error}</p>}
      <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'loading'}>
        {status === 'loading' ? c.sending : status === 'error' ? c.retry : submitLabel ?? c.formSubmit}
      </button>
    </form>
  )
}
