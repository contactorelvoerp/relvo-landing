import { useState, useEffect } from 'react'
import { trackScheduleDemo } from '../../utils/analytics'

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

  const handleCtaClick = (event, source) => {
    event.preventDefault()
    trackScheduleDemo(source)
    if (!isPage) {
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate?.('/')
      window.setTimeout(() => {
        document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 120)
    }
  }

  return (
    <>
    {/* ── Mobile bar (< sm) ── */}
    <div className="fixed inset-x-0 top-0 z-50 sm:hidden" style={{ background: 'rgba(252,252,248,0.92)', backdropFilter: 'blur(12px)', borderBottom: menuOpen ? '1px solid var(--border-subtle)' : '1px solid transparent' }}>
      <div className="flex h-14 items-center justify-between px-4">
        <a href={homeHref} onClick={handleHomeClick} className="flex items-center gap-1.5">
          <img src="/logo-mark-dark.svg" alt="" aria-hidden="true" className="h-4 w-auto" />
          <img src="/relvo-wordmark-dark.svg" alt="relvo" className="h-4 w-auto" />
        </a>
        <div className="flex items-center gap-2">
          {ctaItem && (
            <a
              href="/#contacto"
              onClick={(e) => handleCtaClick(e, 'navbar_mobile')}
              className="inline-flex h-9 items-center justify-center rounded-md bg-[var(--text-main)] px-4 text-white transition hover:opacity-90"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              {t.navCta}
            </a>
          )}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--text-muted)] transition hover:text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="14" x2="17" y2="14" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-[var(--border-subtle)] bg-white px-3 pb-3 pt-2 shadow-[0_8px_24px_rgba(15,17,21,0.08)]">
          {regularItems.map((item) => {
            const active = isActiveItem(item.href)
            return (
              <a
                key={item.label}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                onClick={item.href?.startsWith('/')
                  ? (event) => { handleRouteClick(event, item.href); setMenuOpen(false) }
                  : (event) => { handleAnchorClick(event, item.href); setMenuOpen(false) }}
                className={`block px-2 py-3 text-[0.95rem] transition-colors hover:text-[var(--text-main)] ${
                  active ? 'font-semibold text-[var(--text-main)]' : 'font-medium text-[var(--text-soft)]'
                }`}
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                {item.label}
              </a>
            )
          })}
          <div className="mt-1 border-t border-[var(--border-subtle)] pt-2">
            <a
              href={loginHref}
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-3 text-[0.95rem] font-medium text-[var(--text-soft)] transition-colors hover:text-[var(--text-main)]"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {t.navLogin ?? 'Login'}
            </a>
          </div>
        </div>
      )}
    </div>

    {/* ── Desktop navbar (≥ sm) ── */}
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
                className={`px-1 py-1 text-sm transition-colors duration-150 focus-visible:outline-none ${
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
            className="h-8 cursor-pointer items-center justify-center rounded-md border border-[var(--border-default)] px-4 text-sm font-medium text-[var(--text-soft)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-main)] inline-flex"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {t.navLogin ?? 'Login'}
          </a>

          {ctaItem && (
            <a
              href="/#contacto"
              onClick={(e) => handleCtaClick(e, 'navbar')}
              className="inline-flex h-8 items-center justify-center rounded-md bg-[var(--text-main)] px-4 text-white transition hover:opacity-85 focus-visible:outline-none sm:px-5"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}
            >
              {t.navCta}
            </a>
          )}
        </div>
      </nav>
    </header>
    </>
  )
}
