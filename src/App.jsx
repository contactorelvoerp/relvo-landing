import { getDict } from './i18n'
import { PAGE_COMPONENTS } from './pages/registry'
import { PendingPage } from './pages/PendingPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'

export function App({ route }) {
  const t = getDict(route.locale)
  const Page = PAGE_COMPONENTS[route.id]

  let content
  if (route.status === '404') content = <NotFoundPage t={t} />
  else if (Page) content = <Page t={t} locale={route.locale} />
  else content = <PendingPage route={route} />

  return (
    <div className="site">
      <Nav t={t} locale={route.locale} />
      <main>{content}</main>
      <Footer t={t} locale={route.locale} />
    </div>
  )
}
