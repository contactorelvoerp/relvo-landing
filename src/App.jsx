import { HeroSection } from './components/landing/HeroSection'
import { AboutSection } from './components/landing/AboutSection'
import { CTASection } from './components/landing/CTASection'
import { Navbar } from './components/landing/Navbar'
import { Reveal } from './components/landing/Reveal'
import { SocialProofSection } from './components/landing/SocialProofSection'
import { text } from './i18n/text'

const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'

function App() {
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
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg-main)] text-[var(--text-main)] antialiased">
      <Navbar t={t} />

      <main id="inicio" className="relative">
        <section id="hero">
          <HeroSection t={t} />
        </section>

        <section aria-label="Mensaje de transición" className="bg-white py-20 sm:py-24">
          <div className="section-shell">
            <Reveal className="mx-auto max-w-5xl text-center">
              <p className="text-[clamp(1.75rem,2.35vw,2.35rem)] font-semibold leading-[1.14] tracking-[-0.035em] text-[var(--text-main)]">
                <span>{t.bridgeFrom}</span>
                <span className="mx-3 text-[var(--text-soft)]">→</span>
                <span>
                  {hasBridgeToHighlight ? (
                    <>
                      {bridgeTo.slice(0, bridgeToHighlightIndex)}
                      <span className="relative inline-block px-1">
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-[0.12em] h-[0.52em] rounded-[2px] bg-[var(--brand-warm)]"
                        />
                        <span className="relative z-10">
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

        <section id="producto">
          <AboutSection t={t} />
        </section>

        <SocialProofSection t={t} />

        <section id="demos">
          <CTASection ctaHref={calendlyHref} t={t} />
        </section>
      </main>

      <footer className="bg-white pb-10 pt-16">
        <div className="section-shell">
          <Reveal className="bg-hero rounded-[var(--radius-2xl)] px-7 py-10 text-white shadow-[0_26px_60px_rgba(0,0,0,0.26)] sm:px-10 sm:py-12">
            <div className="grid gap-10 md:grid-cols-[1.2fr_1.8fr] md:items-start">
              <div>
                <p className="font-display text-sm font-semibold tracking-[0.12em] text-white/90">
                  RELVO
                </p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
                  {t.footerTagline}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  © {new Date().getFullYear()} Relvo. {t.footerRights}
                </p>
                <p className="mt-2 text-sm text-white/60">contacto@relvoerp.com</p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-3 sm:gap-8">
                {footerColumns.map((column) => (
                  <div key={column.title} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                      {column.title}
                    </p>
                    <div className="space-y-2 text-white/55">
                      {column.links
                        ?.filter((link) => String(link?.label || '').trim().toLowerCase() !== 'link')
                        .map((link) => (
                        <a
                          key={`${column.title}-${link.label}`}
                          className="block hover:text-white"
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
  )
}

export default App