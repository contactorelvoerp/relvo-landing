import { useState } from 'react'
import { copy } from './copy'
import './demo.css'

const EMPTY = { nombre: '', email: '', empresa: '', cargo: '', problema: '', website: '' }
const REQUIRED = ['nombre', 'email', 'empresa', 'cargo']

// Formulario de contacto → /api/lead (tabla `leads` en Supabase). Ninguna key en el navegador.
export function DemoPage({ locale }) {
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

    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, url_origen: window.location.href, fuente: 'agendar_demo' }),
      })
      if (!res.ok) throw new Error(String(res.status))
      // Evento de conversión (métrica de éxito del sitio). Sin datos personales.
      if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form: 'agendar_demo', locale })
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

  return (
    <section className="demo">
      <div className="demo__intro">
        <h1 className="demo__title">{c.title}</h1>
        <p className="demo__lede">{c.lede}</p>
      </div>

      {status === 'success' ? (
        <div className="demo__success" role="status">
          <p className="demo__success-title">{c.successTitle}</p>
          <p>{c.successBody}</p>
        </div>
      ) : (
        <form className="form" onSubmit={submit} noValidate>
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
            {status === 'loading' ? c.sending : status === 'error' ? c.retry : c.submit}
          </button>
        </form>
      )}
    </section>
  )
}
