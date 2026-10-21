import { useRef, useState } from 'react'
import { captureAttribution } from '../attribution.js'
import { trackMarketingEvent } from '../analytics.js'
import { copy } from '../pages/demo/copy'
import '../pages/demo/demo.css'

const EMPTY = { nombre: '', email: '', empresa: '', cargo: '', problema: '', website: '' }
const REQUIRED = ['nombre', 'email', 'empresa', 'cargo']

// Formulario de contacto → /api/lead (tabla `leads` en Supabase). Ninguna key en el navegador.
// Lo usan /agendar-demo y /precios: mismos campos y endpoint; `fuente` dice desde qué página llegó.
// `success` reemplaza el mensaje de éxito por defecto; `submit`, el texto del botón.
export function LeadForm({ locale, fuente, submit: submitLabel, success }) {
  const submissionId = useRef(null)
  const started = useRef(false)
  const converted = useRef(false)
  const c = copy[locale]
  const [data, setData] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const change = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    REQUIRED.forEach((k) => { if (!data[k].trim()) next[k] = c.required })
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = c.invalidEmail
    setErrors(next)
    if (Object.keys(next).length > 0) return

    if (status === 'loading') return
    submissionId.current ??= crypto.randomUUID()
    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, url_origen: window.location.href, fuente, attribution: captureAttribution(), submission_id: submissionId.current }),
      })
      if (!res.ok) throw new Error(String(res.status))
      // Evento de conversión (métrica de éxito del sitio). Sin datos personales.
      const result = await res.json()
      // A lost first response can leave a saved lead: a confirmed retry still
      // converts once in this browser. Honeypot acknowledgments never convert.
      if (result.recorded !== false && !converted.current) {
        converted.current = true
        trackMarketingEvent('generate_lead', { form: fuente, locale })
      }
      setStatus('success')
    } catch {
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
    'aria-invalid': errors[name] ? 'true' : undefined,
    'aria-describedby': errors[name] ? `lead-${name}-error` : undefined,
  })

  if (status === 'success') {
    return (
      <div className="demo__success" role="status">
        <p className="demo__success-title">{c.successTitle}</p>
        {success === undefined ? <p>{c.successBody}</p> : success && <p>{success}</p>}
      </div>
    )
  }
  return (
    <form className="form" onSubmit={submit} noValidate onFocus={() => {
      if (!started.current) { started.current = true; trackMarketingEvent('powered_by_form_start', { form: fuente, locale }) }
    }}>
      <div className="form__row">
        {field('nombre', `${c.name} *`, <input type="text" autoComplete="name" placeholder={c.namePlaceholder} {...props('nombre')} />)}
        {field('email', `${c.email} *`, <input type="email" autoComplete="email" placeholder={c.emailPlaceholder} {...props('email')} />)}
      </div>
      <div className="form__row">
        {field('empresa', `${c.company} *`, <input type="text" autoComplete="organization" placeholder={c.companyPlaceholder} {...props('empresa')} />)}
        {field('cargo', `${c.role} *`, (
          <select {...props('cargo')}>
            <option value="">{c.rolePlaceholder}</option>
            {c.roleOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>
      {field('problema', <>{c.problem} <span className="form__optional">{c.problemOptional}</span></>, <textarea rows={4} placeholder={c.problemPlaceholder} {...props('problema')} />)}
      {/* Honeypot anti-spam: invisible para personas, los bots lo completan. */}
      <div className="form__trap" aria-hidden="true">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={data.website} onChange={change} />
      </div>
      {status === 'error' && <p className="form__error" role="alert">{c.error}</p>}
      <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'loading'}>
        {status === 'loading' ? c.sending : status === 'error' ? c.retry : submitLabel ?? c.submit}
      </button>
    </form>
  )
}
