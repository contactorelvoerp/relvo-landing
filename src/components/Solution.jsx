import { Cpu, Zap, Users, Blocks, ShoppingCart, ShoppingBag, Package, Receipt, CreditCard, Landmark, FileText, TrendingUp } from 'lucide-react'

export const Solution = () => {
  return (
    <section className="border-[var(--glass-border)] z-10 border-t pt-24 pr-6 pb-24 pl-6 relative scroll-mt-32" id="solucion">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="md:text-4xl text-3xl font-medium tracking-tight mb-4">
          La suite contable automatizada y nativa en IA primera en LATAM
          </h2>
          <p className="text-muted leading-relaxed">
          Reemplaza múltiples herramientas y procesos contables en una sola solución inteligente.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Feature: Autonomous Accounting */}
          <div className="md:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden group border border-[var(--glass-border)] hover:border-indigo-500/30 transition-all duration-500">
            <div className="absolute top-0 right-0 p-40 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition-all"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="mb-8">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 border border-indigo-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-medium mb-2">Motor Contable Autónomo</h3>
                <p className="text-muted text-sm max-w-md">
                  Procesamos transacciones de todos tus canales de venta y cuentas bancarias, categorizando y conciliando automáticamente.
                </p>
              </div>

              <div className="w-full bg-[var(--bg-main)] border border-[var(--glass-border)] rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-xs text-muted mb-1">
                    <span>Centralizando data...</span>
                    <span className="text-indigo-500 font-mono">99.8%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--grid-color)] rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 border border-[var(--bg-main)] flex items-center justify-center text-green-500 text-[8px] font-bold">SII</div>
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-[var(--bg-main)] flex items-center justify-center text-blue-500 text-[8px] font-bold">BUK</div>
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-[var(--bg-main)] flex items-center justify-center text-orange-500 text-[8px] font-bold">SHOPIFY</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Simple Migration */}
          <div className="md:col-span-1 glass-panel rounded-2xl p-8 relative overflow-hidden group hover:bg-[var(--glass-hover)] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-medium mb-2">Migración Simple</h3>
            <p className="text-muted text-sm mb-6">
              Importa tu historial y reemplaza tu ERP anterior sin perder trazabilidad.
            </p>

            <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="text-xs font-medium text-emerald-500">Onboarding asistido</div>
            </div>
          </div>

          {/* Feature 3: Centralization */}
          <div className="md:col-span-1 glass-panel rounded-2xl p-8 relative overflow-hidden group hover:bg-[var(--glass-hover)] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-medium mb-2">Centralización de tus EEFF</h3>
            <p className="text-muted text-sm mb-4">
              Controla HR, Ventas y Tesorería en una sola plataforma unificada.<br />
              - Multi sociedad<br />
              - Multi moneda
            </p>

            <div className="flex items-center justify-between text-xs font-medium mt-6 pt-4 border-t border-[var(--glass-border)]">
              <span className="text-muted">Visibilidad Total</span>
              <span className="text-purple-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> 360°
              </span>
            </div>
          </div>

          {/* Feature 4: Integration Ecosystem */}
          <div className="md:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8 scroll-mt-32" id="integraciones">
            <div className="flex-1">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500 mb-4 border border-pink-500/20">
                <Blocks className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-medium mb-2">Integrado a tu ecosistema</h3>
              <p className="text-muted text-sm">
                Relvo no se conecta a otros ERPs, los reemplaza. Nos integramos nativamente con tus herramientas de negocio:
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted opacity-60">HR</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted opacity-60 ml-2">Ventas</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted opacity-60 ml-2">Gastos</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted opacity-60 ml-2">Banca & Tax</span>
              </div>
            </div>

            {/* Ecosystem Badges Grid */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                <div className="integration-badge group-hover:border-blue-400/30">
                  <Users className="w-3 h-3 text-blue-400" /> Buk
                </div>
                <div className="integration-badge group-hover:border-blue-400/30">
                  <Users className="w-3 h-3 text-blue-400" /> Talana
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                <div className="integration-badge group-hover:border-green-400/30">
                  <ShoppingCart className="w-3 h-3 text-green-400" /> Shopify
                </div>
                <div className="integration-badge group-hover:border-green-400/30">
                  <ShoppingBag className="w-3 h-3 text-green-400" /> Bsale
                </div>
                <div className="integration-badge group-hover:border-yellow-400/30">
                  <Package className="w-3 h-3 text-yellow-400" /> MercadoLibre
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                <div className="integration-badge group-hover:border-purple-400/30">
                  <Receipt className="w-3 h-3 text-purple-400" /> Rindegastos
                </div>
                <div className="integration-badge group-hover:border-purple-400/30">
                  <CreditCard className="w-3 h-3 text-purple-400" /> Xpendit
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                <div className="integration-badge group-hover:border-red-400/30">
                  <Landmark className="w-3 h-3 text-red-400" /> Bancos LATAM
                </div>
                <div className="integration-badge group-hover:border-red-400/30">
                  <FileText className="w-3 h-3 text-red-400" /> SII
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

