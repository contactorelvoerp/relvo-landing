import { Helmet } from 'react-helmet-async'
import { CompanyAboutSection } from '../components/landing/CompanyAboutSection'
import { Navbar } from '../components/landing/Navbar'
import { FooterSection } from '../components/landing/FooterSection'

export const AboutPage = ({ navigate, t }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fcfcf8] text-[var(--text-main)]">
      <Helmet>
        <title>Nosotros | Relvo</title>
        <meta
          name="description"
          content="Relvo construye una capa financiera AI-native para automatizar el flujo quote-to-cash de empresas B2B en LATAM."
        />
      </Helmet>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at top left, rgba(208,255,11,0.14), transparent 28%),
            radial-gradient(circle at top right, rgba(255,149,102,0.18), transparent 24%),
            linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.98))
          `,
        }}
      />

      <Navbar t={t} navigate={navigate} activePath="/about-us" forceBackdrop />

      <main className="relative z-10 pt-16 sm:pt-20">
        <CompanyAboutSection />
      </main>
      <FooterSection t={t} navigate={navigate} />
    </div>
  )
}
