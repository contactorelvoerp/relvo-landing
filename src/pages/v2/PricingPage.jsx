import { useState, useEffect, useRef, Fragment } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '@/lib/supabase'
import { InfoTooltip } from '@/components/ui/tooltip-info'
import { Switch } from '@/components/ui/switch'
import { Nav } from '../../components/v2/Nav'
import { Footer } from '../../components/v2/Footer'
import { Container, Eyebrow, Reveal, SectionTag } from '../../components/v2/primitives'
import { Aura, Grain } from '../../components/v2/Texture'

const signupHref = 'https://app.relvoerp.com/login'

// ─── Data (per language) ─────────────────────────────────────────────────────

const PLANS = {
  es: [
    {
      id: 'startup',
      name: 'Startup',
      priceMonthly: 0,
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
  ],
  en: [
    {
      id: 'startup',
      name: 'Startup',
      priceMonthly: 0,
      freeLabel: 'Free',
      range: 'For companies with revenue up to $20,000 USD/mo',
      description: 'Everything you need to run your revenue cycle from day one.',
      cta: { label: 'Start free', action: 'link', href: signupHref },
      featured: false,
      highlights: [
        'Metering & contracts (up to 200)',
        'Chile e-invoicing (1 entity)',
        'Bank reconciliation (1 account)',
        'Collections & AR management',
        'Payment-rail integrations',
      ],
    },
    {
      id: 'opera',
      name: 'Opera',
      priceMonthly: 499,
      priceAnnual: 424,
      range: 'For companies with revenue between $20,000 – $100,000 USD/mo',
      description: 'For B2B companies with complex invoicing, multiple legal entities, or high contract volume.',
      cta: { label: 'Contact sales', action: 'scroll' },
      featured: true,
      badge: 'Most popular',
      highlights: [
        'Unlimited contracts',
        'Multi-entity, multi-currency',
        'Up to 3 bank accounts',
        'Complex invoicing (line items, multi-entity)',
        'Collection integrations',
        'API + Webhooks',
      ],
    },
    {
      id: 'escala',
      name: 'Escala',
      priceMonthly: null,
      range: 'For companies with revenue above $100,000 USD/mo',
      description: 'For large-scale operations that need a tailored setup, dedicated SLA, and ERP integration.',
      cta: { label: 'Contact sales', action: 'scroll' },
      featured: false,
      highlights: [
        'Tiered pricing or 0.6% variable',
        'Bank accounts per volume',
        'ERP / accounting integration',
        'Dedicated SLA',
        'Discounted annual contracts',
      ],
    },
  ],
}

const T = {
  check: () => ({ type: 'check' }),
  dash: () => ({ type: 'dash' }),
  limit: (label) => ({ type: 'limit', text: label }),
  integrations: (chips) => ({ type: 'integrations', chips }),
  flags: (items) => ({ type: 'flags', items }),
}

const cl = { label: 'CL', active: true }
const mx = { label: 'MX', active: false }
const co = { label: 'CO', active: false }
const pe = { label: 'PE', active: false }

const TABLE_SECTIONS = {
  es: [
    {
      title: 'Metering y contratos',
      rows: [
        { feature: 'Lectura e interpretación de contratos', tooltip: 'El agente lee el contrato y genera reglas de metering y billing automáticamente', startup: T.limit('hasta 200'), opera: T.check(), escala: T.check() },
        { feature: 'Reglas de pricing recurrente, variable e híbrido', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Planes y productos', tooltip: 'Define planes tarifarios asignables a contratos. El metering calcula el cargo según el plan activo.', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Ingesta de usage vía API', tooltip: 'Envía eventos de uso desde tus sistemas mediante endpoints REST.', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Flujos de aprobación pre-factura y recepción OC', startup: T.limit('gestión manual'), opera: T.check(), escala: T.check() },
        { feature: 'Generar cotizaciones con IA', featureBadge: 'soon', startup: T.dash(), opera: T.check(), escala: T.check() },
      ],
    },
    {
      title: 'Facturación',
      rows: [
        { feature: 'Facturación electrónica', tooltip: 'Próximamente: México, Colombia y Perú', startup: T.flags([cl]), opera: T.flags([cl, mx, co, pe]), escala: T.flags([cl, mx, co, pe]) },
        { feature: 'Conexión SII', tooltip: 'Startup: 1 empresa, 1 cuenta. Opera y Escala: múltiples empresas.', startup: T.limit('1 empresa · 1 cuenta'), opera: T.check(), escala: T.check() },
        { feature: 'Facturación automática desde contrato', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Facturación compleja', tooltip: 'Glosas personalizadas, división por razones sociales, referencias cruzadas y configuración avanzada de emisión', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Multi-empresa', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Multi-moneda', startup: T.dash(), opera: T.check(), escala: T.check() },
      ],
    },
    {
      title: 'Cuentas por cobrar y cobranza',
      rows: [
        { feature: 'Visibilidad CxC en tiempo real', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Conciliación de recaudación', tooltip: 'Cruza automáticamente los pagos recibidos en cuenta corriente contra las facturas emitidas', startup: T.limit('1 cuenta'), opera: T.limit('hasta 3 cuentas'), escala: T.limit('según volumen') },
        { feature: 'Cobranza por mensajería', tooltip: 'Flujos automáticos de cobro vía WhatsApp, email y SMS', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Integraciones de cobranza y cobro con tarjetas', startup: T.dash(), opera: T.integrations(['Toku', 'Fintoc']), escala: T.integrations(['Toku', 'Fintoc']) },
      ],
    },
    {
      title: 'Agentes Relvo',
      soon: true,
      rows: [
        { feature: 'Agente de onboarding', tooltip: 'Lee contratos y PDFs comerciales y los convierte en reglas de pricing configuradas y listas para facturar automáticamente.', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Agente de cobranza', tooltip: 'Gestiona flujos de pago, seguimiento y notificaciones automáticas', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Agente de facturación', tooltip: 'Emite, clasifica y reconcilia facturas automáticamente', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Agente de aprobaciones', tooltip: 'Gestiona flujos de aprobación y notificaciones automática', startup: T.dash(), opera: T.check(), escala: T.check() },
      ],
    },
    {
      title: 'Integraciones y soporte',
      rows: [
        { feature: 'Ingesta de usage vía API (endpoints REST)', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'API + Webhooks (plataforma)', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Integración ERP / contabilidad', startup: T.dash(), opera: T.dash(), escala: T.check() },
        { feature: 'Soporte por chat', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'SLA dedicado', startup: T.dash(), opera: T.dash(), escala: T.check() },
      ],
    },
    {
      title: 'Límites del plan',
      rows: [
        { feature: 'Ingresos gestionados', startup: T.limit('Hasta $20K/mes'), opera: T.limit('$20K–$100K/mes'), escala: T.limit('Sobre $100K/mes') },
        { feature: 'Contratos activos', startup: T.limit('200'), opera: T.limit('Ilimitados'), escala: T.limit('Ilimitados') },
        { feature: 'Cuentas bancarias conciliación', startup: T.limit('1'), opera: T.limit('hasta 3'), escala: T.limit('según volumen') },
        { feature: 'Usuarios', startup: T.limit('Hasta 3'), opera: T.limit('Ilimitados'), escala: T.limit('Ilimitados') },
      ],
    },
  ],
  en: [
    {
      title: 'Metering & contracts',
      rows: [
        { feature: 'Contract reading & interpretation', tooltip: 'The agent reads the contract and generates metering and billing rules automatically', startup: T.limit('up to 200'), opera: T.check(), escala: T.check() },
        { feature: 'Recurring, variable & hybrid pricing rules', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Plans & products', tooltip: 'Define rate plans assignable to contracts. Metering computes charges from the active plan.', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Usage ingestion via API', tooltip: 'Send usage events from your systems through REST endpoints.', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Pre-invoice approval flows & PO intake', startup: T.limit('manual'), opera: T.check(), escala: T.check() },
        { feature: 'AI-generated quotes', featureBadge: 'soon', startup: T.dash(), opera: T.check(), escala: T.check() },
      ],
    },
    {
      title: 'Invoicing',
      rows: [
        { feature: 'E-invoicing', tooltip: 'Coming soon: Mexico, Colombia, and Peru', startup: T.flags([cl]), opera: T.flags([cl, mx, co, pe]), escala: T.flags([cl, mx, co, pe]) },
        { feature: 'SII connection (Chile)', tooltip: 'Startup: 1 entity, 1 account. Opera and Escala: multiple entities.', startup: T.limit('1 entity · 1 account'), opera: T.check(), escala: T.check() },
        { feature: 'Automatic invoicing from contract', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Complex invoicing', tooltip: 'Custom line items, split across legal entities, cross-references, and advanced issuance settings', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Multi-entity', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Multi-currency', startup: T.dash(), opera: T.check(), escala: T.check() },
      ],
    },
    {
      title: 'Accounts receivable & collections',
      rows: [
        { feature: 'Real-time AR visibility', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Payment reconciliation', tooltip: 'Automatically matches payments received in your bank account against issued invoices', startup: T.limit('1 account'), opera: T.limit('up to 3 accounts'), escala: T.limit('per volume') },
        { feature: 'Collections via messaging', tooltip: 'Automated collection flows via WhatsApp, email, and SMS', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Collection & card-payment integrations', startup: T.dash(), opera: T.integrations(['Toku', 'Fintoc']), escala: T.integrations(['Toku', 'Fintoc']) },
      ],
    },
    {
      title: 'Relvo agents',
      soon: true,
      rows: [
        { feature: 'Onboarding agent', tooltip: 'Reads commercial contracts and PDFs and turns them into configured pricing rules, ready to bill automatically.', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Collections agent', tooltip: 'Manages payment flows, follow-up, and automatic notifications', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Invoicing agent', tooltip: 'Issues, classifies, and reconciles invoices automatically', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'Approvals agent', tooltip: 'Manages approval flows and automatic notifications', startup: T.dash(), opera: T.check(), escala: T.check() },
      ],
    },
    {
      title: 'Integrations & support',
      rows: [
        { feature: 'Usage ingestion via API (REST endpoints)', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'API + Webhooks (platform)', startup: T.dash(), opera: T.check(), escala: T.check() },
        { feature: 'ERP / accounting integration', startup: T.dash(), opera: T.dash(), escala: T.check() },
        { feature: 'Chat support', startup: T.check(), opera: T.check(), escala: T.check() },
        { feature: 'Dedicated SLA', startup: T.dash(), opera: T.dash(), escala: T.check() },
      ],
    },
    {
      title: 'Plan limits',
      rows: [
        { feature: 'Managed revenue', startup: T.limit('Up to $20K/mo'), opera: T.limit('$20K–$100K/mo'), escala: T.limit('Above $100K/mo') },
        { feature: 'Active contracts', startup: T.limit('200'), opera: T.limit('Unlimited'), escala: T.limit('Unlimited') },
        { feature: 'Reconciliation bank accounts', startup: T.limit('1'), opera: T.limit('up to 3'), escala: T.limit('per volume') },
        { feature: 'Users', startup: T.limit('Up to 3'), opera: T.limit('Unlimited'), escala: T.limit('Unlimited') },
      ],
    },
  ],
}

const INDUSTRIAS = {
  es: [
    { group: 'Tecnología y software', options: ['SaaS / Software', 'Infraestructura / Cloud / DevTools'] },
    { group: 'Servicios profesionales', options: ['Consultoría', 'Servicios jurídicos', 'Auditoría y contabilidad'] },
    { group: 'Operaciones y outsourcing', options: ['BPO / Outsourcing', 'Facilities / Servicios generales'] },
    { group: 'Finanzas y capital', options: ['Leasing / Renting', 'Factoring / Financieras', 'Fondos / Asset management'] },
    { group: 'Proyectos', options: ['Ingeniería de proyectos', 'Construcción por etapas'] },
    { group: 'Otros recurrentes', options: ['Medios / Publicidad', 'Salud', 'Educación', 'Logística / Transporte', 'Energía / Utilities', 'Otro'] },
  ],
  en: [
    { group: 'Technology & software', options: ['SaaS / Software', 'Infrastructure / Cloud / DevTools'] },
    { group: 'Professional services', options: ['Consulting', 'Legal services', 'Audit & accounting'] },
    { group: 'Operations & outsourcing', options: ['BPO / Outsourcing', 'Facilities / General services'] },
    { group: 'Finance & capital', options: ['Leasing / Renting', 'Factoring / Lenders', 'Funds / Asset management'] },
    { group: 'Projects', options: ['Project engineering', 'Staged construction'] },
    { group: 'Other recurring', options: ['Media / Advertising', 'Healthcare', 'Education', 'Logistics / Transport', 'Energy / Utilities', 'Other'] },
  ],
}

const UI = {
  es: {
    metaTitle: 'Precios | Relvo',
    metaDescription: 'Planes de Relvo. Startup gratis, Opera desde $499/mes, Escala a medida.',
    eyebrow: 'PRECIOS',
    title: 'Un solo sistema de revenue, a la escala de tu empresa',
    subtitle: 'Contrato, factura, cobranza y conciliación en un solo sistema.',
    monthly: 'Mensual',
    annual: 'Anual',
    perMonth: '/mes',
    free: 'Gratis',
    custom: 'Hablemos',
    compare: 'COMPARAR PLANES',
    contactTag: 'CONTACTO',
    feature: 'Feature',
    soon: 'próximamente',
    formTitle: 'Cuéntanos sobre tu empresa',
    formSubtitle: 'Te contactamos en menos de 24 horas.',
    industry: 'Industria',
    industryPlaceholder: 'Selecciona tu industria...',
    revenue: 'Ingresos mensuales estimados',
    revenueOptions: ['Menos de $20.000 USD', '$20.000 – $100.000 USD', 'Más de $100.000 USD'],
    plan: 'Plan de interés',
    planUnknown: 'No lo sé aún',
  },
  en: {
    metaTitle: 'Pricing | Relvo',
    metaDescription: 'Relvo plans. Startup free, Opera from $499/mo, Escala tailored.',
    eyebrow: 'PRICING',
    title: 'One revenue system, at the scale of your company',
    subtitle: 'Contract, invoice, collection, and reconciliation in a single system.',
    monthly: 'Monthly',
    annual: 'Annual',
    perMonth: '/mo',
    free: 'Free',
    custom: "Let's talk",
    compare: 'COMPARE PLANS',
    contactTag: 'CONTACT',
    feature: 'Feature',
    soon: 'coming soon',
    formTitle: 'Tell us about your company',
    formSubtitle: 'We reply within 24 hours.',
    industry: 'Industry',
    industryPlaceholder: 'Select your industry...',
    revenue: 'Estimated monthly revenue',
    revenueOptions: ['Under $20,000 USD', '$20,000 – $100,000 USD', 'Over $100,000 USD'],
    plan: 'Plan of interest',
    planUnknown: "Don't know yet",
  },
}

// ─── Cell rendering ──────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8l3.5 3.5L13 5" stroke="#1B7A50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const chipCls = 'inline-flex items-center rounded-sm px-1.5 py-[3px] font-mono text-[0.67rem] leading-none'

const CellValue = ({ cell }) => {
  if (!cell) return <span className="text-muted-deco">—</span>
  switch (cell.type) {
    case 'check':
      return <CheckIcon />
    case 'dash':
      return <span className="text-muted-deco">—</span>
    case 'limit':
      return <span className={`${chipCls} bg-ink/5 text-ink-soft`}>{cell.text}</span>
    case 'integrations':
      return (
        <span className="inline-flex flex-wrap justify-center gap-1">
          {cell.chips.map((c) => (
            <span key={c} className={chipCls} style={{ background: 'rgba(114,221,170,0.18)', color: '#13131E' }}>
              {c}
            </span>
          ))}
        </span>
      )
    case 'flags':
      return (
        <span className="inline-flex flex-wrap justify-center gap-1">
          {cell.items.map(({ label, active }) => (
            <span
              key={label}
              className={chipCls}
              style={active ? { background: 'rgba(114,221,170,0.18)', color: '#13131E' } : { background: 'rgba(19,19,30,0.04)', color: '#5D5D6B' }}
            >
              {label}
            </span>
          ))}
        </span>
      )
    default:
      return <span>{cell.text}</span>
  }
}

const SoonBadge = ({ ui }) => (
  <span className="ml-2 inline-flex items-center gap-1 font-mono text-[0.6rem]" style={{ color: '#C4501B' }}>
    <span className="inline-block h-1.5 w-1.5 rounded-full opacity-70" style={{ background: '#FF9566' }} aria-hidden="true" />
    {ui.soon}
  </span>
)

// ─── Page ────────────────────────────────────────────────────────────────────

/* text-[1rem] minimum on form controls — smaller triggers iOS auto-zoom on focus */
const inputCls =
  'w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-white px-3.5 py-2.5 font-sans text-[1rem] text-ink placeholder:text-muted-deco focus:border-ink/50 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors'
const labelCls = 'mb-1.5 block font-sans text-[0.8125rem] font-medium text-ink'

export const PricingPage = ({ lang, t, navigate, pathname }) => {
  const ui = UI[lang]
  const plans = PLANS[lang]
  const sections = TABLE_SECTIONS[lang]
  const f = t.form

  const [anual, setAnual] = useState(false)
  const formRef = useRef(null)
  const [planOrigen, setPlanOrigen] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '', email: '', empresa: '', cargo: '', industria: '', ingresos_mensuales: '', plan_interes: '', problema: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [formStatus, setFormStatus] = useState('idle')

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
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const handleCtaClick = (plan) => {
    if (plan.cta.action === 'link') window.open(plan.cta.href, '_blank', 'noopener,noreferrer')
    else scrollToForm(plan.name)
  }

  const required = ['nombre', 'email', 'empresa', 'cargo', 'industria', 'ingresos_mensuales', 'plan_interes']

  const validate = () => {
    const errors = {}
    required.forEach((field) => {
      if (!formData[field]?.trim()) errors[field] = f.required
    })
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = f.invalidEmail
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
    if (!supabase) {
      setFormStatus('error')
      return
    }
    setFormStatus('loading')
    const payload = { ...formData, plan_origen: planOrigen, url_origen: window.location.href, fuente: 'precios' }
    const { error } = await supabase.from('leads').insert([payload])
    if (error) {
      setFormStatus('error')
      return
    }
    setFormStatus('success')
  }

  const err = (k) => (formErrors[k] ? <p className="mt-1 font-sans text-xs text-red-600">{formErrors[k]}</p> : null)
  const errBorder = (k) => (formErrors[k] ? ' border-red-300 bg-red-50' : '')
  const operaPrice = anual ? 424 : 499

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white text-ink antialiased">
      <Helmet htmlAttributes={{ lang }}>
        <title>{ui.metaTitle}</title>
        <meta name="description" content={ui.metaDescription} />
      </Helmet>

      <Nav lang={lang} t={t} navigate={navigate} pathname={pathname} />

      {/* Structured header field */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <Aura color="#D0FF0B" size={480} opacity={0.16} className="-top-24 right-[12%]" />
        <Aura color="#72DDAA" size={420} opacity={0.18} className="-top-32 left-[8%]" />
        <Grain opacity={0.03} />
      </div>

      <main className="relative">
        {/* Boxed structure — vertical rails framing the content column */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-content -translate-x-1/2 border-x border-[var(--border-default)] lg:block"
        />

        <Container className="pt-36 sm:pt-44">
        {/* Header */}
        <Reveal className="mb-16 text-center sm:mb-20">
          <Eyebrow accent="lime">{ui.eyebrow}</Eyebrow>
          <h1
            className="mx-auto mt-5 max-w-3xl font-sans font-medium tracking-[-0.02em] text-ink"
            style={{ fontSize: 'var(--text-h2)', lineHeight: 1.1 }}
          >
            {ui.title}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-ink-soft" style={{ fontSize: 'var(--text-body-lg)', lineHeight: 1.55 }}>
            {ui.subtitle}
          </p>
        </Reveal>

        {/* Monthly / annual toggle */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <span className={`font-sans text-sm ${anual ? 'text-muted-aa' : 'font-semibold text-ink'}`}>{ui.monthly}</span>
          <Switch checked={anual} onCheckedChange={setAnual} />
          <span className={`font-sans text-sm ${anual ? 'font-semibold text-ink' : 'text-muted-aa'}`}>{ui.annual}</span>
          {anual && (
            <span className="rounded-sm px-2 py-[3px] font-mono text-[0.65rem] font-semibold leading-none text-ink" style={{ background: 'rgba(208,255,11,0.35)' }}>
              −15%
            </span>
          )}
        </div>

        {/* Plan cards */}
        <div className="mb-16 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const isFeatured = plan.featured
            const price = plan.id === 'opera' ? operaPrice : plan.priceMonthly
            return (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-[var(--radius-xl)] bg-white p-7"
                style={{
                  border: isFeatured ? '2px solid #D0FF0B' : '1px solid var(--border-default)',
                  boxShadow: isFeatured ? '0 20px 50px rgba(19,19,30,0.08)' : 'none',
                }}
              >
                {plan.badge && (
                  <span className="v2-eyebrow absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-sm)] bg-lime-brand px-3 py-1 font-medium text-ink">
                    {plan.badge}
                  </span>
                )}
                <p className="v2-eyebrow mb-3 text-muted-aa">{plan.name}</p>
                <div className="mb-2 flex items-end gap-1.5">
                  {plan.priceMonthly === null ? (
                    <span className="font-sans text-2xl font-medium tracking-tight text-ink">{ui.custom}</span>
                  ) : plan.priceMonthly === 0 ? (
                    <span className="font-sans text-3xl font-medium tracking-tight text-ink">{ui.free}</span>
                  ) : (
                    <>
                      <span className="flex items-start gap-1.5">
                        {anual && <span className="pt-1.5 font-sans text-base text-muted-aa line-through">$499</span>}
                        <span className="font-sans text-3xl font-medium tracking-tight text-ink">${price}</span>
                      </span>
                      <span className="pb-1 font-sans text-sm text-muted-aa">{ui.perMonth}</span>
                    </>
                  )}
                </div>
                <p className="mb-4 font-sans text-[0.85rem] leading-relaxed text-ink-soft">{plan.description}</p>
                <div
                  className="mb-5 rounded-[var(--radius-sm)] px-3 py-2 text-center font-sans text-[0.78rem] leading-snug"
                  style={
                    isFeatured
                      ? { background: 'rgba(208,255,11,0.18)', border: '1px solid rgba(208,255,11,0.5)', color: '#13131E' }
                      : { background: 'rgba(19,19,30,0.04)', border: '1px solid var(--border-default)', color: 'rgba(19,19,30,0.68)' }
                  }
                >
                  {plan.range}
                </div>
                <button
                  type="button"
                  onClick={() => handleCtaClick(plan)}
                  className={`mb-6 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-[var(--radius-button)] px-5 font-sans text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                    isFeatured
                      ? 'bg-lime-brand text-ink hover:brightness-105 hover:shadow-[0_4px_18px_rgba(208,255,11,0.5)]'
                      : 'border border-[var(--border-strong)] bg-transparent text-ink hover:border-ink/40 hover:bg-ink/[0.03]'
                  }`}
                >
                  {plan.cta.label}
                </button>
                <ul className="space-y-2">
                  {plan.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0">
                        <CheckIcon />
                      </span>
                      <span className="font-sans text-[0.85rem] leading-normal text-ink">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        </Container>

        {/* Comparison table */}
        <SectionTag accent="mint">{ui.compare}</SectionTag>
        <Container className="py-12 sm:py-16">
        <div>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] md:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th className="v2-eyebrow w-[40%] px-4 py-3.5 text-left font-normal text-muted-aa">{ui.feature}</th>
                  {plans.map((p) => (
                    <th key={p.id} className={`v2-eyebrow px-4 py-3.5 text-center font-normal ${p.featured ? 'text-ink' : 'text-muted-aa'}`}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <Fragment key={section.title}>
                    <tr style={{ background: 'rgba(19,19,30,0.02)' }}>
                      <td colSpan={4} className="px-4 py-2.5">
                        <span className="v2-eyebrow text-ink-soft">{section.title}</span>
                        {section.soon && <SoonBadge ui={ui} />}
                      </td>
                    </tr>
                    {section.rows.map((row, i) => (
                      <tr key={`${section.title}-${i}`} className="border-t border-[var(--border-subtle)]">
                        <td className="px-4 py-3">
                          <span className="font-sans text-[0.875rem] text-ink">{row.feature}</span>
                          {row.tooltip && <InfoTooltip content={row.tooltip} />}
                          {row.featureBadge === 'soon' && <SoonBadge ui={ui} />}
                        </td>
                        {plans.map((plan) => (
                          <td key={plan.id} className="px-4 py-3 text-center">
                            <span className="inline-flex items-center justify-center">
                              <CellValue cell={row[plan.id]} ui={ui} />
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {sections.map((section) => (
              <section key={section.title} className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h3 className="v2-eyebrow text-ink-soft">{section.title}</h3>
                  {section.soon && <SoonBadge ui={ui} />}
                </div>
                <div className="space-y-4">
                  {section.rows.map((row, rowIndex) => (
                    <div key={`${section.title}-m-${rowIndex}`} className="border-t border-[var(--border-subtle)] pt-4 first:border-t-0 first:pt-0">
                      <p className="font-sans text-[0.9rem] font-medium leading-snug text-ink">
                        {row.feature}
                        {row.featureBadge === 'soon' && <SoonBadge ui={ui} />}
                      </p>
                      <div className="mt-3 space-y-2">
                        {plans.map((plan) => (
                          <div key={`${row.feature}-${plan.id}`} className="flex items-center justify-between gap-3">
                            <span className="v2-eyebrow text-muted-aa">{plan.name}</span>
                            <span className="flex min-h-5 items-center justify-end text-right">
                              <CellValue cell={row[plan.id]} ui={ui} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        </Container>

        {/* Contact form */}
        <SectionTag accent="purple">{ui.contactTag}</SectionTag>
        <Container className="py-12 pb-24 sm:py-16 sm:pb-28">
        <div ref={formRef} id="form-contacto" className="scroll-mt-28">
          <div className="mx-auto max-w-xl">
            <div className="mb-8 text-center">
              <h2 className="font-sans font-medium tracking-[-0.015em] text-ink" style={{ fontSize: 'var(--text-h3)' }}>
                {ui.formTitle}
              </h2>
              <p className="mt-1.5 font-sans text-[0.9rem] text-ink-soft">{ui.formSubtitle}</p>
            </div>

            {formStatus === 'success' ? (
              <div className="rounded-[var(--radius-lg)] px-6 py-10 text-center" style={{ border: '1px solid rgba(114,221,170,0.5)', background: '#DFF4EB' }}>
                <p className="font-sans text-[1.0625rem] font-semibold text-ink">{f.successTitle}</p>
                <p className="mt-1.5 font-sans text-[0.9375rem] text-ink-soft">{f.successBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pr-nombre" className={labelCls}>{f.name} *</label>
                    <input id="pr-nombre" name="nombre" type="text" value={formData.nombre} onChange={handleChange} placeholder={f.namePlaceholder} className={inputCls + errBorder('nombre')} />
                    {err('nombre')}
                  </div>
                  <div>
                    <label htmlFor="pr-email" className={labelCls}>{f.email} *</label>
                    <input id="pr-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder={f.emailPlaceholder} className={inputCls + errBorder('email')} />
                    {err('email')}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pr-empresa" className={labelCls}>{f.company} *</label>
                    <input id="pr-empresa" name="empresa" type="text" value={formData.empresa} onChange={handleChange} placeholder={f.companyPlaceholder} className={inputCls + errBorder('empresa')} />
                    {err('empresa')}
                  </div>
                  <div>
                    <label htmlFor="pr-cargo" className={labelCls}>{f.role} *</label>
                    <select id="pr-cargo" name="cargo" value={formData.cargo} onChange={handleChange} className={inputCls + errBorder('cargo')}>
                      <option value="">{f.rolePlaceholder}</option>
                      {f.roleOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                    {err('cargo')}
                  </div>
                </div>
                <div>
                  <label htmlFor="pr-industria" className={labelCls}>{ui.industry} *</label>
                  <select id="pr-industria" name="industria" value={formData.industria} onChange={handleChange} className={inputCls + errBorder('industria')}>
                    <option value="">{ui.industryPlaceholder}</option>
                    {INDUSTRIAS[lang].map((group) => (
                      <optgroup key={group.group} label={`— ${group.group} —`}>
                        {group.options.map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {err('industria')}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="pr-ingresos" className={labelCls}>{ui.revenue} *</label>
                    <select id="pr-ingresos" name="ingresos_mensuales" value={formData.ingresos_mensuales} onChange={handleChange} className={inputCls + errBorder('ingresos_mensuales')}>
                      <option value="">{f.rolePlaceholder}</option>
                      {ui.revenueOptions.map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                    {err('ingresos_mensuales')}
                  </div>
                  <div>
                    <label htmlFor="pr-plan" className={labelCls}>{ui.plan} *</label>
                    <select id="pr-plan" name="plan_interes" value={formData.plan_interes} onChange={handleChange} className={inputCls + errBorder('plan_interes')}>
                      <option value="">{f.rolePlaceholder}</option>
                      <option>Startup</option>
                      <option>Opera</option>
                      <option>Escala</option>
                      <option>{ui.planUnknown}</option>
                    </select>
                    {err('plan_interes')}
                  </div>
                </div>
                <div>
                  <label htmlFor="pr-problema" className={labelCls}>
                    {f.problem} <span className="font-normal text-muted-aa">{f.problemOptional}</span>
                  </label>
                  <textarea id="pr-problema" name="problema" rows={4} value={formData.problema} onChange={handleChange} placeholder={f.problemPlaceholder} className={`${inputCls} resize-y`} />
                </div>
                {formStatus === 'error' && <p className="text-center font-sans text-sm text-red-600">{f.error}</p>}
                <button
                  type="submit"
                  disabled={formStatus === 'loading'}
                  className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-[var(--radius-button)] bg-lime-brand px-7 font-sans text-base font-semibold text-ink transition-all duration-200 hover:brightness-105 hover:shadow-[0_6px_24px_rgba(208,255,11,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:opacity-60"
                >
                  {formStatus === 'loading' ? f.sending : formStatus === 'error' ? f.retry : f.submit}
                </button>
              </form>
            )}
          </div>
        </div>
        </Container>
      </main>

      <Footer lang={lang} t={t} navigate={navigate} pathname={pathname} />
    </div>
  )
}
