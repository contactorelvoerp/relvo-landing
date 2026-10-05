import seo from '../reference/seo-metadata.json'

// Único lugar donde se referencia el dominio propio y los destinos externos.
export const SITE_URL = seo.site
export const DEFAULT_LOCALE = seo.defaultLocale
export const SITE_NAME = 'Relvo'
export const APP_LOGIN_URL = 'https://app.relvoerp.com/login'
// Docs y Blog viven fuera de este sitio (como en la web anterior): la documentación de producto y la
// de la API en la app, el blog en su propio sitio. /docs y /blog redirigen ahí (vercel.json).
export const EXTERNAL_PAGES = {
  docs: 'https://app.relvoerp.com/docs/product',
  blog: 'https://blog.relvoerp.com',
}
export const API_DOCS_URL = 'https://app.relvoerp.com/docs'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/relvoerp/'
export const GA_ID = 'G-3612NJ7H02'
export const APOLLO_APP_ID = '699730cba59e31000dd3ed82'
