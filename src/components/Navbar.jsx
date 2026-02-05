export const Navbar = () => {
  const calendlyHref = 'https://calendar.app.google/GbBM26VivFQHGzyL9'

  const handleScrollToConversemos = (e) => {
    e.preventDefault()
    document.getElementById('conversemos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <a href="#statement" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[var(--text-main)] rounded-sm flex items-center justify-center">
            <div className="w-3 h-3 bg-[var(--bg-main)] rounded-sm"></div>
          </div>
          <span className="font-body text-xs font-semibold tracking-[0.22em] text-ink">RELVO</span>
        </a>

        {/* Right CTA */}
        <a
          href="#conversemos"
          onClick={handleScrollToConversemos}
          className="font-body inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase text-ink ng-link"
        >
          CONVERSEMOS
        </a>
      </div>
    </nav>
  )
}

