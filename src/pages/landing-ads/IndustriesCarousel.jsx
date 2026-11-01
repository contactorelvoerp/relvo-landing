import { useEffect, useRef } from 'react'
import { INDUSTRY_ICONS } from './industry-icons'

// Carrusel de industrias para "Para quién es": mismo patrón que el carrusel de integraciones
// (src/blocks/Integrations.jsx) — lineal, lento, se detiene fuera de pantalla y con
// prefers-reduced-motion. Iconos de línea, no fotos stock (regla cero).
export function IndustriesCarousel({ items, label }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => el.classList.toggle('industries--offscreen', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="industries">
      <ul className="industries__track" aria-label={label}>
        {[0, 1].map((group) => items.map((item) => (
          <li key={`${group}-${item.key}`} aria-hidden={group === 1 ? 'true' : undefined}>
            <svg className="industries__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {INDUSTRY_ICONS[item.key]}
            </svg>
            <span>{item.label}</span>
          </li>
        )))}
      </ul>
    </div>
  )
}
