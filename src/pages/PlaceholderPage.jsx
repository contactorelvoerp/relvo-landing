import { hrefFor } from '../routes'
import '../landing/landing.css'

// Página en preparación (src/pages/noindex.js): solo texto aprobado de seo-metadata.json (title como
// H1 y description como bajada) y el CTA de demo. Lleva noindex y no va al sitemap.
export function PlaceholderPage({ t, locale, route }) {
  const demo = hrefFor('demo', locale)
  return (
    <section className="section band band--first lp-hero" aria-labelledby="lp-h1">
      <div className="lp-head">
        <h1 id="lp-h1" className="lp-head__title">{route.title}</h1>
        <p className="lp-head__lead">{route.description}</p>
        {demo && <div className="lp-head__ctas"><a className="btn btn--lg btn--primary" href={demo}>{t.nav.demo}</a></div>}
      </div>
    </section>
  )
}
