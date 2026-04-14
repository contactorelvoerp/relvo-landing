import { useEffect, useRef, useState } from 'react'

// ── Copy ───────────────────────────────────────────────────────────────
// All copy hardcoded for now. Moves to i18n once final.

const PROBLEM_HEADLINE_PRE = 'Operar los modelos de cobro no es fácil:'
const PROBLEM_HEADLINE_HIGHLIGHT = 'lógicas de negocio, cálculos y detalles'
const PROBLEM_HEADLINE_POST = 'se gestionan en planillas y herramientas desconectadas.'

const PROBLEM_BODY_1 =
  'Los problemas empiezan cuando tu negocio comienza a escalar…'
const PROBLEM_BODY_2 =' más clientes, países y modelos de cobro personalizados.'

const CONSEQUENCES_EYEBROW = 'Consecuencias'
const CONSEQUENCES_HEADLINE_PRE = '¿Cuánto cuesta '
const CONSEQUENCES_HEADLINE_HIGHLIGHT = 'este problema'
const CONSEQUENCES_HEADLINE_POST = ' cada año?'

const CONSEQUENCE_STAGES = [
  {
    id: 'cobras-tarde',
    title: 'Días calle',
    body: 'Ciclo de cobro dos veces más largo que el benchmark global .',
    number: '2x',
    numberUnit: ' D S O',
    numberLabel: '',
  },
  {
    id: 'facturas-menos',
    title: 'Menos Revenue',
    body: ' Hasta 3% del revenue se pierde en servicios no facturados o mal calculados.',
    number: '-3% ',
    numberUnit: ' A R R',
    numberLabel: '',
  },
  {
    id: 'quemas-horas',
    title: 'En tareas repetitivas',
    body: ' Dos o más personas en tiempo completo absorbidas por trabajo manual.',
    number: '2+',
    numberUnit: 'FTE',
    numberLabel: '',
  },
]

const CLOSING_PRE = 'Y con cada cliente nuevo.. '
const CLOSING_HIGHLIGHT = 'el problema aumenta.'
const CLOSING_BODY =
  'La ejecución de ingresos no escala con la operación'

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
  fontSize: 'clamp(1.45rem, 4.85vmin, 3.75rem)',
  fontWeight: 300,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  color: '#000000',
}

const BODY_STYLE = {
  fontFamily: 'var(--font-ui)',
  fontSize: 'clamp(1.15rem, 1.85vmin, 1.55rem)',
  fontWeight: 400,
  lineHeight: 1,
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

      <div className="mt-[3vh] flex max-w-3xl flex-col gap-[2vh]" style={BODY_STYLE}>
        <p>{PROBLEM_BODY_1}</p>
        <p>{PROBLEM_BODY_2}</p>
      </div>
    </div>
  </section>
)

// ── Consequences scrollytelling ───────────────────────────────────────

// Beats: intro (empty) → card 0 → card 1 → card 2 → closing.
const BEATS = 5

const ConsequencesBlock = () => {
  const wrapperRef = useRef(null)
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return

    const shader = document.getElementById('shader-background-root')
    const ORIG_POSITION = 'absolute'
    const ORIG_HEIGHT = '100%'

    // Reset shader to clean state on mount in case a prior session (HMR,
    // refresh mid-scroll) left inline styles behind.
    if (shader) {
      shader.style.position = ORIG_POSITION
      shader.style.top = '0px'
      shader.style.height = ORIG_HEIGHT
    }

    // Three states for the shader, derived purely from scroll position
    // relative to the consequences section. No accumulators, no per-exit
    // deltas — each state has a single canonical shader position.
    //
    //   'above'  → user is above the pin. Shader at top:0 (natural).
    //   'pinned' → pin is engaged. Shader fixed at the slice that was
    //              visible when the pin engaged (captured on transition).
    //   'below'  → user is past the pin. Shader at top:PIN_RANGE where
    //              PIN_RANGE is the fixed scroll distance of the pin.
    //              Sections after the pin see a seamless continuation of
    //              the frozen slice because the shader has been shifted
    //              down by exactly the distance that was "skipped" during
    //              the pin.
    //
    // PIN_RANGE is deterministic and fixed per mount/resize. Scrolling in
    // and out of the section always produces the same shader positions.
    let shaderState = 'above'
    const getPinRange = () =>
      Math.max(0, el.offsetHeight - window.innerHeight)

    const setShaderAbove = () => {
      if (!shader || shaderState === 'above') return
      shader.style.position = ORIG_POSITION
      shader.style.top = '0px'
      shader.style.height = ORIG_HEIGHT
      shaderState = 'above'
    }
    const setShaderBelow = () => {
      if (!shader || shaderState === 'below') return
      shader.style.position = ORIG_POSITION
      shader.style.top = `${Math.round(getPinRange())}px`
      shader.style.height = ORIG_HEIGHT
      shaderState = 'below'
    }
    const setShaderPinned = () => {
      if (!shader || shaderState === 'pinned') return
      // Read current absolute top (0 from 'above', PIN_RANGE from 'below')
      // and convert to the equivalent fixed position showing the same slice.
      const currentTop = parseFloat(shader.style.top || '0') || 0
      const scrollY = window.scrollY
      shader.style.height = `${document.documentElement.scrollHeight}px`
      shader.style.position = 'fixed'
      shader.style.top = `${-scrollY + currentTop}px`
      shaderState = 'pinned'
    }

    // Initialize shader state from current scroll position on mount.
    {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom <= vh) setShaderBelow()
      else if (r.top <= 0 && r.bottom >= vh) setShaderPinned()
      // default stays 'above'
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

      // Derive the correct shader state from current scroll position. This
      // is a pure function of scroll, not an incremental transition, so
      // even a scrollbar-drag that skips hundreds of pixels lands in the
      // correct state in a single frame.
      //   - If section is entirely above the viewport → 'below' (user has
      //     passed it)
      //   - If section is entirely below the viewport → 'above' (user
      //     hasn't reached it)
      //   - Otherwise → 'pinned' (section overlaps viewport)
      let target
      if (rect.bottom <= viewportH) target = 'below'
      else if (rect.top > 0) target = 'above'
      else target = 'pinned'

      if (target === 'above') setShaderAbove()
      else if (target === 'below') setShaderBelow()
      else setShaderPinned()
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
      setShaderAbove()
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
      className="relative h-[280vh] w-full md:h-[200vh]"
    >
      {/* Inner stage is position:sticky so the browser pins it to viewport
          top for the full scroll distance of the outer wrapper. Beat state
          is driven purely by scroll position relative to the outer — no
          wheel interception, no engagement math. */}
      <div
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden py-[8vh]"
      >
        <div
          className="relative z-10 mx-4 grid h-full w-full max-w-7xl items-center gap-[4vw] rounded-2xl px-[3vw] py-[5vh] backdrop-blur-sm sm:mx-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
          style={{
            backgroundColor: 'rgba(230, 240, 234, 0.15)',
            border: '1px solid rgba(19,19,30,0.06)',
            boxShadow: '0 2px 12px -4px rgba(19,19,30,0.08)',
          }}
        >
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
                    className="inline-flex items-baseline gap-3 self-start rounded-full bg-[var(--text-main)] px-4 py-2 transition-all duration-500"
                    style={{
                      opacity: stowed ? 1 : 0,
                      transform: stowed ? 'translateY(0)' : 'translateY(-8px)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.2rem, 2.6vmin, 1.7rem)',
                        fontWeight: 300,
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        color: '#ffffff',
                      }}
                    >
                      {stage.number}
                      <span
                        style={{
                          fontSize: '0.5em',
                          marginLeft: '0.2em',
                          color: 'rgba(255,255,255,0.7)',
                        }}
                      >
                        {stage.numberUnit}
                      </span>
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(0.7rem, 1.2vmin, 0.85rem)',
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.85)',
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
