import { ButtonLink } from './ButtonLink'

export const Navbar = ({ ctaHref }) => {
  return (
    <header className="relative z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <nav className="nav-shell mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
        <a
          href="#inicio"
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
        >
          <img
            src="/logo-mark-dark.svg"
            alt="Relvo"
            className="h-10 w-10 rounded-[0.9rem] sm:h-11 sm:w-11"
          />
        </a>

        <ButtonLink href={ctaHref} external className="px-4 py-2.5 text-sm">
          Agendar demo
          <span aria-hidden="true">{'->'}</span>
        </ButtonLink>
      </nav>
    </header>
  )
}
