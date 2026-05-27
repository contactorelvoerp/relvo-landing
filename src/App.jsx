import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { HeroSection } from './components/landing/HeroSection'
import { ProblemConsequences } from './components/landing/ProblemConsequences'
import { AboutSection } from './components/landing/AboutSection'
import { CTASection } from './components/landing/CTASection'
import { Navbar } from './components/landing/Navbar'
import { FooterSection } from './components/landing/FooterSection'
import { SocialProofSection } from './components/landing/SocialProofSection'
import { ShaderBackground } from './components/landing/ShaderBackground'
import { LoginRedirect } from './pages/LoginRedirect'
import { ShaderOnly } from './pages/ShaderOnly'
import { LinkedInBanner } from './pages/LinkedInBanner'
import { DocsPage } from './pages/DocsPage'
import { AboutPage } from './pages/AboutPage'
import { PreciosPage } from './pages/PreciosPage'
import { text } from './i18n/text'

const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'

function navigate(path) {
  console.log('[navigate] pushing path:', path)
  window.history.pushState({}, '', path)
  window.scrollTo(0, 0)
  window.dispatchEvent(new PopStateEvent('popstate'))
  console.log('[navigate] done, pathname now:', window.location.pathname)
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

  const page4Ref = useRef(null)
  const lang = 'es'
  const t = text?.[lang] ?? text?.es ?? {}

  if (pathname === '/docs' || pathname.startsWith('/docs/')) return (
    <DocsPage pathname={pathname} navigate={navigate} t={t} />
  )

  if (pathname === '/about-us') return (
    <AboutPage navigate={navigate} t={t} />
  )

  if (pathname === '/precios') return (
    <PreciosPage navigate={navigate} />
  )

  if (pathname === '/login') return (
    <LoginRedirect />
  )

  if (pathname === '/shader-only') return <ShaderOnly />
  if (pathname === '/linkedin-banner') return <LinkedInBanner />

  return (
    <div className="relative min-h-screen overflow-x-clip text-[var(--text-main)] antialiased">
      <ShaderBackground />
      <Helmet>
        <title>Relvo | Infraestructura de ingresos B2B para LATAM</title>
        <meta name="description" content="Relvo acelera la recaudación de empresas B2B en LATAM automatizando desde el cierre comercial hasta el cobro con IA" />
        <link rel="canonical" href="https://relvoerp.com/" />
        {/* Open Graph — controla previews en WhatsApp, Slack, iMessage, etc. */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://relvoerp.com/" />
        <meta property="og:title" content="Relvo | Infraestructura de ingresos B2B para LATAM" />
        <meta property="og:description" content="Relvo acelera la recaudación de empresas B2B en LATAM automatizando desde el cierre comercial hasta el cobro con IA" />
        <meta property="og:site_name" content="Relvo" />
        {/* Twitter/X card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Relvo | Infraestructura de ingresos B2B para LATAM" />
        <meta name="twitter:description" content="Relvo acelera la recaudación de empresas B2B en LATAM automatizando desde el cierre comercial hasta el cobro con IA" />
      </Helmet>
      <Navbar t={t} navigate={navigate} scrollThreshold={page4Ref} />

      <main id="inicio" className="relative z-10">
        <HeroSection />

        <ProblemConsequences />

        <div ref={page4Ref}>
          <section id="producto" style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 1200px' }}>
            <AboutSection t={t} />
          </section>

          <div style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 600px' }}>
            <SocialProofSection t={t} />
          </div>

          <section id="demos" style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 800px' }}>
            <CTASection ctaHref={calendlyHref} t={t} />
          </section>

          <FooterSection t={t} navigate={navigate} />
        </div>
      </main>
    </div>
  )
}

export default App
