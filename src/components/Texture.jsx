import { useEffect, useRef } from 'react'

// Texturas generativas del DS v1.5. Código de canvas tal cual de relvo-texturas.html.
// Llena su contenedor (que debe tener position e isolation) y pinta su fondo.
const C = { green: '24,102,102', greenLight: '114,221,170', white: '255,255,255' }

const painters = {
  orbits(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h)
    const centers = [[-0.08 * w, 1.12 * h, C.green, 0.55], [1.1 * w, -0.15 * h, C.green, 0.35]]
    centers.forEach(([cx, cy, col, a], k) => {
      const max = Math.hypot(w, h) * 1.05
      const drift = Math.sin(t * 0.00025 + k) * 10
      for (let r = 30; r < max; r += 11) {
        const fade = 1 - r / max
        ctx.strokeStyle = `rgba(${col},${(a * fade).toFixed(3)})`
        ctx.lineWidth = 1
        const start = -Math.PI / 2 + Math.sin(t * 0.0002 + r * 0.01) * 0.12
        ctx.beginPath(); ctx.arc(cx, cy, r + drift, start, start + Math.PI * 0.9 + (k ? Math.PI * 0.3 : 0)); ctx.stroke()
      }
    })
  },
  ridges(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h)
    const lines = 38, step = h / (lines + 2)
    for (let i = 0; i < lines; i++) {
      const y0 = step * (i + 1.5)
      const band = Math.exp(-Math.pow((i - lines * 0.55) / (lines * 0.28), 2))
      ctx.strokeStyle = `rgba(${C.green},${(0.16 + 0.5 * band).toFixed(3)})`
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x <= w; x += 6) {
        const nx = x / w
        const peak = Math.exp(-Math.pow((nx - 0.62) / 0.22, 2)) + 0.6 * Math.exp(-Math.pow((nx - 0.2) / 0.12, 2))
        const y = y0 - band * peak * step * 5.5 * (0.8 + 0.2 * Math.sin(t * 0.0006 + i * 0.35))
                  - Math.sin(nx * 9 + i * 0.5 + t * 0.0004) * 1.6
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  },
  pulse(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h)
    const gap = 14, cols = Math.ceil(w / gap), rows = Math.ceil(h / gap)
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = i * gap + gap / 2, y = j * gap + gap / 2
      const d = Math.hypot(x - w * 0.15, y - h * 0.8)
      const wave = 0.5 + 0.5 * Math.sin(d * 0.035 - t * 0.0022)
      const falloff = Math.max(0, 1 - d / (w * 0.95))
      const v = Math.pow(wave, 3) * falloff
      if (v < 0.03) continue
      ctx.fillStyle = `rgba(${C.greenLight},${(0.08 + 0.7 * v).toFixed(3)})`
      ctx.beginPath(); ctx.arc(x, y, 0.8 + 1.4 * v, 0, Math.PI * 2); ctx.fill()
    }
  },
  periods(ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h)
    const r = h * 0.3, cy = h * 0.5, n = 60
    // El tubo termina en el borde derecho: el último círculo queda fijo ahí y solo se mueven los intermedios
    const startX = w * 0.58, span = (w - r) - startX, step = span / (n - 1), off = (t * 0.012) % step
    for (let k = 0; k < n; k++) {
      const p = k / (n - 1)
      const x = startX + p * span + (k < n - 1 ? off : 0)
      ctx.strokeStyle = `rgba(${C.white},${(0.06 + 0.3 * (1 - p)).toFixed(3)})`
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.arc(x, cy, r, 0, Math.PI * 2); ctx.stroke()
    }
    ctx.strokeStyle = `rgba(${C.white},0.75)`; ctx.lineWidth = 1.25
    ctx.beginPath(); ctx.arc(startX, cy, r, 0, Math.PI * 2); ctx.stroke()
  },
}

export function Texture({ kind }) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const paint = painters[kind]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, visible = false, ready = false, raf = 0, last = 0
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = stage.clientWidth; h = stage.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paint(ctx, w, h, 0)
    }
    // 20 cuadros por segundo y densidad máxima 1,5×: el movimiento es lento y el costo por cuadro cae a un tercio.
    const loop = (t) => {
      if (t - last >= 50) { paint(ctx, w, h, t); last = t }
      if (visible && !reduce) raf = requestAnimationFrame(loop)
    }
    const start = () => { cancelAnimationFrame(raf); if (ready && visible && !reduce) raf = requestAnimationFrame(loop) }
    const ro = new ResizeObserver(size)
    ro.observe(stage)
    // Se pausa fuera de pantalla y con movimiento reducido queda en el primer cuadro.
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; start() })
    io.observe(stage)
    // La animación parte después de la carga: el primer render queda libre (el primer cuadro ya está pintado).
    const begin = () => { ready = true; start() }
    let timer = 0
    const onLoad = () => { timer = setTimeout(begin, 1000) }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    return () => { visible = false; cancelAnimationFrame(raf); clearTimeout(timer); window.removeEventListener('load', onLoad); ro.disconnect(); io.disconnect() }
  }, [kind])

  return (
    <div ref={stageRef} className={`texture texture--${kind}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
