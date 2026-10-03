import { renderToString } from 'react-dom/server'
import { App } from './App'
import { getRoutes, notFoundRoute, routeKey } from './routes'
import { absoluteUrl, buildHead } from './seo/head'
import { SITE_NAME, SITE_URL } from './site'

// API del build estático (scripts/prerender.mjs).
export { getRoutes, notFoundRoute, routeKey, absoluteUrl, SITE_NAME, SITE_URL }

export function render(route, headOptions) {
  return {
    html: renderToString(<App route={route} />),
    head: buildHead(route, headOptions),
  }
}
