import { Reveal } from './Reveal'

export const SocialProofSection = ({ t }) => {
  const benefits = t.benefits ?? []

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-28">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-6xl">
          {/* Title — Fujiwara */}
          <h2
            className="mx-auto mb-10 max-w-4xl text-center sm:mb-12 md:mb-16"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#000000',
            }}
          >
            {t.benefitsTitle}
          </h2>

          <div className="grid items-stretch gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={`${idx}-${benefit.title}`}
                className="flex h-full flex-col rounded-xl bg-white/50 p-5 backdrop-blur-sm sm:p-6 md:p-8"
                style={{ border: '1px solid rgba(19,19,30,0.06)' }}
              >
                {/* Number — Geist Mono */}
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    color: 'var(--text-muted)',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </p>

                {/* Title — Instrument Sans */}
                <h3
                  className="mt-3 sm:mt-4"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                    fontWeight: 600,
                    lineHeight: 1.25,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-main)',
                  }}
                >
                  {benefit.title}
                </h3>

                {/* Description — Instrument Sans */}
                <p
                  className="mt-2 sm:mt-3"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: 'var(--text-soft)',
                  }}
                >
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
