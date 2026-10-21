import { hrefFor } from '../../routes'
import { copy as demoCopy } from '../demo/copy'
import { copy as homeCopy } from '../home/copy'
import { HeroStage } from '../home/HeroStage'
import { Case } from '../../blocks/Case'
import '../../landing/landing.css'
import '../home/home.css'

// This acquisition page reuses approved product copy and the real published
// customer case. It makes no claim that the recipient's invoice was issued by Relvo.
export function PoweredByPage({ locale }) {
  const c = homeCopy[locale]
  return (
    <>
      <section className="section band band--first lp-hero" aria-labelledby="powered-by-title">
        <div className="lp-head">
          <h1 id="powered-by-title" className="lp-head__title">Powered by Relvo</h1>
          <p className="lp-head__lead">{locale === 'es' ? c.hero.subtitle : demoCopy.en.lede}</p>
          <div className="lp-head__ctas">
            <a className="btn btn--lg btn--primary" href={hrefFor('demo', locale)}>{c.hero.demo}</a>
          </div>
        </div>
        {locale === 'es' && <div className="lp-hero__visual"><HeroStage c={c.hero.stage} locale={locale} /></div>}
      </section>
      {locale === 'es' && <section className="section band"><Case c={c.case} /></section>}
    </>
  )
}
