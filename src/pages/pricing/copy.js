// Página de precios. Copy: Notion "Estructura — Página de precios (v2)", 12-10-2026, tal cual.
// Cambios de Ricardo (13-10-2026): los CTA "Crear cuenta" y "Pedir propuesta" de los planes y el CTA
// final dicen "Agendar una demo" y llevan al formulario; el precio de A medida dice "Hablemos".
// Visual "Crece sin migrar": datos ficticios del brief; fechas y desglose del mockup de Claude Design.
// Inglés: sin copy aprobado (la página no se publica en /en/pricing).
const PENDING = '[PENDIENTE]'

export const copy = {
  es: {
    hero: {
      h1: 'Precios claros, sin importar cómo cobras.',
      lead: 'Un plan para empezar, con tarjeta, transferencia o ambas. Uno a medida cuando crezcas.',
    },
    plansLabel: 'Planes',
    cta: 'Agendar una demo',
    limits: { contracts: 'Contratos', entities: 'Sociedades', countries: 'Países' },
    plans: [
      {
        name: 'Startup',
        who: 'Para SaaS e IA que cobran planes fijos y quieren automatizar el cobro desde el primer cliente.',
        price: 'USD 299',
        period: '/ mes',
        limits: ['Hasta 50', '1', '1'],
        payLabel: 'Te pagan con',
        pay: ['Tarjeta', 'Transferencia', 'Ambas'],
        note: 'Con tu pasarela: Stripe, Toku o Fintoc.',
        includes: ['Planes mensuales y anuales', 'Facturación electrónica en Chile o México', 'Conciliación de pagos', 'MRR, ARR y recaudación'],
      },
      {
        name: 'A medida',
        who: 'Para SaaS, IA y agencias que venden con contrato: cobro por uso, órdenes de compra o varias sociedades.',
        price: 'Hablemos',
        limits: ['Más de 50', 'Varias', 'Varios'],
        note: 'Precio por tramos, según tu volumen de contratos.',
        includes: ['Pricing híbrido: fijo, uso e hitos', 'Aprobaciones y órdenes de compra', 'Facturación compleja y varias monedas', 'Rev Rec bajo IFRS 15'],
      },
    ],
    grow: {
      h2: 'Empieza simple. Crece sin migrar.',
      text: 'Cuando lo necesites, pasas a A medida sobre lo que ya tienes. Mismos clientes, mismo historial.',
      customer: 'Lumen IA · contrato',
      sample: 'Ejemplo · datos ficticios',
      historyLabel: 'Historial del contrato',
      invoiceLabel: 'Factura que emite Relvo',
      total: 'Total',
      meta: ['Pago', 'Orden de compra', 'Facturar a'],
      versions: [
        {
          when: 'v1 · Mes 1', plan: 'Startup', title: 'Plan fijo con tarjeta', date: '01-11-2026',
          lines: [{ label: 'Plan Pro', detail: 'Mensual', amount: 'USD 49,00' }],
          total: 'USD 49,00',
          meta: ['Tarjeta · Stripe', 'Sin OC', '1 sociedad'],
        },
        {
          when: 'v2 · Mes 6', plan: 'Startup', title: 'Pasa a plan anual, paga por transferencia', date: '01-04-2027',
          lines: [{ label: 'Plan Pro', detail: 'Anual', amount: 'USD 490,00' }],
          total: 'USD 490,00',
          meta: ['Transferencia', 'Sin OC', '1 sociedad'],
        },
        {
          when: 'v3 · Mes 14', plan: 'A medida', title: 'Contrato con uso y OC, suma filial en México', date: '01-12-2027',
          lines: [
            { label: 'Plataforma', detail: 'Fijo mensual', amount: 'USD 300,00' },
            { label: 'Llamadas API', detail: '12.400 × USD 0,005', amount: 'USD 62,00', usage: true },
          ],
          total: 'USD 362,00',
          meta: ['Transferencia', 'OC-2027-018', '2 sociedades'],
        },
      ],
    },
    form: {
      h2: 'Cuéntanos cómo cobras.',
      text: 'Te respondemos con una propuesta y una demo con tus casos.',
      submit: 'Pedir propuesta',
    },
    faq: {
      h2: 'Preguntas frecuentes',
      items: [
        { q: '¿Qué es un contrato en Relvo?', a: 'Las reglas de cobro activas de un cliente: qué le cobras, cuánto, cada cuánto y cómo te paga. No es un PDF ni algo que se firma. Un cliente suscrito con tarjeta también cuenta como contrato.' },
        { q: '¿Qué pasa si paso los 50 contratos?', a: 'Pasas a A medida. Tus clientes, planes e historial se mantienen.' },
        { q: '¿Relvo procesa los pagos con tarjeta?', a: 'No. Se conecta con tu pasarela (Stripe, Toku o Fintoc) y se encarga de planes, facturación y conciliación.' },
        { q: '¿En qué moneda se cobra Relvo?', a: PENDING },
        { q: '¿Los precios incluyen impuestos?', a: PENDING },
      ],
    },
    final: { h2: 'Tú vendes. Relvo hace el resto.' },
  },
}

export const isPending = (text) => text === PENDING

// Preguntas con respuesta aprobada: las únicas que van al JSON-LD FAQPage (y a producción)
export const answeredFaq = (locale) => copy[locale]?.faq.items.filter((item) => !isPending(item.a)) ?? []
