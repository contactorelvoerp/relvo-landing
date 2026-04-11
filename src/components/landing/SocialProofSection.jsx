import { Reveal } from './Reveal'

export const SocialProofSection = ({ t }) => {
  const benefits = t.benefits ?? []

  return (
    <section className="py-14 sm:py-16">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[var(--radius-2xl)] px-6 py-10 shadow-[0_20px_50px_rgba(61,61,61,0.10)] sm:px-10 sm:py-12">
            <h2 className="mx-auto mb-6 max-w-4xl text-center text-[clamp(1.75rem,2.35vw,2.35rem)] font-semibold leading-[1.14] tracking-[-0.035em] text-[var(--text-main)] sm:mb-8">
              {t.benefitsTitle}
            </h2>
            <div className="grid items-stretch gap-4 md:grid-cols-3">
              {benefits.map((benefit, idx) => (
                <div
                  key={`${idx}-${benefit.title}`}
                  className="flex h-full flex-col rounded-[var(--radius-lg)] border border-black/[0.06] bg-white/60 p-5 sm:p-6 backdrop-blur-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">
                    {String(idx + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 min-h-[3rem] text-lg font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--text-main)]">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.55] text-[var(--text-muted)] sm:text-[15px]">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
