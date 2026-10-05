import { renderToString } from 'react-dom/server'
import { App } from './App'
import { getRoutes, notFoundRoute, resolvePath, routeKey } from './routes'
import { absoluteUrl, buildHead } from './seo/head'
import { SITE_NAME, SITE_URL } from './site'

// API del render en servidor: la usan el build estático (scripts/prerender.mjs)
// y el servidor de desarrollo (vite.config.js), así localhost sirve el mismo HTML que producción.
export { getRoutes, notFoundRoute, resolvePath, absoluteUrl, SITE_NAME, SITE_URL }
export { llmsTxt, robotsTxt, sitemapXml } from './seo/files'

export function renderDocument(template, route, headOptions) {
  const html = renderToString(<App route={route} />)
  return template
    .replace('<html lang="es">', `<html lang="${route.locale}">`)
    .replace('<!--app-head-->', buildHead(route, headOptions))
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-route="${routeKey(route)}" data-status="${route.status}">${html}</div>`)
}
