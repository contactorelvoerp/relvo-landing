import { useRef } from 'react'
import { usePageSnap } from '../../hooks/usePageSnap'

export const HeroSection = ({ t }) => {
  const page2Ref = useRef(null)
  usePageSnap(page2Ref)

  return (
    <>
      {/* ── PAGE 1: Tagline + Wordmark + Headline ── */}
      <section className="full-page relative flex w-full flex-col items-center px-6 pb-12 pt-4 sm:pt-6">
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
          <div className="flex flex-1 flex-col items-center justify-center" style={{ marginTop: '-8vh' }}>
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
            más rápido.
          </h1>
          </div>
        </div>
      </section>

      {/* ── PAGE 2: Description + Flowchart + Bottom text ── */}
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
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 400,
              lineHeight: 1.55,
              color: '#626262',
            }}
          >
            Cuando tu negocio factura por uso, hitos o métricas de servicio,
            <br className="hidden sm:block" />
            el camino del contrato al cobro es largo y manual...
          </p>

          {/* Flowchart screenshot */}
          <div className="mt-12 w-full max-w-4xl sm:mt-16">
            <img
              src="/flowchart-strip.png"
              alt="Flujo de trabajo Relvo"
              className="w-full rounded-lg"
              loading="lazy"
            />
          </div>

          {/* Bottom text — Instrument Sans SemiBold */}
          <p
            className="mx-auto mt-10 max-w-4xl sm:mt-14"
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
              fontWeight: 600,
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
    </>
  )
}
