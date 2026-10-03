// Gráficos de Inteligencia: MrrUsageChart, DsoDti y MrrWaterfall del DS v1.5,
// con los datos de ejemplo del mockup. Se reemplazan por screenshots del producto cuando existan.
const MONTHS_VALUES = {
  fixed: [138, 141, 144, 147, 150.6, 160],
  api: [14, 16, 18, 20, 22.4, 31],
  docs: [5.5, 6.5, 7.5, 8.5, 9.4, 13.1],
  dso: [52, 49, 46, 44, 41, 38],
  dti: [9, 7, 5, 3, 2, 1],
}
const WATERFALL = [
  { key: 'start', value: 182.4, type: 'start' },
  { key: 'new', value: 8.0, type: 'up' },
  { key: 'expansion', value: 9.8, type: 'up' },
  { key: 'usage', value: 12.3, type: 'up' },
  { key: 'contraction', value: -3.4, type: 'down' },
  { key: 'churn', value: -5.0, type: 'down' },
  { key: 'end', value: 204.1, type: 'end' },
]
const BAR = { start: '#13131E', end: '#13131E', up: '#3F7A1C', down: '#A3302A' }
const MONO = 'Geist Mono, monospace'
const UI = 'Instrument Sans, sans-serif'

function Figure({ title, summary, note, children }) {
  return (
    <figure className="chart">
      <figcaption className="chart__caption">
        <span className="chart__title">{title}</span>
        <span className="chart__summary">{summary}</span>
      </figcaption>
      {children}
      {note && <p className="chart__note">{note}</p>}
    </figure>
  )
}

export function MrrUsageChart({ c }) {
  const W = 640, H = 250, pl = 40, pr = 8, pt = 12, pb = 30
  const series = [
    { name: c.series.fixed, values: MONTHS_VALUES.fixed, color: '#13131E' },
    { name: c.series.api, values: MONTHS_VALUES.api, color: '#186666' },
    { name: c.series.docs, values: MONTHS_VALUES.docs, color: '#8CC7C7' },
  ]
  const totals = c.months.map((_, i) => series.reduce((s, m) => s + m.values[i], 0))
  const hi = Math.ceil(Math.max(...totals) * 1.08 / 50) * 50
  const y = (v) => pt + (1 - v / hi) * (H - pt - pb)
  const step = (W - pl - pr) / c.months.length, bw = step * 0.5
  return (
    <Figure title={c.usage.title} summary={c.usage.summary} note={`${c.unit}.`}>
      <div className="chart__legend">
        {series.map((s) => <span key={s.name}><span className="chart__swatch" style={{ background: s.color }} />{s.name}</span>)}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={c.usage.title}>
        {[0, hi / 2, hi].map((t) => (
          <g key={t}><line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="#ECECF0" /><text x={pl - 8} y={y(t) + 4} textAnchor="end" fontFamily={MONO} fontSize="11" fill="#6E6E7A">{t}</text></g>
        ))}
        {c.months.map((m, i) => {
          let acc = 0
          const x = pl + i * step + (step - bw) / 2
          return (
            <g key={m}>
              {series.map((s) => { const v = s.values[i]; const r = <rect key={s.name} x={x} y={y(acc + v)} width={bw} height={y(acc) - y(acc + v)} fill={s.color} stroke="#FFFFFF" strokeWidth="0.75" />; acc += v; return r })}
              <text x={x + bw / 2} y={H - pb + 18} textAnchor="middle" fontFamily={UI} fontSize="12" fill="#5C5C69">{m}</text>
            </g>
          )
        })}
        <line x1={pl} x2={W - pr} y1={H - pb} y2={H - pb} stroke="#13131E" />
      </svg>
    </Figure>
  )
}

function Trend({ m, values, target, c }) {
  const W = 300, H = 140, pl = 26, pr = 36, pt = 10, pb = 24
  const hi = Math.ceil(Math.max(...values, target) * 1.1 / 10) * 10
  const x = (i) => pl + (i / (values.length - 1)) * (W - pl - pr)
  const y = (v) => pt + (1 - v / hi) * (H - pt - pb)
  const last = values[values.length - 1]
  return (
    <div className="trend">
      <span className="trend__name">{m.name}</span>
      <span className="trend__definition">{m.definition}</span>
      <span className="trend__value"><span className="trend__number">{last}</span><span className="trend__unit">{c.days}</span></span>
      <span className="trend__judgement"><strong>{c.underTarget}</strong> · {c.target} {target} {c.days} · {m.delta}</span>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={m.name}>
        <line x1={pl} x2={W - pr} y1={y(target)} y2={y(target)} stroke="#13131E" strokeDasharray="3 3" />
        <text x={W - pr + 4} y={y(target) + 4} fontFamily={UI} fontSize="11" fill="#13131E">{c.targetLabel}</text>
        <polyline points={values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke="#186666" strokeWidth="1.75" />
        {values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === values.length - 1 ? 3.5 : 2.25} fill={i === values.length - 1 ? '#186666' : '#FFFFFF'} stroke="#186666" strokeWidth="1.25" />)}
        <text x={pl - 6} y={y(hi) + 4} textAnchor="end" fontFamily={MONO} fontSize="10.5" fill="#6E6E7A">{hi}</text>
        <text x={pl - 6} y={y(0) + 4} textAnchor="end" fontFamily={MONO} fontSize="10.5" fill="#6E6E7A">0</text>
        <line x1={pl} x2={W - pr} y1={y(0)} y2={y(0)} stroke="#13131E" />
        {c.months.map((mo, i) => <text key={mo} x={x(i)} y={H - 6} textAnchor="middle" fontFamily={UI} fontSize="11" fill="#5C5C69">{mo}</text>)}
      </svg>
    </div>
  )
}

export function DsoDti({ c }) {
  return (
    <div className="trends">
      <Trend m={c.dti} values={MONTHS_VALUES.dti} target={2} c={c} />
      <Trend m={c.dso} values={MONTHS_VALUES.dso} target={40} c={c} />
    </div>
  )
}

export function MrrWaterfall({ c }) {
  const W = 640, H = 270, pl = 40, pr = 8, pt = 26, pb = 40
  const fmt = (v) => v.toLocaleString(c.numberLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  let run = 0
  const bars = WATERFALL.map((s) => {
    if (s.type === 'start' || s.type === 'end') { run = s.value; return { ...s, y0: 0, y1: s.value } }
    const y0 = run; run += s.value; return { ...s, y0, y1: run }
  })
  const lo = Math.floor(Math.min(...bars.filter((b) => b.y0 === 0).map((b) => b.y1)) * 0.8 / 10) * 10
  const hi = Math.ceil(Math.max(...bars.map((b) => Math.max(b.y0, b.y1))) * 1.04 / 10) * 10
  const y = (v) => pt + (1 - (Math.max(v, lo) - lo) / (hi - lo)) * (H - pt - pb)
  const step = (W - pl - pr) / bars.length, bw = step * 0.56
  return (
    <Figure title={c.waterfall.title} summary={c.waterfall.summary} note={`${c.unit}. ${c.axisFrom} ${lo}.`}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={c.waterfall.title}>
        {[lo, lo + (hi - lo) / 2, hi].map((t) => (
          <g key={t}><line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="#ECECF0" /><text x={pl - 8} y={y(t) + 4} textAnchor="end" fontFamily={MONO} fontSize="11" fill="#6E6E7A">{Math.round(t)}</text></g>
        ))}
        {bars.map((b, i) => {
          const x = pl + i * step + (step - bw) / 2, top = y(Math.max(b.y0, b.y1)), bot = y(Math.min(b.y0, b.y1))
          const total = b.y0 === 0
          return (
            <g key={b.key}>
              {i < bars.length - 1 && <line x1={x + bw} x2={x + step} y1={y(b.y1)} y2={y(b.y1)} stroke="#ABABB7" />}
              <rect x={x} y={top} width={bw} height={Math.max(1, bot - top)} fill={BAR[b.type]} />
              <text x={x + bw / 2} y={top - 7} textAnchor="middle" fontFamily={MONO} fontSize="11.5" fill={total ? '#13131E' : BAR[b.type]}>{total ? fmt(b.value) : (b.value > 0 ? '+' : '−') + fmt(Math.abs(b.value))}</text>
              <text x={x + bw / 2} y={H - pb + 18} textAnchor="middle" fontFamily={UI} fontSize="12" fill="#5C5C69">{c.waterfall.steps[b.key]}</text>
            </g>
          )
        })}
        <line x1={pl} x2={W - pr} y1={H - pb} y2={H - pb} stroke="#13131E" />
      </svg>
    </Figure>
  )
}
