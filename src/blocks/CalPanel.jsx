import { useState } from 'react'
import { CalEmbed } from '../components/CalEmbed'
import '../styles/blocks.css'

// Formulario alternativo al calendario: en mobile va colapsado (acordeón) debajo de Cal.com, en
// desktop siempre abierto (.cal-panel__form-body--closed solo actúa bajo los 900px del grid, ver
// src/styles/blocks.css). `title` lo decide cada página (ninguna copy fija acá).
function FormPanel({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="cal-panel__form">
      <button type="button" className="cal-panel__form-toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <svg className={`cal-panel__form-chevron${open ? ' cal-panel__form-chevron--open' : ''}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
      </button>
      <div className={`cal-panel__form-body${open ? '' : ' cal-panel__form-body--closed'}`}>
        {children}
      </div>
    </div>
  )
}

// Calendario de Cal.com (CalEmbed) + un formulario alternativo secundario, lado a lado en desktop.
// Usado por /lp/facturacion-b2b, /agendar-demo y /powered-by-relvo: una sola conversión principal
// (agendar) y una secundaria (dejar los datos), nunca dos CTAs del mismo peso.
export function CalPanel({ onBooked, prefill, formTitle, children }) {
  return (
    <div className="cal-panel__grid">
      <div className="cal-panel__cal"><CalEmbed onBooked={onBooked} prefill={prefill} /></div>
      <FormPanel title={formTitle}>{children}</FormPanel>
    </div>
  )
}
