import { copy } from './copy'
import { LeadForm } from '../../components/LeadForm'
import './demo.css'

export function DemoPage({ locale }) {
  const c = copy[locale]
  return (
    <section className="demo">
      <div className="demo__intro">
        <h1 className="demo__title">{c.title}</h1>
        <p className="demo__lede">{c.lede}</p>
      </div>
      <LeadForm locale={locale} fuente="agendar_demo" />
    </section>
  )
}
