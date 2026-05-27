import { useState } from 'react'
import { Reveal } from './Reveal'
import { trackScheduleDemo } from '../../utils/analytics'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SelectField } from '@/components/ui/select'

export const CTASection = ({ ctaHref, t }) => {
  const [formData, setFormData] = useState({ nombre: '', email: '', empresa: '', cargo: '', problema: '' })
  const [formErrors, setFormErrors] = useState({})
  const [formStatus, setFormStatus] = useState('idle')

  const required = ['nombre', 'email', 'empresa', 'cargo']

  const validate = () => {
    const errors = {}
    required.forEach((f) => { if (!formData[f]?.trim()) errors[f] = 'Campo requerido' })
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido'
    return errors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }
    setFormStatus('loading')
    const payload = { ...formData, url_origen: window.location.href, fuente: 'cta' }
    const { error } = await supabase.from('leads').insert([payload])
    if (error) { console.error('[CTASection] supabase error:', error); setFormStatus('idle'); return }
    setFormStatus('success')
  }

  const fieldClass = (f) => formErrors[f] ? 'border-red-300 bg-red-50' : ''

  return (
    <section id="contacto" className="px-4 pt-24 pb-16 sm:px-6 sm:pt-40 sm:pb-20 md:pt-52 md:pb-28">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-6xl text-center">
          {/* Title — Fujiwara */}
          <h2
            className="mx-auto"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(1.6rem, 4vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              color: '#000000',
            }}
          >
            {'Tú decides tus modelos de cobro,'}
            <br />
             {'deja que '}
            <span
              className="px-[0.18em]"
              style={{
                background: 'linear-gradient(transparent 48%, #F4B08E 48%)',
                WebkitBoxDecorationBreak: 'clone',
                boxDecorationBreak: 'clone',
                borderRadius: '2px',
              }}
              >
            Relvo los opere
            </span>
            <br />
          </h2>

          {/* CTA button */}
          <div className="mt-10 sm:mt-12">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackScheduleDemo('cta_section')}
              className="inline-flex h-14 items-center justify-center rounded-md bg-[var(--text-main)] px-8 text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {t.ctaScheduleText}
            </a>
          </div>

          {/* Contact form */}
          <div className="mx-auto mt-16 w-full max-w-xl text-left sm:mt-20">
            <div className="mb-8 text-center">
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: 12,
                }}
              >
                O cuéntanos sobre tu empresa
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: 'var(--text-soft)' }}>
                Te contactamos en menos de 24 horas.
              </p>
            </div>

            {formStatus === 'success' ? (
              <div
                className="rounded-md px-6 py-8 text-center"
                style={{ border: '1px solid rgba(114,221,170,0.4)', background: 'rgba(114,221,170,0.08)' }}
              >
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 500, color: 'var(--text-main)', marginBottom: 4 }}>
                  ¡Listo! Te contactamos pronto.
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: 'var(--text-soft)' }}>
                  Revisamos tu solicitud y te escribimos en menos de 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Nombre *</Label>
                    <Input name="nombre" type="text" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre" className={fieldClass('nombre')} />
                    {formErrors.nombre && <p className="mt-1 text-xs text-red-600">{formErrors.nombre}</p>}
                  </div>
                  <div>
                    <Label>Email corporativo *</Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="nombre@empresa.com" className={fieldClass('email')} />
                    {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Empresa *</Label>
                    <Input name="empresa" type="text" value={formData.empresa} onChange={handleChange} placeholder="Nombre de tu empresa" className={fieldClass('empresa')} />
                    {formErrors.empresa && <p className="mt-1 text-xs text-red-600">{formErrors.empresa}</p>}
                  </div>
                  <div>
                    <Label>Cargo *</Label>
                    <SelectField name="cargo" value={formData.cargo} onChange={handleChange} className={fieldClass('cargo')}>
                      <option value="">Selecciona...</option>
                      <option>CFO / Director Financiero</option>
                      <option>Gerente Financiero</option>
                      <option>Founder / CEO</option>
                      <option>Otro</option>
                    </SelectField>
                    {formErrors.cargo && <p className="mt-1 text-xs text-red-600">{formErrors.cargo}</p>}
                  </div>
                </div>
                <div>
                  <Label>
                    ¿Qué problema quieres resolver?{' '}
                    <span style={{ color: 'var(--text-muted)' }}>(opcional)</span>
                  </Label>
                  <Textarea
                    name="problema"
                    value={formData.problema}
                    onChange={handleChange}
                    placeholder="Cuéntanos brevemente tu situación actual..."
                    rows={4}
                    className="resize-y"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="w-full h-auto py-3 text-sm font-semibold rounded-md bg-[var(--text-main)] text-white hover:opacity-85 disabled:opacity-60"
                >
                  {formStatus === 'loading' ? 'Enviando...' : 'Enviar'}
                </Button>
              </form>
            )}
          </div>

        </Reveal>
      </div>
    </section>
  )
}
