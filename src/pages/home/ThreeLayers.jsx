import { useEffect, useRef } from 'react'

// "Tres capas, un solo motor": portado de relvo-tres-capas.html / ThreeLayers del DS v1.5.
// Un pulso recorre el riel y enciende cada capa; en mobile y con movimiento reducido
// queda quieto en el estado final. Las capas apagadas se atenúan por el fondo de la tarjeta
// (no por opacidad, como en el prototipo) para que el texto conserve su contraste.
export function ThreeLayers({ c, example }) {
  const root = useRef(null)
  const done = c.agents.done, running = c.agents.running, deltaText = c.intel.delta, numberLocale = c.numberLocale

  useEffect(() => {
    const el = root.current
    const q = (k) => el.querySelector(`[data-k="${k}"]`), qa = (k) => [...el.querySelectorAll(`[data-k="${k}"]`)]
    const layers = qa('layer'), nums = qa('n'), chip = q('chip'), chipText = q('chipText'), mrr = q('mrr'), delta = q('delta'), pt = q('pt'), proj = q('proj'), seg = q('seg'), rail = q('rail')
    const NS = 'http://www.w3.org/2000/svg', fmt = (n) => 'USD ' + Math.round(n).toLocaleString(numberLocale)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let xs = [], nodes = [], dot = null, isWide = true
    const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e }
    const buildRail = () => {
      const tops = layers.map((l) => l.offsetTop)
      isWide = el.clientWidth >= 720 && tops.every((t) => t === tops[0])
      el.classList.toggle('layers--wide', isWide)
      nodes = []; dot = null
      rail.innerHTML = ''
      if (!isWide) return
      const r = rail.getBoundingClientRect(); const W = rail.clientWidth, H = rail.clientHeight; if (!r.width || !W) return; const sc = W / r.width
      xs = layers.map((l) => { const bb = l.getBoundingClientRect(); return (bb.left - r.left + bb.width / 2) * sc })
      const y = H / 2
      rail.appendChild(mk('line', { x1: 0, x2: W, y1: y, y2: y, stroke: '#186666', 'stroke-width': 2 }))
      nodes = xs.map((x) => rail.appendChild(mk('circle', { cx: x, cy: y, r: 6, fill: '#DFF4EB', stroke: '#186666', 'stroke-width': 1.5 })))
      dot = rail.appendChild(mk('circle', { cx: 0, cy: y, r: 4, fill: '#186666' }))
    }
    const setStep = (s, t) => {
      layers.forEach((l, i) => l.classList.toggle('layers__card--dim', i > s))
      nodes.forEach((n, i) => n.setAttribute('fill', i <= s ? '#186666' : '#DFF4EB'))
      nums.forEach((n) => { const v = +n.dataset.v; n.textContent = fmt(s < 0 ? 0 : s === 0 ? v * Math.min(1, t) : v) })
      if (s === 0 && t < 1) return
      const isDone = s >= 1 && (s > 1 || t > 0.5)
      chip.style.background = isDone ? '#DFF4EB' : '#FBF3E4'; chip.style.color = isDone ? '#0F4A4A' : '#8A5A00'
      chipText.textContent = isDone ? done : running
      const k = s >= 2 ? (s > 2 ? 1 : Math.min(1, t)) : 0
      mrr.textContent = fmt(184300 + 2900 * k)
      delta.textContent = k >= 1 ? deltaText : ' '
      pt.setAttribute('cx', 240 + 60 * k); pt.setAttribute('cy', 34 - 12 * k)
      seg.setAttribute('x2', 240 + 60 * k); seg.setAttribute('y2', 34 - 12 * k)
      proj.setAttribute('opacity', k >= 1 ? '0' : '0.5')
    }
    const CYCLE = 9000; let raf = 0, visible = false, start = 0
    const frame = (now) => {
      if (!start) start = now
      const p = ((now - start) % CYCLE) / CYCLE, travel = Math.min(1, p / 0.78)
      const w = rail.clientWidth
      if (dot) { dot.setAttribute('cx', travel * w); dot.setAttribute('opacity', p < 0.92 ? 1 : 0) }
      let s = -1, t = 0
      xs.forEach((x, i) => { if (travel * w >= x) { s = i; t = Math.min(1, (travel * w - x) / (w * 0.12)) } })
      if (p >= 0.92) { s = 2; t = 1 }
      setStep(s, t)
      if (visible) raf = requestAnimationFrame(frame)
    }
    const still = () => !isWide || reduce
    const rest = () => { setStep(2, 1); if (dot) dot.setAttribute('opacity', 0) }
    buildRail()
    const ro = new ResizeObserver(() => { buildRail(); if (still()) rest() }); ro.observe(q('layers'))
    if (still()) rest(); else setStep(-1, 0)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !still(); cancelAnimationFrame(raf)
      if (visible) { start = 0; raf = requestAnimationFrame(frame) } else if (still()) rest()
    })
    io.observe(q('layers'))
    return () => { visible = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [done, running, deltaText, numberLocale])

  const fmt = (n) => 'USD ' + n.toLocaleString(numberLocale)
  const head = (n, l) => (
    <>
      <div className="layers__head"><span className="layers__num">{n}</span><h3 className="layers__name">{l.title}</h3></div>
      <p className="layers__sub">{l.sub}</p>
    </>
  )

  return (
    <div ref={root} className="layers">
      <div data-k="layers" className="layers__grid">
        <article data-k="layer" className="layers__card">
          {head('01', c.rails)}
          <div className="layers__body layers__calc">
            <div className="layers__row"><span>{c.rails.plan}</span><span data-k="n" data-v="500" className="layers__amount">{fmt(500)}</span></div>
            <div className="layers__row layers__row--tight"><span>{c.rails.usage}</span><span data-k="n" data-v="2400" className="layers__amount layers__amount--exact">{fmt(2400)}</span></div>
            <div className="layers__detail">{c.rails.detail}</div>
            <div className="layers__row layers__row--total"><span>{c.rails.total}</span><span data-k="n" data-v="2900" className="layers__amount">{fmt(2900)}</span></div>
          </div>
        </article>
        <article data-k="layer" className="layers__card">
          {head('02', c.agents)}
          <div className="layers__body layers__event">
            <div className="layers__sender">
              <span className="layers__mark"><svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 7.5 6 10l5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              {c.agents.sender}
            </div>
            <strong className="layers__event-title">{c.agents.event}</strong>
            <span className="layers__event-context">{c.agents.context}</span>
            <span data-k="chip" className="layers__chip"><span className="layers__chip-dot" /><span data-k="chipText">{done}</span></span>
          </div>
        </article>
        <article data-k="layer" className="layers__card">
          {head('03', c.intel)}
          <div className="layers__body">
            <div className="layers__mrr-label">{c.intel.label}</div>
            <div data-k="mrr" className="layers__mrr">{fmt(187200)}</div>
            <div data-k="delta" className="layers__delta">{deltaText}</div>
            <svg className="layers__chart" viewBox="0 0 300 84" preserveAspectRatio="none" aria-hidden="true">
              <polyline points="0,70 50,64 100,58 150,52 200,40 240,34" fill="none" stroke="#13131E" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <polyline data-k="proj" points="240,34 300,22" fill="none" stroke="#13131E" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" opacity="0" />
              <line data-k="seg" x1="240" y1="34" x2="300" y2="22" stroke="#186666" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle data-k="pt" cx="300" cy="22" r="3.5" fill="#186666" />
            </svg>
          </div>
        </article>
      </div>
      <div className="layers__rail" aria-hidden="true"><svg data-k="rail" /></div>
      <div className="layers__example"><span className="example-tag">{example}</span></div>
    </div>
  )
}
