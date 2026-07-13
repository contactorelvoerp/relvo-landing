import { Helmet } from 'react-helmet-async'
import { Nav } from '../../components/v2/Nav'
import { Footer } from '../../components/v2/Footer'
import { Hero } from '../../components/v2/home/Hero'
import { SocialProof } from '../../components/v2/home/SocialProof'
import { Problem } from '../../components/v2/home/Problem'
import { Features } from '../../components/v2/home/Features'
import { UsageAI } from '../../components/v2/home/UsageAI'
import { Personas } from '../../components/v2/home/Personas'
import { Integrations } from '../../components/v2/home/Integrations'
import { ClosingCta } from '../../components/v2/home/ClosingCta'

const SITE = 'https://relvoerp.com'

export const HomePage = ({ lang, t, navigate, pathname }) => {
  const canonical = lang === 'en' ? `${SITE}/en` : `${SITE}/`

  return (
    <div className="relative min-h-screen overflow-x-clip bg-white text-ink antialiased">
      <Helmet htmlAttributes={{ lang }}>
        <title>{t.meta.title}</title>
        <meta name="description" content={t.meta.description} />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="es" href={`${SITE}/`} />
        <link rel="alternate" hrefLang="en" href={`${SITE}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={t.meta.title} />
        <meta property="og:description" content={t.meta.description} />
        <meta property="og:site_name" content="Relvo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.meta.title} />
        <meta name="twitter:description" content={t.meta.description} />
      </Helmet>

      <Nav lang={lang} t={t} navigate={navigate} pathname={pathname} />

      <main className="relative">
        {/* Boxed structure — vertical rails framing the content column */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-full max-w-content -translate-x-1/2 border-x border-[var(--border-default)] lg:block"
        />
        <Hero t={t} lang={lang} />
        <SocialProof t={t} />
        <Problem t={t} lang={lang} />
        <Features t={t} lang={lang} />
        <UsageAI t={t} />
        <Personas t={t} />
        <Integrations t={t} />
        <ClosingCta t={t} />
      </main>

      <Footer lang={lang} t={t} navigate={navigate} pathname={pathname} />
    </div>
  )
}
