import { useRef } from 'react'
import { usePageSnap } from '../../hooks/usePageSnap'

export const HeroSection = ({ t, page4Ref }) => {
  const page1Ref = useRef(null)
  const page2Ref = useRef(null)
  const page3Ref = useRef(null)
  usePageSnap([page1Ref, page2Ref, page3Ref, page4Ref])

  return (
    <>
      {/* ── PAGE 1: Welcome — Tagline + Wordmark + Headline ── */}
      <section
        ref={page1Ref}
        className="full-page relative flex w-full flex-col items-center px-6 pb-12 pt-[5rem] sm:pt-[5.5rem]"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center text-center">
          {/* Tagline — Geist Mono */}
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
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
              style={{ width: 'clamp(220px, 30vw, 380px)' }}
            />

            {/* Headline — Fujiwara A */}
            <h1
              className="mt-28 sm:mt-32"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
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
        className="full-page relative flex w-full flex-col items-center justify-center px-6"
      >
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
          {/* Description */}
          <p
            className="mx-auto max-w-3xl"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
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
          <div className="w-full max-w-6xl" style={{ marginTop: '-8%', marginBottom: '-12%' }}>
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

          {/* Bottom text — Fujiwara A */}
          <p
            className="mx-auto mt-8 max-w-4xl sm:mt-12"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.3rem, 2.8vw, 2rem)',
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
        className="full-page relative flex w-full flex-col items-center px-6"
      >
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center">
          {/* Eyebrow */}
          <p
            className="uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.65rem, 1vw, 0.8rem)',
              fontWeight: 400,
              color: '#585858',
              letterSpacing: '0.14em',
            }}
          >
            Para quién es Relvo
          </p>

          {/* Headline */}
          <h2
            className="mt-8 sm:mt-10"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.8rem)',
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

          {/* Bridge statement */}
          <p
            className="mx-auto mt-10 max-w-5xl sm:mt-14"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(1.3rem, 2.6vw, 2rem)',
              fontWeight: 600,
              lineHeight: 1.25,
              color: 'var(--text-main)',
            }}
          >
            {t.bridgeFrom}
            <span className="mx-2 inline-block align-middle" style={{ color: 'var(--text-soft)' }}>
              <svg width="36" height="14" viewBox="0 0 36 14" fill="none" style={{ display: 'inline', verticalAlign: '0.1em' }}>
                <path d="M1 7h32M29 1l5 6-5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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

          {/* Audience description — pinned to bottom */}
          <p
            className="relative z-10 mx-auto mb-10 max-w-3xl text-center sm:mb-14"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
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
