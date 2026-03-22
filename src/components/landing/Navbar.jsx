import { useState } from 'react'

const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'

export const Navbar = ({ t }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  // Separa el último nav item (Demos/CTA) del resto
  const navItems = t.navItems ?? []
  const ctaItem = navItems[navItems.length - 1]
  const regularItems = navItems.slice(0, -1)

  return (
    <header className="relative z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <nav className="nav-shell mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <a
          href="#inicio"
          className="rounded-[var(--radius-sm)] px-2 py-1 font-display text-base font-semibold tracking-[-0.01em] text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 sm:text-lg"
        >
          Relvo
        </a>

        {/* Desktop nav + CTA button + hamburger (mobile) */}
        <div className="flex items-center gap-3 sm:gap-5">
          {regularItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hidden rounded-[var(--radius-sm)] px-2 py-1 text-xs font-medium text-[var(--text-muted)] transition hover:text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 sm:inline-flex sm:text-sm"
            >
              {item.label}
            </a>
          ))}

          {ctaItem && (
            <a
              href={calendlyHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--text-main)] px-4 text-xs font-medium text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 sm:px-5 sm:text-sm"
            >
              {t.navCta}
            </a>
          )}

          <button
            className="flex items-center justify-center rounded-[var(--radius-sm)] p-2 text-[var(--text-muted)] transition hover:text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:hidden"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown — solo muestra los items regulares, el CTA es visible en el nav */}
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(15,17,21,0.08)] sm:hidden">
          {regularItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-[var(--radius-sm)] px-2 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
