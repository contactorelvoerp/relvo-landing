import { Reveal } from './Reveal'

// Dead space in each animation as % of video width (1080x1080).
// Used to apply negative margins so content sits flush with text.
// For even idx (anim on right): eat right dead space.
// For odd idx (anim on left): eat left dead space.
const animDeadSpace = [
  { left: 11, right: 11, top: 24, bottom: 24 }, // complex-pricing
  { left: 7,  right: 8,  top: 31, bottom: 30 }, // inv-calculation
  { left: 7,  right: 7,  top: 26, bottom: 26 }, // approvals
  { left: 17, right: 17, top: 7,  bottom: 17 }, // conciliation
]

export const AboutSection = ({ t }) => {
  const features = t.features ?? []

  return (
    <section className="section-shell py-20 sm:py-24 lg:py-28">
      <h2
        className="mx-auto -mb-12 text-center sm:-mb-20"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
          fontWeight: 300,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: '#000000',
        }}
      >
        Nuestro Producto
      </h2>
      <div className="mx-auto max-w-6xl [&>*+*]:-mt-40 sm:[&>*+*]:-mt-52 lg:[&>*+*]:-mt-60">
        {features.map((feature, idx) => {
          const dead = animDeadSpace[idx] || { left: 0, right: 0, top: 0, bottom: 0 }
          // Even idx: anim on right, eat right margin. Odd: anim on left, eat left margin.
          const flushSide = idx % 2 === 0 ? 'right' : 'left'

          return (
            <Reveal
              key={`${idx}-${feature.title}`}
              delayMs={idx * 70}
              className={`grid items-center gap-4 md:gap-4 lg:gap-5 ${idx === 1 ? '!-mt-52' : ''} ${idx === 2 ? '!-mt-52' : ''} ${idx === 3 ? '!-mt-52' : ''} ${
                idx === 3 ? 'md:grid-cols-[5fr_7fr]' : idx === 2 ? 'md:grid-cols-[1fr_2fr]' : idx % 2 === 0 ? 'md:grid-cols-[2fr_3fr]' : 'md:grid-cols-[3fr_2fr]'
              }`}
            >
              {/* Text — alternates sides */}
              <div className={`flex w-full flex-col justify-center ${idx % 2 === 0 ? 'md:order-1' : 'md:order-2 md:items-end md:text-right'}`}>
                <h3
                  className="max-w-[18ch]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                    fontWeight: 300,
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-main)',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  className="mt-4 whitespace-pre-line"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
                    lineHeight: 1.5,
                    color: 'var(--text-soft)',
                  }}
                >
                  {feature.description}
                </p>
              </div>

              {/* Animation — alternates sides, negative margins eat dead space */}
              <div
                className={`overflow-hidden ${idx % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}
                style={{
                  overflow: 'hidden',
                  // border: '2px solid red', // debug
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    background: 'transparent',
                    width: '100%',
                    // Even idx: anim on right → shift video right by right dead space
                    // Odd idx: anim on left → shift video left by left dead space
                    marginLeft: idx === 3 ? '0' : idx % 2 === 0 ? `${dead.right}%` : `-${dead.left}%`,
                    marginRight: idx === 3 ? '0' : idx % 2 === 0 ? `-${dead.right}%` : `${dead.left}%`,
                    // border: '2px solid blue', // debug
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
