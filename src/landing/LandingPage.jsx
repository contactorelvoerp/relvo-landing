import { getCase, getContent } from '../content'
import { labelsFor } from '../visuals/labels'
import { copy as homeCopy } from '../pages/home/copy'
import { CtaSection, IntegrationsSection } from '../blocks/Shared'
import { BeforeAfter, CaseBlock, Faq, Features, Hero, Metrics, Quote, Related, Steps } from './blocks'
import { PendingPage } from '../pages/PendingPage'
import './landing.css'

// Plantilla única de las páginas de producto, soluciones y casos: lee el archivo de contenido de la
// ruta (content/<idioma>/<url>.json) y renderiza sus bloques en orden. Todo queda en el HTML inicial.
// Integraciones y CTA son los de la home (iguales en todo el sitio).
const BLOCKS = { beforeAfter: BeforeAfter, steps: Steps, featureTabs: Features, metrics: Metrics, case: CaseBlock, related: Related, faq: Faq, quote: Quote }

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
  return (
    <div className="lp">
      <Hero b={hero} p={p} breadcrumb={page.breadcrumb} />
      {rest.map((b, i) => {
        if (b.type === 'integrations') return <IntegrationsSection key={i} c={home.integrations} locale={locale} />
        if (b.type === 'cta') return <CtaSection key={i} c={home.cta} locale={locale} />
        const Block = BLOCKS[b.type]
        return <Block key={i} b={b} id={`lp-${i + 1}`} p={p} />
      })}
    </div>
  )
}
