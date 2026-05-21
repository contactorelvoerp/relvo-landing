import { useState, useEffect } from 'react'
import { trackScheduleDemo } from '../../utils/analytics'

const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'
const loginHref = 'https://app.relvoerp.com/login'
const clamp01 = (value) => Math.max(0, Math.min(1, value))

export const Navbar = ({ t, navigate, scrollThreshold, activePath = '', forceBackdrop = false }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [backdropProgress, setBackdropProgress] = useState(0)

  useEffect(() => {
    if (forceBackdrop) {
      setBackdropProgress(1)
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
                className={`hidden px-1 py-1 text-sm transition-colors duration-150 focus-visible:outline-none sm:inline-flex ${
                  active
                    ? 'font-semibold text-[var(--text-main)]'
                    : 'font-medium text-[var(--text-soft)] hover:text-[var(--text-main)]'
                }`}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {item.label}
              </a>
            )
          })}

          <a
            href={loginHref}
            className="hidden h-8 cursor-pointer items-center justify-center rounded-md border border-[var(--border-default)] px-4 text-sm font-medium text-[var(--text-soft)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-main)] sm:inline-flex"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t.navLogin ?? 'Login'}
          </a>

          {ctaItem && (
            <a
              href={calendlyHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackScheduleDemo('navbar')}
              className="inline-flex h-8 items-center justify-center rounded-md bg-[var(--text-main)] px-4 text-white transition hover:opacity-85 focus-visible:outline-none sm:px-5"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
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
        <div className="mx-auto mt-2 max-w-7xl rounded-lg border border-[var(--border-default)] bg-white px-3 py-2 shadow-[0_4px_16px_rgba(15,17,21,0.06)] sm:hidden">
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
                className={`block px-2 py-2 text-sm transition-colors hover:text-[var(--text-main)] ${
                  active ? 'font-semibold text-[var(--text-main)]' : 'font-medium text-[var(--text-soft)]'
                }`}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {item.label}
              </a>
            )
          })}
          <div className="mt-1 border-t border-[var(--border-subtle)] pt-1">
            <a
              href={loginHref}
              onClick={() => setMenuOpen(false)}
              className="block cursor-pointer px-2 py-2 text-sm font-medium text-[var(--text-soft)] transition-colors hover:text-[var(--text-main)]"
              style={{ fontFamily: 'var(--font-ui)' }}
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
