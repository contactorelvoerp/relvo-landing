import { useState, useEffect } from 'react'
import { paths, roleSlugs, stripLang } from '../../i18n/copy'
import { trackScheduleDemo } from '../../utils/analytics'

const loginHref = 'https://app.relvoerp.com/login'

export const Nav = ({ lang, t, navigate, pathname }) => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const p = paths[lang]
  const isHome = stripLang(pathname) === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const go = (event, href, scrollTo = null) => {
    event.preventDefault()
    setMenuOpen(false)
    navigate(href, scrollTo)
  }

  // "Product" scrolls to the features on home, or navigates home + scrolls
  const handleProduct = (event) => {
    event.preventDefault()
    setMenuOpen(false)
    if (isHome) {
      document.getElementById('producto')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate(p.home, 'producto')
    }
  }

  const handleStartFree = (event, source) => {
    event.preventDefault()
    setMenuOpen(false)
    trackScheduleDemo(source)
    if (isHome) {
      document.getElementById('start')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      navigate(p.home, 'start')
    }
  }

  // Same page in the other language
  const otherLang = lang === 'es' ? 'en' : 'es'
  const langHref = (() => {
    const neutral = stripLang(pathname)
    const cur = paths[lang]
    const other = paths[otherLang]
    if (neutral === stripLang(cur.pricing)) return other.pricing
    if (neutral.startsWith(stripLang(cur.solutions))) {
      const slug = neutral.split('/').pop()
      const roleKey = Object.entries(roleSlugs[lang]).find(([, s]) => s === slug)?.[0]
      return roleKey ? other.solutionRole(roleSlugs[otherLang][roleKey]) : other.solutions
    }
    return other.home
  })()

  const links = [
    { label: t.nav.product, href: `${p.home}#producto`, onClick: handleProduct },
    { label: t.nav.solutions, href: p.solutions, onClick: (e) => go(e, p.solutions) },
    { label: t.nav.pricing, href: p.pricing, onClick: (e) => go(e, p.pricing) },
    { label: t.nav.docs, href: p.docs, onClick: (e) => go(e, p.docs) },
  ]

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled || menuOpen
            ? 'border-b border-[var(--border-subtle)] bg-white/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="v2-container flex h-16 items-center justify-between gap-6">
          <a
            href={p.home}
            onClick={(e) => go(e, p.home)}
            className="flex shrink-0 cursor-pointer items-center gap-2"
            aria-label="Relvo — home"
          >
            <img src="/logo-mark-dark.svg" alt="" aria-hidden="true" className="h-5 w-auto" />
            <img src="/relvo-wordmark-dark.svg" alt="relvo" className="h-5 w-auto" />
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.onClick}
                className="cursor-pointer font-sans text-[0.9375rem] font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <a
              href={langHref}
              onClick={(e) => go(e, langHref)}
              aria-label={t.nav.langSwitchLabel}
              className="v2-eyebrow cursor-pointer text-muted-aa transition-colors hover:text-ink"
            >
              {t.nav.langSwitch}
            </a>
            <a
              href={loginHref}
              className="font-sans text-[0.9375rem] font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
            >
              {t.nav.login}
            </a>
            <a
              href={`${p.home}#start`}
              onClick={(e) => handleStartFree(e, 'navbar')}
              className="inline-flex h-10 cursor-pointer items-center rounded-[var(--radius-button)] bg-lime-brand px-5 font-sans text-[0.9375rem] font-semibold text-ink transition-all duration-200 hover:brightness-105 hover:shadow-[0_4px_18px_rgba(208,255,11,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              {t.nav.startFree}
            </a>
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href={`${p.home}#start`}
              onClick={(e) => handleStartFree(e, 'navbar_mobile')}
              className="inline-flex h-10 cursor-pointer items-center rounded-[var(--radius-button)] bg-lime-brand px-4 font-sans text-sm font-semibold text-ink"
            >
              {t.nav.startFree}
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[var(--radius-button)] text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <line x1="3" y1="6.5" x2="17" y2="6.5" />
                  <line x1="3" y1="13.5" x2="17" y2="13.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-white pt-20 md:hidden">
          <nav className="v2-container flex flex-1 flex-col gap-1 pt-6" aria-label="Mobile">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.onClick}
                className="cursor-pointer border-b border-[var(--border-subtle)] py-4 font-sans text-2xl font-medium text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href={loginHref}
              className="cursor-pointer border-b border-[var(--border-subtle)] py-4 font-sans text-2xl font-medium text-ink-soft"
            >
              {t.nav.login}
            </a>
            <a
              href={langHref}
              onClick={(e) => go(e, langHref)}
              aria-label={t.nav.langSwitchLabel}
              className="v2-eyebrow cursor-pointer py-6 text-muted-aa"
            >
              {lang === 'es' ? 'English version' : 'Versión en español'}
            </a>
          </nav>
        </div>
      )}
    </>
  )
}
