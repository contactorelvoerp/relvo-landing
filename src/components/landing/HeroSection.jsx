import { useRef } from 'react'
import { usePageSnap } from '../../hooks/usePageSnap'

// ── Typography hierarchy ──
// T1 Eyebrow (Geist Mono):  clamp(0.7rem, 0.9vw, 0.8rem)
// T2 Page title (Fujiwara):  clamp(2.2rem, 4vw, 3.5rem)
// T3 Sub-headline (Fujiwara): clamp(1.4rem, 2.5vw, 2rem)
// T4 Body large (Inst. Sans): clamp(1.1rem, 1.6vw, 1.3rem)
// T5 Body (Inst. Sans):       clamp(0.9rem, 1.2vw, 1.05rem)
// T6 Label (Geist Mono):      0.75rem

export const HeroSection = ({ t, page4Ref }) => {
  const page1Ref = useRef(null)
  const page2Ref = useRef(null)
  usePageSnap([page1Ref, page2Ref], page4Ref)

  return (
    <>
      {/* ── PAGE 1: Hero — Headline + body + animation + close ── */}
      <section
        ref={page1Ref}
        className="full-page relative flex w-full flex-col items-center px-4 pt-[4.5rem] pb-4 sm:px-6 sm:pt-[5rem]"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center text-center">
          {/* Top group: eyebrow stays pinned at top; headline + body
              pushed down so they sit closer to the animation below. */}
          <div className="flex w-full flex-col items-center">
            {/* T1 Eyebrow */}
            <p
              className="uppercase"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.55rem, 0.9vw, 0.8rem)',
                fontWeight: 400,
                color: '#585858',
                letterSpacing: '0.14em',
              }}
            >
              Revenue-design para empresas B2B en LATAM
            </p>

            {/* T2 Page headline */}
            <h1
              className="mt-[14vh] sm:mt-[16vh]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 4vw, 3.5rem)',
                fontWeight: 300,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: '#000000',
              }}
            >
              Del cierre comercial al cobro,
              <br />
              más rápido y sin fricción.
            </h1>

            {/* T4 Body large — intro */}
            <p
              className="mx-auto mt-10 max-w-3xl sm:mt-7"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 'clamp(0.9rem, 1.4vw, 1.2rem)',
                fontWeight: 400,
                lineHeight: 1.5,
                color: '#626262',
              }}
            >
              Cuando tu negocio factura por uso, hitos o métricas de servicio,
              <br className="hidden sm:block" />
              {' '}el camino del contrato al cobro es largo y manual.
              <span className="md:hidden">
                {' '}Relvo automatiza cada paso para acortar ese ciclo y liberar el flujo de caja que ya te pertenece.
              </span>
            </p>
          </div>

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

        </div>
      </section>

      {/* ── PAGE 2: Target Audience + Bridge ── */}
      <section
        ref={page2Ref}
        className="full-page relative flex w-full flex-col items-center px-4 sm:px-6"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center">
          {/* T1 Eyebrow */}
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.55rem, 0.9vw, 0.8rem)',
              fontWeight: 400,
              color: '#585858',
              letterSpacing: '0.14em',
            }}
          >
            Para quién es Relvo
          </p>

          {/* T2 Page headline */}
          <h2
            className="mt-6 sm:mt-8 md:mt-10"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 4vw, 3.5rem)',
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#000000',
            }}
          >
            Empresas B2B que crecen
            <br />
            más rápido que sus procesos.
          </h2>

          {/* T3 Sub-headline — bridge statement */}
          <p
            className="mx-auto mt-8 max-w-5xl sm:mt-10 md:mt-14"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(1rem, 2.5vw, 2rem)',
              fontWeight: 600,
              lineHeight: 1.25,
              color: 'var(--text-main)',
            }}
          >
            {t.bridgeFrom}
            <span className="mx-1 inline-block align-middle sm:mx-2" style={{ color: 'var(--text-soft)' }}>
              <svg width="24" height="12" viewBox="0 0 36 14" fill="none" className="hidden sm:inline" style={{ verticalAlign: '0.1em' }}>
                <path d="M1 7h32M29 1l5 6-5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="sm:hidden">→</span>
            </span>
            {t.bridgeTo && (
              <>
                {'a un sistema único'}
                <br className="hidden sm:block" />
                {'de ingresos '}
                <span
                  className="px-[0.18em]"
                  style={{
                    background: 'linear-gradient(transparent 48%, #F4B08E 48%)',
                    WebkitBoxDecorationBreak: 'clone',
                    boxDecorationBreak: 'clone',
                    borderRadius: '2px',
                  }}
                >
                  {t.bridgeToHighlight && t.bridgeToEmphasis ? (
                    <>
                      {t.bridgeToHighlight.slice(0, t.bridgeToHighlight.indexOf(t.bridgeToEmphasis))}
                      <em className="font-cursive-emphasis">{t.bridgeToEmphasis}</em>
                      {t.bridgeToHighlight.slice(t.bridgeToHighlight.indexOf(t.bridgeToEmphasis) + t.bridgeToEmphasis.length)}
                    </>
                  ) : (
                    t.bridgeToHighlight
                  )}
                </span>
                {t.bridgeTo.slice((t.bridgeTo.indexOf(t.bridgeToHighlight || '') || 0) + (t.bridgeToHighlight || '').length)}
              </>
            )}
          </p>

        </div>

          {/* T5 Body — pinned to bottom (lifted higher on mobile) */}
          <p
            className="relative z-10 mx-auto mb-[22vh] max-w-3xl px-4 text-center sm:mb-10 md:mb-14"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(0.8rem, 1.2vw, 1.05rem)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'var(--text-soft)',
            }}
          >
            {t.bridgeSupport}
          </p>
      </section>
    </>
  )
}
