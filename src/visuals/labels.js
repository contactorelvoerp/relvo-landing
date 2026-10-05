// Textos de interfaz de la librería de visuales y de los bloques de la plantilla. Son las etiquetas
// de la UI de producto que ya usan la home y la página piloto aprobada (no son copy de página).
// EN: pendiente de traducir.
const P = '[PENDIENTE]'

export const labelsFor = (locale) => LABELS[locale] ?? LABELS.es

// Tono de la etiqueta de estado: warn (revisión, ámbar) o neutral (gris); sin tono, verde
const TONE = { warn: 'chip chip--run', neutral: 'chip chip--plain' }
export const chipClass = (tone) => TONE[tone] ?? 'chip'

const LABELS = {
  es: {
    appNav: ['Contratos', 'Facturas', 'Cobranza', 'Reportes'],
    invoice: 'Factura',
    collection: 'Cobro de',
    of: 'de',
    glosa: 'Glosa',
    to: 'Para',
    subject: 'asunto',
    last30: 'Últimos 30 días',
    review: 'Requiere revisión',
    days: 'días',
    before: 'Antes',
    after: 'Con Relvo',
    dti: 'Días en facturar (DTI)',
    breadcrumb: 'Migas de pan',
  },
  en: {
    appNav: [P, P, P, P],
    invoice: P,
    collection: P,
    of: P,
    glosa: P,
    to: P,
    subject: P,
    last30: P,
    review: P,
    days: P,
    before: P,
    after: P,
    dti: P,
    breadcrumb: P,
  },
}
