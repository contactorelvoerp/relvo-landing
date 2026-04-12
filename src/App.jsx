import { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { HeroSection } from './components/landing/HeroSection'
import { AboutSection } from './components/landing/AboutSection'
import { CTASection } from './components/landing/CTASection'
import { Navbar } from './components/landing/Navbar'
import { SocialProofSection } from './components/landing/SocialProofSection'
import { ShaderBackground } from './components/landing/ShaderBackground'
import { ComingSoon } from './pages/ComingSoon'
import { ShaderOnly } from './pages/ShaderOnly'
import { DocsPage } from './pages/DocsPage'
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

  const page4Ref = useRef(null)

  if (pathname === '/docs' || pathname.startsWith('/docs/')) return (
    <DocsPage pathname={pathname} navigate={navigate} />
  )

  if (pathname === '/login') return (
    <div className="relative min-h-screen">
      <ShaderBackground variant="login" />
      <ComingSoon navigate={navigate} />
    </div>
  )

  if (pathname === '/shader-only') return <ShaderOnly />

  const lang = 'es'
  const t = text?.[lang] ?? text?.es ?? {}
  const footerColumns = (t.footerColumns ?? []).filter((column) => {
    const title = String(column?.title || '').trim().toLowerCase()
    return title && title !== 'feature'
  })

  return (
    <div className="relative min-h-screen overflow-x-hidden text-[var(--text-main)] antialiased">
      <ShaderBackground />
      <Helmet>
        <title>Relvo | Infraestructura de Ingresos con IA para B2B en LATAM</title>
        <meta name="description" content="Relvo acelera la recaudación de empresas B2B en LATAM automatizando desde el cierre comercial hasta el cobro con IA" />
        <link rel="canonical" href="https://relvoerp.com/" />
        {/* Open Graph — controla previews en WhatsApp, Slack, iMessage, etc. */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://relvoerp.com/" />
        <meta property="og:title" content="Relvo | Infraestructura de Ingresos con IA para B2B en LATAM" />
        <meta property="og:description" content="Relvo acelera la recaudación de empresas B2B en LATAM automatizando desde el cierre comercial hasta el cobro con IA" />
        <meta property="og:site_name" content="Relvo" />
        {/* Twitter/X card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Relvo | Infraestructura de Ingresos con IA para B2B en LATAM" />
        <meta name="twitter:description" content="Relvo acelera la recaudación de empresas B2B en LATAM automatizando desde el cierre comercial hasta el cobro con IA" />
      </Helmet>
      <Navbar t={t} navigate={navigate} scrollThreshold={page4Ref} />

      <main id="inicio" className="relative z-10">
        <HeroSection t={t} page4Ref={page4Ref} />

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

          <footer className="px-4 pb-10 pt-16 sm:px-6 sm:pt-20 md:pt-28" style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 600px' }}>
            <div className="section-shell">
              <div
                className="mx-auto max-w-6xl rounded-2xl bg-white/75 px-5 py-8 backdrop-blur-sm sm:px-8 sm:py-10 md:px-12 md:py-14"
                style={{ border: '1px solid rgba(19,19,30,0.06)' }}
              >
                <div className="grid gap-10 md:grid-cols-[1.2fr_1.8fr] md:items-start">
                  {/* Left — brand + tagline */}
                  <div>
                    <img
                      src="/relvo-wordmark-dark.svg"
                      alt="relvo"
                      className="h-5 w-auto sm:h-6"
                    />
                    <p
                      className="mt-4 max-w-xs"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.85rem',
                        lineHeight: 1.6,
                        color: 'var(--text-soft)',
                      }}
                    >
                      {t.footerTagline}
                    </p>
                    <p
                      className="mt-4"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      © {new Date().getFullYear()} Relvo. {t.footerRights}
                    </p>
                    <p
                      className="mt-1"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.8rem',
                        color: 'var(--text-soft)',
                      }}
                    >
                      contacto@relvoerp.com
                    </p>
                  </div>

                  {/* Right — nav columns */}
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
                    {footerColumns.map((column) => (
                      <div key={column.title} className="space-y-3">
                        <p
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {column.title}
                        </p>
                        <div className="space-y-2">
                          {column.links
                            ?.filter((link) => String(link?.label || '').trim().toLowerCase() !== 'link')
                            .map((link) => (
                            <a
                              key={`${column.title}-${link.label}`}
                              className="block transition hover:text-[var(--text-main)]"
                              href={link.href}
                              target={link.external ? '_blank' : undefined}
                              rel={link.external ? 'noopener noreferrer' : undefined}
                              style={{
                                fontFamily: 'var(--font-ui)',
                                fontSize: '0.85rem',
                                color: 'var(--text-soft)',
                              }}
                            >
                              {link.label}
                            </a>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
