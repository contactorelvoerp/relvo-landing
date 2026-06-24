import { Reveal } from './Reveal'

export const SocialProofSection = ({ t }) => {
  const benefits = t.benefits ?? []

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-28">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-6xl">
          {/* Title */}
          <h2
            className="mx-auto mb-10 max-w-4xl text-center sm:mb-12 md:mb-16"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(1.75rem, 3.4vw, 2.75rem)',
              fontWeight: 500,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: 'var(--text-main)',
            }}
          >
            {t.benefitsTitle}
          </h2>

          <div className="grid items-stretch gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={`${idx}-${benefit.title}`}
                className="flex h-full flex-col rounded-[var(--radius-lg)] bg-white p-5 transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(19,19,30,0.07)] sm:p-6 md:p-8"
                style={{ border: '1px solid rgba(19,19,30,0.1)', boxShadow: '0 1px 4px rgba(19,19,30,0.04)' }}
              >
                {/* Number — Geist Mono */}
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    color: 'var(--text-muted)',
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </p>

                {/* Title — Instrument Sans */}
                <h3
                  className="mt-3"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                    fontWeight: 500,
                    lineHeight: 1.2,
                    letterSpacing: '-0.025em',
                    color: 'var(--text-main)',
                  }}
                >
                  {benefit.title}
                </h3>

                {/* Description — Instrument Sans */}
                <p
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.9rem',
                    fontWeight: 400,
                    lineHeight: 1.65,
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
