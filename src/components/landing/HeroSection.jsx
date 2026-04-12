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
  const page3Ref = useRef(null)
  usePageSnap([page1Ref, page2Ref, page3Ref], page4Ref)

  return (
    <>
      {/* ── PAGE 1: Welcome — Tagline + Wordmark + Headline ── */}
      <section
        ref={page1Ref}
        className="full-page relative flex w-full flex-col items-center px-4 pb-12 pt-[5rem] sm:px-6 sm:pt-[5.5rem]"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center text-center">
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

          {/* Relvo wordmark + headline grouped */}
          <div className="flex flex-1 flex-col items-center justify-center" style={{ marginTop: '3vh' }}>
            <img
              src="/relvo-wordmark-dark.svg"
              alt="relvo"
              className="h-auto"
              style={{ width: 'clamp(180px, 30vw, 380px)' }}
            />

            {/* T2 Page headline */}
            <h1
              className="mt-16 sm:mt-28 md:mt-32"
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
          </div>
        </div>
      </section>

      {/* ── PAGE 2: Problem — Description + Animation + Bottom text ── */}
      <section
        ref={page2Ref}
        className="full-page relative flex w-full flex-col items-center justify-center px-4 sm:px-6"
      >
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* T4 Body large */}
          <p
            className="mx-auto max-w-3xl"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(0.95rem, 1.6vw, 1.3rem)',
              fontWeight: 400,
              lineHeight: 1.55,
              color: '#626262',
            }}
          >
            Cuando tu negocio factura por uso, hitos o métricas de servicio,
            <br className="hidden sm:block" />
            el camino del contrato al cobro es largo y manual...
          </p>

          {/* Contract-to-cash animation */}
          <div className="w-full max-w-6xl" style={{ marginTop: '-4%', marginBottom: '-8%' }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full"
            >
              <source src="/animations/contract2cash.webm" type="video/webm" />
              <source src="/animations/contract2cash.mov" type="video/quicktime" />
            </video>
          </div>

          {/* T3 Sub-headline */}
          <p
            className="mx-auto mt-4 max-w-4xl sm:mt-8 md:mt-12"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.1rem, 2.5vw, 2rem)',
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
      </section>

      {/* ── PAGE 3: Target Audience + Bridge ── */}
      <section
        ref={page3Ref}
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

          {/* T5 Body — pinned to bottom */}
          <p
            className="relative z-10 mx-auto mb-8 max-w-3xl px-4 text-center sm:mb-10 md:mb-14"
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
