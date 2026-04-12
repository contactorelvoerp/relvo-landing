import { Reveal } from './Reveal'

// Dead space in each animation as % of video width (1080x1080).
const animDeadSpace = [
  { left: 11, right: 11, top: 24, bottom: 24 }, // complex-pricing
  { left: 7,  right: 8,  top: 31, bottom: 30 }, // inv-calculation
  { left: 7,  right: 7,  top: 26, bottom: 26 }, // approvals
  { left: 17, right: 17, top: 7,  bottom: 17 }, // conciliation
]

export const AboutSection = ({ t }) => {
  const features = t.features ?? []

  return (
    <section className="section-shell px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:py-28">
      <h2
        className="mx-auto mb-16 text-center md:-mb-20"
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
      <div className="mx-auto max-w-6xl [&>*+*]:-mt-4 sm:[&>*+*]:-mt-12 md:[&>*+*]:-mt-40 lg:[&>*+*]:-mt-60">
        {features.map((feature, idx) => {
          const dead = animDeadSpace[idx] || { left: 0, right: 0, top: 0, bottom: 0 }

          return (
            <Reveal
              key={`${idx}-${feature.title}`}
              delayMs={idx * 70}
              className={`grid items-center gap-0 sm:gap-1 md:gap-4 lg:gap-5 ${idx === 1 ? 'md:!-mt-52' : ''} ${idx === 2 ? 'md:!-mt-52' : ''} ${idx === 3 ? 'md:!-mt-52' : ''} ${
                idx === 3 ? 'md:grid-cols-[5fr_7fr]' : idx === 2 ? 'md:grid-cols-[1fr_2fr]' : idx % 2 === 0 ? 'md:grid-cols-[2fr_3fr]' : 'md:grid-cols-[3fr_2fr]'
              }`}
            >
              {/* Text — stacks on mobile, alternates on desktop */}
              <div className={`flex w-full flex-col justify-center px-2 sm:px-0 ${idx % 2 === 0 ? 'md:order-1' : 'md:order-2 md:items-end md:text-right'}`}>
                <h3
                  className="max-w-[18ch]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
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
                    fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                    lineHeight: 1.5,
                    color: 'var(--text-soft)',
                  }}
                >
                  {feature.description}
                </p>
              </div>

              {/* Animation — full width on mobile, alternates on desktop */}
              <div
                className={`-mt-6 overflow-hidden sm:-mt-4 md:mt-0 ${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}
                style={{ overflow: 'hidden' }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  ref={(el) => { if (el) el.playbackRate = 0.85 }}
                  className="w-full"
                  style={{
                    background: 'transparent',
                    marginLeft: idx === 3 ? '0' : idx % 2 === 0 ? `${dead.right}%` : `-${dead.left}%`,
                    marginRight: idx === 3 ? '0' : idx % 2 === 0 ? `-${dead.right}%` : `${dead.left}%`,
                  }}
                  src={feature.videoSrc}
                />
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
