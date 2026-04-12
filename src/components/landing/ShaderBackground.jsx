import { RelvoGradient } from '../../shaders/RelvoGradient'
import { LoginGradient } from '../../shaders/LoginGradient'

/**
 * Full-page animated grain gradient background.
 * Supports 'landing' (default) and 'login' variants.
 */

// ── Hypotrochoid figure config (landing only) ──
// size: vw, x/y: vw position, opacity: 0–1
const figures = [
  { src: '/figures/Asset 7.svg', size: 100, x: -85, y: -40,  opacity: 0.30 },
  { src: '/figures/Asset 8.svg', size: 35, x: 80,  y: 85,  opacity: 0.25 },
  { src: '/figures/Asset 6.svg', size: 50, x: 75,  y: 220, opacity: 0.25 },
  { src: '/figures/Asset 9.svg', size: 75, x: -65, y: 130, opacity: 0.25 },
  { src: '/figures/Asset 11.svg', size: 50, x: -40, y: 310, opacity: 0.25 },
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
  maxPixelCount: 2560 * 1440 * 2,
  minPixelRatio: 2,
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

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden ${className}`}
      style={{ height: '100%' }}
    >
      {isLogin ? (
        <LoginGradient
          speed={0.65}
          rotation={-180}
          blobCount={2}
          blobSize={0.80}
          blobScale={1.0}
          {...shaderProps}
        />
      ) : (
        <RelvoGradient
          speed={0.65}
          rotation={-180}
          blobCount={6}
          blobSize={0.80}
          blobScale={1.0}
          {...shaderProps}
        />
      )}

      {!isLogin && figures.map((fig, i) => (
        <img
          key={i}
          src={fig.src}
          alt=""
          aria-hidden="true"
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
