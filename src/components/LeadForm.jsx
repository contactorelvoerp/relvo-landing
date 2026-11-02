import { useRef, useState } from 'react'
import { captureAttribution } from '../attribution.js'
import { trackMarketingEvent } from '../analytics.js'
import { fireAdsConversion, toE164 } from '../pages/landing-ads/ads-conversion.js'
import { copy } from '../pages/demo/copy'
import '../pages/demo/demo.css'

const EMPTY = { nombre: '', email: '', empresa: '', cargo: '', problema: '', telefono: '', website: '' }
const REQUIRED = ['nombre', 'email', 'empresa', 'cargo']

// Formulario de contacto → /api/lead (tabla `leads` en Supabase). Ninguna key en el navegador.
// Lo usan /agendar-demo y /precios: mismos campos y endpoint; `fuente` dice desde qué página llegó.
// `success` reemplaza el mensaje de éxito por defecto; `submit`, el texto del botón.
// `adsClick` (src/pages/landing-ads/ads-click.js) viaja junto a la atribución del sitio cuando la
// página lo pasa. `adsConversion` (src/pages/landing-ads/ads-conversion.js) solo lo pasa esa
// landing: muestra el teléfono opcional y, al convertir, dispara la conversión de Google Ads con
// email/teléfono. El resto del sitio no envía PII a analítica (src/analytics.js), así que este
// comportamiento queda fuera de ahí. `onPrefillChange` (opcional): nombre/email al salir de esos
// campos, por si la página quiere prefillear otra cosa con lo que la persona ya escribió acá (en
// esta landing, el embed de Cal.com). `roleOptions` (opcional): reemplaza las opciones de Cargo del
// copy compartido (src/pages/demo/copy.js) sin tocarlo, para no afectar /agendar-demo ni /precios.
export function LeadForm({ locale, fuente, submit: submitLabel, success, adsClick, adsConversion, onPrefillChange, roleOptions }) {
  const submissionId = useRef(null)
  const started = useRef(false)
  const converted = useRef(false)
  const c = copy[locale]
  const roles = roleOptions ?? c.roleOptions
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
      const attribution = { ...captureAttribution(), ads_click: adsClick }
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, url_origen: window.location.href, fuente, attribution, submission_id: submissionId.current }),
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
        if (adsConversion) fireAdsConversion({ ...adsConversion, transactionId: submissionId.current, email: data.email, phone: toE164(data.telefono) })
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
  const reportPrefill = () => onPrefillChange?.({ name: data.nombre, email: data.email })

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
        {field('nombre', `${c.name} *`, <input type="text" autoComplete="name" placeholder={c.namePlaceholder} onBlur={reportPrefill} {...props('nombre')} />)}
        {field('email', `${c.email} *`, <input type="email" autoComplete="email" placeholder={c.emailPlaceholder} onBlur={reportPrefill} {...props('email')} />)}
      </div>
      <div className="form__row">
        {field('empresa', `${c.company} *`, <input type="text" autoComplete="organization" placeholder={c.companyPlaceholder} {...props('empresa')} />)}
        {field('cargo', `${c.role} *`, (
          <select {...props('cargo')}>
            <option value="">{c.rolePlaceholder}</option>
            {roles.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>
      {adsConversion && field('telefono', <>{c.phone} <span className="form__optional">{c.problemOptional}</span></>, <input type="tel" autoComplete="tel" placeholder={c.phonePlaceholder} {...props('telefono')} />)}
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
