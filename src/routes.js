import seo from '../reference/seo-metadata.json'
import { SHOW_PENDING } from './env'
import { DEFAULT_LOCALE } from './site'
import { READY_LOCALES, getDict } from './i18n'
import { PAGE_COMPONENTS } from './pages/registry'


function buildRoutes() {
  const routes = []
  for (const page of seo.pages) {
    if (page.pagina.includes('(ola 2)')) continue
    // Las páginas sin implementar se generan solo fuera de producción.
    const live = Boolean(PAGE_COMPONENTS[page.id])
    if (!live && !SHOW_PENDING) continue
    for (const locale of READY_LOCALES) {
      const meta = page[locale]
      routes.push({
        id: page.id,
        locale,
        path: meta.url,
        title: meta.title,
        description: meta.description,
        status: live ? 'live' : 'pending',
      })
    }
  }
  return routes
}

// Perezoso: las páginas del registro importan este módulo (hrefFor).
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
  return findRoute(id, locale)?.path ?? null
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
