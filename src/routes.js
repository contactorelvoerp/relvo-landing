import seo from '../reference/seo-metadata.json'
import { SHOW_PENDING } from './env'
import { DEFAULT_LOCALE, EXTERNAL_PAGES } from './site'
import { READY_LOCALES, getDict } from './i18n'
import { PAGE_DEFINITIONS } from './pages/manifest'
import { NOINDEX_PAGES } from './pages/noindex'


function buildRoutes() {
  const routes = []
  for (const page of seo.pages) {
    // Las páginas sin implementar se generan solo fuera de producción; las de la ola 2, solo cuando
    // ya están implementadas.
    // Docs y Blog son sitios externos: no generan página en este sitio
    if (EXTERNAL_PAGES[page.id]) continue
    const definition = PAGE_DEFINITIONS[page.id]
    const built = Boolean(definition)
    if (page.pagina.includes('(ola 2)') && !built) continue
    if (!built && !SHOW_PENDING) continue
    for (const locale of READY_LOCALES) {
      const live = built && definition.locales.includes(locale)
      // Sin traducción no hay ruta en inglés (404), tampoco en preview
      if (!live && (!SHOW_PENDING || locale !== DEFAULT_LOCALE)) continue
      const meta = page[locale]
      routes.push({
        id: page.id,
        locale,
        path: meta.url,
        title: meta.title,
        description: meta.description,
        status: live ? 'live' : 'pending',
        noindex: NOINDEX_PAGES.includes(page.id),
      })
    }
  }
  return routes
}

// Build route metadata once without loading page components.
let cache
export function getRoutes() {
  cache ??= buildRoutes()
  return cache
}

export function notFoundRoute(locale = DEFAULT_LOCALE) {
  return { id: '404', locale, path: null, title: getDict(locale).notFound.title, description: '', status: '404' }
}

function findRoute(id, locale) {
  return getRoutes().find((r) => r.id === id && r.locale === locale) ?? null
}

export function hrefFor(id, locale) {
  return EXTERNAL_PAGES[id] ?? findRoute(id, locale)?.path ?? null
}

// Para links escritos como URL en los archivos de contenido: la URL si la página existe en este
// build (en producción, solo las publicadas); si no, null y el link no se renderiza.
export function hrefForPath(path) {
  return getRoutes().some((r) => r.path === path) ? path : null
}

export function resolvePath(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return getRoutes().find((r) => r.path === path) ?? notFoundRoute()
}

// "home:es" en el atributo data-route del HTML prerenderizado.
export function routeKey(route) {
  return `${route.id}:${route.locale}`
}

export function routeFromKey(key) {
  const [id, locale] = key.split(':')
  return findRoute(id, locale) ?? notFoundRoute(locale)
}
