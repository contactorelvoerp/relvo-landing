import { Reveal } from './Reveal'

export const SocialProofSection = ({ t }) => {
  const benefits = t.benefits ?? []

  return (
    <section className="py-20 sm:py-28">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-6xl">
          {/* Title — Fujiwara */}
          <h2
            className="mx-auto mb-12 max-w-4xl text-center sm:mb-16"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#000000',
            }}
          >
            {t.benefitsTitle}
          </h2>

          <div className="grid items-stretch gap-5 md:grid-cols-3 md:gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={`${idx}-${benefit.title}`}
                className="flex h-full flex-col rounded-xl bg-white/50 p-6 backdrop-blur-sm sm:p-8"
                style={{ border: '1px solid rgba(19,19,30,0.06)' }}
              >
                {/* Number — Geist Mono */}
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    color: 'var(--text-muted)',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </p>

                {/* Title — Instrument Sans */}
                <h3
                  className="mt-4"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'clamp(1.1rem, 1.6vw, 1.3rem)',
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
                  className="mt-3"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
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
