import { useEffect, useState } from 'react'
import { HeroSection } from './components/landing/HeroSection'
import { AboutSection } from './components/landing/AboutSection'
import { CTASection } from './components/landing/CTASection'
import { Navbar } from './components/landing/Navbar'
import { text } from './i18n/text'

const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'

function App() {
  const [lang, setLang] = useState('es')
  const t = text?.[lang] ?? text?.es ?? {}

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  if (!text || !text[lang]) {
    console.warn(
      'Missing translations for',
      lang,
      '— falling back to',
      text?.es ? 'es' : 'empty object'
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg-main)] text-[var(--text-main)] antialiased">
      <Navbar
        ctaHref={calendlyHref}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      <main id="inicio" className="relative">
        <section id="hero">
          <HeroSection ctaHref={calendlyHref} t={t} />
        </section>

        <section id="about">
          <AboutSection t={t} />
        </section>

        <section id="cta">
          <CTASection ctaHref={calendlyHref} t={t} lang={lang} />
        </section>
      </main>

      <footer className="border-t border-black/[0.06] bg-white py-6">
        <div className="section-shell">
          <div className="flex flex-col items-center justify-between gap-2 text-center text-sm text-[var(--text-soft)] sm:flex-row sm:text-left">
            <p>
              © {new Date().getFullYear()} Relvo. {t.footerRights}
            </p>
            <p>contacto@relvoerp.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App