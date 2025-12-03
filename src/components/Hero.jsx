import { ArrowRight, CheckCircle, TrendingUp, Zap } from 'lucide-react'
import { useTypewriter } from '../hooks/useTypewriter'

export const Hero = () => {
  const phrases = ["Cierres contables", "Conciliaciones", "Estados de resultado", "Flujos de caja"]
  const typewriterText = useTypewriter(phrases, {
    typeSpeed: 70,
    deleteSpeed: 35,
    delayAtEnd: 10600,
    delayBetweenPhrases: 12200,
  })

  return (
    <section className="md:pt-48 md:pb-32 z-10 pt-32 pr-6 pb-20 pl-6 relative">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-500 text-xs font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Próximamente: Contabilidad Autónoma v1.0
        </div>

        <h1 className="md:text-7xl leading-[1.1] text-5xl font-medium tracking-tight mb-6">
          <span className="bg-clip-text font-semibold text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            {typewriterText}
          </span>
          <span className="typewriter-cursor"></span>
          <br />
          <span className="text-[var(--text-main)]">en piloto automático</span>
        </h1>

        <p className="md:text-xl text-muted leading-relaxed text-lg font-light max-w-2xl mr-auto mb-10 ml-auto">
          Relvo es el IA - Based ERP que centraliza y automatiza tus finanzas. Tareas repetitivas en manos de agentes. Categorización inteligente. Aprende de tus datos. Cierres en un día.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#early-bird"
            className="w-full sm:w-auto px-8 py-3 bg-[var(--text-main)] text-[var(--bg-main)] rounded-full font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
          >
            Quiero probarlo <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Dashboard Abstract Visual */}
      <div className="mt-20 max-w-6xl mx-auto animate-float">
        <div className="glass-panel rounded-xl p-1 shadow-2xl shadow-indigo-500/10">
          <div className="bg-[var(--card-inner)] rounded-lg p-6 md:p-10 transition-colors duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="col-span-1 glass-panel p-5 rounded-lg border-0 bg-[var(--bg-main)]/50">
                <div className="text-muted text-xs font-medium uppercase tracking-widest mb-2">
                  Conciliación Bancaria
                </div>
                <div className="text-3xl font-medium mb-1">100%</div>
                <div className="text-xs text-green-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Bancos LATAM Sincronizados
                </div>
              </div>
              
              <div className="col-span-1 glass-panel border-0 rounded-lg p-5">
                <div className="text-muted text-xs font-medium uppercase tracking-widest mb-2">
                  Ventas
                </div>
                <div className="text-3xl font-medium mb-1">$4.2M</div>
                <div className="text-xs text-indigo-500 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Shopify + Bsale
                </div>
              </div>
              
              <div className="col-span-1 glass-panel p-5 rounded-lg border-0 bg-[var(--bg-main)]/50">
                <div className="text-muted text-xs font-medium uppercase tracking-widest mb-2">
                  Asientos contables
                </div>
                <div className="text-3xl font-medium mb-1">1,402</div>
                <div className="text-xs text-muted flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Centralizado en Relvo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

