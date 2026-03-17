import { ButtonLink } from './ButtonLink'

export const HeroSection = ({ ctaHref, t }) => {
  return (
    <section className="hero-shell section-shell relative flex min-h-[calc(100vh-110px)] items-center bg-white pb-12 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10">      
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
        <div className="flex max-w-[36rem] flex-col lg:max-w-[38rem]">
          <p className="eyebrow-compact">{t.heroEyebrow}</p>

          <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(2.65rem,5.4vw,5rem)] leading-[0.96] tracking-[-0.05em] text-[var(--text-main)] lg:min-h-[3.2em]">
            {t.heroTitle}
          </h1>

          <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--text-muted)] sm:text-xl">
            {t.heroDescription}
          </p>

          <p className="mt-4 text-sm leading-6 text-[var(--text-soft)]">
            {t.heroSupport}
          </p>

          <div className="mt-6">
            <ButtonLink
              href={ctaHref}
              external
              variant="primary"
              className="group px-6 py-3.5 text-base font-medium shadow-[0_20px_45px_rgba(16,16,14,0.12)]"
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
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-black/[0.08] bg-white shadow-[0_20px_50px_rgba(16,16,14,0.08)]">
            <div className="border-b border-black/[0.06] px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                    {t.panelEyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-[1.8rem] tracking-[-0.04em] text-[var(--text-main)]">
                    {t.panelTitle}
                  </h2>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/15 bg-emerald-600/8 px-3 py-1 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  {t.panelStatus}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/[0.06] bg-[var(--surface-subtle)] px-4 py-4">
                  <p className="text-xs font-semibold text-[var(--text-soft)]">
                    {t.contractLabel}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-main)]">
                    {t.contractName}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {t.contractMeta}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.06] bg-[var(--surface-subtle)] px-4 py-4">
                  <p className="text-xs font-semibold text-[var(--text-soft)]">
                    {t.pricingLabel}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-main)]">
                    {t.pricingValue}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.06] bg-[var(--surface-subtle)] px-4 py-4">
                  <p className="text-xs font-semibold text-[var(--text-soft)]">
                    {t.usageLabel}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--text-main)]">
                    {t.usageValue}
                  </p>
                </div>

                <div className="rounded-2xl border border-black/[0.06] bg-[var(--surface-subtle)] px-4 py-4">
                  <p className="text-xs font-semibold text-[var(--text-soft)]">
                    {t.chargesLabel}
                  </p>
                  <p className="mt-2 text-base font-semibold text-[var(--text-main)]">
                    {t.chargesValue}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[1.5rem] border border-black/[0.06] bg-[var(--surface-subtle)] p-4">
                <p className="text-xs font-semibold text-[var(--text-soft)]">
                  {t.revenueStatusLabel}
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-[var(--text-soft)]">
                      {t.collectedLabel}
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-main)]">
                      {t.collectedValue}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--text-soft)]">
                      {t.pendingLabel}
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-main)]">
                      {t.pendingValue}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--text-soft)]">
                      {t.riskLabel}
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-main)]">
                      {t.riskValue}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}