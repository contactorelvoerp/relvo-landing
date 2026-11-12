import { getDict } from './i18n'
import { STANDALONE_PAGES } from './pages/standalone'
import { PendingPage } from './pages/PendingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'

export function App({ route, Page }) {
  const t = getDict(route.locale)
  const skipLink = <a className="skip-link" href="#main-content">{route.locale === 'en' ? 'Skip to content' : 'Saltar al contenido'}</a>

  let content
  if (route.status === '404') content = <NotFoundPage t={t} />
  else if (Page) content = <Page t={t} locale={route.locale} route={route} />
  else content = <PendingPage route={route} />

  // Landings de campañas pagadas (src/pages/standalone.js): sin nav ni footer completo, sin
  // ninguna salida del embudo. La página pinta su propio logo y un footer mínimo.
  if (STANDALONE_PAGES.includes(route.id)) {
    return (
      <div className="site">
        {skipLink}
        <div className="frame"><main id="main-content" tabIndex={-1}>{content}</main></div>
      </div>
    )
  }

  return (
    <div className="site">
      {skipLink}
      <Nav t={t} locale={route.locale} pageId={route.id} />
      <div className="frame">
        <main id="main-content" tabIndex={-1}>{content}</main>
      </div>
      <Footer t={t} locale={route.locale} />
    </div>
  )
}
