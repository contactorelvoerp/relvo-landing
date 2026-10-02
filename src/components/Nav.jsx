import { useEffect, useRef, useState } from 'react'
import { hrefFor } from '../routes'
import { APP_LOGIN_URL } from '../site'

// Mega-menú por capa (brief 6.4, Nav del Design System v1.5).
const PRODUCT = [
  { index: '01', key: 'rails', ids: ['contratos', 'medicion', 'aprobaciones', 'cxc'] },
  { index: '02', key: 'agents', ids: ['agentes'] },
  { index: '03', key: 'intelligence', ids: ['reporteria'] },
]
const SOLUTIONS = [
  { key: 'teams', ids: ['revops', 'finanzas', 'ingenieria'] },
  { key: 'industries', ids: ['saas', 'agencias'] },
  { key: 'useCases', ids: ['planes', 'hibrido', 'uso'] },
]
const RESOURCES = ['docs', 'blog']

function Chevron() {
  return (
    <svg className="nav__chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Column({ index, title, links }) {
  return (
    <div className="nav__col">
      <p className="nav__col-title">{index && <span>{index}</span>}<span>{title}</span></p>
      {links.map((l) => (
        <a key={l.id} className="nav__item" href={l.href}>
          <span className="nav__item-name">{l.name}</span>
          {l.desc && <span className="nav__item-desc">{l.desc}</span>}
        </a>
      ))}
    </div>
  )
}

export function Nav({ t, locale }) {
  const [open, setOpen] = useState(null)
  // Menú que abrió el mouse al pasar por encima: el clic no debe cerrarlo.
  const hovered = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Solo se enlazan páginas que existen en este build: sin links rotos.
  const links = (ids) => ids
    .map((id) => ({ id, href: hrefFor(id, locale), ...t.pages[id] }))
    .filter((l) => l.href)
  const columns = (groups, titles) => groups
    .map((g) => ({ ...g, title: titles[g.key], links: links(g.ids) }))
    .filter((g) => g.links.length > 0)

  const product = columns(PRODUCT, t.nav.layers)
  const solutions = columns(SOLUTIONS, t.nav)
  const resources = links(RESOURCES)
  const docs = hrefFor('docs', locale)
  const customers = hrefFor('clientes', locale)
  const pricing = hrefFor('precios', locale)
  const demo = hrefFor('demo', locale)
  const home = hrefFor('home', locale) ?? '/'

  const toggle = (menu) => setOpen((o) => (o === menu && hovered.current !== menu ? null : menu))
  const hover = (menu) => (e) => {
    if (e.pointerType !== 'mouse') return
    hovered.current = menu
    setOpen(menu)
  }
  const leave = () => {
    hovered.current = null
    setOpen((o) => (o === 'mobile' ? o : null))
  }
  const trigger = (menu, label) => (
    <button
      type="button"
      className="nav__link"
      aria-expanded={open === menu}
      onClick={() => toggle(menu)}
      onPointerEnter={hover(menu)}
    >
      {label} <Chevron />
    </button>
  )
  const logo = (height) => (
    <a className="nav__logo" href={home}>
      <img src="/logo-logotype-dark.svg" alt="Relvo" width={Math.round(height * 3.927)} height={height} />
    </a>
  )

  return (
    <header className="nav" onPointerLeave={leave}>
      <nav className="nav__bar nav__bar--desktop" aria-label={t.nav.menu}>
        {logo(26)}
        <div className="nav__links">
          {product.length > 0 && trigger('product', t.nav.product)}
          {solutions.length > 0 && trigger('solutions', t.nav.solutions)}
          {customers && <a className="nav__link" href={customers} onPointerEnter={hover(null)}>{t.nav.customers}</a>}
          {resources.length > 0 && (
            <div className="nav__dropdown-anchor">
              {trigger('resources', t.nav.resources)}
              <div className="nav__dropdown" hidden={open !== 'resources'}>
                {resources.map((l) => <a key={l.id} className="nav__plain" href={l.href}>{l.name}</a>)}
              </div>
            </div>
          )}
          {pricing && <a className="nav__link" href={pricing} onPointerEnter={hover(null)}>{t.nav.pricing}</a>}
        </div>
        <div className="nav__actions">
          <a className="btn btn--ghost btn--md" href={APP_LOGIN_URL}>{t.nav.login}</a>
          {demo && <a className="btn btn--primary btn--md" href={demo}>{t.nav.demo}</a>}
        </div>
      </nav>

      <div className="nav__panel nav__panel--product" hidden={open !== 'product'}>
        {product.map((c) => <Column key={c.key} index={c.index} title={c.title} links={c.links} />)}
        {docs && (
          <div className="nav__col nav__col--last">
            <p className="nav__col-title">{t.nav.developers}</p>
            <a className="nav__plain nav__plain--accent" href={docs}>{t.nav.apiDocs} →</a>
          </div>
        )}
      </div>
      <div className="nav__panel nav__panel--solutions" hidden={open !== 'solutions'}>
        {solutions.map((c) => <Column key={c.key} title={c.title} links={c.links} />)}
      </div>

      <nav className="nav__bar nav__bar--mobile" aria-label={t.nav.menu}>
        {logo(20)}
        <div className="nav__actions">
          {demo && <a className="btn btn--primary btn--sm" href={demo}>{t.nav.demo}</a>}
          <button type="button" className="nav__burger" aria-label={t.nav.menu} aria-expanded={open === 'mobile'} onClick={() => toggle('mobile')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </nav>
      <div className="nav__sheet" hidden={open !== 'mobile'}>
        {product.length > 0 && (
          <div className="nav__sheet-group">
            <p className="nav__sheet-top">{t.nav.product}</p>
            {product.flatMap((c) => c.links).map((l) => (
              <a key={l.id} className="nav__sheet-item" href={l.href}>
                <span>{l.name}</span>
                {l.desc && <span className="nav__item-desc">{l.desc}</span>}
              </a>
            ))}
          </div>
        )}
        {solutions.length > 0 && (
          <div className="nav__sheet-group">
            <p className="nav__sheet-top">{t.nav.solutions}</p>
            {solutions.map((c) => (
              <div key={c.key}>
                <p className="nav__sheet-label">{c.title}</p>
                {c.links.map((l) => (
                  <a key={l.id} className="nav__sheet-item" href={l.href}>
                    <span>{l.name}</span>
                    {l.desc && <span className="nav__item-desc">{l.desc}</span>}
                  </a>
                ))}
              </div>
            ))}
          </div>
        )}
        {customers && <a className="nav__sheet-top" href={customers}>{t.nav.customers}</a>}
        {resources.map((l) => <a key={l.id} className="nav__sheet-top" href={l.href}>{l.name}</a>)}
        {pricing && <a className="nav__sheet-top" href={pricing}>{t.nav.pricing}</a>}
        <a className="nav__sheet-top" href={APP_LOGIN_URL}>{t.nav.login}</a>
      </div>
    </header>
  )
}
