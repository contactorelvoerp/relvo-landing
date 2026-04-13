import { useEffect, useRef, useState } from 'react'

// ── Copy ───────────────────────────────────────────────────────────────
// All copy hardcoded for now. Moves to i18n once final.

const PROBLEM_HEADLINE_PRE = 'Las empresas que cobran por '
const PROBLEM_HEADLINE_HIGHLIGHT = 'suscripciones, uso, hitos o métricas'
const PROBLEM_HEADLINE_POST = ' terminan operando en planillas de Excel y apps desconectadas.'

const PROBLEM_BODY_1 =
  'Al principio funciona — un par de hojas, una rutina clara, alguien de finanzas que la mantiene viva. Hasta que deja de funcionar.'
const PROBLEM_BODY_2 =
  'Los parches internos no escalan: requieren mantenimiento constante, se rompen con cada cambio de modelo y dependen de que la persona que los construyó siga en el equipo.'

const CONSEQUENCES_EYEBROW = 'Consecuencias'
const CONSEQUENCES_HEADLINE_PRE = '¿Cuánto te cuesta '
const CONSEQUENCES_HEADLINE_HIGHLIGHT = 'este problema'
const CONSEQUENCES_HEADLINE_POST = ' cada año?'

const CONSEQUENCE_STAGES = [
  {
    id: 'cobras-tarde',
    title: 'Cobras tarde.',
    body: 'Ciclos de cobro hasta 2× más largos que el plazo acordado. El capital de trabajo se queda atrapado en cuentas por cobrar, no en tu operación.',
    number: '+22',
    numberUnit: 'días',
    numberLabel: 'sobre el plazo acordado',
  },
  {
    id: 'facturas-menos',
    title: 'Facturas menos.',
    body: 'Hasta 5% del ARR se escapa en servicios no facturados o mal calculados. Lo que ya ganaste no llega a tu balance.',
    number: '5%',
    numberUnit: 'del ARR',
    numberLabel: 'facturado de menos',
  },
  {
    id: 'quemas-horas',
    title: 'Quemas horas-hombre.',
    body: 'Dos o más personas en tiempo completo absorbidas por trabajo que debería estar automatizado — tiempo que no se dedica a cerrar, cobrar o crecer.',
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

const ConsequencesBlock = () => {
  const [activeCard, setActiveCard] = useState(0)
  const cardRefs = useRef([])

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveCard(i)
        },
        { threshold: 0, rootMargin: '-45% 0px -45% 0px' },
      )
      io.observe(el)
      return io
    })
    return () => observers.forEach((io) => io && io.disconnect())
  }, [])

  return (
    <section className="relative w-full px-4 py-[12vh] sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-[6vw] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* LEFT: pinned section header */}
        <div className="md:sticky md:top-[18vh] md:self-start">
          <h2 className="max-w-md" style={HEADLINE_STYLE}>
            {CONSEQUENCES_HEADLINE_PRE}
            {CONSEQUENCES_HEADLINE_HIGHLIGHT}
            {CONSEQUENCES_HEADLINE_POST}
          </h2>

          {/* Progress indicator — which card is currently centered */}
          <div className="mt-[5vh] flex items-center gap-3">
            {CONSEQUENCE_STAGES.map((_, i) => (
              <span
                key={i}
                className="block h-px transition-all duration-500"
                style={{
                  width: activeCard === i ? '2.5rem' : '1rem',
                  backgroundColor: activeCard === i ? '#000000' : 'rgba(0,0,0,0.2)',
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: scrolling cards */}
        <div className="flex flex-col gap-[14vh] md:gap-[18vh]">
          {CONSEQUENCE_STAGES.map((stage, i) => (
            <article
              key={stage.id}
              ref={(el) => (cardRefs.current[i] = el)}
              className="flex flex-col items-start"
            >
              {/* Big number */}
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

              {/* Title + body */}
              <h3
                className="mt-[4vh]"
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
            </article>
          ))}
        </div>
      </div>

      {/* Closing meta-beat — spans full width below the two-column grid */}
      <div className="mx-auto mt-[18vh] max-w-6xl">
        <p
          className="max-w-3xl"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 4vmin, 2.6rem)',
            fontWeight: 300,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            color: '#000000',
          }}
        >
          {CLOSING_PRE}
          <span style={HIGHLIGHT_STYLE}>{CLOSING_HIGHLIGHT}</span>
        </p>
        <p className="mt-[4vh] max-w-2xl" style={BODY_STYLE}>
          {CLOSING_BODY}
        </p>
      </div>
    </section>
  )
}

// ── Public ────────────────────────────────────────────────────────────

export const ProblemConsequences = () => (
  <>
    <ProblemBlock />
    <ConsequencesBlock />
  </>
)
