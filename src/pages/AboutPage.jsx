import { Helmet } from 'react-helmet-async'
import { CompanyAboutSection } from '../components/landing/CompanyAboutSection'
import { Nav } from '../components/v2/Nav'
import { Footer } from '../components/v2/Footer'

export const AboutPage = ({ v2 }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)]">
      <Helmet>
        <title>Nosotros | Relvo</title>
        <meta
          name="description"
          content="Relvo construye una capa financiera AI-native para automatizar el flujo quote-to-cash de empresas B2B en LATAM."
        />
      </Helmet>

      <Nav lang={v2.lang} t={v2.t} navigate={v2.navigate} pathname={v2.pathname} />

      <main className="relative z-10">
        <CompanyAboutSection />
      </main>
      <Footer lang={v2.lang} t={v2.t} navigate={v2.navigate} pathname={v2.pathname} />
    </div>
  )
}
