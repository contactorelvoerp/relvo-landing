import seo from '../reference/seo-metadata.json'

// Único lugar donde se referencia el dominio propio y los destinos externos.
export const SITE_URL = seo.site
export const DEFAULT_LOCALE = seo.defaultLocale
export const SITE_NAME = 'Relvo'
export const APP_LOGIN_URL = 'https://app.getrelvo.ai/login'
// Páginas que no genera este sitio. Docs vive en la app (/docs redirige ahí). El blog es el proyecto
// relvo-blog (Astro + Keystatic), servido en /blog con un rewrite (vercel.json). Términos y Privacidad
// son los textos legales ya publicados de la plataforma: no se inventa texto legal, y /terminos y
// /privacidad redirigen ahí (vercel.json) hasta que este sitio tenga sus propias páginas.
export const EXTERNAL_PAGES = {
  docs: 'https://app.getrelvo.ai/docs/product/es/overview/',
  blog: '/blog',
  terminos: 'https://app.relvoerp.com/terms',
  privacidad: 'https://app.relvoerp.com/privacy',
}
export const API_DOCS_URL = 'https://app.getrelvo.ai/docs'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/relvoai'
export const GA_ID = 'G-3612NJ7H02'
export const APOLLO_APP_ID = '699730cba59e31000dd3ed82'
// Google Ads (campaña /lp/facturacion-b2b, dato de Ricardo): no es secreto, igual que GA_ID.
export const GOOGLE_ADS_ID = 'AW-18546425614'
