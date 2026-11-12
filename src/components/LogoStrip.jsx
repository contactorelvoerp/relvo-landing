import { useEffect, useRef } from 'react'
import './logo-strip.css'

// Logos de la versión anterior del sitio, recortados a su contenido. El alto iguala el peso
// óptico (OpticalLogo del DS, base 30). Carrusel aprobado por Ricardo (2026-10-02).
const LOGOS = [
  { src: '/logos/clients/tgp.webp', alt: 'TGP', width: 99, height: 27 },
  { src: '/logos/clients/lidz.webp', alt: 'Lidz', width: 107, height: 25 },
  { src: '/logos/clients/relif.webp', alt: 'Relif', width: 81, height: 33 },
  { src: '/logos/clients/bulk.webp', alt: 'Bulk', width: 41, height: 40 },
  { src: '/logos/clients/skyward.webp', alt: 'Skyward', width: 128, height: 21 },
  { src: '/logos/clients/regcheq.svg', alt: 'Regcheq', width: 122, height: 36 },
  { src: '/logos/clients/scoops-xi.svg', alt: 'Scoops XI', width: 127, height: 30, preserveWhite: true },
  { src: '/logos/clients/eol-research.png', alt: 'EOL Research', width: 81, height: 48 },
]
// Cada mitad del carrusel repite los logos hasta tener al menos 8 celdas.
const REPEAT = Math.ceil(8 / LOGOS.length)
const SET = Array.from({ length: REPEAT }, () => LOGOS).flat()

export function LogoStrip({ label }) {
  const ref = useRef(null)
  // El carrusel se detiene fuera de pantalla.
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => el.classList.toggle('logo-strip--offscreen', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="logo-strip">
      <p className="logo-strip__label">{label}</p>
      <div className="logo-strip__window">
        <div className="logo-strip__track">
          {[0, 1].map((group) => (
            <div key={group} className="logo-strip__group" aria-hidden={group === 1 ? 'true' : undefined}>
              {SET.map((logo, i) => {
                const repeat = group === 1 || i >= LOGOS.length
                return (
                  <div key={i} className={`logo-strip__cell${i >= LOGOS.length ? ' logo-strip__cell--repeat' : ''}`}>
                    <img className={logo.preserveWhite ? 'logo-strip__preserve-white' : undefined} src={logo.src} alt={repeat ? '' : logo.alt} width={logo.width} height={logo.height} loading="lazy" draggable="false" />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
