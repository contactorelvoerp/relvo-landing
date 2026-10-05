import { hrefFor } from '../routes'
import { Texture } from '../components/Texture'
import { BandTexture } from '../components/BandTexture'
import { Integrations } from './Integrations'
import '../styles/blocks.css'

// Piezas iguales en todo el sitio: titular en dos tonos, integraciones y CTA final.

// Titular en dos tonos: número (opcional) + titular + continuación más suave.
export function Heading({ n, title, soft, id }) {
  return (
    <h2 className="h2" id={id}>
      {n && <span className="h2__n">{n}</span>}
      {title}{soft && <> <span className="h2__soft">{soft}</span></>}
    </h2>
  )
}

export function IntegrationsSection({ c, locale }) {
  return (
    <section className="section band">
      <BandTexture kind="linesEdge" />
      <Heading title={c.title} soft={c.soft} />
      <Integrations c={c} locale={locale} />
    </section>
  )
}

// Tarjeta verde con la textura Períodos, dentro de una sección blanca
export function CtaSection({ c, locale }) {
  const demo = hrefFor('demo', locale), pricing = hrefFor('precios', locale), docs = hrefFor('docs', locale)
  return (
    <section className="section section--cta band">
      <div className="cta">
        <Texture kind="periods" />
        <div className="cta__content">
          <h2 className="cta__title">{c.title}</h2>
          <div className="cta__actions">
            {demo && <a className="cta__button" href={demo}>{c.demo}</a>}
            {pricing && <a className="link" href={pricing}>{c.pricing}</a>}
            {docs && <a className="link" href={docs}>{c.docs}</a>}
          </div>
        </div>
      </div>
    </section>
  )
}
