export const ComingSoon = ({ navigate }) => {
  const handleBack = () => {
    if (navigate) {
      navigate('/')
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-5 sm:px-6 sm:pt-6 md:px-10 md:pt-8">
        <button
          onClick={handleBack}
          className="cursor-pointer rounded-[var(--radius-sm)] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <img src="/relvo-wordmark-dark.svg" alt="relvo" className="h-5 w-auto sm:h-6" />
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-8 text-center sm:px-6 sm:pb-24">

        {/* Eyebrow — Geist Mono */}
        <p
          className="mb-10 uppercase"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.7rem, 0.9vw, 0.8rem)',
            fontWeight: 400,
            color: '#585858',
            letterSpacing: '0.14em',
          }}
        >
          Acceso a la plataforma
        </p>

        {/* Heading — Fujiwara */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#000000',
          }}
        >
          Próximamente
        </h1>

        {/* Subtitle — Instrument Sans */}
        <p
          className="mt-8 max-w-sm sm:max-w-md"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'var(--text-soft)',
          }}
        >
          Estamos construyendo el acceso a Relvo.
          <br />
          Muy pronto podrás ingresar desde aquí.
        </p>

        {/* Contact chip */}
        <a
          href="mailto:contacto@relvoerp.com"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/50 px-5 py-2 backdrop-blur-sm transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.85rem',
            color: 'var(--text-soft)',
            border: '1px solid rgba(19,19,30,0.06)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="1" y="3" width="14" height="10" rx="2" />
            <polyline points="1,3 8,9 15,3" />
          </svg>
          contacto@relvoerp.com
        </a>

        {/* Back button — pill style */}
        <button
          onClick={handleBack}
          className="mt-10 inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-[var(--text-main)] px-6 text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="13" y1="8" x2="3" y2="8" />
            <polyline points="7 4 3 8 7 12" />
          </svg>
          Volver al inicio
        </button>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center">
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          © {new Date().getFullYear()} Relvo
        </p>
      </footer>
    </div>
  )
}
