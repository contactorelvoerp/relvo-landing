import { Reveal } from './Reveal'
import { useIsMobile } from '../../hooks/useIsMobile'

// Dead space in each animation as % of video width (1080x1080).
const animDeadSpace = [
  { left: 11, right: 11, top: 24, bottom: 24 }, // complex-pricing
  { left: 7,  right: 8,  top: 31, bottom: 30 }, // inv-calculation
  { left: 0,  right: 0.7, top: 26, bottom: 26 }, // approvals v2 — hair of right bleed
  { left: 17, right: 17, top: 7,  bottom: 17 }, // conciliation
]

// Detect iOS devices (including iPads masquerading as Mac in iPadOS 13+).
// Every browser on iOS uses the system WebKit, so VP9+alpha webm fails
// regardless of the browser brand — we have to serve the mp4 fallback
// whenever the device is iOS.
const detectIsIOS = () => {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod/.test(ua)) return true
  // iPadOS 13+ reports as "Mac" in UA but has touch input.
  if (/Mac/.test(ua) && navigator.maxTouchPoints > 1) return true
  return false
}

export const AboutSection = ({ t }) => {
  const features = t.features ?? []
  const isMobile = useIsMobile()
  const isIOS = detectIsIOS()
  // Whether to serve static stills instead of the animated videos.
  // Currently: iOS devices (WebKit can't play transparent webm reliably).
  // Future: also low-end devices where animated playback janks.
  const useStills = isIOS

  return (
    <section className="section-shell px-4 pb-32 pt-32 sm:px-6 sm:pb-40 sm:pt-40 md:pb-48 md:pt-48 lg:pb-56 lg:pt-56">
      <h2
        className="mx-auto mb-16 text-center md:mb-24 lg:mb-32"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
          fontWeight: 300,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: '#000000',
        }}
      >
        Nuestro Producto
      </h2>
      <div className="mx-auto max-w-6xl [&>*+*]:-mt-4 sm:[&>*+*]:-mt-12 md:[&>*+*]:-mt-20 lg:[&>*+*]:-mt-28">
        {features.map((feature, idx) => {
          // Approval workflow (idx=2) gets a wider column for the animation
          // since its content is inherently small. Other features (0, 1, 3)
          // got tighter animation columns and more space for text.
          const gridCols =
            idx === 0 ? 'md:grid-cols-[2fr_3fr]' :
            idx === 1 ? 'md:grid-cols-[3fr_2fr]' :
            idx === 2 ? 'md:grid-cols-[5fr_8fr]' :
            idx === 3 ? 'md:grid-cols-[5fr_6fr]' :
            'md:grid-cols-[2fr_3fr]'
          return (
            <Reveal
              key={`${idx}-${feature.title}`}
              delayMs={idx * 70}
              className={`grid items-center gap-0 sm:gap-1 md:gap-4 lg:gap-5 ${idx === 1 ? '!mt-20 md:!mt-40 lg:!mt-52' : ''} ${idx === 2 ? '!mt-20 md:!mt-40 lg:!mt-52' : ''} ${idx === 3 ? '!mt-28 md:!mt-32 lg:!mt-40' : ''} ${gridCols}`}
            >
              {/* Text — stacks on mobile, alternates on desktop */}
              <div className={`flex w-full flex-col justify-center px-2 sm:px-0 ${idx % 2 === 0 ? 'md:order-1' : 'md:order-2 md:items-end md:text-right'}`}>
                <h3
                  className="max-w-[18ch]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)',
                    fontWeight: 300,
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-main)',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mt-3 whitespace-pre-line sm:mt-4"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'clamp(1.1rem, 1.7vw, 1.45rem)',
                    lineHeight: 1.5,
                    color: 'var(--text-soft)',
                  }}
                >
                  {feature.description}
                </p>
              </div>

              {/* Animation — full width on mobile, alternates on desktop.
                  For features 1-3 (idx 0-2) collapse the transparent
                  dead space above/below the animation with negative
                  margins sized in vw (scaled from animDeadSpace). */}
              <div
                className={`${idx === 3 ? '-mt-4 sm:-mt-16 md:-mt-12' : ''} overflow-hidden ${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}
                style={{
                  overflow: 'hidden',
                  ...(idx < 3
                    ? {
                        // Mobile: less negative top for anims 1 & 2 so they
                        // sit a bit lower (more breathing room above).
                        marginTop:
                          isMobile && idx <= 2
                            ? `-${animDeadSpace[idx].top * 0.55}vw`
                            : `-${animDeadSpace[idx].top * 0.7}vw`,
                        marginBottom: `-${animDeadSpace[idx].bottom * 0.7}vw`,
                      }
                    : {}),
                }}
              >
                {useStills && feature.stillSrc ? (
                  <img
                    src={feature.stillSrc}
                    alt=""
                    className={`w-full ${idx === 0 || idx === 1 ? 'scale-[1.18] md:scale-100' : ''} ${idx === 3 ? 'scale-110 md:scale-100' : ''} ${isMobile ? '' : `flush-anim-${idx}`}`}
                    style={{ background: 'transparent' }}
                  />
                ) : (
                  <video
                    key={feature.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    ref={(el) => { if (el) el.playbackRate = 0.85 }}
                    className={`w-full ${idx === 0 || idx === 1 ? 'scale-[1.18] md:scale-100' : ''} ${idx === 3 ? 'scale-110 md:scale-100' : ''} ${isMobile ? '' : `flush-anim-${idx}`}`}
                    style={{ background: 'transparent' }}
                  >
                    <source src={feature.videoSrc} type="video/webm" />
                    {feature.iosSrc && <source src={feature.iosSrc} type="video/mp4" />}
                  </video>
                )}
              </div>
            </Reveal>
          )
        })}
      </div>

      <style>{`
        @media (min-width: 768px) {
          ${features.map((_, idx) => {
            const dead = animDeadSpace[idx] || { left: 0, right: 0 }
            if (idx === 3) return ''
            const ml = idx % 2 === 0 ? `${dead.right}%` : `-${dead.left}%`
            const mr = idx % 2 === 0 ? `-${dead.right}%` : `${dead.left}%`
            return `.flush-anim-${idx} { margin-left: ${ml}; margin-right: ${mr}; }`
          }).join('\n          ')}
        }
      `}</style>
    </section>
  )
}
