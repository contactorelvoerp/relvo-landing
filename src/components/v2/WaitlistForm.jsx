import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { trackLeadCapture } from '../../utils/analytics'

/* text-[1rem] minimum on form controls — smaller triggers iOS auto-zoom on focus */
const inputCls =
  'w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-white px-3.5 py-2.5 font-sans text-[1rem] text-ink placeholder:text-muted-deco focus:border-ink/50 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors'
const labelCls = 'mb-1.5 block font-sans text-[0.8125rem] font-medium text-ink'

export const WaitlistForm = ({ t, source = 'start_free' }) => {
  const f = t.form
  const [formData, setFormData] = useState({ nombre: '', email: '', empresa: '', cargo: '', problema: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const required = ['nombre', 'email', 'empresa', 'cargo']

  const validate = () => {
    const next = {}
    required.forEach((k) => {
      if (!formData[k]?.trim()) next[k] = f.required
    })
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = f.invalidEmail
    return next
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    if (!supabase) {
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrors({})
    const payload = { ...formData, url_origen: window.location.href, fuente: source }
    const { error } = await supabase.from('leads').insert([payload])
    if (error) {
      setStatus('error')
      return
    }
    trackLeadCapture(formData.email)
    setStatus('success')
  }

  const err = (k) => (errors[k] ? <p className="mt-1 font-sans text-xs text-red-600">{errors[k]}</p> : null)
  const errBorder = (k) => (errors[k] ? ' border-red-300 bg-red-50' : '')

  if (status === 'success') {
    return (
      <div
        className="rounded-[var(--radius-lg)] px-6 py-10 text-center"
        style={{ border: '1px solid rgba(114,221,170,0.5)', background: '#DFF4EB' }}
      >
        <p className="font-sans text-[1.0625rem] font-semibold text-ink">{f.successTitle}</p>
        <p className="mt-1.5 font-sans text-[0.9375rem] text-ink-soft">{f.successBody}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-nombre" className={labelCls}>
            {f.name} *
          </label>
          <input id="wl-nombre" name="nombre" type="text" value={formData.nombre} onChange={handleChange} placeholder={f.namePlaceholder} className={inputCls + errBorder('nombre')} />
          {err('nombre')}
        </div>
        <div>
          <label htmlFor="wl-email" className={labelCls}>
            {f.email} *
          </label>
          <input id="wl-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={f.emailPlaceholder} className={inputCls + errBorder('email')} />
          {err('email')}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-empresa" className={labelCls}>
            {f.company} *
          </label>
          <input id="wl-empresa" name="empresa" type="text" value={formData.empresa} onChange={handleChange} placeholder={f.companyPlaceholder} className={inputCls + errBorder('empresa')} />
          {err('empresa')}
        </div>
        <div>
          <label htmlFor="wl-cargo" className={labelCls}>
            {f.role} *
          </label>
          <select id="wl-cargo" name="cargo" value={formData.cargo} onChange={handleChange} className={inputCls + errBorder('cargo')}>
            <option value="">{f.rolePlaceholder}</option>
            {f.roleOptions.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          {err('cargo')}
        </div>
      </div>
      <div>
        <label htmlFor="wl-problema" className={labelCls}>
          {f.problem} <span className="font-normal text-muted-aa">{f.problemOptional}</span>
        </label>
        <textarea id="wl-problema" name="problema" rows={3} value={formData.problema} onChange={handleChange} placeholder={f.problemPlaceholder} className={`${inputCls} resize-y`} />
      </div>
      {status === 'error' && <p className="text-center font-sans text-sm text-red-600">{f.error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-[var(--radius-button)] bg-lime-brand px-7 font-sans text-base font-semibold text-ink transition-all duration-200 hover:brightness-105 hover:shadow-[0_6px_24px_rgba(208,255,11,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:opacity-60"
      >
        {status === 'loading' ? f.sending : status === 'error' ? f.retry : f.submit}
      </button>
    </form>
  )
}
