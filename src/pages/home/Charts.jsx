// Gráficos de 03 Inteligencia (prototipo home v2), con datos de ejemplo y colores del DS v1.5.
// Las series de consumo van en el acento de uso (morado).
// SVG renderizado en el servidor: queda en el HTML inicial, sin canvas.
const H = 230, L = 44, W = 640
const INK = '#13131E', ACCENT = '#186666', NEGATIVE = '#A3302A', USO = '#633BF2', USO_2 = '#E3C0F2'
const UI = 'Instrument Sans, sans-serif'

function Grid({ ticks, y, format = String }) {
  return ticks.map((v) => (
    <g key={v}>
      <line x1={L} x2={W} y1={y(v)} y2={y(v)} stroke="#ECEEF1" />
      <text x={L - 10} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#6E6E7A" fontFamily={UI}>{format(v)}</text>
    </g>
  ))
}

const Label = ({ x, children }) => <text x={x} y={H + 20} textAnchor="middle" fontSize="12" fill="#5C5C69" fontFamily={UI}>{children}</text>

export function UsageBars({ months, label }) {
  const max = 220, fix = [140, 143, 146, 149, 152, 156], api = [12, 14, 17, 20, 24, 31], doc = [6, 6, 7, 7, 8, 10]
  const y = (v) => H - (v / max) * (H - 20)
  const bw = 46, gap = (W - L - 20 - bw * 6) / 5
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label={label}>
      <Grid ticks={[0, 100, 200]} y={y} />
      {months.map((m, i) => {
        const x = L + 10 + i * (bw + gap)
        let top = H
        return (
          <g key={m}>
            {[[fix[i], INK], [api[i], USO], [doc[i], USO_2]].map(([v, color], k) => {
              const h = (v / max) * (H - 20)
              top -= h
              return <rect key={k} x={x} y={top} width={bw} height={h} fill={color} />
            })}
            <Label x={x + bw / 2}>{m}</Label>
          </g>
        )
      })}
    </svg>
  )
}

export function DtiDsoLines({ months, label }) {
  const max = 50, dti = [6, 5, 5, 4, 3, 3], dso = [47, 45, 44, 41, 40, 38]
  const x = (i) => L + 20 + i * ((W - L - 40) / 5)
  const y = (v) => H - (v / max) * (H - 20)
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label={label}>
      <Grid ticks={[0, 25, 50]} y={y} />
      {[[dso, INK], [dti, ACCENT]].map(([data, color]) => (
        <g key={color}>
          <polyline points={data.map((v, i) => `${x(i)},${y(v)}`).join(' ')} fill="none" stroke={color} strokeWidth="2" />
          {data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={color} />)}
        </g>
      ))}
      {months.map((m, i) => <Label key={m} x={x(i)}>{m}</Label>)}
    </svg>
  )
}

export function MrrWaterfall({ steps, label, locale }) {
  const values = [[184.3, true], [6.2], [3.1], [2.9], [-1.4], [-2.7], [192.4, true]]
  const lo = 175, hi = 200
  const y = (v) => H - ((v - lo) / (hi - lo)) * (H - 20)
  const fmt = (v) => v.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const bw = 52, gap = (W - L - 20 - bw * values.length) / (values.length - 1)
  let acc = 0
  return (
    <svg viewBox="0 0 640 260" role="img" aria-label={label}>
      <Grid ticks={[175, 185, 195]} y={y} />
      {values.map(([v, base], i) => {
        const x = L + 10 + i * (bw + gap)
        let y1, y2, color
        if (base) { y1 = y(v); y2 = H; color = INK; acc = v }
        else { const a = acc, b = acc + v; y1 = y(Math.max(a, b)); y2 = y(Math.min(a, b)); color = v > 0 ? ACCENT : NEGATIVE; acc = b }
        return (
          <g key={i}>
            <rect x={x} y={y1} width={bw} height={Math.max(1, y2 - y1)} fill={color} />
            <text x={x + bw / 2} y={y1 - 6} textAnchor="middle" fontSize="11" fill="#4A4A57" fontFamily={UI}>{base ? fmt(v) : (v > 0 ? '+' : '−') + fmt(Math.abs(v))}</text>
            <Label x={x + bw / 2}>{steps[i]}</Label>
          </g>
        )
      })}
    </svg>
  )
}
