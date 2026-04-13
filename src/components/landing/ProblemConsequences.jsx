import { useEffect, useRef, useState } from 'react'

// ── Copy ───────────────────────────────────────────────────────────────
// All copy hardcoded for now. Moves to i18n once final.

const PROBLEM_HEADLINE_PRE = 'Operar los modelos de cobro no es fácil:'
const PROBLEM_HEADLINE_HIGHLIGHT = 'lógicas de negocio, cálculos y detalles'
const PROBLEM_HEADLINE_POST = 'se gestionan en planillas y herramientas desconectadas.'

const PROBLEM_BODY_1 =
  'Al principio funciona — un par de hojas, una rutina clara y alguien que mantiene todo. Hasta que comienzan los problemas.'
const PROBLEM_BODY_2 =
  'Los parches no escalan: necesitan mantenimiento constante, dependen de una persona y, peor aún, no crecen con la operación.'

const CONSEQUENCES_EYEBROW = 'Consecuencias'
const CONSEQUENCES_HEADLINE_PRE = '¿Cuánto cuesta '
const CONSEQUENCES_HEADLINE_HIGHLIGHT = 'este problema'
const CONSEQUENCES_HEADLINE_POST = ' a la empresa cada año?'

const CONSEQUENCE_STAGES = [
  {
    id: 'cobras-tarde',
    title: 'Cobras tarde.',
    body: 'Ciclos de cobro hasta 2× más largos que el plazo acordado. El capital de trabajo se queda atrapado en cuentas por cobrar, no en tu operación.',
    number: '+22',
    numberUnit: 'd í a s',
    numberLabel: 'sobre el plazo acordado',
  },
  {
    id: 'facturas-menos',
    title: 'Facturas menos.',
    body: 'Hasta 5% del ARR se escapa en servicios no facturados o mal calculados. Lo que ya ganaste no llega a tu balance.',
    number: '5%',
    numberUnit: ' del  A R R',
    numberLabel: 'facturado de menos',
  },
  {
    id: 'quemas-horas',
    title: 'Quemas HH.',
    body: 'Dos o más personas en tiempo completo absorbidas por trabajo que debería estar automatizado — tiempo que no se dedica a cerrar o crecer.',
    number: '2+',
    numberUnit: 'FTE',
    numberLabel: 'atrapados en tareas manuales',
  },
]

const CLOSING_PRE = 'Y cada cliente nuevo no reduce el problema — '
const CLOSING_HIGHLIGHT = 'lo multiplica.'
const CLOSING_BODY =
  'No solo dejas dinero sobre la mesa hoy: pones un techo a lo que puedes crecer mañana.'

// ── Shared style tokens ────────────────────────────────────────────────

const EYEBROW_STYLE = {
  fontFamily: 'var(--font-mono)',
  fontSize: 'clamp(0.65rem, 0.95vmin, 0.85rem)',
  fontWeight: 400,
  color: '#585858',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
}

const HEADLINE_STYLE = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.3rem, 4.5vmin, 3.5rem)',
  fontWeight: 300,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  color: '#000000',
}

const BODY_STYLE = {
  fontFamily: 'var(--font-ui)',
  fontSize: 'clamp(0.9rem, 1.9vmin, 1.25rem)',
  fontWeight: 400,
  lineHeight: 1.55,
  color: '#2a2a2a',
}

const HIGHLIGHT_STYLE = {
  background: 'linear-gradient(transparent 48%, #F4B08E 48%)',
  WebkitBoxDecorationBreak: 'clone',
  boxDecorationBreak: 'clone',
  borderRadius: '2px',
  padding: '0 0.18em',
}

// ── Problem sub-block ─────────────────────────────────────────────────

const ProblemBlock = () => (
  <section className="relative flex w-full flex-col items-center px-4 py-[18vh] sm:px-6">
    <div className="mx-auto flex w-full max-w-4xl flex-col items-start text-left">
      <h2 style={HEADLINE_STYLE}>
        {PROBLEM_HEADLINE_PRE}
        <span style={HIGHLIGHT_STYLE}>{PROBLEM_HEADLINE_HIGHLIGHT}</span>
        {PROBLEM_HEADLINE_POST}
      </h2>

      <div className="mt-[6vh] flex max-w-3xl flex-col gap-[2.5vh]" style={BODY_STYLE}>
        <p>{PROBLEM_BODY_1}</p>
        <p>{PROBLEM_BODY_2}</p>
      </div>
    </div>
  </section>
)

// ── Consequences scrollytelling ───────────────────────────────────────

// Beats: intro (empty) → card 0 → card 1 → card 2 → closing.
const BEATS = 5
// Total scroll distance consumed by all beats (on top of the 100vh section).
// 100vh extra means each beat = 20vh of scroll drives one transition.
const BEAT_SCROLL_VH = 100

const ConsequencesBlock = () => {
  const wrapperRef = useRef(null)
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const shader = document.getElementById('shader-background-root')
    const origPosition = shader ? shader.style.position : ''
    const origTop = shader ? shader.style.top : ''
    const origHeight = shader ? shader.style.height : ''
    let shaderPinned = false

    // `capturedScrollY` = the scroll position at which we first locked the
    // shader during this pin session. `offsetAccum` = the cumulative offset
    // that's been "absorbed" by previous pin sessions. Post-pin we keep the
    // shader shifted so the rest of the page sees a seamless continuation
    // of the frozen slice.
    let capturedScrollY = 0
    let offsetAccum = 0

    const pinShader = () => {
      if (!shader || shaderPinned) return
      capturedScrollY = window.scrollY
      shader.style.height = `${document.documentElement.scrollHeight}px`
      shader.style.position = 'fixed'
      shader.style.top = `${-capturedScrollY + offsetAccum}px`
      shaderPinned = true
    }
    const unpinShader = () => {
      if (!shader || !shaderPinned) return
      // On exit, accumulate the scroll distance traversed during this pin.
      // Post-pin, the shader is `position: absolute; top: offsetAccum` so
      // that at the current scroll position, the same slice is visible.
      const releaseScrollY = window.scrollY
      const delta = releaseScrollY - capturedScrollY
      offsetAccum += delta
      shader.style.position = origPosition // absolute
      shader.style.top = `${offsetAccum}px`
      shader.style.height = origHeight
      shaderPinned = false
    }

    let raf = 0
    let snapTimer = null

    const compute = () => {
      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const range = el.offsetHeight - viewportH
      const t = Math.min(1, Math.max(0, scrolled / Math.max(1, range)))
      const b = Math.min(BEATS, Math.floor(t * (BEATS + 1)))
      setBeat(b)

      // Pin the shader while the sticky stage is actually pinned. Use a
      // generous tolerance so sub-pixel jitter during smooth scroll doesn't
      // cause the pin to toggle (which would re-capture a new slice).
      const isStickyPinned = rect.top <= 2 && rect.bottom >= viewportH - 2
      if (isStickyPinned) pinShader()
      else unpinShader()
    }

    // Snap scroll to the nearest beat position after scroll goes idle.
    // The shader stays pinned across snaps (it was captured once on entry
    // and remains at that same scroll offset).
    const scheduleSnap = () => {
      if (snapTimer) clearTimeout(snapTimer)
      snapTimer = setTimeout(() => {
        const rect = el.getBoundingClientRect()
        const viewportH = window.innerHeight
        if (rect.top > 0 || rect.bottom < viewportH) return // not pinned
        const range = el.offsetHeight - viewportH
        const scrolled = -rect.top
        const t = scrolled / Math.max(1, range)
        const currentBeat = t * (BEATS + 1) - 0.5
        const targetBeatIdx = Math.round(currentBeat)
        if (targetBeatIdx < 0 || targetBeatIdx > BEATS) return
        const targetT = (targetBeatIdx + 0.5) / (BEATS + 1)
        const targetScrolled = targetT * range
        const targetScrollY = window.scrollY + rect.top + targetScrolled
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
      }, 140)
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        compute()
        scheduleSnap()
      })
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
      if (snapTimer) clearTimeout(snapTimer)
      unpinShader()
    }
  }, [])

  // Visual state mapping (beat -1 shows same layout as beat 0 so the user
  // never sees an empty stage when they first arrive):
  //   -1 / 0: empty right column
  //    1:     card 0 visible
  //    2:     card 0 stowed, card 1 visible
  //    3:     cards 0+1 stowed, card 2 visible
  //    4:     all 3 stowed, closing punchline visible
  const activeBeat = Math.max(0, beat)
  const activeCardIndex = activeBeat - 1 // -1 (nothing) | 0 | 1 | 2 | 3 (punchline)
  const isClosing = activeCardIndex >= CONSEQUENCE_STAGES.length

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: `${100 + BEAT_SCROLL_VH}vh` }}
    >
      {/* Inner stage is position:sticky so the browser pins it to viewport
          top for the full scroll distance of the outer wrapper. Beat state
          is driven purely by scroll position relative to the outer — no
          wheel interception, no engagement math. */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <div className="relative z-10 mx-auto grid h-full max-w-6xl items-center gap-[6vw] px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* LEFT: headline */}
          <div className="flex flex-col">
            <h2 className="max-w-md" style={HEADLINE_STYLE}>
              {CONSEQUENCES_HEADLINE_PRE}
              {CONSEQUENCES_HEADLINE_HIGHLIGHT}
              {CONSEQUENCES_HEADLINE_POST}
            </h2>
          </div>

          {/* RIGHT: card stage */}
          <div className="relative flex h-[60vh] flex-col">
            {/* Stowed pills at top — one per card that has been stowed */}
            <div className="flex flex-col gap-[1.2vh]">
              {CONSEQUENCE_STAGES.map((stage, i) => {
                // Pill appears once progress advances past this card (i.e.,
                // when a later card becomes active).
                const stowed = activeCardIndex > i || isClosing
                return (
                  <div
                    key={`pill-${stage.id}`}
                    className="flex items-baseline gap-3 transition-all duration-500"
                    style={{
                      opacity: stowed ? 1 : 0,
                      transform: stowed ? 'translateY(0)' : 'translateY(-8px)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.4rem, 3vmin, 2rem)',
                        fontWeight: 300,
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        color: '#000000',
                      }}
                    >
                      {stage.number}
                      <span
                        style={{
                          fontSize: '0.5em',
                          marginLeft: '0.2em',
                          color: '#585858',
                        }}
                      >
                        {stage.numberUnit}
                      </span>
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 'clamp(0.75rem, 1.4vmin, 0.95rem)',
                        fontWeight: 500,
                        color: '#585858',
                      }}
                    >
                      {stage.pillTitle}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Card content area — one big card shown at a time */}
            <div className="relative mt-[4vh] flex-1">
              {CONSEQUENCE_STAGES.map((stage, i) => {
                const active = activeCardIndex === i
                return (
                  <div
                    key={`card-${stage.id}`}
                    className="absolute inset-0 flex flex-col justify-start transition-opacity duration-500"
                    style={{
                      opacity: active ? 1 : 0,
                      pointerEvents: active ? 'auto' : 'none',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(3.5rem, 12vmin, 9rem)',
                        fontWeight: 300,
                        lineHeight: 0.9,
                        letterSpacing: '-0.04em',
                        color: '#000000',
                      }}
                    >
                      {stage.number}
                      <span
                        style={{
                          fontSize: '0.35em',
                          marginLeft: '0.15em',
                          color: '#585858',
                        }}
                      >
                        {stage.numberUnit}
                      </span>
                    </div>
                    <p
                      className="mt-[1.5vh]"
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 'clamp(0.8rem, 1.5vmin, 1rem)',
                        fontWeight: 400,
                        lineHeight: 1.4,
                        color: '#585858',
                      }}
                    >
                      {stage.numberLabel}
                    </p>
                    <h3
                      className="mt-[3vh]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.4rem, 3.6vmin, 2.4rem)',
                        fontWeight: 300,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        color: '#000000',
                      }}
                    >
                      {stage.title}
                    </h3>
                    <p className="mt-[2vh] max-w-md" style={BODY_STYLE}>
                      {stage.body}
                    </p>
                  </div>
                )
              })}

              {/* Closing punchline — shown during beat 4 */}
              <div
                className="absolute inset-0 flex flex-col justify-start transition-opacity duration-500"
                style={{
                  opacity: isClosing ? 1 : 0,
                  pointerEvents: isClosing ? 'auto' : 'none',
                }}
              >
                <p
                  className="max-w-md"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.4rem, 3.8vmin, 2.6rem)',
                    fontWeight: 300,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    color: '#000000',
                  }}
                >
                  {CLOSING_PRE}
                  <span style={HIGHLIGHT_STYLE}>{CLOSING_HIGHLIGHT}</span>
                </p>
                <p className="mt-[3vh] max-w-md" style={BODY_STYLE}>
                  {CLOSING_BODY}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Public ────────────────────────────────────────────────────────────

export const ProblemConsequences = () => (
  <>
    <ProblemBlock />
    <ConsequencesBlock />
  </>
)
