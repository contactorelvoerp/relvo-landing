export const ComingSoon = ({ navigate }) => {
  const handleBack = () => {
    if (navigate) {
      navigate('/')
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white">

      {/* Background glow bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[60vh]"
        style={{
          background:
            'radial-gradient(ellipse 120% 100% at 50% 100%, rgba(200,255,92,0.32) 0%, rgba(255,212,154,0.24) 45%, transparent 72%)',
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <button
          onClick={handleBack}
          className="font-display text-base font-semibold tracking-[-0.01em] text-[var(--text-main)] sm:text-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded-[var(--radius-sm)]"
        >
          Relvo
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-8 text-center">

        {/* Eyebrow */}
        <span className="eyebrow-compact mb-10">Acceso a la plataforma</span>

        {/* Heading */}
        <h1
          className="text-[clamp(3.2rem,9vw,7rem)] font-bold leading-[0.92] tracking-[-0.045em] text-[var(--text-main)]"
        >
          Próxima&shy;mente
        </h1>

        {/* Accent underline */}
        <div
          className="mt-6 h-[5px] w-16 rounded-full"
          style={{ background: 'var(--brand-accent)' }}
        />

        {/* Subtitle */}
        <p className="mt-8 max-w-sm text-[0.95rem] leading-[1.7] text-[var(--text-soft)] sm:max-w-md sm:text-base">
          Estamos construyendo el acceso a Relvo.
          <br />
          Muy pronto podrás ingresar desde aquí.
        </p>

        {/* Contact chip */}
        <a
          href="mailto:contacto@relvoerp.com"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-subtle,#f6f7f8)] px-4 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="1" y="3" width="14" height="10" rx="2" />
            <polyline points="1,3 8,9 15,3" />
          </svg>
          contacto@relvoerp.com
        </a>

        {/* Back button */}
        <button
          onClick={handleBack}
          className="mt-12 inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-[var(--radius-button)] border border-[var(--border-strong)] bg-white px-6 text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--surface-subtle,#f6f7f8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="13" y1="8" x2="3" y2="8" />
            <polyline points="7 4 3 8 7 12" />
          </svg>
          Volver al inicio
        </button>
      </main>

      {/* Bottom label */}
      <footer className="relative z-10 pb-8 text-center">
        <p className="text-[0.72rem] tracking-wide text-[var(--text-soft)]">
          © {new Date().getFullYear()} Relvo
        </p>
      </footer>
    </div>
  )
}
