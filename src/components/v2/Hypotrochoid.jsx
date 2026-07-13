import { useMemo } from 'react'

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))

/**
 * Relvo's signature spirograph line figure, generated parametrically.
 * x(t) = (R−r)·cos t + d·cos(((R−r)/r)·t)
 * y(t) = (R−r)·sin t − d·sin(((R−r)/r)·t)
 *
 * Rendered as thin, low-opacity ambient line art. One per section max.
 */
export const Hypotrochoid = ({
  R = 120,
  r = 37,
  d = 85,
  stroke = '#D0FF0B',
  strokeWidth = 1,
  opacity = 0.5,
  size = 640,
  drift = true,
  driftDuration = 120,
  glow = false,
  className = '',
  style = {},
}) => {
  const path = useMemo(() => {
    const revolutions = r / gcd(Math.round(R), Math.round(r))
    const tMax = 2 * Math.PI * revolutions
    const steps = Math.max(720, Math.round(revolutions * 240))
    const pts = []
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tMax
      const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t)
      const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t)
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
    }
    return `M${pts.join('L')}Z`
  }, [R, r, d])

  const extent = R - r + d + strokeWidth * 4
  const viewBox = `${-extent} ${-extent} ${extent * 2} ${extent * 2}`

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`.trim()}
      style={{ opacity, ...style }}
    >
      <g
        style={
          drift
            ? { animation: `v2-drift ${driftDuration}s linear infinite`, transformOrigin: 'center' }
            : undefined
        }
      >
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          style={glow ? { filter: `drop-shadow(0 0 6px ${stroke})` } : undefined}
        />
      </g>
    </svg>
  )
}
