import { Container, Reveal } from '../primitives'
import { Aura, Grain } from '../Texture'
import { WaitlistForm } from '../WaitlistForm'
import { trackScheduleDemo } from '../../../utils/analytics'

const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'

export const ClosingCta = ({ t }) => (
  <section id="cierre" className="py-14 sm:py-20">
    <Container>
      <Reveal>
        <div className="glass-block px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          {/* Lime/deep-green auras + grain, contained inside the block */}
          <Aura color="#D0FF0B" size={560} opacity={0.15} blur={100} className="-left-32 top-1/2 -translate-y-1/2" />
          <Aura color="#186666" size={460} opacity={0.5} blur={95} className="bottom-[-25%] right-[6%]" />
          <Grain opacity={0.07} />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <h2
                className="max-w-xl font-sans font-medium tracking-[-0.02em] text-white"
                style={{ fontSize: 'var(--text-h2)', lineHeight: 1.1 }}
              >
                {t.closing.title}
              </h2>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href={calendlyHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackScheduleDemo('closing_cta')}
                  className="glass-chip inline-flex min-h-12 cursor-pointer items-center justify-center rounded-[var(--radius-button)] border border-white/20 px-7 font-sans text-base font-medium text-white transition-all duration-200 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  {t.closing.ctaSecondary}
                </a>
              </div>
            </div>

            <div id="start" className="scroll-mt-28 rounded-[var(--radius-lg)] bg-white p-6 shadow-[0_32px_80px_rgba(0,0,0,0.4)] sm:p-8">
              <h3 className="font-sans text-[1.375rem] font-semibold tracking-[-0.01em] text-ink">{t.form.title}</h3>
              <p className="mb-6 mt-1.5 font-sans text-[0.9375rem] leading-relaxed text-ink-soft">{t.form.subtitle}</p>
              <WaitlistForm t={t} source="start_free" />
            </div>
          </div>
        </div>
      </Reveal>
    </Container>
  </section>
)
