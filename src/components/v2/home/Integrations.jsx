import { Container, SectionTag, Reveal } from '../primitives'
import { Scene } from './FeatureVisuals'

const monoXs = 'font-mono text-[0.58rem] uppercase tracking-[0.08em]'

/* Tabbed box, Autumn-style (YOUR APPLICATION / PAYMENT PROCESSOR) */
const TabBox = ({ tab, children, dark = false }) => (
  <div className="w-full">
    <span
      className={`${monoXs} inline-block rounded-t-[4px] border border-b-0 px-2 py-1 font-medium ${
        dark ? 'text-ink' : 'border-[var(--border-strong)] bg-white text-ink-soft'
      }`}
      style={dark ? { borderColor: '#13131E', background: '#72DDAA' } : undefined}
    >
      {tab}
    </span>
    <div
      className={`rounded-[var(--radius-sm)] rounded-tl-none border ${
        dark
          ? 'bg-ink shadow-[0_16px_40px_rgba(19,19,30,0.25)]'
          : 'border-[var(--border-strong)] bg-white shadow-[0_1px_2px_rgba(19,19,30,0.04)]'
      }`}
      style={dark ? { borderColor: '#13131E' } : undefined}
    >
      {children}
    </div>
  </div>
)

/* Dashed connector with endpoint squares */
const Flow = ({ flip = false, className = '' }) => (
  <svg viewBox="0 0 52 10" className={`h-2.5 w-full min-w-[24px] ${className}`.trim()} aria-hidden="true" preserveAspectRatio="none">
    <path
      d="M4 5 H48"
      stroke="#633BF2"
      strokeWidth="1.3"
      strokeDasharray="4 4"
      style={{ animation: `v2-flow 1.4s linear infinite ${flip ? 'reverse' : ''}` }}
    />
    <rect x="0" y="2.5" width="5" height="5" fill="#633BF2" />
    <rect x="47" y="2.5" width="5" height="5" fill="#633BF2" />
  </svg>
)

const GroupBox = ({ group }) => (
  <TabBox tab={group.label}>
    <div className="flex flex-wrap gap-1.5 p-2.5">
      {group.items.map((item) => (
        <span key={item} className="rounded-[4px] border border-[var(--border-default)] bg-[#FBFBFA] px-2 py-1.5 font-mono text-[0.7rem] text-ink">
          {item}
        </span>
      ))}
    </div>
  </TabBox>
)

export const Integrations = ({ t }) => {
  const [payments, banks, erp, crm] = t.integrations.groups

  return (
    <section id="integraciones" className="bg-[#FBFBF9]">
      <SectionTag accent="mint">{t.integrations.eyebrow}</SectionTag>
      <Container className="py-16 sm:py-20 lg:py-24">
        <Reveal>
          <div className="text-center">
            <h2
              className="font-sans font-medium tracking-[-0.02em] text-ink"
              style={{ fontSize: 'var(--text-h3)', lineHeight: 1.2 }}
            >
              {t.integrations.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-sans text-[0.9375rem] leading-relaxed text-muted-aa">
              {t.integrations.line}
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={120}>
          <Scene accent="mint" className="mt-12 p-5 sm:p-8">
            {/* Desktop: [group][flow][RELVO][flow][group] × 2 */}
            <div className="hidden items-center gap-2 lg:grid lg:grid-cols-[1fr_56px_auto_56px_1fr] lg:gap-y-8">
              <GroupBox group={payments} />
              <Flow />
              <div className="row-span-2 self-center px-1">
                <TabBox tab={t.integrations.hubLabel} dark>
                  <div className="flex flex-col items-center gap-2 px-7 py-8">
                    <img src="/logo-mark-light.svg" alt="" aria-hidden="true" className="h-8 w-auto" />
                    <img src="/relvo-wordmark-light.svg" alt="Relvo" className="h-4 w-auto" />
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mint-brand animate-pulse-soft" aria-hidden="true" />
                  </div>
                </TabBox>
              </div>
              <Flow flip />
              <GroupBox group={erp} />

              <GroupBox group={banks} />
              <Flow />
              <Flow flip />
              <GroupBox group={crm} />
            </div>

            {/* Mobile / tablet: hub on top, groups below */}
            <div className="lg:hidden">
              <div className="mx-auto mb-5 w-fit">
                <TabBox tab={t.integrations.hubLabel} dark>
                  <div className="flex items-center gap-2.5 px-6 py-4">
                    <img src="/logo-mark-light.svg" alt="" aria-hidden="true" className="h-6 w-auto" />
                    <img src="/relvo-wordmark-light.svg" alt="Relvo" className="h-3.5 w-auto" />
                    <span className="h-1.5 w-1.5 rounded-full bg-mint-brand animate-pulse-soft" aria-hidden="true" />
                  </div>
                </TabBox>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {t.integrations.groups.map((group) => (
                  <GroupBox key={group.id} group={group} />
                ))}
              </div>
            </div>
          </Scene>
        </Reveal>
      </Container>
    </section>
  )
}
