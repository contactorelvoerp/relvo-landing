import { NOINDEX_PAGES } from './noindex.js'

// Route availability is data only. Do not import page components here: pages
// themselves use route helpers, and that would create an SSR import cycle.
export const LANDINGS = ['cxc', 'contratos', 'medicion', 'aprobaciones', 'agentes', 'reporteria', 'planes', 'hibrido', 'uso', 'saas', 'agencias', 'revops', 'finanzas', 'ingenieria', 'tgp']
const TRANSLATED_PRODUCTS = ['contratos', 'medicion', 'aprobaciones', 'cxc', 'agentes', 'reporteria']
const NOINDEX_KINDS = { 'lp-facturacion-b2b': 'landingAds', powered_by: 'poweredBy' }

// Shared by client loading and static asset hints. Paths are Vite manifest keys.
export const PAGE_MODULES = {
  home: { file: 'src/pages/home/HomePage.jsx', name: 'HomePage' },
  demo: { file: 'src/pages/demo/DemoPage.jsx', name: 'DemoPage' },
  pricing: { file: 'src/pages/pricing/PricingPage.jsx', name: 'PricingPage' },
  landing: { file: 'src/landing/LandingPage.jsx', name: 'LandingPage' },
  landingAds: { file: 'src/pages/landing-ads/LandingAdsPage.jsx', name: 'LandingAdsPage' },
  poweredBy: { file: 'src/pages/powered-by/PoweredByPage.jsx', name: 'PoweredByPage' },
  placeholder: { file: 'src/pages/PlaceholderPage.jsx', name: 'PlaceholderPage' },
}

export const PAGE_DEFINITIONS = {
  home: { kind: 'home', locales: ['es', 'en'] },
  demo: { kind: 'demo', locales: ['es', 'en'] },
  precios: { kind: 'pricing', locales: ['es', 'en'] },
  ...Object.fromEntries(LANDINGS.map((id) => [id, { kind: 'landing', locales: TRANSLATED_PRODUCTS.includes(id) ? ['es', 'en'] : ['es'] }])),
  ...Object.fromEntries(NOINDEX_PAGES.map((id) => [id, { kind: NOINDEX_KINDS[id] ?? 'placeholder', locales: ['es'] }])),
}
