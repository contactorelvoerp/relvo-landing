import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { App } from './App'
import { routeFromKey } from './routes'
import './styles/tokens.css'
import './styles/site.css'

// Todo HTML llega renderizado desde el servidor (build estático o servidor de desarrollo).
const root = document.getElementById('root')
hydrateRoot(root, <StrictMode><App route={routeFromKey(root.dataset.route)} /></StrictMode>)
