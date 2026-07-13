import { useEffect, useRef, useState } from 'react'
import { ACCENTS } from '../primitives'
import { hatch, Grain } from '../Texture'

/* Activates once when scrolled into view; instantly active under reduced motion. */
export const useActivate = (threshold = 0.3) => {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      setActive(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, active]
}

/* Staggered enter transition for sequence steps */
export const stepStyle = (active, i, baseMs = 320, offset = 200) => ({
  opacity: active ? 1 : 0,
  transform: active ? 'none' : 'translateY(6px)',
  transition: `opacity 0.5s ease ${offset + i * baseMs}ms, transform 0.5s ease ${offset + i * baseMs}ms`,
})

/* Stripe-style scene: the interface sits on a soft accent texture inside a framed box */
export const Scene = ({ accent = 'lime', className = '', children }) => {
  const a = ACCENTS[accent]
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] p-5 sm:p-8 ${className}`.trim()}
      style={{
        background: `linear-gradient(135deg, ${a.tint}99 0%, #FFFFFF 42%, ${a.tint}55 100%)`,
      }}
    >
      {/* Hatched corner patches */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-44 w-56"
        style={{
          background: hatch(a.solid, '30'),
          WebkitMaskImage: 'radial-gradient(ellipse at top right, black 30%, transparent 72%)',
          maskImage: 'radial-gradient(ellipse at top right, black 30%, transparent 72%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-52"
        style={{
          background: hatch(a.solid, '24'),
          WebkitMaskImage: 'radial-gradient(ellipse at bottom left, black 25%, transparent 70%)',
          maskImage: 'radial-gradient(ellipse at bottom left, black 25%, transparent 70%)',
        }}
      />
      <Grain opacity={0.03} />
      <div className="relative">{children}</div>
    </div>
  )
}

/* Shared card treatment for all five visuals */
const VisualFrame = ({ label, accent = 'lime', children, frameRef }) => (
  <div
    ref={frameRef}
    className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-white shadow-[0_1px_2px_rgba(19,19,30,0.04),0_24px_60px_rgba(19,19,30,0.08)]"
  >
    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3">
      <span className="v2-eyebrow text-muted-aa">{label}</span>
      <span
        className="h-2 w-2 rounded-full animate-pulse-soft"
        style={{ background: ACCENTS[accent].solid }}
        aria-hidden="true"
      />
    </div>
    <div className="bg-[#FBFBFA] p-5 sm:p-6">{children}</div>
  </div>
)

const mono = 'font-mono text-[0.6875rem] uppercase tracking-[0.1em]'
const monoData = 'font-mono text-[0.75rem]'

const CheckIcon = ({ color = '#1B7A50', size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 6.5 5 9l4.5-6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── 1 · Contracts & usage — document parses into pricing rules, usage flows in. Lime. ── */
export const ContractsVisual = ({ lang }) => {
  const [ref, active] = useActivate()
  const L =
    lang === 'es'
      ? { doc: 'CONTRATO.PDF', rules: 'REGLAS DE FACTURACIÓN', usage: 'USO ESTE CICLO', reading: 'LEYENDO TÉRMINOS…', live: 'API · EN VIVO' }
      : { doc: 'CONTRACT.PDF', rules: 'BILLING RULES', usage: 'USAGE THIS CYCLE', reading: 'READING TERMS…', live: 'API · LIVE' }

  const rules = [
    ['BASE', '$2,500 /mo'],
    ['API CALLS', '$0.04 /unit'],
    ['TIER > 50K', '$0.03 /unit'],
  ]

  return (
    <VisualFrame frameRef={ref} label={L.reading} accent="lime">
      <div className="grid grid-cols-[1fr_auto_1.15fr] items-center gap-3 sm:gap-4">
        {/* Messy document being scanned */}
        <div className="relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white p-4">
          <p className={`${mono} mb-3 text-muted-aa`}>{L.doc}</p>
          <div className="space-y-2" aria-hidden="true">
            {[92, 78, 96, 60, 88, 42, 84, 70].map((w, i) => (
              <div key={i} className="h-1.5 rounded-sm bg-gray-brand" style={{ width: `${w}%` }} />
            ))}
          </div>
          {/* parsing sweep */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-16"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(208,255,11,0.35), transparent)',
              animation: active ? 'v2-scan 2.8s ease-in-out infinite' : 'none',
            }}
            aria-hidden="true"
          />
        </div>

        <span className="text-muted-deco" aria-hidden="true">→</span>

        {/* Extracted rules + live usage */}
        <div className="space-y-2">
          <p className={`${mono} text-muted-aa`} style={stepStyle(active, 0)}>{L.rules}</p>
          {rules.map(([k, v], i) => (
            <div
              key={k}
              className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-white px-3 py-2"
              style={stepStyle(active, i + 1)}
            >
              <span className={`${mono} text-ink-soft`}>{k}</span>
              <span className={`${monoData} font-medium text-ink`}>{v}</span>
            </div>
          ))}
          <div
            className="flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2"
            style={{ background: 'rgba(208,255,11,0.16)', ...stepStyle(active, 4) }}
          >
            <span className={`${mono} text-ink-soft`}>
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-ink align-middle animate-pulse-soft" aria-hidden="true" />
              {L.usage}
            </span>
            <span className={`${monoData} font-medium text-ink`}>42,318</span>
          </div>
          <p className={`${mono} text-right text-muted-deco`} style={stepStyle(active, 5)}>{L.live}</p>
        </div>
      </div>
    </VisualFrame>
  )
}

/* ── 2 · Approvals — the chain completes step by step. Mint. ── */
export const ApprovalsVisual = ({ lang }) => {
  const [ref, active] = useActivate()
  const L =
    lang === 'es'
      ? {
          label: 'FACTURA #0492 · ACME SPA',
          steps: [
            ['Pre-factura enviada', '09:14'],
            ['Vista por el cliente', '09:31'],
            ['Esperando OC', '11:02'],
            ['OC recibida y conciliada', '14:47'],
            ['Aprobada', '14:48'],
          ],
          done: 'LISTA PARA FACTURAR',
        }
      : {
          label: 'INVOICE #0492 · ACME INC',
          steps: [
            ['Pre-invoice sent', '09:14'],
            ['Viewed by client', '09:31'],
            ['Awaiting PO', '11:02'],
            ['PO received & matched', '14:47'],
            ['Approved', '14:48'],
          ],
          done: 'READY TO INVOICE',
        }

  return (
    <VisualFrame frameRef={ref} label={L.label} accent="mint">
      <ol className="relative space-y-0">
        {L.steps.map(([label, time], i) => {
          const last = i === L.steps.length - 1
          return (
            <li key={label} className="relative flex items-start gap-3.5 pb-4 last:pb-0" style={stepStyle(active, i, 420)}>
              {!last && (
                <span
                  className="absolute left-[9px] top-6 h-[calc(100%-14px)] w-px"
                  style={{
                    background: '#72DDAA',
                    opacity: active ? 1 : 0,
                    transition: `opacity 0.4s ease ${420 + i * 420}ms`,
                  }}
                  aria-hidden="true"
                />
              )}
              <span
                className="mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full"
                style={{ background: last ? '#72DDAA' : '#DFF4EB', border: '1px solid #72DDAA' }}
                aria-hidden="true"
              >
                <CheckIcon color={last ? '#13131E' : '#1B7A50'} size={10} />
              </span>
              <span className="flex flex-1 items-baseline justify-between gap-3">
                <span className={`font-sans text-[0.875rem] ${last ? 'font-semibold text-ink' : 'text-ink-soft'}`}>
                  {label}
                </span>
                <span className={`${monoData} text-muted-deco`}>{time}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <div
        className="mt-4 rounded-[var(--radius-sm)] px-3 py-2 text-center"
        style={{ background: '#DFF4EB', ...stepStyle(active, L.steps.length, 420) }}
      >
        <span className={`${mono} font-medium`} style={{ color: '#186666' }}>
          {L.done} <CheckIcon color="#186666" size={11} />
        </span>
      </div>
    </VisualFrame>
  )
}

/* ── 3 · Complex invoicing — one charge splits into entities. Salmon. ── */
export const InvoicingVisual = ({ lang }) => {
  const [ref, active] = useActivate()
  const L =
    lang === 'es'
      ? { label: 'UN COBRO · TRES SOCIEDADES', charge: 'COBRO MENSUAL', client: 'Cliente Acme', entities: [
          ['Sociedad Chile SpA', 'CLP 6.480.000', '4 glosas'],
          ['Entity US Inc.', 'USD 3,900', '2 line items'],
          ['Sociedad Perú SAC', 'PEN 9,120', '3 glosas'],
        ] }
      : { label: 'ONE CHARGE · THREE ENTITIES', charge: 'MONTHLY CHARGE', client: 'Acme Corp', entities: [
          ['Entity Chile SpA', 'CLP 6,480,000', '4 line items'],
          ['Entity US Inc.', 'USD 3,900', '2 line items'],
          ['Entity Peru SAC', 'PEN 9,120', '3 line items'],
        ] }

  return (
    <VisualFrame frameRef={ref} label={L.label} accent="salmon">
      {/* Single charge */}
      <div
        className="mx-auto w-fit rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white px-5 py-3 text-center"
        style={stepStyle(active, 0)}
      >
        <p className={`${mono} text-muted-aa`}>{L.charge}</p>
        <p className="mt-1 font-mono text-[1.05rem] font-medium text-ink">$12,400</p>
        <p className="font-sans text-[0.75rem] text-muted-aa">{L.client}</p>
      </div>

      {/* Branch */}
      <svg viewBox="0 0 300 44" className="mx-auto my-1 block w-full max-w-[300px]" aria-hidden="true">
        {[
          'M150 2 C 150 24, 50 20, 50 42',
          'M150 2 L 150 42',
          'M150 2 C 150 24, 250 20, 250 42',
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#FF9566"
            strokeWidth="1.3"
            strokeDasharray="120"
            strokeDashoffset={active ? 0 : 120}
            style={{ transition: `stroke-dashoffset 0.9s ease ${500 + i * 150}ms` }}
          />
        ))}
      </svg>

      {/* Entities */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {L.entities.map(([name, amount, items], i) => (
          <div
            key={name}
            className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-white px-2.5 py-3 text-center"
            style={stepStyle(active, i + 3, 200, 900)}
          >
            <p className="truncate font-sans text-[0.72rem] font-medium text-ink">{name}</p>
            <p className={`${monoData} mt-1 font-medium text-ink`}>{amount}</p>
            <p className={`${mono} mt-1`} style={{ color: '#C4501B' }}>{items}</p>
          </div>
        ))}
      </div>
    </VisualFrame>
  )
}

/* ── 4 · Collection router — charge travels to the right rail. Purple. ── */
export const CollectionVisual = ({ lang }) => {
  const [ref, active] = useActivate()
  const L =
    lang === 'es'
      ? { label: 'ROUTER DE COBRANZA', charge: 'COBRO', card: 'TARJETA', cardState: 'Pagado', transfer: 'TRANSFERENCIA', transferState: 'Recordatorio enviado', auto: 'AUTOMÁTICO' }
      : { label: 'COLLECTION ROUTER', charge: 'CHARGE', card: 'CARD', cardState: 'Paid', transfer: 'BANK TRANSFER', transferState: 'Reminder sent', auto: 'AUTOMATED' }

  const rail = (title, state, done, delayIdx) => (
    <div
      className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-white px-3.5 py-3"
      style={stepStyle(active, delayIdx, 350, 600)}
    >
      <div>
        <p className={`${mono} text-muted-aa`}>{title}</p>
        <p className="mt-0.5 font-sans text-[0.8125rem] font-medium text-ink">{state}</p>
      </div>
      {done ? (
        <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: '#DFF4EB' }} aria-hidden="true">
          <CheckIcon />
        </span>
      ) : (
        <span className="h-2 w-2 rounded-full animate-pulse-soft" style={{ background: '#633BF2' }} aria-hidden="true" />
      )}
    </div>
  )

  return (
    <VisualFrame frameRef={ref} label={L.label} accent="purple">
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-0">
        {/* Incoming charge */}
        <div
          className="rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-white px-3 py-2.5 text-center"
          style={stepStyle(active, 0)}
        >
          <p className={`${mono} text-muted-aa`}>{L.charge}</p>
          <p className={`${monoData} mt-0.5 font-medium text-ink`}>$4,200</p>
        </div>

        {/* flow line in */}
        <svg viewBox="0 0 60 8" className="w-full" aria-hidden="true" preserveAspectRatio="none">
          <path d="M0 4 H60" stroke="#633BF2" strokeWidth="1.4" strokeDasharray="5 6" className={active ? 'animate-flow' : ''} />
        </svg>

        {/* Relvo = the router */}
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-[var(--radius-md)] bg-ink shadow-[0_10px_28px_rgba(63,40,178,0.35)]"
          style={stepStyle(active, 1)}
        >
          <img src="/logo-mark-light.svg" alt="Relvo" className="h-6 w-auto" />
          <span
            className="absolute -inset-1.5 rounded-[calc(var(--radius-md)+6px)] border animate-pulse-soft"
            style={{ borderColor: 'rgba(99,59,242,0.5)' }}
            aria-hidden="true"
          />
        </div>

        {/* flow lines out */}
        <svg viewBox="0 0 60 72" className="h-[72px] w-full" aria-hidden="true" preserveAspectRatio="none">
          <path d="M0 36 C 30 36, 30 12, 60 12" fill="none" stroke="#633BF2" strokeWidth="1.4" strokeDasharray="5 6" className={active ? 'animate-flow' : ''} />
          <path d="M0 36 C 30 36, 30 60, 60 60" fill="none" stroke="#633BF2" strokeWidth="1.4" strokeDasharray="5 6" className={active ? 'animate-flow' : ''} />
        </svg>

        {/* Rails */}
        <div className="space-y-3">
          {rail(L.card, L.cardState, true, 2)}
          {rail(L.transfer, L.transferState, false, 3)}
        </div>
      </div>
      <p className={`${mono} mt-4 text-center text-muted-deco`} style={stepStyle(active, 4, 350, 600)}>
        {L.auto} · RELVO
      </p>
    </VisualFrame>
  )
}

/* ── 5 · Accounts receivable — bank movements auto-match open invoices. Lime. ── */
export const ARVisual = ({ lang }) => {
  const [ref, active] = useActivate()
  const L =
    lang === 'es'
      ? { label: 'CUENTAS POR COBRAR · EN VIVO', bank: 'MOVIMIENTO BANCARIO', matched: 'Conciliada', open: 'Pendiente', total: 'POR COBRAR' }
      : { label: 'ACCOUNTS RECEIVABLE · LIVE', bank: 'BANK MOVEMENT', matched: 'Matched', open: 'Open', total: 'OUTSTANDING' }

  const rows = [
    { client: 'Acme', amount: '$4,200', matches: true },
    { client: 'Borealis', amount: '$1,850', matches: true },
    { client: 'Cobalt', amount: '$7,600', matches: false },
    { client: 'Dune Labs', amount: '$3,140', matches: false },
  ]

  return (
    <VisualFrame frameRef={ref} label={L.label} accent="lime">
      {/* Incoming bank movement */}
      <div
        className="mb-4 flex items-center justify-between rounded-[var(--radius-sm)] px-3.5 py-2.5"
        style={{ background: 'rgba(208,255,11,0.16)', ...stepStyle(active, 0) }}
      >
        <span className={`${mono} text-ink-soft`}>
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-ink align-middle animate-pulse-soft" aria-hidden="true" />
          {L.bank}
        </span>
        <span className={`${monoData} font-medium text-ink`}>+ $6,050</span>
      </div>

      {/* Invoice rows */}
      <div className="divide-y divide-[var(--border-subtle)] rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white">
        {rows.map((row, i) => (
          <div key={row.client} className="flex items-center justify-between px-3.5 py-2.5" style={stepStyle(active, i + 1, 260)}>
            <span className="font-sans text-[0.8125rem] font-medium text-ink">{row.client}</span>
            <span className="flex items-center gap-3">
              <span className={`${monoData} text-ink-soft`}>{row.amount}</span>
              {row.matches ? (
                <span
                  className={`${mono} inline-flex items-center gap-1 rounded-[0.25rem] px-2 py-0.5`}
                  style={{
                    background: '#DFF4EB',
                    color: '#186666',
                    opacity: active ? 1 : 0,
                    transition: `opacity 0.5s ease ${1200 + i * 260}ms`,
                  }}
                >
                  <CheckIcon color="#186666" size={9} /> {L.matched}
                </span>
              ) : (
                <span className={`${mono} rounded-[0.25rem] px-2 py-0.5 text-muted-aa`} style={{ background: '#F1F1EF' }}>
                  {L.open}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Live total */}
      <div className="mt-4 flex items-baseline justify-between px-1" style={stepStyle(active, 6, 260)}>
        <span className={`${mono} text-muted-aa`}>{L.total}</span>
        <span className="font-mono text-[1.15rem] font-medium text-ink">$10,740</span>
      </div>
    </VisualFrame>
  )
}
