import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { HeroSection } from './components/landing/HeroSection'
import { AboutSection } from './components/landing/AboutSection'
import { CTASection } from './components/landing/CTASection'
import { Navbar } from './components/landing/Navbar'
import { Reveal } from './components/landing/Reveal'
import { SocialProofSection } from './components/landing/SocialProofSection'
import { ShaderBackground } from './components/landing/ShaderBackground'
import { ComingSoon } from './pages/ComingSoon'
import { text } from './i18n/text'

const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'

function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const handler = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  if (pathname === '/login') return <ComingSoon navigate={navigate} />

  const lang = 'es'
  const t = text?.[lang] ?? text?.es ?? {}
  const bridgeTo = String(t.bridgeTo || '')
  const bridgeToHighlight = String(t.bridgeToHighlight || '').trim()
  const bridgeToHighlightIndex = bridgeToHighlight ? bridgeTo.indexOf(bridgeToHighlight) : -1
  const hasBridgeToHighlight = bridgeToHighlightIndex >= 0
  const bridgeToEmphasis = String(t.bridgeToEmphasis || '').trim()
  const bridgeToEmphasisIndex = bridgeToEmphasis ? bridgeToHighlight.indexOf(bridgeToEmphasis) : -1
  const hasBridgeToEmphasis = bridgeToEmphasisIndex >= 0
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
      <Navbar t={t} navigate={navigate} />

      <main id="inicio" className="relative z-10">
        <HeroSection t={t} />

        <section aria-label="Mensaje de transición" className="py-20 sm:py-24">
          <div className="section-shell">
            <Reveal className="mx-auto max-w-5xl text-center">
              <p className="text-[clamp(1.75rem,2.35vw,2.35rem)] font-semibold leading-[1.14] tracking-[-0.035em] text-[var(--text-main)]">
                <span>{t.bridgeFrom}</span>
                <span className="mx-3 text-[var(--text-soft)]">→</span>
                <span>
                  {hasBridgeToHighlight ? (
                    <>
                      {bridgeTo.slice(0, bridgeToHighlightIndex)}
                      <span
                        className="px-[0.18em]"
                        style={{
                          background: 'linear-gradient(transparent 48%, var(--brand-warm) 48%)',
                          WebkitBoxDecorationBreak: 'clone',
                          boxDecorationBreak: 'clone',
                          borderRadius: '2px',
                        }}
                      >
                        {hasBridgeToEmphasis ? (
                          <>
                            {bridgeToHighlight.slice(0, bridgeToEmphasisIndex)}
                            <em className="font-cursive-emphasis">{bridgeToEmphasis}</em>
                            {bridgeToHighlight.slice(bridgeToEmphasisIndex + bridgeToEmphasis.length)}
                          </>
                        ) : (
                          bridgeToHighlight
                        )}
                      </span>
                      {bridgeTo.slice(bridgeToHighlightIndex + bridgeToHighlight.length)}
                    </>
                  ) : (
                    bridgeTo
                  )}
                </span>
              </p>
              <p className="mx-auto mt-7 max-w-3xl text-base leading-[1.55] text-[var(--text-soft)] sm:text-lg">
                {t.bridgeSupport}
              </p>
            </Reveal>
          </div>
        </section>

        <div>
          <section id="producto">
            <AboutSection t={t} />
          </section>

          <SocialProofSection t={t} />

          <section id="demos">
            <CTASection ctaHref={calendlyHref} t={t} />
          </section>

          <footer className="pb-10 pt-16">
        <div className="section-shell">
          <Reveal className="rounded-[var(--radius-2xl)] bg-white/60 px-7 py-10 shadow-[0_20px_50px_rgba(61,61,61,0.10)] backdrop-blur-sm sm:px-10 sm:py-12">
            <div className="grid gap-10 md:grid-cols-[1.2fr_1.8fr] md:items-start">
              <div>
                <p className="font-display text-sm font-semibold tracking-[0.12em] text-[var(--text-main)]">
                  RELVO
                </p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-[var(--text-muted)]">
                  {t.footerTagline}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
                  © {new Date().getFullYear()} Relvo. {t.footerRights}
                </p>
                <p className="mt-2 text-sm text-[var(--text-soft)]">contacto@relvoerp.com</p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3 sm:gap-8">
                {footerColumns.map((column) => (
                  <div key={column.title} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {column.title}
                    </p>
                    <div className="space-y-2 text-[var(--text-soft)]">
                      {column.links
                        ?.filter((link) => String(link?.label || '').trim().toLowerCase() !== 'link')
                        .map((link) => (
                        <a
                          key={`${column.title}-${link.label}`}
                          className="block hover:text-[var(--text-main)]"
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                        >
                          {link.label}
                        </a>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App