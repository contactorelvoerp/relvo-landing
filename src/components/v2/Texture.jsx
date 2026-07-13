/* Background texture system — structured grid + soft color auras + film grain.
   Replaces floating line figures: nothing gets cropped, everything is atmosphere. */

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")"

/* Fine grid + stronger major lines every 4 cells, fading out via radial mask —
   the "imperfect mesh" (Cartesia/Stripe) rather than a hard uniform grid. */
export const GridField = ({
  dark = false,
  size = 56,
  mask = 'radial-gradient(ellipse 90% 75% at 50% 0%, black 25%, transparent 78%)',
  className = '',
}) => {
  const fine = dark ? 'rgba(255,255,255,0.045)' : 'rgba(19,19,30,0.045)'
  const major = dark ? 'rgba(255,255,255,0.075)' : 'rgba(19,19,30,0.08)'
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`.trim()}
      style={{
        backgroundImage: [
          `linear-gradient(to right, ${fine} 1px, transparent 1px)`,
          `linear-gradient(to bottom, ${fine} 1px, transparent 1px)`,
          `linear-gradient(to right, ${major} 1px, transparent 1px)`,
          `linear-gradient(to bottom, ${major} 1px, transparent 1px)`,
        ].join(', '),
        backgroundSize: `${size}px ${size}px, ${size}px ${size}px, ${size * 4}px ${size * 4}px, ${size * 4}px ${size * 4}px`,
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    />
  )
}

/* Soft blurred color field from the brand palette. */
export const Aura = ({ color = '#72DDAA', size = 560, opacity = 0.4, blur = 90, className = '', style = {} }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute rounded-full ${className}`.trim()}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: `blur(${blur}px)`,
      opacity,
      ...style,
    }}
  />
)

/* Diagonal hatch — Stripe-style corner texture (thin 45° lines in an accent color) */
export const hatch = (color, alpha = '22') =>
  `repeating-linear-gradient(45deg, ${color}${alpha} 0px, ${color}${alpha} 1px, transparent 1px, transparent 7px)`

/* Tiny dot grid — Autumn-style soft band texture */
export const dots = (color = 'rgba(19,19,30,0.14)', size = 9) => ({
  backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
  backgroundSize: `${size}px ${size}px`,
})

/* Film grain over auras — the granular quality. Keep opacity very low. */
export const Grain = ({ opacity = 0.05, className = '' }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute inset-0 ${className}`.trim()}
    style={{ backgroundImage: NOISE_URI, backgroundSize: '160px 160px', opacity }}
  />
)
