export const FooterSection = ({ t, navigate }) => {
  const footerColumns = (t?.footerColumns ?? []).filter((column) => {
    const title = String(column?.title || '').trim().toLowerCase()
    return title && title !== 'feature'
  })

  const handleLinkClick = (e, link) => {
    if (link.external) return
    const href = link.href ?? ''
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return

    e.preventDefault()

    if (href.startsWith('/')) {
      const [path, hash] = href.split('#')
      navigate?.(path || '/')
      if (hash) {
        window.setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 120)
      }
    } else if (href.startsWith('#')) {
      const id = href.slice(1)
      if (window.location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        navigate?.('/')
        window.setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 120)
      }
    }
  }

  return (
    <footer className="px-4 pb-10 pt-16 sm:px-6 sm:pt-20 md:pt-28">
      <div className="section-shell">
        <div
          className="relative mx-auto max-w-6xl rounded-lg bg-white/75 px-5 py-8 backdrop-blur-sm sm:px-8 sm:py-10 md:px-12 md:py-14"
          style={{ border: '1px solid rgba(19,19,30,0.06)' }}
        >
          <a
            href="https://www.linkedin.com/company/relvoerp/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Relvo en LinkedIn"
            className="absolute right-5 top-5 inline-block transition hover:scale-105 sm:right-8 sm:top-8 md:right-12 md:top-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <rect width="24" height="24" rx="3" fill="#0A66C2" />
              <path
                d="M8.94 7.44a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0zM6.3 9.36h2.76v9.24H6.3V9.36zm4.44 0h2.64v1.26h.04c.37-.7 1.27-1.44 2.61-1.44 2.79 0 3.31 1.83 3.31 4.21v5.21h-2.76v-4.62c0-1.1-.02-2.52-1.54-2.52-1.54 0-1.78 1.2-1.78 2.44v4.7h-2.76V9.36z"
                fill="#ffffff"
              />
            </svg>
          </a>

          <div className="grid gap-10 md:grid-cols-[1.2fr_1.8fr] md:items-start">
            {/* Left — brand + tagline */}
            <div>
              <div className="flex items-center gap-2">
                <img src="/logo-mark-dark.svg" alt="" aria-hidden="true" className="h-5 w-auto sm:h-6" />
                <img src="/relvo-wordmark-dark.svg" alt="relvo" className="h-5 w-auto sm:h-6" />
              </div>
              <p
                className="mt-4 max-w-xs"
                style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-soft)' }}
              >
                {t?.footerTagline}
              </p>
              <p
                className="mt-4"
                style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--text-muted)' }}
              >
                © {new Date().getFullYear()} Relvo. {t?.footerRights}
              </p>
            </div>

            {/* Right — nav columns */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 sm:gap-8">
              {footerColumns.map((column) => (
                <div key={column.title} className="space-y-3">
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {column.title}
                  </p>
                  <div className="space-y-2">
                    {column.links
                      ?.filter((link) => String(link?.label || '').trim().toLowerCase() !== 'link')
                      .map((link) => (
                        <a
                          key={`${column.title}-${link.label}`}
                          href={link.href}
                          onClick={(e) => handleLinkClick(e, link)}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          className="block transition hover:text-[var(--text-main)]"
                          style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-soft)' }}
                        >
                          {link.label}
                        </a>
                      ))}
                    {column.address && (
                      <p
                        className="whitespace-pre-line pt-1"
                        style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--text-muted)' }}
                      >
                        {column.address}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
