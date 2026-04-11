import { FileEdit, ClipboardCheck, FileText, CircleDollarSign, Landmark } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Contract-to-Cash animated flowchart.
 *
 * Recreates the Hera animation in pure CSS/JS:
 * - 5 cards appear static
 * - Glow activates each card sequentially (left to right)
 * - Arrows + traveling dots appear between cards as flow progresses
 * - Glow merges cards into one expanding blob
 * - Holds fully lit, then fades out and resets
 */

const steps = [
  { icon: FileEdit, label: 'Contrato firmado' },
  { icon: ClipboardCheck, label: 'Aprobación OC' },
  { icon: FileText, label: 'Factura emitida' },
  { icon: CircleDollarSign, label: 'Cobranza gestionada' },
  { icon: Landmark, label: 'Cobro realizado' },
]

// Timing: when each step activates (in seconds)
const STEP_DELAY = 0.8 // time between each step activation
const HOLD_TIME = 1.5 // hold all-lit state
const FADE_TIME = 0.8 // fade out duration
const PAUSE_TIME = 1.0 // pause before restart
const TOTAL = steps.length * STEP_DELAY + HOLD_TIME + FADE_TIME + PAUSE_TIME

export const ContractToCash = ({ className = '' }) => {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    let start = performance.now()
    let raf

    const tick = (now) => {
      const t = ((now - start) / 1000) % TOTAL
      setElapsed(t)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Which steps are active
  const activeCount = Math.min(
    steps.length,
    Math.floor(elapsed / STEP_DELAY) + (elapsed > 0.1 ? 1 : 0)
  )

  // Global fade: after all steps + hold, fade out
  const fadeStart = steps.length * STEP_DELAY + HOLD_TIME
  const globalOpacity = elapsed > fadeStart
    ? Math.max(0, 1 - (elapsed - fadeStart) / FADE_TIME)
    : elapsed < 0.1 ? 0 : 1

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center justify-center gap-0">
        {steps.map((step, i) => {
          const isActive = i < activeCount
          const activationTime = i * STEP_DELAY
          const stepElapsed = Math.max(0, elapsed - activationTime)
          // Card glow grows in over 0.4s
          const glowIntensity = isActive ? Math.min(1, stepElapsed / 0.4) : 0
          const cardGlowOpacity = glowIntensity * globalOpacity

          return (
            <div key={step.label} className="flex items-center">
              {/* Card with glow */}
              <div className="relative">
                {/* Glow layers — concentric rings */}
                {cardGlowOpacity > 0 && (
                  <>
                    {/* Outermost glow — green */}
                    <div
                      className="absolute rounded-2xl"
                      style={{
                        inset: '-18px',
                        background: '#72DDAA',
                        opacity: cardGlowOpacity * 0.5,
                        filter: 'blur(6px)',
                        transition: 'opacity 0.3s',
                      }}
                    />
                    {/* Mid glow — bright green */}
                    <div
                      className="absolute rounded-2xl"
                      style={{
                        inset: '-13px',
                        background: '#A8FF3E',
                        opacity: cardGlowOpacity * 0.7,
                        filter: 'blur(3px)',
                        transition: 'opacity 0.3s',
                      }}
                    />
                    {/* Inner glow — neon yellow */}
                    <div
                      className="absolute rounded-xl"
                      style={{
                        inset: '-8px',
                        background: '#D0FF0B',
                        opacity: cardGlowOpacity * 0.9,
                        filter: 'blur(1px)',
                        transition: 'opacity 0.3s',
                      }}
                    />
                    {/* Core fill */}
                    <div
                      className="absolute rounded-xl"
                      style={{
                        inset: '-4px',
                        background: '#D0FF0B',
                        opacity: cardGlowOpacity,
                        transition: 'opacity 0.3s',
                      }}
                    />
                  </>
                )}

                {/* Card */}
                <div
                  className="relative flex flex-col items-center justify-center rounded-xl bg-white px-3 py-4 sm:px-5 sm:py-6"
                  style={{
                    minWidth: 'clamp(80px, 12vw, 140px)',
                    border: `1px solid ${isActive ? 'rgba(208,255,11,0.4)' : 'rgba(19,19,30,0.06)'}`,
                    boxShadow: isActive
                      ? `0 0 20px rgba(208,255,11,${0.3 * cardGlowOpacity})`
                      : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                >
                  <step.icon
                    className="mb-2"
                    size={24}
                    strokeWidth={1.5}
                    style={{
                      color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                      transition: 'color 0.3s',
                    }}
                  />
                  <span
                    className="text-center"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 'clamp(0.55rem, 1vw, 0.75rem)',
                      fontWeight: isActive ? 600 : 500,
                      lineHeight: 1.3,
                      color: isActive ? 'var(--text-main)' : 'var(--text-soft)',
                      transition: 'color 0.3s, font-weight 0.3s',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              </div>

              {/* Arrow + traveling dot */}
              {i < steps.length - 1 && (
                <div className="relative mx-1 flex items-center sm:mx-2">
                  {/* Arrow line */}
                  <div
                    className="h-px w-6 sm:w-8"
                    style={{
                      background: i < activeCount - 1
                        ? `rgba(208,255,11,${globalOpacity})`
                        : 'var(--border-strong)',
                      transition: 'background 0.3s',
                    }}
                  />
                  {/* Arrow head */}
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '3px solid transparent',
                      borderBottom: '3px solid transparent',
                      borderLeft: i < activeCount - 1
                        ? `5px solid rgba(208,255,11,${globalOpacity})`
                        : '5px solid var(--border-strong)',
                      transition: 'border-left-color 0.3s',
                    }}
                  />
                  {/* Traveling dot */}
                  {i < activeCount - 1 && (
                    <div
                      className="absolute top-1/2 h-1.5 w-1.5 rounded-full"
                      style={{
                        background: '#D0FF0B',
                        boxShadow: '0 0 6px #D0FF0B',
                        opacity: globalOpacity,
                        transform: 'translateY(-50%)',
                        left: '0%',
                        animation: `c2c-dot 0.5s ease-out forwards`,
                        animationDelay: `${(i + 1) * STEP_DELAY - 0.3}s`,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes c2c-dot {
          0% { left: 0%; opacity: 1; }
          100% { left: calc(100% - 6px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
