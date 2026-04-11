export const HeroSection = ({ t }) => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Content layer on top of ShaderBackground from App.jsx */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 pt-24 text-center sm:pb-24 sm:pt-32">
        {/* Tagline */}
        <p
          className="text-sm tracking-[0.12em] uppercase"
          style={{
            fontFamily: 'var(--font-ui)',
            color: '#585858',
            letterSpacing: '0.12em',
          }}
        >
          Revenue-design para empresas B2B en LATAM
        </p>

        {/* Relvo wordmark */}
        <img
          src="/relvo-wordmark-dark.svg"
          alt="relvo"
          className="mt-10 h-auto sm:mt-14"
          style={{ width: 'clamp(280px, 40vw, 480px)' }}
        />

        {/* Headline — Fujiwara A */}
        <h1
          className="mt-10 sm:mt-14"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
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

        {/* Description */}
        <p
          className="mx-auto mt-12 max-w-3xl sm:mt-16"
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
  )
}
