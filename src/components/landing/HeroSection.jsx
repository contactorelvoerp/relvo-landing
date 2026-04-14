import { useRef } from 'react'
import { HeroFlowLive } from './HeroFlowLive'

function goTo(path) {
  window.history.pushState({}, '', path)
  window.scrollTo(0, 0)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// ── Typography hierarchy ──
// T1 Eyebrow (Geist Mono):  clamp(0.7rem, 0.9vw, 0.8rem)
// T2 Page title (Fujiwara):  clamp(2.2rem, 4vw, 3.5rem)
// T3 Sub-headline (Fujiwara): clamp(1.4rem, 2.5vw, 2rem)
// T4 Body large (Inst. Sans): clamp(1.1rem, 1.6vw, 1.3rem)
// T5 Body (Inst. Sans):       clamp(0.9rem, 1.2vw, 1.05rem)
// T6 Label (Geist Mono):      0.75rem

export const HeroSection = () => {
  const page1Ref = useRef(null)

  return (
    <>
      {/* ── PAGE 1: Hero — Headline + body + animation + close ── */}
      <section
        ref={page1Ref}
        className="full-page relative flex w-full flex-col items-center px-4 pt-[4.5rem] pb-4 sm:px-6 sm:pt-[5rem]"
      >
        <div className="relative z-10 mx-auto w-full max-w-5xl flex-1 text-center">
          {/* T1 Eyebrow — anchored at 8vh from section top on mobile, 7vh on desktop */}
          <p
            className="absolute left-1/2 -translate-x-1/2 uppercase whitespace-nowrap top-0 lg:top-[6vh]"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.65rem, 1vmin, 0.85rem)',
              fontWeight: 400,
              color: '#585858',
              letterSpacing: '0.14em',
            }}
          >
            Revenue-design para empresas B2B en LATAM
          </p>

          {/* T2 Page headline — anchored at 14vh mobile, 22vh desktop */}
          <h1
            className="absolute left-1/2 -translate-x-1/2 top-[7vh] lg:top-[20vh]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.85rem, 6.5vmin, 5.5rem)',
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#000000',
              width: 'min(90vw, 64rem)',
            }}
          >
            Cobra como quieras,
            <br />
            opera en un sólo sistema.
          </h1>

          {/* T4 Body large — anchored at 36vh mobile, 40vh desktop */}
          <p
            className="absolute left-1/2 -translate-x-1/2 top-[27vh] lg:top-[38vh]"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(0.95rem, 2.2vmin, 1.55rem)',
              fontWeight: 400,
              lineHeight: 1.5,
              color: '#2a2a2a',
              width: 'min(85vw, 48rem)',
            }}
          >
            Cuando tus ingresos dependen de cobros por suscripciones, uso, hitos o métricas de servicio, el camino del contrato al cobro es largo y manual. Relvo automatiza ese proceso de punta a punta, para que la facturación deje de ser un dolor de cabeza.
          </p>

          {/* HeroFlow animation — anchored at 57vh mobile, 55vh desktop */}
          <div
            className="absolute left-1/2 w-full -translate-x-1/2 top-[57vh] lg:top-[55vh]"
            style={{ aspectRatio: '6 / 1' }}
          >
            <div
              className="absolute left-1/2 top-1/2 block w-[165vw] max-w-none -translate-x-1/2 -translate-y-1/2 sm:w-full sm:max-w-[min(80rem,90vmin)]"
              style={{ aspectRatio: '6 / 1' }}
            >
              <HeroFlowLive className="block h-full w-full" />
            </div>
          </div>

          {/* Desktop only: contract2cash animation — temporarily disabled.
              Kept in repo for future re-enable. */}
          {false && (
          <>
          {/* Desktop only: contract2cash animation with the closing
              sub-headline sitting on top of the video's transparent bottom
              padding. Absolutely positioned relative to the section so it
              floats independently of block 1's flow. Hidden on mobile —
              the mobile version drops the animation entirely and shows only
              the sub-headline in natural flow (see next block). */}
          <div className="absolute left-1/2 hidden w-full max-w-5xl -translate-x-1/2 px-4 md:block md:px-6" style={{ bottom: '18vh' }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="block w-full"
            >
              <source src="/animations/contract2cash.webm" type="video/webm" />
              <source src="/animations/contract2cash.mov" type="video/quicktime" />
            </video>
            {/* Sub-headline positioned over the video's lower transparent
                strip. Cards end at ~68%, video ends at 100%, so we center
                the text in the 68%–100% band = around 84% from top. */}
            <p
              className="absolute left-1/2 mx-auto w-full max-w-4xl -translate-x-1/2 px-4"
              style={{
                top: '76%',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.1rem, 2.2vw, 1.7rem)',
                fontWeight: 300,
                lineHeight: 1.3,
                color: '#000000',
              }}
            >
              Relvo automatiza cada paso para acortar ese ciclo
              <br className="hidden sm:block" />
              y liberar el flujo de caja que ya te pertenece.
            </p>
          </div>
          </>
          )}

          {/* Hero CTAs — lower half */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-[2vmin] sm:gap-10" style={{ bottom: '7vh' }}>
            <a
              href="#producto"
              className="inline-flex items-center justify-center rounded-full bg-white/50 text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(0.7rem, 1.4vmin, 0.95rem)',
                fontWeight: 500,
                height: 'clamp(2.2rem, 5vmin, 3rem)',
                minWidth: 'clamp(7rem, 18vmin, 11rem)',
                paddingLeft: 'clamp(1rem, 3vmin, 2.5rem)',
                paddingRight: 'clamp(1rem, 3vmin, 2.5rem)',
              }}
            >
              Ver producto
            </a>
            <a
              href="/login"
              onClick={(e) => { e.preventDefault(); goTo('/login') }}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--text-main)] text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.6rem, 1.2vmin, 0.8rem)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                height: 'clamp(2.2rem, 5vmin, 3rem)',
                minWidth: 'clamp(7rem, 18vmin, 11rem)',
                paddingLeft: 'clamp(1rem, 3vmin, 2.5rem)',
                paddingRight: 'clamp(1rem, 3vmin, 2.5rem)',
              }}
            >
              Ir a demo
            </a>
          </div>

        </div>
      </section>

    </>
  )
}
