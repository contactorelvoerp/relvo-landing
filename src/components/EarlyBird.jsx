import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { submitEarlyBird, isSupabaseConfigured } from '../config/supabase'

export const EarlyBird = () => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingresa un email válido' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Por favor ingresa un email válido' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await submitEarlyBird(email)

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: result.message })
      }
      
      // Auto-hide message after 5 seconds
      setTimeout(() => setMessage(null), 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setMessage({ 
        type: 'error', 
        text: 'Hubo un error. Por favor intenta de nuevo más tarde.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="overflow-hidden text-center z-10 pt-32 pr-6 pb-32 pl-6 relative" id="early-bird">
      {/* Background decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full -z-10"></div>

      <div className="max-w-xl mx-auto relative glass-panel p-8 md:p-12 rounded-3xl border border-indigo-500/20">
        <div className="inline-flex gap-2 text-xs font-medium text-indigo-400 bg-indigo-500/10 border-indigo-500/20 border rounded-full mb-6 pt-1 pr-3 pb-1 pl-3 items-center">
          Early Access: Q1 2026
        </div>

        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Migra a Relvo</h2>
        <p className="text-muted font-light mb-8">
          Estamos abriendo cupos para empresas listas para dejar su ERP tradicional. Asegura tu lugar para recibir onboarding prioritario.
        </p>

        <form onSubmit={handleSubmit} className="relative w-full max-w-sm mx-auto group">
          <div className="relative flex items-center">
            <Mail className="absolute left-4 w-5 h-5 text-muted transition-colors group-focus-within:text-indigo-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@empresa.com"
              disabled={isSubmitting || !isSupabaseConfigured}
              className="border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-muted/50 text-sm w-full border rounded-full pt-4 pr-32 pb-4 pl-12 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isSubmitting || !isSupabaseConfigured}
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-[var(--text-main)] text-[var(--bg-main)] hover:bg-indigo-600 hover:text-white rounded-full px-5 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                isSupabaseConfigured ? 'Unirme' : 'Configura Supabase'
              )}
            </button>
          </div>
          
          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-muted opacity-70">
            <Lock className="w-3 h-3" /> Sin spam. Solo updates del producto.
          </div>

          {/* Message feedback */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm transition-opacity duration-300 ${
                message.type === 'success'
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

