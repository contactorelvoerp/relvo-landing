import { initializeMarketing } from './analytics.js'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { routeFromKey } from './routes'
import { loadContent } from './content'
import { LANDINGS } from './pages/manifest'
import { loadPage } from './pages/load'
import './styles/tokens.css'
import './styles/site.css'

// Todo HTML llega renderizado desde el servidor (build estático o servidor de desarrollo).
// Las páginas de plantilla traen su archivo de contenido antes de hidratar.
initializeMarketing()
const root = document.getElementById('root')
const route = routeFromKey(root.dataset.route)
const content = route.status === 'live' && LANDINGS.includes(route.id) ? loadContent(route.locale, route.path) : Promise.resolve()
Promise.all([loadPage(route), content]).then(([Page]) => {
  hydrateRoot(root, <StrictMode><App route={route} Page={Page} /></StrictMode>)
})
