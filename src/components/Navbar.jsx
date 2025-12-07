import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export const Navbar = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[var(--glass-border)] bg-[var(--nav-bg)] backdrop-blur-xl transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[var(--text-main)] rounded-sm flex items-center justify-center transition-colors">
            <div className="w-3 h-3 bg-[var(--bg-main)] rounded-sm transition-colors"></div>
          </div>
          <span className="text-lg font-semibold tracking-tighter font-geist">RELVO</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm text-muted font-medium">
          <a href="#solucion" className="hover:text-[var(--text-main)] transition-colors">Contabilidad</a>
          <a href="#ai-assistant" className="hover:text-[var(--text-main)] transition-colors">Asistente IA</a>
          <a href="#precios" className="hover:text-[var(--text-main)] transition-colors">Precios</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[var(--glass-hover)] text-muted hover:text-[var(--text-main)] transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
          <a
            href="#early-bird"
            className="text-xs font-medium bg-[var(--text-main)] text-[var(--bg-main)] px-4 py-2 rounded-full hover:opacity-90 transition-opacity tracking-tight"
          >
            Acceso anticipado
          </a>
        </div>
      </div>
    </nav>
  )
}

