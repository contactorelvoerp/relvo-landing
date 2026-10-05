import { useTabs } from './useTabs'
import { DtiDsoLines, MrrWaterfall, UsageBars } from './Charts'

// 03 Inteligencia (prototipo home v1): un solo contenedor con tabs de texto, KPI a la izquierda y gráfico.
const LEGEND_COLORS = [['#13131E', '#186666', '#8CC7C7'], ['#186666', '#13131E']]

export function Intelligence({ c, example }) {
  const tabs = useTabs('reportes', c.tabs.length)
  const charts = [
    <UsageBars key="usage" months={c.months} label={c.tabs[0].chartLabel} />,
    <DtiDsoLines key="dti" months={c.months} label={c.tabs[1].chartLabel} />,
    <MrrWaterfall key="mrr" steps={c.tabs[2].steps} label={c.tabs[2].chartLabel} locale={c.numberLocale} />,
  ]

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
                  <p className="kpi__note">{k.note}</p>
                </div>
              ))}
              <span className="example-tag">{example}</span>
            </div>
            <div className="report__chart">
              {charts[i]}
              {t.legend && (
                <div className="legend">
                  {t.legend.map((name, k) => <span key={name + k}><i style={{ background: LEGEND_COLORS[i][k] }} />{name}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="also">{c.also}</p>
    </>
  )
}
