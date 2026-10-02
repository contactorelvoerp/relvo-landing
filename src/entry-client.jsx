import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { resolvePath, routeFromKey } from './routes'
import './styles/tokens.css'
import './styles/site.css'

const root = document.getElementById('root')
const prerendered = root.dataset.route

if (prerendered) {
  hydrateRoot(root, <StrictMode><App route={routeFromKey(prerendered)} /></StrictMode>)
} else {
  // Servidor de desarrollo: no hay HTML prerenderizado.
  const route = resolvePath(window.location.pathname)
  document.documentElement.lang = route.locale
  document.title = route.title
  createRoot(root).render(<StrictMode><App route={route} /></StrictMode>)
}
