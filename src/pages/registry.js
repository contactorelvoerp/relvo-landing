import { PoweredByPage } from './powered-by/PoweredByPage'
import { HomePage } from './home/HomePage'
import { DemoPage } from './demo/DemoPage'
import { PricingPage } from './pricing/PricingPage'
import { LandingAdsPage } from './landing-ads/LandingAdsPage'
import { LandingPage } from '../landing/LandingPage'
import { PlaceholderPage } from './PlaceholderPage'
import { NOINDEX_PAGES } from './noindex'

// Páginas de plantilla publicadas: se renderizan desde su archivo de contenido
// (content/<idioma>/<url>.json). El resto de los archivos de content/ se valida pero no se publica.
export const LANDINGS = ['cxc', 'contratos', 'medicion', 'aprobaciones', 'agentes', 'reporteria', 'planes', 'hibrido', 'uso', 'saas', 'agencias', 'revops', 'finanzas', 'ingenieria', 'tgp']

// Páginas noindex con componente propio (no el placeholder genérico): quedan fuera del índice
// a propósito, no "hasta que estén listas" (ver src/pages/noindex.js).
const NOINDEX_COMPONENTS = { 'lp-facturacion-b2b': LandingAdsPage, powered_by: PoweredByPage }

// id de página (reference/seo-metadata.json) → componente.
// Una página se publica en producción solo cuando está registrada acá.
export const PAGE_COMPONENTS = {
  home: HomePage,
  demo: DemoPage,
  precios: PricingPage,
  ...Object.fromEntries(LANDINGS.map((id) => [id, LandingPage])),
  ...Object.fromEntries(NOINDEX_PAGES.map((id) => [id, NOINDEX_COMPONENTS[id] ?? PlaceholderPage])),
}

// Idiomas con copy aprobado por página. Si una página no aparece acá, está lista en todos.
// Home en inglés: pendiente de traducir el copy del prototipo. Plantillas: el inglés queda para
// después (rutas /en preparadas, sin publicar). "powered_by" también: el rediseño (PoweredByPage.jsx,
// brief de Ricardo, 2026-11-02) no tiene copy EN aprobado, así que /en/powered-by-relvo queda sin
// ruta (404, con redirect 301 a la versión ES — ver vercel.json) hasta que llegue la traducción,
// igual que /en con home.
export const PAGE_LOCALES = {
  home: ['es'],
  // Precios: sin copy aprobado en inglés
  precios: ['es'],
  ...Object.fromEntries([...LANDINGS, ...NOINDEX_PAGES].map((id) => [id, ['es']])),
}
