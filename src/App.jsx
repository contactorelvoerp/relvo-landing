import { useState, useEffect, lazy, Suspense } from 'react'
import { copy, getLangFromPath, stripLang, roleSlugs } from './i18n/copy'
import { HomePage } from './pages/v2/HomePage'
import { SolutionsIndexPage, SolutionRolePage } from './pages/v2/SolutionsPage'
import { PricingPage } from './pages/v2/PricingPage'
import { LoginRedirect } from './pages/LoginRedirect'

const ShaderOnly = lazy(() => import('./pages/ShaderOnly').then((m) => ({ default: m.ShaderOnly })))
const LinkedInBanner = lazy(() => import('./pages/LinkedInBanner').then((m) => ({ default: m.LinkedInBanner })))
const DocsPage = lazy(() => import('./pages/DocsPage').then((m) => ({ default: m.DocsPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })))

const lazyPage = (node) => <Suspense fallback={<div className="min-h-screen bg-white" />}>{node}</Suspense>

let _pendingScroll = null

function navigate(path, scrollAfter = null) {
  _pendingScroll = scrollAfter
  window.history.pushState({}, '', path)
  window.scrollTo(0, 0)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const handler = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_path: pathname })
    }
  }, [pathname])

  // After navigation, scroll to the requested section on the new page.
  useEffect(() => {
    if (!_pendingScroll) return
    const id = _pendingScroll
    _pendingScroll = null
    const timer = setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 96
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 120)
    return () => clearTimeout(timer)
  }, [pathname])

  const lang = getLangFromPath(pathname)
  const neutral = stripLang(pathname)
  const t = copy[lang]
  const pageProps = { lang, t, navigate, pathname }

  // Utility / legacy routes
  if (neutral === '/login') return <LoginRedirect />
  if (neutral === '/shader-only') return lazyPage(<ShaderOnly />)
  if (neutral === '/linkedin-banner') return lazyPage(<LinkedInBanner />)
  if (neutral === '/docs' || neutral.startsWith('/docs/')) {
    return lazyPage(<DocsPage pathname={neutral} navigate={navigate} v2={pageProps} />)
  }
  if (neutral === '/about-us') return lazyPage(<AboutPage v2={pageProps} />)

  // Pricing — both localized paths work in either language
  if (neutral === '/precios' || neutral === '/pricing') return <PricingPage {...pageProps} />

  // Solutions — index + per-role
  const solutionsMatch = neutral.match(/^\/(soluciones|solutions)(?:\/([^/]+))?$/)
  if (solutionsMatch) {
    const slug = solutionsMatch[2]
    if (!slug) return <SolutionsIndexPage {...pageProps} />
    const roleKey =
      Object.entries(roleSlugs[lang]).find(([, s]) => s === slug)?.[0] ??
      Object.entries(roleSlugs[lang === 'es' ? 'en' : 'es']).find(([, s]) => s === slug)?.[0]
    if (roleKey) return <SolutionRolePage {...pageProps} roleKey={roleKey} />
    return <SolutionsIndexPage {...pageProps} />
  }

  return <HomePage {...pageProps} />
}

export default App
