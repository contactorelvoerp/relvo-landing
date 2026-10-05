import { useTabs } from './useTabs'
import { Visual } from '../visuals/Visual'
import '../styles/blocks.css'

// Tabs verticales con su pantalla de producto (01 Rieles de la home y bloque featureTabs de la
// plantilla). Cada tab trae { label, desc, visual }; todos los paneles quedan en el HTML.
export function FeatureTabs({ prefix, tablist, tabs, locale, example }) {
  const t = useTabs(prefix, tabs.length)
  return (
    <div className="rails">
      <div className="vtabs" role="tablist" aria-label={tablist} aria-orientation="vertical">
        {tabs.map((tab, i) => (
          <button key={tab.label + i} className="vtab" {...t.tab(i)}>
            <b>{tab.label}</b>
            <span>{tab.desc}</span>
          </button>
        ))}
      </div>
      <div className="rails__panel">
        {tabs.map((tab, i) => <div key={tab.label + i} className="rails__screen" {...t.panel(i)}><Visual visual={tab.visual} locale={locale} label={tab.label} /></div>)}
        <span className="example-tag rails__tag">{example}</span>
      </div>
    </div>
  )
}
