import { useEffect } from 'react'
import { Spotlight } from './components/Spotlight'
import { BackgroundLayers } from './components/BackgroundLayers'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { AIAssistant } from './components/AIAssistant'
import { Solution } from './components/Solution'
import { Pricing } from './components/Pricing'
import { EarlyBird } from './components/EarlyBird'
import { Footer } from './components/Footer'
import { initSupabase } from './config/supabase'

function App() {
  useEffect(() => {
    // Apply dark mode by default to body
    document.body.classList.add('dark')
    
    // Initialize Supabase on app mount
    initSupabase()
    
    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons({
        attrs: {
          'stroke-width': 1.5
        }
      })
    }
  }, [])

  return (
    <div id="app-body" className="antialiased selection:bg-indigo-500/30 selection:text-indigo-400 relative overflow-x-hidden">
      <Spotlight />
      <BackgroundLayers />
      <Navbar />
      <Hero />
      <Solution />
      <AIAssistant />
      <Pricing />
      <EarlyBird />
      <Footer />
    </div>
  )
}

export default App

