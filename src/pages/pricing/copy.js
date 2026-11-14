// ES/EN pricing content. Published amounts and limits remain the commercial source of truth.
// See docs/pricing-page-playbook.md for the design rationale and unresolved commercial policies.

export const copy = {
  es: {
    hero: {
      h1: 'Tu facturación y cobranza,',
      emphasis: 'en un solo plan.',
    },
    plansLabel: 'Compara los planes',
    summaryLabel: 'Explora los planes',
    sharedFeaturesLabel: 'Incluido en ambos planes',
    featureIncluded: 'Incluido', featureDetails: 'Ver detalles', featureLink: 'Ver producto',
    limits: { contracts: 'Contratos activos', entities: 'Sociedades', countries: 'Países' },
    features: [
      { title: 'Suscripciones recurrentes', detail: 'Define el precio y la frecuencia de cada suscripción. Relvo calcula el cobro de cada período.', page: 'contratos' },
      { title: 'Facturación en Chile o México', detail: 'Emite cada factura con los datos fiscales, la sociedad y la moneda del contrato.', page: 'cxc' },
      { title: 'Conciliación de pagos', detail: 'Relaciona cada movimiento del banco con su factura. Relvo propone la conciliación con evidencia y tu equipo confirma.', page: 'cxc' },
      { title: 'Reporting de ingresos y cobranza', detail: 'Consulta MRR, ARR, recaudación y DSO desde los mismos datos con que facturas y cobras.', page: 'reporteria' },
      { title: 'Agentes de IA para facturación', detail: 'Leen órdenes de compra, hacen seguimiento por correo y avisan a tu equipo en Slack o Google Chat. Tú resuelves las excepciones.', page: 'agentes' },
      { title: 'Contratos por uso y pricing mixto', detail: 'Combina cargos fijos, consumo, tramos y mínimos según las condiciones de cada cliente.', page: 'contratos' },
      { title: 'Órdenes de compra y aprobaciones', detail: 'Asocia la OC y consigue la aprobación antes de emitir la factura.', page: 'aprobaciones' },
      { title: 'Facturación multimoneda', detail: 'Divide facturas entre sociedades, aplica prorrateos y convierte monedas.', page: 'cxc' },
      { title: 'Reconocimiento de ingresos bajo IFRS 15', detail: 'Reconoce ingresos bajo IFRS 15 con los mismos datos que usas para facturar.', page: 'reporteria' },
      { title: 'MCP para tus asistentes de IA', detail: 'Consulta facturas, cobros y consumo desde tus asistentes de IA mediante Model Context Protocol (MCP).', page: 'agentes' },
    ],
    plans: [
      {
        id: 'startup', name: 'Business',
        price: 'USD 299', period: '/ mes', summary: 'Hasta 50 contratos',
        limits: ['Hasta 50', '1', '1'],
        cta: 'Agendar demo', intent: 'demo',
      },
      {
        id: 'custom', name: 'A medida',
        price: 'Hablemos', summary: 'Más de 50 contratos',
        limits: ['Más de 50', 'Varias', 'Varios'],
        note: 'Precio según tu volumen de contratos.',
        cta: 'Solicitar propuesta', intent: 'proposal',
      },
    ],
    fit: '¿No sabes cuál elegir?',
    fitLink: 'Hablemos',
    proof: { title: 'TGP con Relvo', link: 'Ver el caso de TGP', linkNote: '' },
    form: {
      h2: 'Hablemos de tu facturación.',
      text: 'Te mostramos cómo funcionaría Relvo con tus contratos y qué plan se ajusta a tu operación.',
      demo: 'Agendar demo',
      email: 'Prefiero escribirles',
    },
    faq: {
      h2: 'Antes de elegir.',
      items: [
        { q: '¿Qué es un contrato en Relvo?', a: 'Las reglas de cobro activas de un cliente: monto, frecuencia y medio de pago. Una suscripción con tarjeta también cuenta.' },
        { q: '¿Qué pasa si paso los 50 contratos?', a: 'Pasas a A medida. Tus clientes, planes e historial se mantienen.' },
        { q: '¿Relvo procesa los pagos con tarjeta?', a: 'Relvo se integra a Stripe, Toku o Fintoc. Relvo gestiona planes, facturas y conciliación.' },
      ],
    },
  },
  en: {
    hero: {
      h1: 'Your billing and collections,', emphasis: 'in one plan.',
    },
    plansLabel: 'Compare plans', summaryLabel: 'Explore the plans',
    sharedFeaturesLabel: 'Included in both plans',
    featureIncluded: 'Included', featureDetails: 'View details', featureLink: 'View product',
    limits: { contracts: 'Active contracts', entities: 'Legal entities', countries: 'Countries' },
    features: [
      { title: 'Recurring subscriptions', detail: 'Set each subscription’s price and frequency. Relvo calculates the charge for every period.', page: 'contratos' },
      { title: 'Invoicing in Chile or Mexico', detail: 'Issue electronic invoices using the contract’s legal entity and currency.', page: 'cxc' },
      { title: 'Payment reconciliation', detail: 'Match bank transactions to invoices. Relvo suggests the match with supporting evidence, and your team confirms.', page: 'cxc' },
      { title: 'Revenue and collections reporting', detail: 'See MRR, ARR, collected revenue and DSO from the same data you use to invoice and collect.', page: 'reporteria' },
      { title: 'AI agents for invoicing', detail: 'Read purchase orders, follow up by email and notify your team in Slack or Google Chat. Your team handles exceptions.', page: 'agentes' },
      { title: 'Usage-based contracts and hybrid pricing', detail: 'Combine fixed fees, usage, tiers and minimums according to each customer’s terms.', page: 'contratos' },
      { title: 'Purchase orders and approvals', detail: 'Link the PO and get approval before issuing the invoice.', page: 'aprobaciones' },
      { title: 'Multi-currency invoicing', detail: 'Split invoices across legal entities, prorate charges and convert currencies.', page: 'cxc' },
      { title: 'Revenue recognition under IFRS 15', detail: 'Recognize revenue under IFRS 15 using the same data you invoice with.', page: 'reporteria' },
      { title: 'MCP for your AI assistants', detail: 'Query invoices, collections and usage from your AI assistants through Model Context Protocol (MCP).', page: 'agentes' },
    ],
    plans: [
      {
        id: 'startup', name: 'Business',
        price: 'USD 299', period: '/ month', summary: 'Up to 50 contracts',
        limits: ['Up to 50', '1', '1'],
        cta: 'Book a demo', intent: 'demo',
      },
      {
        id: 'custom', name: 'Custom',
        price: "Let's talk", summary: 'More than 50 contracts',
        limits: ['More than 50', 'Multiple', 'Multiple'], note: 'Pricing based on contract volume.',
        cta: 'Request a proposal', intent: 'proposal',
      },
    ],
    fit: 'Not sure which plan fits?', fitLink: 'Let’s talk',
    proof: { title: 'TGP with Relvo', link: 'Read the TGP case study', linkNote: '(in Spanish)' },
    form: {
      h2: 'Let’s talk about your billing.',
      text: 'See how Relvo would work with your contracts and which plan fits your operation.',
      demo: 'Book a demo',
      email: 'I’d rather email you',
    },
    faq: {
      h2: 'Before you choose.',
      items: [
        { q: 'What is a contract in Relvo?', a: "A customer's active billing rules: amount, frequency and payment method. A card subscription counts, too." },
        { q: 'What happens if I exceed 50 contracts?', a: 'You move to Custom. Your customers, plans and history stay with you.' },
        { q: 'Does Relvo process card payments?', a: 'Relvo integrates with: Stripe, Toku or Fintoc. Relvo handles plans, invoices and reconciliation.' },
      ],
    },
  },
}
export const answeredFaq = (locale) => copy[locale]?.faq.items ?? []
