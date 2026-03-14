import { ButtonLink } from './ButtonLink'

export const Navbar = ({ ctaHref, lang, setLang, t }) => {
  return (
    <header className="relative z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <nav className="nav-shell mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <a
          href="#inicio"
          className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
        >
          <img
            src="/logo-mark-dark.svg"
            alt="Relvo"
            className="h-11 w-11 rounded-[0.9rem] sm:h-12 sm:w-12"
          />
          <span className="font-display text-sm font-semibold tracking-[0.08em] text-[var(--text-main)] sm:text-base">
            RELVO
          </span>
        </a>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-black/[0.08] bg-white px-1 py-1 text-xs">
            <button
              type="button"
              onClick={() => setLang('es')}
              className={`rounded-full px-2.5 py-1 transition ${
                lang === 'es'
                  ? 'bg-[var(--text-main)] text-white'
                  : 'text-[var(--text-soft)]'
              }`}
            >
              {t.langEs}
            </button>

            <button
              type="button"
              onClick={() => setLang('en')}
              className={`rounded-full px-2.5 py-1 transition ${
                lang === 'en'
                  ? 'bg-[var(--text-main)] text-white'
                  : 'text-[var(--text-soft)]'
              }`}
            >
              {t.langEn}
            </button>
          </div>

          <ButtonLink
            href={ctaHref}
            external
            variant="secondary"
            className="group px-5 py-2.5 text-sm font-medium"
          >
            {t.navCta}
            <span
              aria-hidden="true"
              className="ml-1 transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </ButtonLink>
        </div>
      </nav>
    </header>
  )
}