import { useEffect, useRef, useState } from 'react'
import { LoginGradient } from '../../shaders/LoginGradient'
import { BackgroundStatic } from './BackgroundStatic'

/**
 * Full-page animated grain gradient background.
 * Supports 'landing' (default) and 'login' variants.
 */

// ── Hypotrochoid figure config (landing only) ──
// size: vw, x/y: vw position, opacity: 0–1
const figures = [
  { src: '/figures/Asset 7.svg', size: 100, x: -85, y: -40,  opacity: 0.30 },
  { src: '/figures/Asset 8.svg', size: 35, x: 80,  y: 85,  opacity: 0.25 },
  { src: '/figures/Asset 9.svg', size: 75, x: -65, y: 130, opacity: 0.25 },
  { src: '/figures/Asset 6.svg', size: 50, x: 75,  y: 220, opacity: 0.25 },
  { src: '/figures/Asset 11.svg', size: 50, x: -40, y: 310, opacity: 0.25 },
  { src: '/figures/Asset 7.svg', size: 60, x: 70,  y: 400, opacity: 0.20 },
  { src: '/figures/Asset 8.svg', size: 45, x: -50, y: 480, opacity: 0.20 },
  { src: '/figures/Asset 6.svg', size: 55, x: 65,  y: 570, opacity: 0.20 },
  { src: '/figures/Asset 9.svg', size: 65, x: -55, y: 660, opacity: 0.18 },
  { src: '/figures/Asset 11.svg', size: 50, x: 72,  y: 750, opacity: 0.18 },
  { src: '/figures/Asset 7.svg', size: 70, x: -60, y: 850, opacity: 0.15 },
]

const shaderProps = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  softness: 0.35,
  intensity: 0.58,
  noise: 0.008,
  colors: ['#DFF4EB', '#D5F7C1', '#E3C0F2', '#3F28B2'],
  colorBack: '#00000000',
  maxPixelCount: 2560 * 1440,
  style: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
}

export const ShaderBackground = ({ className = '', variant = 'landing' }) => {
  const isLogin = variant === 'login'
  const wrapperRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => setIsVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const activeSpeed = isVisible ? 0.65 : 0

  return (
    <div
      ref={wrapperRef}
      id="shader-background-root"
      className={`pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden ${className}`}
      style={{ height: '100%' }}
    >
      {isLogin ? (
        <LoginGradient
          speed={activeSpeed}
          rotation={-180}
          blobCount={2}
          blobSize={0.80}
          blobScale={1.0}
          minPixelRatio={2}
          {...shaderProps}
        />
      ) : (
        <BackgroundStatic />
      )}

      {!isLogin && figures.map((fig, i) => (
        <img
          key={i}
          src={fig.src}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute"
          style={{
            left: `${fig.x}vw`,
            top: `${fig.y}vw`,
            width: `${fig.size}vw`,
            height: 'auto',
            opacity: fig.opacity,
          }}
        />
      ))}
    </div>
  )
}
