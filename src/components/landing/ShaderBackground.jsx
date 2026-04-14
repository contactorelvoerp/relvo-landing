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
  { src: '/figures/Asset 7.svg', size: 132, x: -85, y: -40,  opacity: 0.30 },
  { src: '/figures/Asset 8.svg', size: 42, x: 80,  y: 85,  opacity: 0.25 },
  { src: '/figures/Asset 9.svg', size: 76.545, x: -65, y: 130, opacity: 0.25 },
  { src: '/figures/Asset 6.svg', size: 60, x: 75,  y: 220, opacity: 0.25 },
  { src: '/figures/Asset 11.svg', size: 54.15, x: -40, y: 310, opacity: 0.25 },
  { src: '/figures/Asset 7.svg', size: 72, x: 70,  y: 400, opacity: 0.20 },
  { src: '/figures/Asset 8.svg', size: 54, x: -50, y: 480, opacity: 0.20 },
  { src: '/figures/Asset 6.svg', size: 66, x: 65,  y: 570, opacity: 0.20 },
  { src: '/figures/Asset 9.svg', size: 66.339, x: -55, y: 660, opacity: 0.18 },
  { src: '/figures/Asset 11.svg', size: 54.15, x: 72,  y: 750, opacity: 0.18 },
  { src: '/figures/Asset 7.svg', size: 84, x: -60, y: 850, opacity: 0.15 },
]

const mobileFigureOverrides = {
  2: { y: 180, size: 81 },
  3: { y: 330 },
  4: { y: 410, size: 60 },
  5: { y: 520 },
  6: { y: 625 },
  7: { y: 735 },
  8: { y: 845, size: 70.2 },
  9: { y: 965, size: 60 },
  10: { y: 1095 },
}

const mobileExtraFigures = [
  { src: '/figures/Asset 8.svg', size: 50, x: 68, y: 1230, opacity: 0.14 },
  { src: '/figures/Asset 11.svg', size: 62, x: -52, y: 1370, opacity: 0.12 },
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
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  )

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

  useEffect(() => {
    const handleResize = () => setIsMobileViewport(window.innerWidth < 768)
    window.addEventListener('resize', handleResize, { passive: true })
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const activeSpeed = isVisible ? 0.65 : 0
  const activeFigures = isMobileViewport
    ? [
      ...figures.map((fig, index) => ({
        ...fig,
        ...(mobileFigureOverrides[index] ?? {}),
      })),
      ...mobileExtraFigures,
    ]
    : figures
  const rootClassName = isLogin
    ? `pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden ${className}`
    : `pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`

  return (
    <div
      ref={wrapperRef}
      id="shader-background-root"
      className={rootClassName}
      style={{ height: isLogin ? '100%' : '100vh' }}
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
        <div
          id="shader-background-track"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            willChange: 'transform',
          }}
        >
          <BackgroundStatic />
          {activeFigures.map((fig, i) => (
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
      )}
    </div>
  )
}
