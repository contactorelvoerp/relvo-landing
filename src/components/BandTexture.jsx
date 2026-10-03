import { useEffect, useRef } from 'react'

// Texturas de fondo estáticas del prototipo home v1 (una por sección, detrás del contenido).
// Se dibujan una sola vez cuando la banda se acerca al viewport y de nuevo solo si cambia su
// tamaño. `inner` son los bordes del contenido de la banda: las texturas de borde no lo invaden.
const painters = {
  orbitsEdge(ctx, w, h) {
    const cx = w + 60, cy = h * 0.32, max = Math.max(w * 0.62, 700)
    for (let r = 120; r < max; r += 13) {
      ctx.strokeStyle = `rgba(15,74,74,${(0.2 * (1 - r / max)).toFixed(3)})`
      ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke()
    }
  },
  ridgesSoft(ctx, w, h) {
    for (let y = 14; y < h; y += 11) {
      const band = Math.exp(-Math.pow((y / h - 0.62) / 0.3, 2))
      ctx.strokeStyle = `rgba(24,102,102,${(0.04 + 0.08 * band).toFixed(3)})`
      ctx.beginPath()
      for (let x = 0; x <= w; x += 8) {
        const nx = x / w
        const yy = y - band * 26 * (Math.exp(-Math.pow((nx - 0.8) / 0.18, 2)) + 0.7 * Math.exp(-Math.pow((nx - 0.12) / 0.1, 2)))
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy)
      }
      ctx.stroke()
    }
  },
  dotsGutter(ctx, w, h, inner) {
    const g = 16
    ctx.fillStyle = 'rgb(24,102,102)'
    for (let y = g / 2; y < h; y += g) for (let x = g / 2; x < w; x += g) {
      const d = x < inner.l ? inner.l - x : x > inner.r ? x - inner.r : -1
      if (d < 0) continue
      ctx.globalAlpha = Math.min(0.32, 0.06 + d / 900)
      ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1
  },
  orbitsDark(ctx, w, h) {
    const cx = -40, cy = h + 40, max = Math.max(w * 0.5, 600)
    for (let r = 80; r < max; r += 12) {
      ctx.strokeStyle = `rgba(114,221,170,${(0.1 * (1 - r / max)).toFixed(3)})`
      ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, 0); ctx.stroke()
    }
  },
  linesEdge(ctx, w, h, inner) {
    const right = w - inner.r
    for (let y = 10, i = 0; y < h; y += 7, i++) {
      ctx.strokeStyle = `rgba(24,102,102,${(0.08 + 0.06 * Math.sin(i * 0.2)).toFixed(3)})`
      const len = Math.min(inner.l, inner.l * (0.55 + 0.45 * Math.abs(Math.sin(i * 0.11))) + 60 * Math.sin(i * 0.05))
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(Math.max(0, len), y); ctx.stroke()
      const len2 = right * (0.55 + 0.45 * Math.abs(Math.cos(i * 0.09)))
      ctx.beginPath(); ctx.moveTo(w, y); ctx.lineTo(w - Math.max(0, len2), y); ctx.stroke()
    }
  },
}

export function BandTexture({ kind }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const band = canvas.parentElement
    const ctx = canvas.getContext('2d')
    let drawn = false

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = canvas.clientWidth, h = canvas.clientHeight
      if (!w || !h) return
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineWidth = 1
      const c = canvas.getBoundingClientRect(), b = band.getBoundingClientRect(), pad = parseFloat(getComputedStyle(band).paddingLeft)
      painters[kind](ctx, w, h, { l: b.left - c.left + pad, r: b.right - c.left - pad })
      drawn = true
    }

    const resize = new ResizeObserver(() => { if (drawn) draw() })
    const view = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      view.disconnect()
      draw()
      resize.observe(band)
    }, { rootMargin: '400px 0px' })
    view.observe(band)
    return () => { view.disconnect(); resize.disconnect() }
  }, [kind])

  return <canvas ref={ref} className="band-texture" aria-hidden="true" />
}
