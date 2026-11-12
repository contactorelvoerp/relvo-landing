// Textos de interfaz de la librería de visuales y de los bloques de la plantilla. Son las etiquetas
// de la UI de producto que ya usan la home y la página piloto aprobada (no son copy de página).
// ES/EN: etiquetas compartidas por la home y las páginas de producto.

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
    // Barra secundaria: etiqueta corta del ancla de cada bloque con h2 (piloto aprobada)
    sections: 'Secciones',
    docs: 'Docs',
    anchors: { beforeAfter: 'Resumen', steps: 'Cómo funciona', featureTabs: 'Funcionalidades', capabilities: 'Detalle', metrics: 'Métricas', case: 'Caso', related: 'Relacionados', faq: 'Preguntas' },
  },
  en: {
    appNav: ['Contracts', 'Invoices', 'Collections', 'Reports'],
    invoice: 'Invoice',
    collection: 'Collection for',
    of: 'of',
    glosa: 'Description',
    to: 'To',
    subject: 'subject',
    last30: 'Last 30 days',
    review: 'Needs review',
    days: 'days',
    before: 'Before',
    after: 'With Relvo',
    dti: 'Days to invoice (DTI)',
    breadcrumb: 'Breadcrumb',
    sections: 'Sections',
    docs: 'Docs',
    anchors: { beforeAfter: 'Overview', steps: 'How it works', featureTabs: 'Features', capabilities: 'Details', metrics: 'Metrics', case: 'Case study', related: 'Related', faq: 'Questions' },
  },
}
