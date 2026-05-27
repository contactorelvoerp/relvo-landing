import { useState, useEffect, useRef, Fragment } from 'react'
import { supabase } from '@/lib/supabase'
import { InfoTooltip } from '@/components/ui/tooltip-info'
import { Helmet } from 'react-helmet-async'
import { Navbar } from '../components/landing/Navbar'
import { FooterSection } from '../components/landing/FooterSection'
import { text } from '../i18n/text'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SelectField } from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

const signupHref = 'https://app.relvoerp.com/login'

// ─── Data ──────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: 'startup',
    name: 'Startup',
    priceMonthly: 0,
    priceAnnual: 0,
    freeLabel: 'Gratis',
    range: 'Para empresas con ingresos hasta $20.000 USD/mes',
    description: 'Todo lo que necesitas para gestionar tu ciclo de ingresos desde el día uno.',
    cta: { label: 'Empezar gratis', action: 'link', href: signupHref },
    featured: false,
    highlights: [
      'Metering y contratos (hasta 200)',
      'Facturación Chile (1 empresa)',
      'Conciliación bancaria (1 cuenta)',
      'Cobranza y gestión de CxC',
      'Integración con medios de pago',
    ],
  },
  {
    id: 'opera',
    name: 'Opera',
    priceMonthly: 499,
    priceAnnual: 424,
    range: 'Para empresas con ingresos entre $20.000 – $100.000 USD/mes',
    description: 'Para empresas B2B con facturación compleja, múltiples sociedades o alto volumen de contratos.',
    cta: { label: 'Contactar ventas', action: 'scroll' },
    featured: true,
    badge: 'Más popular',
    highlights: [
      'Contratos ilimitados',
      'Multi-empresa, multi-moneda',
      'Hasta 3 cuentas bancarias',
      'Facturación compleja (glosas, multi-RUT)',
      'Integraciones de cobranza',
      'API + Webhooks',
    ],
  },
  {
    id: 'escala',
    name: 'Escala',
    priceMonthly: null,
    priceAnnual: null,
    range: 'Para empresas con ingresos sobre $100.000 USD/mes',
    description: 'Para operaciones de gran escala que necesitan una solución a medida, SLA dedicado e integración ERP.',
    cta: { label: 'Contactar ventas', action: 'scroll' },
    featured: false,
    highlights: [
      'Precio por tiers o 0.6% variable',
      'Cuentas bancarias según volumen',
      'Integración ERP / contabilidad',
      'SLA dedicado',
      'Contratos anuales con descuento',
    ],
  },
]

// Cell types: check | dash | limit | soon | integrations | flags | text
const T = {
  check: () => ({ type: 'check' }),
  dash: () => ({ type: 'dash' }),
  limit: (text) => ({ type: 'limit', text }),
  soon: () => ({ type: 'soon' }),
  integrations: (chips) => ({ type: 'integrations', chips }),
  flags: (items) => ({ type: 'flags', items }),
}

const TABLE_SECTIONS = [
  {
    title: 'Metering y contratos',
    soon: false,
    rows: [
      {
        feature: 'Lectura e interpretación de contratos',
        tooltip: 'El agente lee el contrato y genera reglas de metering y billing automáticamente',
        startup: T.limit('hasta 200'), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Reglas de pricing recurrente, variable e híbrido',
        startup: T.check(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Planes y productos',
        tooltip: 'Define planes tarifarios asignables a contratos. El metering calcula el cargo según el plan activo.',
        startup: T.check(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Ingesta de usage vía API',
        tooltip: 'Envía eventos de uso desde tus sistemas mediante endpoints REST.',
        startup: T.check(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Flujos de aprobación pre-factura y recepción OC',
        startup: T.limit('gestión manual'), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Generar cotizaciones con IA',
        featureBadge: 'soon',
        startup: T.dash(), opera: T.check(), escala: T.check(),
      },
    ],
  },
  {
    title: 'Facturación',
    soon: false,
    rows: [
      {
        feature: 'Facturación electrónica',
        tooltip: 'Próximamente: México, Colombia y Perú',
        startup: T.flags([{ flag: '🇨🇱', label: 'CL', active: true }]),
        opera: T.flags([
          { flag: '🇨🇱', label: 'CL', active: true },
          { flag: '🇲🇽', label: 'MX', active: false },
          { flag: '🇨🇴', label: 'CO', active: false },
          { flag: '🇵🇪', label: 'PE', active: false },
        ]),
        escala: T.flags([
          { flag: '🇨🇱', label: 'CL', active: true },
          { flag: '🇲🇽', label: 'MX', active: false },
          { flag: '🇨🇴', label: 'CO', active: false },
          { flag: '🇵🇪', label: 'PE', active: false },
        ]),
      },
      {
        feature: 'Conexión SII',
        tooltip: 'Startup: 1 empresa, 1 cuenta. Opera y Escala: múltiples empresas.',
        startup: T.limit('1 empresa · 1 cuenta'), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Facturación automática desde contrato',
        startup: T.check(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Facturación compleja',
        tooltip: 'Glosas personalizadas, división por razones sociales, referencias cruzadas y configuración avanzada de emisión',
        startup: T.dash(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Multi-empresa',
        startup: T.dash(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Multi-moneda',
        startup: T.dash(), opera: T.check(), escala: T.check(),
      },
    ],
  },
  {
    title: 'Cuentas por cobrar y cobranza',
    soon: false,
    rows: [
      {
        feature: 'Visibilidad CxC en tiempo real',
        startup: T.check(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Conciliación de recaudación',
        tooltip: 'Cruza automáticamente los pagos recibidos en cuenta corriente contra las facturas emitidas',
        startup: T.limit('1 cuenta'),
        opera: T.limit('hasta 3 cuentas'),
        escala: T.limit('según volumen'),
      },
      {
        feature: 'Cobranza por mensajería',
        tooltip: 'Flujos automáticos de cobro vía WhatsApp, email y SMS',
        startup: T.check(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Integraciones de cobranza y cobro con tarjetas',
        startup: T.dash(),
        opera: T.integrations(['Toku', 'Fintoc', 'Rebill']),
        escala: T.integrations(['Toku', 'Fintoc', 'Rebill']),
      },
    ],
  },
  {
    title: 'Agentes Relvo',
    soon: true,
    rows: [
      {
        feature: 'Agente de onboarding',
        tooltip: 'Lee contratos y PDFs comerciales y los convierte en reglas de pricing configuradas y listas para facturar automáticamente.',
        startup: T.dash(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Agente de cobranza',
        tooltip: 'Gestiona flujos de pago, seguimiento y notificaciones automáticas',
        startup: T.dash(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Agente de facturación',
        tooltip: 'Emite, clasifica y reconcilia facturas automáticamente',
        startup: T.dash(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Agente de aprobaciones',
        tooltip: 'Gestiona flujos de aprobación y notificaciones automática',
        startup: T.dash(), opera: T.check(), escala: T.check(),
      },
    ],
  },
  {
    title: 'Integraciones y soporte',
    soon: false,
    rows: [
      {
        feature: 'Ingesta de usage vía API (endpoints REST)',
        startup: T.check(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'API + Webhooks (plataforma)',
        startup: T.dash(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'Integración ERP / contabilidad',
        startup: T.dash(), opera: T.dash(), escala: T.check(),
      },
      {
        feature: 'Soporte por chat',
        startup: T.check(), opera: T.check(), escala: T.check(),
      },
      {
        feature: 'SLA dedicado',
        startup: T.dash(), opera: T.dash(), escala: T.check(),
      },
    ],
  },
  {
    title: 'Límites del plan',
    soon: false,
    rows: [
      {
        feature: 'Ingresos gestionados',
        startup: T.limit('Hasta $20K/mes'),
        opera: T.limit('$20K–$100K/mes'),
        escala: T.limit('Sobre $100K/mes'),
      },
      {
        feature: 'Contratos activos',
        startup: T.limit('200'),
        opera: T.limit('Ilimitados'),
        escala: T.limit('Ilimitados'),
      },
      {
        feature: 'Cuentas bancarias conciliación',
        startup: T.limit('1'),
        opera: T.limit('hasta 3'),
        escala: T.limit('según volumen'),
      },
      {
        feature: 'Usuarios',
        startup: T.limit('Hasta 3'),
        opera: T.limit('Ilimitados'),
        escala: T.limit('Ilimitados'),
      },
    ],
  },
]

const INDUSTRIAS = [
  { group: 'Tecnología y software', options: ['SaaS / Software', 'Infraestructura / Cloud / DevTools'] },
  { group: 'Servicios profesionales', options: ['Consultoría', 'Servicios jurídicos', 'Auditoría y contabilidad'] },
  { group: 'Operaciones y outsourcing', options: ['BPO / Outsourcing', 'Facilities / Servicios generales'] },
  { group: 'Finanzas y capital', options: ['Leasing / Renting', 'Factoring / Financieras', 'Fondos / Asset management'] },
  { group: 'Proyectos', options: ['Ingeniería de proyectos', 'Construcción por etapas'] },
  { group: 'Otros recurrentes', options: ['Medios / Publicidad', 'Salud', 'Educación', 'Logística / Transporte', 'Energía / Utilities', 'Otro'] },
]

// ─── Sub-components ─────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8l3.5 3.5L13 5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DashIcon = () => (
  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1 }}>—</span>
)

// Chip base: flat, esquinas sutiles, sin borde
const chip = (...extra) => cn(
  "inline-flex items-center h-auto rounded-sm px-1.5 py-[3px] font-mono text-[0.67rem] border-none leading-none",
  ...extra
)

function PlanFeatureCell({ cell }) {
  if (!cell) return <TableCell />

  switch (cell.type) {
    case 'check':
      return (
        <TableCell className="text-center">
          <span className="inline-flex items-center justify-center"><CheckIcon /></span>
        </TableCell>
      )
    case 'dash':
      return (
        <TableCell className="text-center">
          <span className="inline-flex items-center justify-center"><DashIcon /></span>
        </TableCell>
      )
    case 'limit':
      return (
        <TableCell className="text-center">
          <span className={chip("bg-[rgba(19,19,30,0.04)] text-[var(--text-soft)]")}>
            {cell.text}
          </span>
        </TableCell>
      )
    case 'soon':
      return (
        <TableCell className="text-center">
          <span className={chip("bg-[rgba(255,149,102,0.1)] text-[#b85a24]")}>
            próximamente
          </span>
        </TableCell>
      )
    case 'integrations':
      return (
        <TableCell className="text-center">
          <span className="inline-flex flex-wrap justify-center gap-1">
            {cell.chips.map((c) => (
              <span key={c} className={chip("bg-[rgba(114,221,170,0.12)] text-[#2a7a55]")}>
                {c}
              </span>
            ))}
          </span>
        </TableCell>
      )
    case 'flags':
      return (
        <TableCell className="text-center">
          <span className="inline-flex flex-wrap justify-center gap-1">
            {cell.items.map(({ flag, label, active }) => (
              <span
                key={label}
                className={chip(
                  "gap-0.5",
                  active ? "bg-[rgba(114,221,170,0.12)] text-[#2a7a55]" : "bg-[rgba(19,19,30,0.04)] text-[var(--text-muted)]"
                )}
              >
                <span>{flag}</span>
                <span>{label}</span>
              </span>
            ))}
          </span>
        </TableCell>
      )
    default:
      return <TableCell className="text-center">{cell.text}</TableCell>
  }
}

// ─── Main component ──────────────────────────────────────────────────────────

export const PreciosPage = ({ navigate }) => {
  const lang = 'es'
  const t = text?.[lang] ?? text?.es ?? {}

  const [anual, setAnual] = useState(false)
  const formRef = useRef(null)

  const [planOrigen, setPlanOrigen] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    empresa: '',
    cargo: '',
    industria: '',
    ingresos_mensuales: '',
    plan_interes: '',
    problema: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [formStatus, setFormStatus] = useState('idle') // idle | loading | success

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const plan = params.get('plan')
    if (plan) {
      setPlanOrigen(plan)
      setFormData((prev) => ({ ...prev, plan_interes: plan }))
    }
  }, [])

  const scrollToForm = (plan) => {
    if (plan) {
      setPlanOrigen(plan)
      setFormData((prev) => ({ ...prev, plan_interes: plan }))
    }
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const handleCtaClick = (plan) => {
    if (plan.cta.action === 'link') {
      window.open(plan.cta.href, '_blank', 'noopener,noreferrer')
    } else {
      scrollToForm(plan.name)
    }
  }

  const required = ['nombre', 'email', 'empresa', 'cargo', 'industria', 'ingresos_mensuales', 'plan_interes']

  const validate = () => {
    const errors = {}
    required.forEach((field) => {
      if (!formData[field]?.trim()) errors[field] = 'Campo requerido'
    })
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido'
    }
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
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormStatus('loading')

    const payload = {
      ...formData,
      plan_origen: planOrigen,
      url_origen: window.location.href,
      fuente: 'precios',
    }

    const { error } = await supabase.from('leads').insert([payload])
    if (error) { console.error('[PreciosPage] supabase error:', error); setFormStatus('idle'); return }
    setFormStatus('success')
  }

  const fieldClass = (field) => formErrors[field] ? 'border-red-300 bg-red-50' : ''

  const operaPrice = anual ? 424 : 499

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fcfcf8] text-[var(--text-main)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at top left, rgba(208,255,11,0.14), transparent 28%), radial-gradient(circle at top right, rgba(255,149,102,0.18), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.98))' }} />
      <Helmet>
        <title>Precios | Relvo</title>
        <meta name="description" content="Planes de Relvo para empresas B2B en LATAM. Startup gratis, Opera desde $499/mes, Escala a medida." />
      </Helmet>

      <Navbar t={t} navigate={navigate} activePath="/precios" forceBackdrop />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-36 sm:px-6 sm:pt-44">

        {/* ── Page header ── */}
        <div className="mb-20 text-center">
          <p
            className="mb-3 uppercase"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.16em', color: 'var(--text-muted)' }}
          >
            Precios
          </p>
          <h1
            className="mb-4"
            style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.8rem,4vw,3.5rem)', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: 1.1 }}
          >
            Infraestructura financiera para empresas que crecen.
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', color: 'var(--text-soft)', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
            Contrato, factura, cobranza y conciliación en un solo sistema.
          </p>
        </div>

        {/* ── Toggle mensual / anual ── */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <span
            style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: anual ? 400 : 600, color: anual ? 'var(--text-muted)' : 'var(--text-main)', transition: 'color 0.15s' }}
          >
            Mensual
          </span>

          <Switch checked={anual} onCheckedChange={setAnual} />

          <span
            style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: anual ? 600 : 400, color: anual ? 'var(--text-main)' : 'var(--text-muted)', transition: 'color 0.15s' }}
          >
            Anual
          </span>

          {anual && (
            <span
              className="rounded-sm px-2 py-[3px] font-mono text-[0.65rem] font-semibold leading-none"
              style={{ background: 'rgba(208,255,11,0.25)', color: '#4a6600' }}
            >
              −15%
            </span>
          )}
        </div>

        {/* ── Plan cards ── */}
        <div className="mb-16 grid gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const isOpera = plan.id === 'opera'
            const price = plan.id === 'opera' ? operaPrice : plan.priceMonthly

            return (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-md p-6"
                style={{
                  border: isOpera ? '2px solid var(--brand-accent)' : '1px solid var(--border-default)',
                  background: '#fff',
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 h-auto rounded-md px-2.5 py-0.5 font-mono text-[0.62rem] font-semibold tracking-[0.08em] bg-[var(--brand-accent)] text-[var(--text-main)] border-none">
                    {plan.badge}
                  </Badge>
                )}

                {/* Plan name */}
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                  {plan.name}
                </p>

                {/* Price */}
                <div className="mb-2 flex items-end gap-1.5">
                  {plan.priceMonthly === null ? (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                      Hablemos
                    </span>
                  ) : plan.priceMonthly === 0 ? (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '2rem', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                      Gratis
                    </span>
                  ) : (
                    <>
                      <div className="flex items-start gap-1">
                        {anual && (
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 300, color: 'var(--text-muted)', textDecoration: 'line-through', paddingTop: 6 }}>
                            $499
                          </span>
                        )}
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '2rem', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                          ${price}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-muted)', paddingBottom: 4 }}>/mes</span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--text-soft)', lineHeight: 1.55, marginBottom: 14 }}>
                  {plan.description}
                </p>

                {/* Range */}
                <div
                  className="mb-5 w-full rounded-sm px-3 py-2 text-center text-[0.78rem]"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 400,
                    lineHeight: 1.45,
                    background: isOpera ? 'rgba(208,255,11,0.18)' : 'rgba(19,19,30,0.05)',
                    border: isOpera ? '1px solid rgba(208,255,11,0.5)' : '1px solid var(--border-strong)',
                    color: isOpera ? '#3d5500' : 'var(--text-soft)',
                  }}
                >
                  {plan.range}
                </div>

                {/* CTA */}
                <Button
                  type="button"
                  onClick={() => handleCtaClick(plan)}
                  className={cn(
                    "mb-6 w-full h-auto py-2.5 text-sm font-semibold rounded-md transition-opacity hover:opacity-85",
                    isOpera
                      ? "bg-[var(--text-main)] text-white border-none"
                      : "bg-transparent text-[var(--text-main)] border border-[var(--border-strong)]"
                  )}
                >
                  {plan.cta.label}
                </Button>

                {/* Highlights */}
                <ul className="space-y-2">
                  {plan.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <CheckIcon />
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* ── Comparison table ── */}
        <div className="mb-20">
          <h2
            className="mb-6 text-center"
            style={{ fontFamily: 'var(--font-ui)', fontSize: '1.2rem', fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--text-main)' }}
          >
            Comparar planes
          </h2>

          <div className="overflow-x-auto rounded-md border border-[var(--border-default)]">
            <Table>
              <TableHeader>
                <TableRow style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <TableHead
                    className="w-[40%] text-left"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-soft)' }}
                  >
                    Feature
                  </TableHead>
                  {PLANS.map((p) => (
                    <TableHead
                      key={p.id}
                      className="text-center"
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: p.featured ? 'var(--text-main)' : 'var(--text-soft)' }}
                    >
                      {p.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {TABLE_SECTIONS.map((section) => (
                  <Fragment key={section.title}>
                    <TableRow style={{ background: 'rgba(19,19,30,0.02)' }}>
                      <TableCell colSpan={4} className="py-2.5">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-soft)' }}>
                          {section.title}
                        </span>
                        {section.soon && (
                          <span className="ml-2 inline-flex items-center gap-1 font-mono text-[0.6rem] text-[#b85a24]">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#b85a24] opacity-70" />
                            próximamente
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                    {section.rows.map((row, i) => (
                      <TableRow
                        key={`${section.title}-${i}`}
                        style={{ borderTop: '1px solid var(--border-subtle)' }}
                      >
                        <TableCell>
                          <span
                            style={{
                              fontFamily: 'var(--font-ui)',
                              fontSize: '0.85rem',
                              color: 'var(--text-main)',
                            }}
                          >
                            {row.feature}
                          </span>
                          {row.tooltip && <InfoTooltip content={row.tooltip} />}
                          {row.featureBadge === 'soon' && (
                            <span className="ml-2 inline-flex items-center gap-1 font-mono text-[0.6rem] text-[#b85a24]">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#b85a24] opacity-70" />
                              próximamente
                            </span>
                          )}
                        </TableCell>
                        <PlanFeatureCell cell={row.startup} />
                        <PlanFeatureCell cell={row.opera} />
                        <PlanFeatureCell cell={row.escala} />
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── Contact form ── */}
        <div ref={formRef} id="form-contacto" className="scroll-mt-28">
          <div className="mx-auto max-w-xl">
            <div className="mb-8">
              <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: 6 }}>
                Cuéntanos sobre tu empresa
              </h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--text-soft)' }}>
                Te contactamos en menos de 24 horas.
              </p>
            </div>

            {formStatus === 'success' ? (
              <div
                className="rounded-md px-6 py-8 text-center"
                style={{ border: '1px solid rgba(114,221,170,0.4)', background: 'rgba(114,221,170,0.08)' }}
              >
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                  ¡Listo! Te contactamos pronto.
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: 'var(--text-soft)' }}>
                  Revisamos tu solicitud y te escribimos en menos de 24 horas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {/* Row: Nombre + Email */}
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

                {/* Row: Empresa + Cargo */}
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

                {/* Industria */}
                <div>
                  <Label>Industria *</Label>
                  <SelectField name="industria" value={formData.industria} onChange={handleChange} className={fieldClass('industria')}>
                    <option value="">Selecciona tu industria...</option>
                    {INDUSTRIAS.map((group) => (
                      <optgroup key={group.group} label={`— ${group.group} —`}>
                        {group.options.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </optgroup>
                    ))}
                  </SelectField>
                  {formErrors.industria && <p className="mt-1 text-xs text-red-600">{formErrors.industria}</p>}
                </div>

                {/* Row: Ingresos + Plan */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Ingresos mensuales estimados *</Label>
                    <SelectField name="ingresos_mensuales" value={formData.ingresos_mensuales} onChange={handleChange} className={fieldClass('ingresos_mensuales')}>
                      <option value="">Selecciona...</option>
                      <option>Menos de $20.000 USD</option>
                      <option>$20.000 – $100.000 USD</option>
                      <option>Más de $100.000 USD</option>
                    </SelectField>
                    {formErrors.ingresos_mensuales && <p className="mt-1 text-xs text-red-600">{formErrors.ingresos_mensuales}</p>}
                  </div>
                  <div>
                    <Label>Plan de interés *</Label>
                    <SelectField name="plan_interes" value={formData.plan_interes} onChange={handleChange} className={fieldClass('plan_interes')}>
                      <option value="">Selecciona...</option>
                      <option>Startup</option>
                      <option>Opera</option>
                      <option>Escala</option>
                      <option>No lo sé aún</option>
                    </SelectField>
                    {formErrors.plan_interes && <p className="mt-1 text-xs text-red-600">{formErrors.plan_interes}</p>}
                  </div>
                </div>

                {/* Problema */}
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
                    className={cn(fieldClass('problema'), 'resize-y')}
                  />
                </div>

                {/* Submit */}
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
        </div>

      </main>
      <FooterSection t={t} navigate={navigate} />
    </div>
  )
}
