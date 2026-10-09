import seo from '../reference/seo-metadata.json'

// Único lugar donde se referencia el dominio propio y los destinos externos.
export const SITE_URL = seo.site
export const DEFAULT_LOCALE = seo.defaultLocale
export const SITE_NAME = 'Relvo'
export const APP_LOGIN_URL = 'https://app.getrelvo.ai/login'
// Páginas que no genera este sitio. Docs vive en la app (/docs redirige ahí). El blog es el proyecto
// relvo-blog (Astro + Keystatic), servido en /blog con un rewrite (vercel.json).
export const EXTERNAL_PAGES = {
  docs: 'https://app.getrelvo.ai/docs/product/es/overview/',
  blog: '/blog',
}
export const API_DOCS_URL = 'https://app.relvoerp.com/docs'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/relvoerp/'
export const GA_ID = 'G-3612NJ7H02'
export const APOLLO_APP_ID = '699730cba59e31000dd3ed82'
