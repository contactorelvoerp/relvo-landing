import { useState, useEffect } from 'react'
import { trackScheduleDemo } from '../../utils/analytics'

const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'
const appHref = 'http://app.relvoerp.com'
const clamp01 = (value) => Math.max(0, Math.min(1, value))

export const Navbar = ({ t, navigate, scrollThreshold, activePath = '', forceBackdrop = false }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [backdropProgress, setBackdropProgress] = useState(0)

  useEffect(() => {
    if (forceBackdrop) {
      setShowBackdrop(true)
      return
    }

    if (!scrollThreshold) return

    const handleScroll = () => {
      const fadeDistance = Math.max(window.innerHeight * 0.22, 120)
      setBackdropProgress(clamp01(window.scrollY / fadeDistance))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollThreshold, forceBackdrop])

  // Separa el último nav item (Demos/CTA) del resto
  const navItems = t.navItems ?? []
  const ctaItem = navItems[navItems.length - 1]
  const isPage = Boolean(activePath)
  const regularItems = [
    ...(isPage ? [{ label: 'Inicio', href: '/' }] : []),
    ...navItems.slice(0, -1),
  ]
  const homeHref = isPage ? '/' : '#inicio'
  const handleHomeClick = (event) => {
    if (!isPage) return
    event.preventDefault()
    navigate?.('/')
  }
  const handleRouteClick = (event, href) => {
    event.preventDefault()
    navigate?.(href)
  }
  const handleAnchorClick = (event, href) => {
    if (!isPage) return

    event.preventDefault()
    navigate?.('/')
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ block: 'start' })
    }, 0)
  }
  const isActiveItem = (href) =>
    Boolean(activePath && href?.startsWith('/') && (activePath === href || activePath.startsWith(`${href}/`)))

  return (
    <>
    {/* Mobile-only top bar with CTA */}
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 pt-3 pb-2 sm:hidden">
      <a href={homeHref} onClick={handleHomeClick} className="flex items-center gap-1.5 px-1 py-1">
        <img src="/logo-mark-dark.svg" alt="" aria-hidden="true" className="h-4 w-auto" />
        <img src="/relvo-wordmark-dark.svg" alt="relvo" className="h-4 w-auto" />
      </a>
      {ctaItem && (
        <a
          href={calendlyHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackScheduleDemo('navbar_mobile')}
          className="inline-flex h-8 items-center justify-center rounded-full bg-[var(--text-main)] px-4 text-white transition hover:opacity-90"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {t.navCta}
        </a>
      )}
    </div>

    {/* Desktop navbar */}
    <header
      className="fixed inset-x-0 top-0 z-50 hidden px-4 pt-3 sm:block sm:px-6 sm:pt-4"
      style={{
        paddingBottom: `${0.75 + 1.75 * backdropProgress}rem`,
        background: `linear-gradient(to bottom, rgba(255,255,255,${backdropProgress}) 0%, rgba(255,255,255,${backdropProgress}) 60%, rgba(255,255,255,0) 100%)`,
        transition: 'background 0.4s ease',
      }}
    >
      <nav className="nav-shell mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <a href={homeHref} onClick={handleHomeClick} className="flex items-center gap-2 px-2 py-1">
          <img src="/logo-mark-dark.svg" alt="" aria-hidden="true" className="h-5 w-auto sm:h-6" />
          <img src="/relvo-wordmark-dark.svg" alt="relvo" className="h-5 w-auto sm:h-6" />
        </a>

        {/* Desktop nav + CTA button + hamburger (mobile) */}
        <div className="flex items-center gap-3 sm:gap-5">
          {regularItems.map((item) => {
            const active = isActiveItem(item.href)
            return (
              <a
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                onClick={item.href?.startsWith('/')
                  ? (event) => handleRouteClick(event, item.href)
                  : (event) => handleAnchorClick(event, item.href)}
                className={`hidden rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 sm:inline-flex sm:text-sm ${
                  active
                    ? 'border-[var(--border-default)] bg-white/70 text-[var(--text-main)] shadow-[0_8px_22px_rgba(15,17,21,0.05)]'
                    : 'border-transparent text-[var(--text-muted)] hover:bg-white/40 hover:text-[var(--text-main)]'
                }`}
              >
                {item.label}
              </a>
            )
          })}

          <a
            href={appHref}
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full bg-white/50 px-5 text-xs font-medium text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 sm:px-6 sm:text-sm"
          >
            {t.navLogin ?? 'Login'}
          </a>

          {ctaItem && (
            <a
              href={calendlyHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackScheduleDemo('navbar')}
              className="inline-flex h-9 items-center justify-center rounded-[var(--radius-button)] bg-[var(--text-main)] px-4 text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 sm:px-5"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
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

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-white/80 px-4 py-3 shadow-[0_8px_24px_rgba(15,17,21,0.08)] backdrop-blur-md sm:hidden">
          {regularItems.map((item) => {
            const active = isActiveItem(item.href)
            return (
              <a
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                onClick={item.href?.startsWith('/')
                  ? (event) => {
                    handleRouteClick(event, item.href)
                    setMenuOpen(false)
                  }
                  : (event) => {
                    handleAnchorClick(event, item.href)
                    setMenuOpen(false)
                  }}
                className={`block rounded-[var(--radius-sm)] px-2 py-2 text-sm font-medium transition hover:text-[var(--text-main)] ${
                  active ? 'bg-[rgba(19,19,30,0.05)] text-[var(--text-main)]' : 'text-[var(--text-muted)]'
                }`}
              >
                {item.label}
              </a>
            )
          })}
          <div className="mt-2 border-t border-[var(--border-default)] pt-2">
            <a
              href={appHref}
              onClick={() => setMenuOpen(false)}
              className="block cursor-pointer rounded-[var(--radius-sm)] px-2 py-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
            >
              {t.navLogin ?? 'Login'}
            </a>
          </div>
        </div>
      )}
    </header>
    </>
  )
}
