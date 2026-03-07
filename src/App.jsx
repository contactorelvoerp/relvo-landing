import { HeroSection } from './components/landing/HeroSection'

const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg-main)] text-[var(--text-main)] antialiased">
      <div aria-hidden className="page-glow" />

      <main id="inicio" className="relative">
        <HeroSection ctaHref={calendlyHref} />
      </main>
    </div>
  )
}

export default App
