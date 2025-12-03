import { Linkedin, Twitter } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="border-[var(--glass-border)] z-10 border-t pt-12 pr-6 pb-12 pl-6 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[var(--text-main)] rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-[var(--bg-main)] rounded-sm"></div>
          </div>
          <span className="text-base font-semibold tracking-tighter">RELVO</span>
        </div>
        
        <div className="text-xs text-muted">
          © 2024 Relvo Inc. Todos los derechos reservados.
        </div>
        
        <div className="flex gap-6">
          <a href="#" className="text-muted hover:text-[var(--text-main)] transition-colors">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="#" className="text-muted hover:text-[var(--text-main)] transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

