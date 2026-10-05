// Gráficos de Inteligencia (barChart, lineChart, waterfall), con colores del DS v1.5 y datos por
// parámetro. SVG renderizado en el servidor: queda en el HTML inicial, sin canvas.
// Las series de consumo van en el acento de uso (morado).
const H = 230, L = 44, W = 640
import { ACCENT, BAR_COLORS, INK, LINE_COLORS, NEGATIVE } from './colors'
const UI = 'Instrument Sans, sans-serif'

// Escala: máximo redondeado hacia arriba (múltiplos de 50 sobre 100, de 25 bajo 100) y 3 marcas
function scale(max) {
  const step = max > 100 ? 50 : 25
  const top = Math.ceil(max / step) * step
  return { top, ticks: [0, top / 2, top] }
}

function Grid({ ticks, y, format = String }) {
  return ticks.map((v) => (
    <g key={v}>
      <line x1={L} x2={W} y1={y(v)} y2={y(v)} stroke="#ECEEF1" />
      <text x={L - 10} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#6E6E7A" fontFamily={UI}>{format(v)}</text>
    </g>
  ))
}

const Label = ({ x, children }) => <text x={x} y={H + 20} textAnchor="middle" fontSize="12" fill="#5C5C69" fontFamily={UI}>{children}</text>

export function Legend({ names, colors }) {
  return (
    <div className="legend">
      {names.map((name, i) => <span key={name + i}><i style={{ background: colors[i] }} />{name}</span>)}
    </div>
  )
}

export function BarChart({ labels, series, label }) {
  const totals = labels.map((_, i) => series.reduce((sum, s) => sum + s.values[i], 0))
  const { top, ticks } = scale(Math.max(...totals))
  const y = (v) => H - (v / top) * (H - 20)
  const bw = 46, gap = (W - L - 20 - bw * labels.length) / (labels.length - 1)
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label={label}>
      <Grid ticks={ticks} y={y} />
      {labels.map((m, i) => {
        const x = L + 10 + i * (bw + gap)
        let base = H
        return (
          <g key={m}>
            {series.map((s, k) => {
              const h = (s.values[i] / top) * (H - 20)
              base -= h
              return <rect key={s.name} x={x} y={base} width={bw} height={h} fill={BAR_COLORS[k]} />
            })}
            <Label x={x + bw / 2}>{m}</Label>
          </g>
        )
      })}
    </svg>
  )
}

export function LineChart({ labels, series, label }) {
  const { top, ticks } = scale(Math.max(...series.flatMap((s) => s.values)))
  const x = (i) => L + 20 + i * ((W - L - 40) / (labels.length - 1))
  const y = (v) => H - (v / top) * (H - 20)
  // Se dibuja la última serie primero, así la primera (en acento) queda encima
  const ordered = series.map((s, k) => [s, LINE_COLORS[k]]).reverse()
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label={label}>
      <Grid ticks={ticks} y={y} />
      {ordered.map(([s, color]) => (
        <g key={s.name}>
          <polyline points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke={color} strokeWidth="2" />
          {s.values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={color} />)}
        </g>
      ))}
      {labels.map((m, i) => <Label key={m} x={x(i)}>{m}</Label>)}
    </svg>
  )
}

export function Waterfall({ steps, label, locale = 'es-CL' }) {
  let acc = 0
  const levels = steps.map(([, v, base]) => (acc = base ? v : acc + v))
  const lo = Math.floor((Math.min(...steps.filter((s) => s[2]).map((s) => s[1])) - 5) / 5) * 5
  const hi = Math.ceil((Math.max(...levels) + 3) / 5) * 5
  const y = (v) => H - ((v - lo) / (hi - lo)) * (H - 20)
  const fmt = (v) => v.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const bw = 52, gap = (W - L - 20 - bw * steps.length) / (steps.length - 1)
  acc = 0
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label={label}>
      <Grid ticks={[lo, lo + 10, lo + 20]} y={y} />
      {steps.map(([name, v, base], i) => {
        const x = L + 10 + i * (bw + gap)
        let y1, y2, color
        if (base) { y1 = y(v); y2 = H; color = INK; acc = v }
        else { const a = acc, b = acc + v; y1 = y(Math.max(a, b)); y2 = y(Math.min(a, b)); color = v > 0 ? ACCENT : NEGATIVE; acc = b }
        return (
          <g key={name}>
            <rect x={x} y={y1} width={bw} height={Math.max(1, y2 - y1)} fill={color} />
            <text x={x + bw / 2} y={y1 - 6} textAnchor="middle" fontSize="11" fill="#4A4A57" fontFamily={UI}>{base ? fmt(v) : (v > 0 ? '+' : '−') + fmt(Math.abs(v))}</text>
            <Label x={x + bw / 2}>{name}</Label>
          </g>
        )
      })}
    </svg>
  )
}
