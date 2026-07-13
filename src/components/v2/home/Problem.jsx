import { Container, Eyebrow, SectionTag, Reveal } from '../primitives'
import { Aura, Grain } from '../Texture'
import { Scene } from './FeatureVisuals'

/* Mini app window — each fragment of the revenue stack looks like the real
   interface it lives in today. */
const MiniWindow = ({ title, tilt = 0, children }) => (
  <div
    className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white shadow-[0_1px_2px_rgba(19,19,30,0.04),0_10px_24px_rgba(19,19,30,0.06)]"
    style={{ transform: `rotate(${tilt}deg)` }}
  >
    <div className="flex items-center gap-1.5 border-b border-[var(--border-subtle)] bg-[#FBFBFA] px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-gray-brand" aria-hidden="true" />
      <span className="h-2 w-2 rounded-full bg-gray-brand" aria-hidden="true" />
      <span className="ml-1 truncate font-mono text-[0.6rem] uppercase tracking-[0.08em] text-muted-aa">{title}</span>
    </div>
    <div className="p-3">{children}</div>
  </div>
)

const mono = 'font-mono text-[0.62rem] uppercase tracking-[0.08em]'

export const Problem = ({ t, lang }) => {
  const L =
    lang === 'es'
      ? {
          pdf: 'contrato_acme_v3_FINAL.pdf',
          dash: 'dashboard — uso',
          dashMetric: '42.318 eventos',
          mail: 'inbox — aprobaciones',
          mail1: 'RE: RE: OC 4512 ¿aprobada?',
          mail1Meta: 'hace 6 días',
          mail2: 'Fwd: pre-factura marzo',
          mail2Meta: 'sin responder',
          sheet: 'facturación_2026.xlsx',
          disconnect: 'SIN CONEXIÓN',
          relvoTitle: 'relvo — panel',
          modules: ['Contratos', 'Uso', 'Aprobaciones', 'Facturación'],
          connected: 'Conectado',
        }
      : {
          pdf: 'acme_contract_v3_FINAL.pdf',
          dash: 'dashboard — usage',
          dashMetric: '42,318 events',
          mail: 'inbox — approvals',
          mail1: 'RE: RE: PO 4512 approved?',
          mail1Meta: '6 days ago',
          mail2: 'Fwd: march pre-invoice',
          mail2Meta: 'no reply',
          sheet: 'billing_2026.xlsx',
          disconnect: 'NOT CONNECTED',
          relvoTitle: 'relvo — panel',
          modules: ['Contracts', 'Usage', 'Approvals', 'Invoicing'],
          connected: 'Connected',
        }

  return (
    <section id="problema" className="relative overflow-hidden">
      <SectionTag accent="salmon">{t.problem.eyebrow}</SectionTag>
      <Aura color="#FF9566" size={560} opacity={0.12} blur={100} className="right-[-8%] top-[30%]" />
      <Grain opacity={0.03} />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <Reveal>
          <h2
            className="mx-auto max-w-3xl text-center font-sans font-medium tracking-[-0.02em] text-ink"
            style={{ fontSize: 'var(--text-h2)', lineHeight: 1.12 }}
          >
            {t.problem.title}
          </h2>
        </Reveal>

        {/* Three ideas, not one wall of text */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-x-10 gap-y-8 sm:mt-16 lg:grid-cols-3">
          {t.problem.points.map((point, i) => (
            <Reveal key={point.title} delayMs={i * 90}>
              <div className="border-t-2 pt-5" style={{ borderColor: '#FF9566' }}>
                <span className="v2-eyebrow" style={{ color: '#C4501B' }}>0{i + 1}</span>
                <h3 className="mt-2.5 font-sans text-[1.125rem] font-semibold tracking-[-0.01em] text-ink">
                  {point.title}
                </h3>
                <p className="mt-2 font-sans text-[0.9375rem] leading-relaxed text-ink-soft">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Disconnected systems → one system */}
        <Reveal delayMs={160}>
          <Scene accent="salmon" className="mx-auto mt-16 max-w-5xl sm:mt-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_auto_1fr] lg:gap-8">
            {/* Four real interfaces, none of them talking to each other */}
            <div className="relative">
              {/* Broken links between the windows */}
              <svg className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M28 28 72 72 M72 28 28 72" stroke="rgba(19,19,30,0.22)" strokeWidth="0.5" strokeDasharray="2 2.5" fill="none" vectorEffect="non-scaling-stroke" />
              </svg>
              <div
                className={`${mono} absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-sm)] border border-dashed bg-white px-2.5 py-1.5`}
                style={{ borderColor: '#FF9566', color: '#C4501B' }}
              >
                ✕ {L.disconnect}
              </div>

              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {/* Contract PDF */}
                <MiniWindow title={L.pdf} tilt={-0.6}>
                  <div className="space-y-1.5" aria-hidden="true">
                    {[92, 70, 96, 55, 84].map((w, i) => (
                      <div key={i} className="h-1.5 rounded-sm bg-gray-brand" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                  <p className={`${mono} mt-2.5 text-muted-deco`}>PDF · 14 p.</p>
                </MiniWindow>

                {/* Usage dashboard */}
                <MiniWindow title={L.dash} tilt={0.5}>
                  <svg viewBox="0 0 120 40" className="w-full" aria-hidden="true">
                    {[12, 22, 17, 28, 24, 34, 30].map((h, i) => (
                      <rect key={i} x={4 + i * 17} y={40 - h} width="10" height={h} rx="1.5" fill="#DFF4EB" stroke="#72DDAA" strokeWidth="0.8" />
                    ))}
                  </svg>
                  <p className={`${mono} mt-2 text-ink-soft`}>{L.dashMetric}</p>
                </MiniWindow>

                {/* Approvals inbox */}
                <MiniWindow title={L.mail} tilt={0.6}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#FF9566' }} aria-hidden="true" />
                        <span className="truncate font-sans text-[0.72rem] font-medium text-ink">{L.mail1}</span>
                      </span>
                      <span className={`${mono} shrink-0 text-muted-deco`}>{L.mail1Meta}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-2">
                      <span className="truncate font-sans text-[0.72rem] text-ink-soft">{L.mail2}</span>
                      <span className={`${mono} shrink-0`} style={{ color: '#C4501B' }}>{L.mail2Meta}</span>
                    </div>
                  </div>
                </MiniWindow>

                {/* Billing spreadsheet */}
                <MiniWindow title={L.sheet} tilt={-0.5}>
                  <div className="grid grid-cols-3 overflow-hidden rounded-sm border border-[var(--border-subtle)] text-center" aria-hidden="true">
                    {['B4', 'C4', 'D4', '$1.240', '$860', '#REF!', '$3.100', '—', '$920'].map((cell, i) => (
                      <div
                        key={i}
                        className={`border-b border-r border-[var(--border-subtle)] px-1 py-1 font-mono text-[0.58rem] ${
                          cell === '#REF!' ? 'bg-red-50 text-red-600' : i < 3 ? 'bg-[#FBFBFA] text-muted-deco' : 'text-ink-soft'
                        }`}
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                </MiniWindow>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center lg:block" aria-hidden="true">
              <svg width="56" height="24" viewBox="0 0 56 24" fill="none" className="rotate-90 text-muted-deco lg:rotate-0">
                <path d="M2 12h46" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 5" style={{ animation: 'v2-flow 1.6s linear infinite' }} />
                <path d="M42 6l8 6-8 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* One system — the Relvo panel, everything connected */}
            <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white shadow-[0_1px_2px_rgba(19,19,30,0.05),0_24px_50px_rgba(19,19,30,0.12)]">
              <div className="flex items-center gap-2 bg-ink px-3.5 py-2.5">
                <img src="/logo-mark-light.svg" alt="" aria-hidden="true" className="h-3.5 w-auto" />
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/80">{L.relvoTitle}</span>
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-lime-brand animate-pulse-soft" aria-hidden="true" />
              </div>
              <div className="divide-y divide-[var(--border-subtle)]">
                {L.modules.map((moduleName) => (
                  <div key={moduleName} className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="font-sans text-[0.8125rem] font-medium text-ink">{moduleName}</span>
                    <span className={`${mono} inline-flex items-center gap-1`} style={{ color: '#186666' }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2.5 6.5 5 9l4.5-6" stroke="#186666" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {L.connected}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--border-subtle)] bg-[#FBFBFA] px-3.5 py-2 text-center">
                <span className="v2-eyebrow" style={{ color: '#5F7500' }}>{t.problem.oneSystem}</span>
              </div>
            </div>
          </div>
          </Scene>
        </Reveal>

        {/* Kicker → transitions into features */}
        <Reveal delayMs={220}>
          <p className="mt-16 text-center sm:mt-20">
            <Eyebrow accent="salmon">
              {t.problem.kicker} <span aria-hidden="true">→</span>
            </Eyebrow>
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
