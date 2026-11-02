import { copy } from './copy'
import { LeadForm } from '../../components/LeadForm'
import { CalPanel } from '../../blocks/CalPanel'
import './demo.css'

// Calendario embebido (CalPanel/CalEmbed, compartidos con /lp/facturacion-b2b y /powered-by-relvo):
// solo en ES por ahora, porque el texto del panel alternativo (copy.js → formTitle/formSubmit) no
// tiene traducción aprobada todavía. /en/book-a-demo sigue siendo solo el formulario, como antes.
export function DemoPage({ locale }) {
  const c = copy[locale]
  if (locale !== 'es') {
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
  return (
    <section className="demo demo--cal">
      <div className="demo__intro">
        <h1 className="demo__title">{c.title}</h1>
        <p className="demo__lede">{c.lede}</p>
      </div>
      <CalPanel formTitle={c.formTitle}>
        <LeadForm locale={locale} fuente="agendar_demo" submit={c.formSubmit} />
      </CalPanel>
    </section>
  )
}
