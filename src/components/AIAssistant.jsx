import { BookOpen, Landmark, Sparkles, Bot, MoreHorizontal, ArrowUp } from 'lucide-react'

export const AIAssistant = () => {
  return (
    <section className="z-10 pt-24 pr-6 pb-32 pl-6 relative" id="ai-assistant">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* EXPERTISE SPECIFICATIONS (LEFT SIDE) */}
          <div className="order-2 lg:order-1 space-y-10">
            <div>
              <h2 className="text-3xl font-medium tracking-tight mb-4">Tu analista financiero 24/7</h2>
              <p className="text-muted text-lg font-light leading-relaxed">
                Relvo AI no es solo un chat. Es un experto tributario y financiero conectado en tiempo real a tus datos, capaz de responder consultas complejas al instante.
              </p>
            </div>

            <div className="space-y-6">
              {/* Item 1: IFRS */}
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-main)] text-lg mb-1">Normativa IFRS Actualizada</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Motor de conocimiento sincronizado con los últimos estándares internacionales de contabilidad (Full y Pyme).
                  </p>
                </div>
              </div>

              {/* Item 2: SII / Tax */}
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-main)] text-lg mb-1">Leyes Tributarias SII (Chile)</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Base legal actualizada con las últimas reformas, circulares y oficios del Servicio de Impuestos Internos.
                  </p>
                </div>
              </div>

              {/* Item 3: Analysis */}
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-main)] text-lg mb-1">Auditoría y Compliance</h3>
                  <p className="text-sm text-muted leading-relaxed">
                    Detección automática de discrepancias y alertas preventivas sobre flujo de caja y obligaciones laborales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CHAT INTERFACE (RIGHT SIDE) */}
          <div className="order-1 lg:order-2">
            <div className="glass-panel rounded-2xl border border-[var(--glass-border)] shadow-2xl overflow-hidden flex flex-col relative z-20">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-[var(--glass-border)] bg-[var(--nav-bg)]/80 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 relative">
                    <Sparkles className="w-4 h-4" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[var(--bg-main)] rounded-full"></span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Relvo AI</div>
                    <div className="text-[10px] text-muted">Conectado a Bancos, SII, Buk & Shopify</div>
                  </div>
                </div>
                <button className="text-muted hover:text-[var(--text-main)] transition-colors p-1 rounded-md hover:bg-[var(--glass-hover)]">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="p-6 space-y-6 min-h-[360px] bg-gradient-to-b from-[var(--bg-main)]/50 to-[var(--bg-main)]/80 relative">
                <div className="flex justify-center">
                  <span className="text-[10px] font-medium text-muted uppercase tracking-widest opacity-60">
                    Hoy, 10:45 AM
                  </span>
                </div>

                <div className="flex gap-4 max-w-[95%]">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex-shrink-0 flex items-center justify-center text-indigo-500 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="space-y-2">
                    <div className="bg-[var(--card-inner)] border border-[var(--glass-border)] rounded-2xl rounded-tl-sm p-4 text-sm leading-relaxed shadow-sm">
                      <p>
                        Hola. He conciliado los pagos de nómina desde <span className="font-medium text-[var(--text-main)]">Buk</span> y las ventas de ayer de <span className="font-medium text-[var(--text-main)]">Shopify</span>. Tu flujo de caja actual es de $4.2M (+12%).
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-1 rounded-md">
                        Ver reporte SII
                      </span>
                      <span className="text-[10px] bg-[var(--glass-hover)] text-muted border border-[var(--glass-border)] px-2 py-1 rounded-md">
                        Detalle nómina
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[var(--nav-bg)] border-t border-[var(--glass-border)]">
                <div className="relative flex items-center group">
                  <input
                    type="text"
                    placeholder="Pregunta sobre gastos, ventas o impuestos..."
                    className="w-full bg-[var(--bg-main)] text-sm border border-[var(--glass-border)] rounded-full pl-12 pr-12 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-muted/50"
                  />
                  <button className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors shadow-lg shadow-indigo-500/20">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decoration behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
    </section>
  )
}

