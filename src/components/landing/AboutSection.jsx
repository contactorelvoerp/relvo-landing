import { Reveal } from './Reveal'
import { useIsMobile } from '../../hooks/useIsMobile'

// Dead space in each animation as % of video width (1080x1080).
const animDeadSpace = [
  { left: 11, right: 11, top: 24, bottom: 24 }, // complex-pricing
  { left: 7,  right: 8,  top: 31, bottom: 30 }, // inv-calculation
  { left: 7,  right: 7,  top: 26, bottom: 26 }, // approvals
  { left: 17, right: 17, top: 7,  bottom: 17 }, // conciliation
]

export const AboutSection = ({ t }) => {
  const features = t.features ?? []
  const isMobile = useIsMobile()

  return (
    <section className="section-shell px-4 pb-32 pt-32 sm:px-6 sm:pb-40 sm:pt-40 md:pb-48 md:pt-48 lg:pb-56 lg:pt-56">
      <h2
        className="mx-auto mb-16 text-center md:mb-8"
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
            idx === 2 ? 'md:grid-cols-[1fr_2fr]' :
            idx === 3 ? 'md:grid-cols-[2fr_5fr]' :
            idx % 2 === 0 ? 'md:grid-cols-[3fr_2fr]' : 'md:grid-cols-[2fr_3fr]'
          return (
            <Reveal
              key={`${idx}-${feature.title}`}
              delayMs={idx * 70}
              className={`grid items-center gap-0 sm:gap-1 md:gap-4 lg:gap-5 ${idx === 1 ? '!mt-20 md:!mt-4' : ''} ${idx === 2 ? '!mt-20 md:!-mt-12' : ''} ${idx === 3 ? '!mt-28 md:!-mt-4' : ''} ${gridCols}`}
            >
              {/* Text — stacks on mobile, alternates on desktop */}
              <div className={`flex w-full flex-col justify-center px-2 sm:px-0 ${idx % 2 === 0 ? 'md:order-1' : 'md:order-2 md:items-end md:text-right'}`}>
                <h3
                  className="max-w-[18ch]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
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
                    fontSize: 'clamp(0.95rem, 1.4vw, 1.2rem)',
                    lineHeight: 1.5,
                    color: 'var(--text-soft)',
                  }}
                >
                  {feature.description}
                </p>
              </div>

              {/* Animation — full width on mobile, alternates on desktop */}
              <div
                className={`${idx === 3 ? '-mt-8' : 'mt-4'} overflow-hidden sm:-mt-8 md:mt-0 ${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}
                style={{ overflow: 'hidden' }}
              >
                <video
                  key={isMobile ? feature.iosSrc : feature.videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  ref={(el) => { if (el) el.playbackRate = 0.85 }}
                  className={`w-full ${idx === 2 ? 'scale-95 md:scale-100' : ''} ${idx === 3 ? 'scale-75 md:scale-100' : ''} ${isMobile ? '' : `flush-anim-${idx}`}`}
                  style={{ background: 'transparent' }}
                  src={isMobile && feature.iosSrc ? feature.iosSrc : feature.videoSrc}
                />
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
