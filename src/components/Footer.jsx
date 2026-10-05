import { hrefFor } from '../routes'
import { SITE_URL } from '../site'

// Columnas del Footer del Design System v1.5. Los equipos de Soluciones ("Para equipos") se muestran
// por nombre, sin link, hasta que sus páginas existan, igual que en el menú.
const COLUMNS = [
  { key: 'product', ids: ['contratos', 'medicion', 'aprobaciones', 'cxc', 'agentes', 'reporteria'] },
  { key: 'solutions', ids: ['revops', 'finanzas', 'ingenieria', 'saas', 'agencias'], showWithoutPage: ['revops', 'finanzas', 'ingenieria'] },
  { key: 'useCases', ids: ['planes', 'hibrido', 'uso'] },
  { key: 'resources', ids: ['docs', 'blog', 'clientes', 'precios'] },
]
const LEGAL = ['terminos', 'privacidad']

export function Footer({ t, locale }) {
  const links = (ids, showWithoutPage = []) => ids
    // Clientes lleva al caso TGP de la home, como en el menú
    .map((id) => ({ id, href: id === 'clientes' ? `${hrefFor('home', locale) ?? '/'}#clientes` : hrefFor(id, locale), name: t.pages[id].name }))
    .filter((l) => l.href || showWithoutPage.includes(l.id))
  const columns = COLUMNS
    .map((c) => ({ ...c, links: links(c.ids, c.showWithoutPage) }))
    .filter((c) => c.links.length > 0)

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <img src="/logo-logotype-light.svg" alt="Relvo" width="102" height="26" loading="lazy" />
          <p className="footer__tagline">{t.footer.tagline}</p>
          <img className="footer__badge" src="/logos/startup-chile-white.webp" alt="Start-Up Chile by Corfo" width="227" height="40" loading="lazy" />
        </div>
        {columns.map((c) => (
          <div key={c.key} className="footer__col">
            <p className="footer__col-title">{t.nav[c.key]}</p>
            {c.links.map((l) => l.href
              ? <a key={l.id} className="footer__link" href={l.href}>{l.name}</a>
              : <span key={l.id} className="footer__link">{l.name}</span>)}
          </div>
        ))}
      </div>
      <p className="footer__illustrative">{t.footer.illustrative}</p>
      <div className="footer__legal">
        <span>{t.footer.legal}</span>
        {links(LEGAL).map((l) => <a key={l.id} href={l.href}>{l.name}</a>)}
        <span className="footer__domain">{new URL(SITE_URL).host}</span>
      </div>
    </footer>
  )
}
