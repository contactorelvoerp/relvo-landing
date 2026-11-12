import { useEffect, useRef, useState } from 'react'
import { hrefFor } from '../routes'
import { API_DOCS_URL, APP_LOGIN_URL } from '../site'
import { LanguageSwitch } from './LanguageSwitch'

// Orden por filas: funciones principales primero, automatización y reportes después.
const PRODUCT = ['cxc', 'contratos', 'medicion', 'aprobaciones', 'agentes', 'reporteria']
const SOLUTIONS = [
  // Ola 2: se muestran por nombre, sin link, hasta que sus páginas existan.
  { key: 'teams', ids: ['revops', 'finanzas', 'ingenieria'], showWithoutPage: true },
  { key: 'industries', ids: ['saas', 'agencias'] },
  { key: 'useCases', ids: ['planes', 'hibrido', 'uso'] },
]
const RESOURCES = ['docs', 'blog']
const SHOW_SOLUTIONS = false

function Chevron() {
  return (
    <svg className="nav__chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Página construida: link. Página aún no construida (columna "Para equipos"): solo el nombre.
function Item({ link, className, nameClass }) {
  const content = (
    <>
      <span className={nameClass}>{link.name}</span>
      {link.desc && <span className="nav__item-desc">{link.desc}</span>}
    </>
  )
  return link.href
    ? <a className={className} href={link.href}>{content}</a>
    : <span className={`${className} nav__item--static`}>{content}</span>
}

function Column({ index, title, links }) {
  return (
    <div className="nav__col">
      <p className="nav__col-title">{index && <span>{index}</span>}<span>{title}</span></p>
      {links.map((l) => <Item key={l.id} link={l} className="nav__item" nameClass="nav__item-name" />)}
    </div>
  )
}

export function Nav({ t, locale, pageId }) {
  const [open, setOpen] = useState(null)
  const root = useRef(null)
  const opener = useRef(null)
  // Menú que abrió el mouse al pasar por encima: el clic no debe cerrarlo.
  const hovered = useRef(null)

  useEffect(() => {
    const mobile = window.matchMedia('(max-width:959px)')
    const reset = () => { hovered.current = null; opener.current = null; setOpen(null) }
    mobile.addEventListener('change', reset)
    return () => mobile.removeEventListener('change', reset)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(null)
      hovered.current = null
      opener.current?.focus()
    }
    const onPointer = (e) => {
      if (!root.current?.contains(e.target)) {
        hovered.current = null
        setOpen(null)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  // Solo se enlazan páginas que existen en este build: sin links rotos.
  const links = (ids, showWithoutPage = false) => ids
    .map((id) => ({ id, href: hrefFor(id, locale), ...t.pages[id] }))
    .filter((l) => l.href || showWithoutPage)
  const columns = (groups, titles) => groups
    .map((g) => ({ ...g, title: titles[g.key], links: links(g.ids, g.showWithoutPage) }))
    .filter((g) => g.links.length > 0)

  const product = links(PRODUCT)
  const solutions = SHOW_SOLUTIONS ? columns(SOLUTIONS, t.nav) : []
  const resources = links(RESOURCES)
  const docs = hrefFor('docs', locale)
  // Clientes lleva al caso TGP de la home
  const customers = `${hrefFor('home', locale) ?? '/'}#clientes`
  const pricing = hrefFor('precios', locale)
  const demo = hrefFor('demo', locale)
  const home = hrefFor('home', locale) ?? '/'

  const toggle = (menu) => setOpen((o) => (o === menu && hovered.current !== menu ? null : menu))
  const hover = (menu) => (e) => {
    if (e.pointerType !== 'mouse') return
    if (menu) opener.current = e.currentTarget
    hovered.current = menu
    setOpen(menu)
  }
  const leave = () => {
    hovered.current = null
    // El panel usado con teclado sigue abierto cuando el puntero sale del header.
    if (root.current?.contains(document.activeElement)) return
    setOpen((o) => (o === 'mobile' ? o : null))
  }
  const trigger = (menu, label) => (
    <button
      type="button"
      className="nav__link"
      aria-expanded={open === menu}
      aria-controls={`nav-${menu}`}
      onClick={(e) => { opener.current = e.currentTarget; toggle(menu) }}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowDown') return
        e.preventDefault()
        opener.current = e.currentTarget
        setOpen(menu)
        requestAnimationFrame(() => document.getElementById(`nav-${menu}`)?.querySelector('a')?.focus())
      }}
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
    <header ref={root} className={`nav${open && open !== 'mobile' ? ' nav--open' : ''}${open === 'product' || open === 'solutions' ? ' nav--mega' : ''}`} onPointerLeave={leave}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          hovered.current = null
          setOpen(null)
        }
      }}
      onClick={(e) => {
        if (e.target.closest('a')) { hovered.current = null; setOpen(null) }
      }}>
      <nav className="nav__bar nav__bar--desktop" aria-label={t.nav.menu}>
        {logo(26)}
        <div className="nav__links">
          {product.length > 0 && trigger('product', t.nav.product)}
          {solutions.length > 0 && trigger('solutions', t.nav.solutions)}
          {customers && <a className="nav__link" href={customers} onPointerEnter={hover(null)}>{t.nav.customers}</a>}
          {resources.length > 0 && (
            <div className="nav__dropdown-anchor">
              {trigger('resources', t.nav.resources)}
              <div id="nav-resources" className="nav__dropdown" hidden={open !== 'resources'}>
                {resources.map((l) => <a key={l.id} className="nav__plain" href={l.href}>{l.name}</a>)}
              </div>
            </div>
          )}
          {pricing && <a className="nav__link" href={pricing} onPointerEnter={hover(null)}>{t.nav.pricing}</a>}
        </div>
        <div className="nav__actions">
          <LanguageSwitch locale={locale} pageId={pageId} />
          <a className="btn btn--ghost btn--md" href={APP_LOGIN_URL}>{t.nav.login}</a>
          {demo && <a className="btn btn--primary btn--md" href={demo}>{t.nav.demo}</a>}
        </div>
      </nav>

      <div id="nav-product" className="nav__panel nav__panel--product" hidden={open !== 'product'}>
        <div className="nav__product-group">
          <p className="nav__product-label">{t.nav.product}</p>
          <div className="nav__product-grid">
            {product.map((l) => <Item key={l.id} link={l} className="nav__item nav__product-item" nameClass="nav__item-name" />)}
          </div>
        </div>
        {docs && (
          <div className="nav__developers">
            <p className="nav__product-label">{t.nav.developers}</p>
            <a className="nav__plain nav__plain--accent" href={API_DOCS_URL}>{t.nav.apiDocs} →</a>
          </div>
        )}
      </div>
      <div id="nav-solutions" className="nav__panel nav__panel--solutions" hidden={open !== 'solutions'}>
        {solutions.map((c) => <Column key={c.key} title={c.title} links={c.links} />)}
      </div>

      <nav className="nav__bar nav__bar--mobile" aria-label={t.nav.menu}>
        {logo(20)}
        <div className="nav__actions">
          <LanguageSwitch locale={locale} pageId={pageId} />
          {demo && <a className="btn btn--primary btn--sm" href={demo} aria-label={t.nav.demo}><span className="nav__demo-label">{t.nav.demo}</span><span className="nav__demo-short" aria-hidden="true">Demo</span></a>}
          <button type="button" className="nav__burger" aria-label={t.nav.menu} aria-expanded={open === 'mobile'} aria-controls="nav-mobile" onClick={(e) => { opener.current = e.currentTarget; toggle('mobile') }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d={open === 'mobile' ? 'M6 6l12 12M6 18 18 6' : 'M4 7h16M4 12h16M4 17h16'} />
            </svg>
          </button>
        </div>
      </nav>
      <div id="nav-mobile" className="nav__sheet" hidden={open !== 'mobile'}>
        {product.length > 0 && (
          <div className="nav__sheet-group">
            <p className="nav__sheet-top">{t.nav.product}</p>
            {product.map((l) => (
              <Item key={l.id} link={l} className="nav__sheet-item" />
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
                  <Item key={l.id} link={l} className="nav__sheet-item" />
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
