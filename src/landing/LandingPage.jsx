import { getCase, getContent } from '../content'
import { labelsFor } from '../visuals/labels'
import { copy as homeCopy } from '../pages/home/copy'
import { CtaSection, IntegrationsSection } from '../blocks/Shared'
import { hrefFor } from '../routes'
import { BeforeAfter, Capabilities, CaseBlock, Faq, Features, Hero, Metrics, Quote, Related, Steps, Subnav } from './blocks'
import { PendingPage } from '../pages/PendingPage'
import './landing.css'

// Plantilla única de las páginas de producto, soluciones y casos: lee el archivo de contenido de la
// ruta (content/<idioma>/<url>.json) y renderiza sus bloques en orden. Todo queda en el HTML inicial.
// Integraciones y CTA son los de la home (iguales en todo el sitio).
const BLOCKS = { beforeAfter: BeforeAfter, steps: Steps, featureTabs: Features, capabilities: Capabilities, metrics: Metrics, case: CaseBlock, related: Related, faq: Faq, quote: Quote }

export function LandingPage({ t, locale, route }) {
  const page = getContent(locale, route.path)
  // Sin archivo de contenido en este idioma (p. ej. /en, aún sin traducir): placeholder de preview
  if (!page) return <PendingPage route={route} />
  const home = homeCopy[locale]
  const p = {
    t, locale, home,
    l: labelsFor(locale),
    numberLocale: locale === 'en' ? 'en-US' : 'es-CL',
    caseData: page.case,
    getCase: (ref) => getCase(locale, ref),
  }
  const [hero, ...rest] = page.blocks
  const id = (i) => `lp-${i + 1}`
  // Cada bloque con h2 que tenga etiqueta corta genera su ancla en la barra secundaria
  const anchors = rest.map((b, i) => ({ id: id(i), label: b.h2 && p.l.anchors[b.type] })).filter((a) => a.label)
  return (
    <div className="lp">
      {page.subnav && <Subnav name={t.pages[route.id].name} anchors={anchors} docs={hrefFor('docs', locale)} l={p.l} />}
      <Hero b={hero} p={p} breadcrumb={page.breadcrumb} />
      {rest.map((b, i) => {
        if (b.type === 'integrations') return <IntegrationsSection key={i} c={home.integrations} locale={locale} />
        if (b.type === 'cta') return <CtaSection key={i} c={home.cta} locale={locale} />
        const Block = BLOCKS[b.type]
        return <Block key={i} b={b} id={id(i)} p={p} />
      })}
    </div>
  )
}
