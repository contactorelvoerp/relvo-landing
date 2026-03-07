import { ButtonLink } from './ButtonLink'

const executiveBlocks = [
  {
    title: 'Centraliza contratos y pricing',
    text: 'Modela planes, condiciones comerciales y excepciones sin depender de planillas.',
  },
  {
    title: 'Calcula automaticamente lo que debes cobrar',
    text: 'Consumo, volumen o performance para transformar operacion en cargos correctos.',
  },
  {
    title: 'Visibiliza tu facturacion',
    text: 'Muestra que fue cobrado, que falta por facturar y donde se esta escapando revenue.',
  },
]

export const HeroSection = ({ ctaHref }) => {
  return (
    <section className="hero-shell section-shell flex min-h-screen items-center pt-8 sm:pt-10 lg:pt-12">
      <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(380px,0.86fr)] lg:gap-12">
        <div className="max-w-3xl">
          <div className="mb-8 flex items-center gap-4 sm:mb-10 sm:gap-5">
            <img
              src="/logo-mark-dark.svg"
              alt="Relvo"
              className="h-14 w-14 sm:h-16 sm:w-16"
            />
            <span className="font-display text-[2.3rem] font-semibold tracking-[0.02em] text-[var(--text-main)] sm:text-[2.75rem]">
              RELVO
            </span>
          </div>

          <p className="eyebrow-compact">Revenue automation para B2B en LATAM</p>
          <h1 className="mt-4 max-w-[13ch] font-display text-[clamp(2.55rem,5.4vw,4.95rem)] leading-[0.98] tracking-[-0.06em] text-[var(--text-main)]">
            Convierte contratos, pricing y consumo en revenue confiable.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-muted)] sm:text-xl">
            Relvo centraliza contratos, reglas comerciales y datos de uso para
            calcular cargos, ordenar la facturacion y dar control sobre tu revenue.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={ctaHref}
              external
              className="min-w-[190px] px-6 py-3.5 text-base shadow-[0_22px_45px_rgba(16,16,14,0.18)]"
            >
              Agendar demo
              <span aria-hidden="true">{'->'}</span>
            </ButtonLink>
          </div>
        </div>

        <div className="compact-visual relative">
          <div className="surface-panel relative overflow-hidden rounded-[2rem] border border-black/[0.12] bg-white/[0.9] p-5 shadow-[0_28px_60px_rgba(16,16,14,0.08)] sm:p-6">
            <div className="border-b border-black/[0.08] pb-4">
              <div className="inline-flex rounded-full border border-black/[0.08] bg-[var(--surface-subtle)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                Revenue control
              </div>
              <h2 className="mt-4 max-w-[16ch] font-display text-[clamp(1.72rem,2.6vw,2.3rem)] leading-[1.02] tracking-[-0.05em] text-[var(--text-main)]">
                Mas control. Menos trabajo manual.
              </h2>
              <p className="mt-4 max-w-[36ch] text-sm leading-7 text-[var(--text-muted)] sm:text-[15px]">
                Una vista consistente del contrato al monto cobrado, con mas
                trazabilidad y menos dependencia de reconciliar numeros a mano.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {executiveBlocks.map((block) => (
                <div
                  key={block.title}
                  className="rounded-[1.35rem] border border-black/[0.08] bg-[rgba(238,230,218,0.55)] px-4 py-4 shadow-[0_12px_24px_rgba(16,16,14,0.035)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-[0.7rem] h-2 w-2 shrink-0 rounded-full bg-[var(--text-main)]" />
                    <div>
                      <p className="text-sm font-semibold tracking-[-0.02em] text-[var(--text-main)]">
                        {block.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                        {block.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
