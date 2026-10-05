import { useTabs } from '../../blocks/useTabs'
import { Chart } from '../../visuals/Visual'

// 03 Inteligencia (prototipo home v2): un solo contenedor con tabs de texto, KPI a la izquierda y
// gráfico de la librería de visuales. En desktop el panel tiene alto fijo: cambiar de tab no cambia
// la altura de la sección. Datos de ejemplo.
const RECURRING = [140, 143, 146, 149, 152, 156], TOKENS = [38, 52, 41, 63, 49, 72], DOCS = [12, 9, 15, 11, 17, 14]
const DTI = [6, 5, 5, 4, 3, 3], DSO = [47, 45, 44, 41, 40, 38]
const MRR = [184.3, 6.2, 3.1, 2.9, -1.4, -2.7, 192.4]

function chartFor(i, t, months) {
  if (i === 0) return { id: 'barChart', data: { labels: months, series: [RECURRING, TOKENS, DOCS].map((values, k) => ({ name: t.legend[k], values })) } }
  if (i === 1) return { id: 'lineChart', data: { labels: months, series: [DTI, DSO].map((values, k) => ({ name: t.legend[k], values })) } }
  return { id: 'waterfall', data: { steps: t.steps.map((name, k) => (k === 0 || k === t.steps.length - 1 ? [name, MRR[k], 'base'] : [name, MRR[k]])) } }
}

export function Intelligence({ c, example }) {
  const tabs = useTabs('reportes', c.tabs.length)
  return (
    <>
      <div className="report">
        <div className="htabs" role="tablist" aria-label={c.tablist}>
          {c.tabs.map((t, i) => <button key={t.label + i} className="htab" {...tabs.tab(i)}>{t.label}</button>)}
        </div>
        {c.tabs.map((t, i) => (
          <div key={t.label + i} className="report__panel" {...tabs.panel(i)}>
            <div className="kpis">
              {t.kpis.map((k) => (
                <div key={k.label} className="kpi">
                  <span className="kpi__label">{k.label}</span>
                  <b className="kpi__value num">{k.value}</b>
                  {k.note && <p className="kpi__note">{k.note}</p>}
                </div>
              ))}
              <span className="example-tag">{example}</span>
            </div>
            <div className="report__chart"><Chart {...chartFor(i, t, c.months)} label={t.chartLabel} locale={c.numberLocale} /></div>
          </div>
        ))}
      </div>
      <p className="also">{c.also}</p>
    </>
  )
}
