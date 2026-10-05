import { Texture } from '../../components/Texture'
import { Usage } from '../../visuals/cards'
import { labelsFor } from '../../visuals/labels'
import { Toast, Window } from '../../visuals/HeroApp'
import { useSequence } from '../../visuals/useSequence'

// Hero (prototipo home v2): ventana de la app → tokens del mes → factura → pago conciliado,
// sobre la textura Órbitas. La ventana, la tarjeta de tokens, el aviso y la secuencia de aparición
// son los de la librería de visuales. En mobile se apilan.
// Tokens por día de los últimos 30 días (ejemplo), en % del día más alto de la escala
const DAYS = [8, 12, 18, 15, 24, 30, 22, 26, 14, 10, 28, 25, 33, 38, 30, 52, 70, 42, 35, 26, 30, 34, 32, 44, 50, 56, 62, 48, 36, 40]

export function HeroStage({ c, locale }) {
  const [stage, paid] = useSequence(2)
  const w = c.window
  const rows = w.rows.map(([id, amount, status], i) => ({ cols: [id, amount], status: i === 0 && paid ? w.paid : status }))
  return (
    <div ref={stage} className="stage hero-stage">
      <Texture kind="orbits" />
      <Window url={w.url} nav={w.nav} section={w.nav[0]} kpi={{ label: w.label, value: w.name, badge: w.status }} columns={w.columns} rows={rows} />
      <div className="hc hc--usage"><Usage d={{ ...c.usage, series: DAYS }} l={labelsFor(locale)} /></div>
      <div className="hc hc--invoice">
        <div className="inv__head"><span>{c.invoice.title}</span><span>{c.invoice.meta}</span></div>
        <p className="inv__total num">{c.invoice.total}</p>
        {c.invoice.rows.map(([label, amount], i) => (
          <div key={label} className="hc__row"><span>{label}</span><span className={i === 1 ? 'num hc__uso' : 'num'}>{amount}</span></div>
        ))}
        <div className="hc__row hc__row--total"><span>{c.invoice.totalLabel}</span><span className="num">{c.invoice.total}</span></div>
      </div>
      <Toast title={c.toast.title} sub={c.toast.meta} />
    </div>
  )
}
