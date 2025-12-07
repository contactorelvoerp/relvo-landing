import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { computeTheme, applyTheme, persistTheme } from './utils/theme'

// Apply theme before rendering to avoid initial flash/mismatch
const initialTheme = computeTheme()
applyTheme(initialTheme)
persistTheme(initialTheme)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

