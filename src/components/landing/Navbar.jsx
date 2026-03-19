export const Navbar = ({ t }) => {
  return (
    <header className="relative z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <nav className="nav-shell mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <a
          href="#inicio"
          className="rounded-[var(--radius-sm)] px-2 py-1 font-display text-sm font-semibold tracking-[-0.01em] text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 sm:text-base"
        >
          Relvo
        </a>

        <div className="flex items-center gap-5 text-xs font-medium text-[var(--text-muted)] sm:gap-7 sm:text-sm">
          {(t.navItems ?? []).map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-[var(--radius-sm)] px-2 py-1 transition hover:text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}