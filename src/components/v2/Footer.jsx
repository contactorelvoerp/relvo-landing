import { paths, roleSlugs, stripLang } from '../../i18n/copy'

const loginHref = 'https://app.relvoerp.com/login'
const blogHref = 'https://blog.relvoerp.com'
const linkedinHref = 'https://www.linkedin.com/company/relvoerp/posts/?feedView=all'

export const Footer = ({ lang, t, navigate, pathname }) => {
  const p = paths[lang]
  const f = t.footer
  const isHome = stripLang(pathname) === '/'

  const go = (event, href, scrollTo = null) => {
    event.preventDefault()
    navigate(href, scrollTo)
  }

  const goAnchor = (event, anchor) => {
    event.preventDefault()
    if (isHome) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate(p.home, anchor)
    }
  }

  const linkCls =
    'block cursor-pointer font-sans text-[0.875rem] text-ink-soft transition-colors duration-150 hover:text-ink'
  const headCls = 'v2-eyebrow text-muted-aa'

  const solutionLinks = t.personas.cards.map((card) => ({
    label: card.label
      .toLowerCase()
      .replace(/(^|\s|\/)\S/g, (c) => c.toUpperCase()),
    href: p.solutionRole(roleSlugs[lang][card.role]),
  }))

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-white">
      <div className="v2-container pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          {/* Brand */}
          <div>
            <a
              href={p.home}
              onClick={(e) => go(e, p.home)}
              className="inline-flex cursor-pointer items-center gap-2"
              aria-label="Relvo — home"
            >
              <img src="/logo-mark-dark.svg" alt="" aria-hidden="true" className="h-5 w-auto" />
              <img src="/relvo-wordmark-dark.svg" alt="relvo" className="h-5 w-auto" />
            </a>
            <p className="mt-4 max-w-xs font-sans text-[0.875rem] leading-relaxed text-ink-soft">{f.tagline}</p>
            <p className="mt-6 whitespace-pre-line font-sans text-[0.8125rem] leading-relaxed text-muted-aa">
              {f.address}
            </p>
          </div>

          {/* Sitemap */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            <div className="space-y-3.5">
              <p className={headCls}>{f.columns.product.title}</p>
              {f.columns.product.links.map((link) => (
                <a
                  key={link.anchor}
                  href={`${p.home}#${link.anchor}`}
                  onClick={(e) => goAnchor(e, link.anchor)}
                  className={linkCls}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="space-y-3.5">
              <p className={headCls}>{f.columns.solutions.title}</p>
              {solutionLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={(e) => go(e, link.href)} className={linkCls}>
                  {link.label}
                </a>
              ))}
            </div>

            <div className="space-y-3.5">
              <p className={headCls}>{f.columns.resources.title}</p>
              <a href={p.pricing} onClick={(e) => go(e, p.pricing)} className={linkCls}>
                {f.columns.resources.pricing}
              </a>
              <a href={p.docs} onClick={(e) => go(e, p.docs)} className={linkCls}>
                {f.columns.resources.docs}
              </a>
              <a href={loginHref} className={linkCls}>
                {f.columns.resources.login}
              </a>
            </div>

            <div className="space-y-3.5">
              <p className={headCls}>{f.columns.company.title}</p>
              <a href={p.about} onClick={(e) => go(e, p.about)} className={linkCls}>
                {f.columns.company.about}
              </a>
              <a href={blogHref} target="_blank" rel="noopener noreferrer" className={linkCls}>
                {f.columns.company.blog}
              </a>
              <a href={`mailto:${f.columns.company.contact}`} className={linkCls}>
                {f.columns.company.contact}
              </a>
            </div>
          </div>
        </div>

        {/* Legal row */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6">
          <p className="font-sans text-[0.8125rem] text-muted-aa">
            © {new Date().getFullYear()} Relvo. {f.rights}
          </p>
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Relvo on LinkedIn"
            className="cursor-pointer text-muted-aa transition-colors hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
