import { ButtonLink } from './ButtonLink'

export const CTASection = ({ ctaHref, t, lang }) => {
  return (
    <section className="bg-white py-2">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-[2rem] border border-black/[0.06] bg-[var(--surface-subtle)] px-8 py-6 text-center shadow-[0_20px_50px_rgba(16,16,14,0.05)] sm:px-14">
          <h2 className="font-display text-[2.3rem] tracking-[-0.04em] text-[var(--text-main)] sm:text-[2.6rem]">
            {lang === 'es'
              ? 'Empieza a operar revenue con precisión'
              : 'Start operating revenue with precision'}
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-[var(--text-muted)]">
            {lang === 'es'
              ? 'Descubre cómo Relvo conecta contratos, pricing y uso para automatizar facturación y revenue.'
              : 'See how Relvo connects contracts, pricing and usage to automate billing and revenue.'}
          </p>

          <div className="mt-6">
            <ButtonLink
              href={ctaHref}
              external
              variant="primary"
              className="group px-7 py-3.5 text-base font-medium shadow-[0_18px_40px_rgba(16,16,14,0.12)]"
            >
              {t.navCta}
              <span
                aria-hidden="true"
                className="ml-2 transition-transform duration-200 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </ButtonLink>
          </div>

          <p className="mt-4 text-sm text-[var(--text-soft)]">
            {lang === 'es'
              ? 'Diseñado para B2B con pricing complejo.'
              : 'Built for B2B with complex pricing.'}
          </p>
        </div>
      </div>
    </section>
  )
}