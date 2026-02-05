export const OneStatement = () => {
  const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'

  const ScrollHint = ({ variant = 'light' }) => (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 scroll-hint"
    >
      <div
        className={[
          'flex flex-col items-center gap-2',
          variant === 'dark' ? 'text-white/60' : 'text-black/40',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block w-px h-14',
            variant === 'dark' ? 'bg-white/45' : 'bg-black/35',
          ].join(' ')}
        />
        <span
          className={[
            'inline-block w-1.5 h-1.5 rounded-full',
            variant === 'dark' ? 'bg-white/45' : 'bg-black/30',
          ].join(' ')}
        />
      </div>
    </div>
  )

  return (
    <main
      id="statement"
      className="relative h-[100dvh] surface-base overflow-hidden"
    >
      {/* Scrollfolio rail */}
      <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-[92px] h-px bg-[var(--rule)]" />

      <div className="h-[100dvh] overflow-y-auto overscroll-contain snap-y snap-mandatory px-4 sm:px-6">
        {/* Panel 1 */}
        <section className="relative snap-start min-h-[100dvh] flex items-center">
          <div className="w-full max-w-6xl mx-auto">
            <p className="font-body text-center tracking-[-0.02em] text-ink text-[clamp(34px,4.8vw,64px)] leading-[1.06] mx-auto max-w-[18ch]">
              Cuando las empresas crecen rápido,
              <br />
              <span className="font-semibold">la contabilidad</span>
              <br />
              <span className="font-semibold">empieza a generar fricción.</span>
            </p>
          </div>
          <ScrollHint />
        </section>

        {/* Panel 2 */}
        <section className="relative snap-start min-h-[100dvh] flex items-center">
          <div className="w-full max-w-6xl mx-auto">
            <p className="font-body text-center tracking-[-0.015em] text-ink text-[clamp(22px,3.2vw,44px)] leading-[1.12] mx-auto max-w-[22ch]">
              Cierres lentos, tareas manuales y procesos repetitivos que consumen tiempo del equipo financiero.
            </p>
          </div>
          <ScrollHint />
        </section>

        {/* Panel 3 (muted setup + bold statement) */}
        <section className="relative snap-start min-h-[100dvh] flex items-center">
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center">
              <p className="font-body text-ink-muted tracking-[-0.01em] text-[clamp(18px,2.1vw,28px)] leading-[1.35] mx-auto max-w-[30ch]">
                El problema no es la contabilidad ni las personas.
              </p>
              <p className="mt-[clamp(28px,5vh,56px)] font-body text-ink font-semibold tracking-[-0.02em] text-[clamp(26px,4.0vw,56px)] leading-[1.06] mx-auto max-w-[20ch]">
                Es un stack financiero construido para un mundo pre‑IA y sostenido por procesos manuales.
              </p>
            </div>
          </div>
          <ScrollHint />
        </section>

        {/* Panel 4 */}
        <section className="relative snap-start min-h-[100dvh] flex items-center">
          <div className="w-full max-w-6xl mx-auto">
            <p className="font-body text-center tracking-[-0.015em] text-ink text-[clamp(22px,3.0vw,42px)] leading-[1.12] mx-auto max-w-[20ch]">
              Partimos desde ahí.
            </p>
          </div>
          <ScrollHint />
        </section>

        {/* Panel 5 */}
        <section className="relative snap-start min-h-[100dvh] flex items-center">
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center">
              <p className="font-body text-ink tracking-[-0.02em] text-[clamp(24px,3.6vw,52px)] leading-[1.08] mx-auto max-w-[24ch]">
                Automatizar lo repetitivo y ordenar los flujos financieros,
              </p>
              <p className="mt-[clamp(18px,3vh,28px)] font-body text-ink-muted tracking-[-0.01em] text-[clamp(18px,2.2vw,28px)] leading-[1.45] mx-auto max-w-[34ch]">
                para que los equipos puedan enfocarse en análisis y toma de decisiones.
              </p>
            </div>
          </div>
          <ScrollHint />
        </section>

        {/* Panel 6 (closing) */}
        <section className="relative snap-start min-h-[100dvh] flex items-center">
          <div className="w-full max-w-6xl mx-auto">
            <p className="font-body text-center tracking-[-0.02em] text-ink text-[clamp(28px,4.2vw,60px)] leading-[1.06] mx-auto max-w-[20ch]">
              Relvo nace cuando la contabilidad tradicional deja de escalar.
            </p>
          </div>
          <ScrollHint />
        </section>

        {/* Panel 7 (dark lockup + CTA) */}
        <section id="conversemos" className="relative snap-start min-h-[100dvh] flex items-center -mx-4 sm:-mx-6 bg-dark-grid">
          <div className="w-full px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-white font-body tracking-[-0.04em] text-[clamp(56px,9vw,112px)] leading-[0.92] font-semibold">
                Relvo.
              </div>
              <div aria-hidden className="mt-6 w-20 h-px bg-white/25" />
              <p className="mt-10 font-body text-white/70 tracking-[-0.01em] text-[clamp(18px,2.4vw,30px)] leading-[1.35] max-w-[34ch]">
              Plataforma contable AI-native para LATAM.
              </p>


              <div className="mt-[clamp(24px,5vh,56px)]">
                <a
                  href={calendlyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/5 px-7 py-3 font-body text-sm sm:text-[15px] font-semibold tracking-[0.14em] uppercase text-white backdrop-blur-sm transition hover:bg-white/10 hover:border-white/35"
                >
                  Conversemos
                  <span className="inline-block w-10 h-px bg-white/50" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

