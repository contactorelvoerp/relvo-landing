import { useState } from 'react'
import { Check, Minus, ChevronDown, ChevronUp } from 'lucide-react'

export const Pricing = () => {
  const [isTableExpanded, setIsTableExpanded] = useState(false)

  const toggleTable = () => {
    setIsTableExpanded(!isTableExpanded)
    
    if (isTableExpanded) {
      // Scroll back to table when collapsing
      document.getElementById('comparison-container')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  return (
    <section className="border-[var(--glass-border)] z-10 border-t pt-24 pr-6 pb-24 pl-6 relative scroll-mt-32" id="precios">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-medium tracking-tight mb-16 text-center">
          Planes diseñados para escalar
        </h2>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-24">
          {/* Starter */}
          <div className="glass-panel p-8 rounded-2xl border-t border-[var(--glass-border)] hover:bg-[var(--glass-hover)] transition-colors h-full flex flex-col">
            <h3 className="text-lg font-medium text-muted mb-2">Starter</h3>
            <div className="text-3xl font-medium mb-1">
              $299 <span className="text-sm text-muted font-normal">USD/mes</span>
            </div>
            <p className="text-xs text-muted mb-6">Para empresas pequeñas.</p>
            <ul className="space-y-3 text-sm text-muted mb-8 flex-grow">
              <li className="flex gap-2 items-center">
                <Check className="w-4 h-4" />Bancos + SII
              </li>
              <li className="flex gap-2 items-center">
                <Check className="w-4 h-4" />1 Sociedad
              </li>
              <li className="flex gap-2 items-center">
                <Check className="w-4 h-4" />Integración Básica
              </li>
            </ul>
            <button className="w-full py-2.5 rounded-lg border border-[var(--glass-border)] text-sm font-medium hover:bg-[var(--glass-hover)] transition-colors">
              Próximamente
            </button>
          </div>

          {/* Pro */}
          <div className="glass-panel p-8 rounded-2xl border border-indigo-500/30 relative bg-[var(--card-inner)] shadow-2xl shadow-indigo-500/5 h-full flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-lg shadow-indigo-500/40">
              Popular
            </div>
            <h3 className="text-lg font-medium text-indigo-400 mb-2">Pro</h3>
            <div className="text-3xl font-medium mb-1">
              $799 <span className="text-sm text-muted font-normal">USD/mes</span>
            </div>
            <p className="text-xs text-muted mb-6">Para equipos en expansión.</p>
            <ul className="space-y-3 text-sm text-muted mb-8 flex-grow">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" /> HR + Ventas (Shopify, Buk)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" /> Multiusuario
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400" /> Conciliación Avanzada
              </li>
            </ul>
            <button className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
              Próximamente
            </button>
          </div>

          {/* Enterprise */}
          <div className="glass-panel p-8 rounded-2xl border-t border-[var(--glass-border)] hover:bg-[var(--glass-hover)] transition-colors h-full flex flex-col">
            <h3 className="text-lg font-medium text-muted mb-2">Enterprise y estudios contables</h3>
            <div className="text-xl font-medium mb-1 pt-1.5 pb-1.5">Contactar a ventas</div>
            <p className="text-muted text-xs mb-6">Para operaciones complejas, multiples sociedades y estudios contables.</p>
            <ul className="space-y-3 text-sm text-muted mb-8 flex-grow">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Multiempresa
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Migración Dedicada
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4" /> API Personalizada
              </li>
            </ul>
            <button className="w-full py-2.5 rounded-lg border border-[var(--glass-border)] text-sm font-medium hover:bg-[var(--glass-hover)] transition-colors">
              Próximamente
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div id="comparison-container" className="relative rounded-2xl overflow-hidden border border-[var(--glass-border)] glass-panel bg-[var(--bg-main)]/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse comparison-table">
              <thead className="bg-[var(--glass-hover)]">
                <tr>
                  <th className="text-sm font-medium text-muted border-b border-[var(--glass-border)] w-1/4 py-4 pl-6">
                    Funcionalidades
                  </th>
                  <th className="text-sm font-semibold text-[var(--text-main)] border-b border-[var(--glass-border)] w-1/4 text-center py-4">
                    Starter
                  </th>
                  <th className="text-sm font-semibold text-indigo-400 border-b border-[var(--glass-border)] w-1/4 text-center py-4">
                    Pro
                  </th>
                  <th className="text-sm font-semibold text-[var(--text-main)] border-b border-[var(--glass-border)] w-1/4 text-center py-4">
                    Enterprise
                  </th>
                </tr>
              </thead>
              
              {/* Always Visible Section */}
              <tbody className="text-sm">
                <tr>
                  <td colSpan="4" className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted/60 bg-[var(--bg-main)]/20">
                    General
                  </td>
                </tr>
                <tr className="group hover:bg-[var(--glass-hover)] transition-colors">
                  <td className="border-b border-[var(--glass-border)] text-muted group-hover:text-[var(--text-main)] transition-colors font-medium pl-6">
                    Usuarios
                  </td>
                  <td className="border-b border-[var(--glass-border)] text-center text-muted">1</td>
                  <td className="border-b border-[var(--glass-border)] text-center text-[var(--text-main)] font-medium">5</td>
                  <td className="border-b border-[var(--glass-border)] text-center text-[var(--text-main)] font-medium">Ilimitados</td>
                </tr>
                <tr className="group hover:bg-[var(--glass-hover)] transition-colors">
                  <td className="border-b border-[var(--glass-border)] text-muted group-hover:text-[var(--text-main)] transition-colors font-medium pl-6">
                    Sociedades
                  </td>
                  <td className="border-b border-[var(--glass-border)] text-center text-muted">1</td>
                  <td className="border-b border-[var(--glass-border)] text-center text-[var(--text-main)] font-medium">3</td>
                  <td className="border-b border-[var(--glass-border)] text-center text-[var(--text-main)] font-medium">Ilimitadas</td>
                </tr>
                <tr className="group hover:bg-[var(--glass-hover)] transition-colors">
                  <td className="border-b border-[var(--glass-border)] text-muted group-hover:text-[var(--text-main)] transition-colors font-medium pl-6">
                    Almacenamiento Documentos
                  </td>
                  <td className="border-b border-[var(--glass-border)] text-center text-muted">10 GB</td>
                  <td className="border-b border-[var(--glass-border)] text-center text-[var(--text-main)] font-medium">100 GB</td>
                  <td className="border-b border-[var(--glass-border)] text-center text-[var(--text-main)] font-medium">1 TB</td>
                </tr>
              </tbody>

              {/* Collapsible Section */}
              {isTableExpanded && (
                <tbody className="text-sm transition-all duration-700">
                  <tr>
                    <td colSpan="4" className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted/60 bg-[var(--bg-main)]/20">
                      Contabilidad & Automatización
                    </td>
                  </tr>
                  <tr className="group hover:bg-[var(--glass-hover)] transition-colors">
                    <td className="border-b border-[var(--glass-border)] text-muted group-hover:text-[var(--text-main)] transition-colors font-medium pl-6">
                      Conciliación Bancaria
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="group hover:bg-[var(--glass-hover)] transition-colors">
                    <td className="border-b border-[var(--glass-border)] text-muted group-hover:text-[var(--text-main)] transition-colors font-medium pl-6">
                      Reglas de IA (Categorización)
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center text-muted">Básicas</td>
                    <td className="border-b border-[var(--glass-border)] text-center text-[var(--text-main)] font-medium">Avanzadas (Contextual)</td>
                    <td className="border-b border-[var(--glass-border)] text-center text-[var(--text-main)] font-medium">Modelos Personalizados</td>
                  </tr>

                  <tr>
                    <td colSpan="4" className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted/60 bg-[var(--bg-main)]/20">
                      Integraciones & Ecosistema
                    </td>
                  </tr>
                  <tr className="group hover:bg-[var(--glass-hover)] transition-colors">
                    <td className="border-b border-[var(--glass-border)] text-muted group-hover:text-[var(--text-main)] transition-colors font-medium pl-6">
                      Bancos & SII
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="group hover:bg-[var(--glass-hover)] transition-colors">
                    <td className="border-b border-[var(--glass-border)] text-muted group-hover:text-[var(--text-main)] transition-colors font-medium pl-6">
                      Ventas (Shopify, Bsale, MeLi)
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Minus className="w-4 h-4 text-muted mx-auto opacity-30" />
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="group hover:bg-[var(--glass-hover)] transition-colors">
                    <td className="border-b border-[var(--glass-border)] text-muted group-hover:text-[var(--text-main)] transition-colors font-medium pl-6">
                      HR (Buk, Talana)
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Minus className="w-4 h-4 text-muted mx-auto opacity-30" />
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="group hover:bg-[var(--glass-hover)] transition-colors">
                    <td className="border-b border-[var(--glass-border)] text-muted group-hover:text-[var(--text-main)] transition-colors font-medium pl-6">
                      Gastos (Rindegastos, Xpendit)
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Minus className="w-4 h-4 text-muted mx-auto opacity-30" />
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center">
                      <Check className="w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                  </tr>

                  <tr>
                    <td colSpan="4" className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-muted/60 bg-[var(--bg-main)]/20">
                      Soporte & Migración
                    </td>
                  </tr>
                  <tr className="group hover:bg-[var(--glass-hover)] transition-colors">
                    <td className="border-b border-[var(--glass-border)] text-muted group-hover:text-[var(--text-main)] transition-colors font-medium pl-6">
                      Migración de ERP Legacy
                    </td>
                    <td className="border-b border-[var(--glass-border)] text-center text-muted">Auto-servicio</td>
                    <td className="border-b border-[var(--glass-border)] text-center text-[var(--text-main)] font-medium">Asistida</td>
                    <td className="border-b border-[var(--glass-border)] text-center text-[var(--text-main)] font-medium">Dedicada</td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>

          {/* Expand/Collapse Button */}
          {!isTableExpanded ? (
            <div className="absolute bottom-0 left-0 w-full h-32 table-fade-overlay flex items-end justify-center pb-8 z-10 transition-opacity duration-500">
              <button
                onClick={toggleTable}
                className="group flex items-center gap-2 bg-[var(--text-main)] text-[var(--bg-main)] px-5 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 pointer-events-auto"
              >
                <span>Ver todas las características</span>
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center py-6 border-t border-[var(--glass-border)] bg-[var(--bg-main)]/30">
              <button
                onClick={toggleTable}
                className="group flex items-center gap-2 text-muted hover:text-[var(--text-main)] text-sm font-medium transition-colors"
              >
                <span>Colapsar tabla</span>
                <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

