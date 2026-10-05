import { chipClass } from './labels'
import './visuals.css'

// Librería de visuales (content/SCHEMA.md §3): tarjetas de UI de producto con datos de ejemplo.
// Generalizan las pantallas de la home (plan, línea de tiempo, factura dividida, cobro, tokens,
// agentes) y suman las nuevas (correo, medios de pago, revisión, código y resultado del caso).
export const Check = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 7.5 6 10l5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const TASK_ICONS = {
  doc: <><path d="M4 1.5h5l3 3v10H4z" /><path d="M9 1.5v3h3M6 8h4M6 10.5h4" /></>,
  mail: <><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" /><path d="m2 4.5 6 4.5 6-4.5" /></>,
  hash: <path d="M6 2 4.5 14M11.5 2 10 14M2.5 5.5h11M2 10.5h11" />,
  plug: <path d="M5.5 1.5v3M10.5 1.5v3M3.5 4.5h9v3a4.5 4.5 0 0 1-9 0zM8 12v2.5" />,
}
export const TaskIcon = ({ icon }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">{TASK_ICONS[icon]}</svg>
)
// 0,65 → '65%'; un número de 0 a 100 se usa tal cual
const pct = (v) => `${v <= 1 ? Math.round(v * 100) : v}%`
// '1.200 M' / '48.300' → número (formato es-CL), para la barra de lo usado sobre lo incluido
const toNumber = (s) => Number(String(s).replace(/[^\d,]/g, '').replace(',', '.'))

function Head({ title, children }) {
  return <div className="ui__head"><b>{title}</b>{children}</div>
}

function Timeline({ steps, compact }) {
  return (
    <ol className={`tline${compact ? ' tline--compact' : ''}`}>
      {steps.map((s) => (
        <li key={s.label} className={s.done ? undefined : 'tline__now'}>
          <span className="tline__icon">{s.done && <Check />}</span>
          <div><b>{s.label}</b><small>{s.sub}</small></div>
        </li>
      ))}
    </ol>
  )
}

export function PlanCard({ d }) {
  const mark = (d.client ?? d.plan).trim().charAt(0)
  // La barra de tramos va bajo la línea de tokens (o al final, si no hay)
  const tiersAt = d.tiers ? Math.max(0, d.lines.findIndex(([label]) => /token/i.test(label))) : -1
  return (
    <>
      <div className="plan">
        <span className="plan__mark" aria-hidden="true">{mark}</span>
        <div><b>{d.plan}</b>{d.client && <small>{d.client}</small>}</div>
        <span className="plan__price num">{d.price}{d.per && <small>{d.per}</small>}</span>
      </div>
      {d.lines.map(([label, value], i) => (
        <div key={label} className="plan__line">
          <div className="plan__row"><span>{label}</span><span className="num">{value}</span></div>
          {i === tiersAt && (
            <>
              <div className="tiers" aria-hidden="true"><i className="tiers__t1" style={{ width: pct(d.tiers.t1) }} /><i className="tiers__t2" style={{ width: pct(d.tiers.t2) }} /></div>
              <div className="tiers__labels"><span>{d.tiers.labels[0]}</span><span>{d.tiers.labels[1]}</span></div>
            </>
          )}
        </div>
      ))}
      <div className="plan__sum"><span>{d.total[0]}</span><span className="num">{d.total[1]}</span></div>
    </>
  )
}

export function TimelineCard({ d }) {
  return (
    <>
      <Head title={d.title}>{d.meta && <span>{d.meta}</span>}</Head>
      <Timeline steps={d.steps} />
    </>
  )
}

export function SplitInvoice({ d, l }) {
  return (
    <>
      <Head title={`${l.invoice} ${d.invoice}`}><span className="num">{d.total}</span></Head>
      <div className="splitbar" aria-hidden="true">{d.parts.map((p) => <i key={p.entity} style={{ width: pct(p.pct) }} />)}</div>
      <div className="splitbar__legend" style={{ gridTemplateColumns: d.parts.map((p) => `${p.pct}fr`).join(' ') }}>
        {d.parts.map((p) => <div key={p.entity}><small>{p.entity}</small><b className="num">{p.amount}</b><span>{pct(p.pct)}</span></div>)}
      </div>
      <div className="ui__glosa"><small>{l.glosa}</small>{d.glosa}</div>
    </>
  )
}

export function Payment({ d, l }) {
  return (
    <>
      <Head title={`${l.collection} ${d.invoice}`}>{d.badge && <span className="chip chip--run">{d.badge}</span>}</Head>
      <div className="paid"><span className="num">{d.paid}</span><small>{l.of} {d.total}</small></div>
      <div className="meter meter--lg" aria-hidden="true"><i style={{ width: pct(d.progress) }} /></div>
      <Timeline steps={d.events} compact />
    </>
  )
}

export function EmailPreview({ d, l }) {
  return (
    <>
      <div className="mail">
        <div className="mail__head">{l.to} <b>{d.to}</b>, {l.subject} <b>{d.subject}</b></div>
        <div className="mail__body">{d.body}{d.cta && <><br /><span className="mail__pay">{d.cta}</span></>}</div>
      </div>
      <div className="mail__schedule">{d.schedule.map((s) => <span key={s.label} className={chipClass(s.tone)}>{s.label}</span>)}</div>
    </>
  )
}

export function Methods({ d }) {
  return (
    <>
      <Head title={d.title}>{d.client && <span>{d.client}</span>}</Head>
      <div className="methods">
        {d.methods.map((m) => (
          <div key={m.label} className={`methods__item${m.selected ? ' methods__item--on' : ''}`}>
            <span className="methods__radio" aria-hidden="true" />{m.label}{m.provider && <span className="methods__provider">{m.provider}</span>}
          </div>
        ))}
      </div>
      <div className="plan__sum"><span>{d.total[0]}</span><span className="num">{d.total[1]}</span></div>
    </>
  )
}

export function Usage({ d, l }) {
  const share = Math.min(1, toNumber(d.used) / toNumber(d.included))
  return (
    <>
      <div className="usage__plan">
        <span className="usage__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2 1.5" /></svg>
        </span>
        <div><b>{d.unit}</b><small>{d.price}</small></div>
      </div>
      <div className="usage__big"><b className="num">{d.used}</b><small>{l.of} {d.included}</small></div>
      <div className="meter meter--uso" aria-hidden="true"><i style={{ width: pct(share) }} /></div>
      <div className="usage__hist" aria-hidden="true">{d.series.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
      <p className="usage__period">{l.last30}</p>
    </>
  )
}

// Agentes y revisión: claros; en la banda oscura de la home van en tinta (.agents--ink).
export function AgentFeed({ d, feedRef }) {
  return (
    <>
      {d.kpis && (
        <div className="agents__kpis">
          {d.kpis.map(([label, value], i) => (
            <div key={label}><small>{label}</small><b className={i === 1 ? 'num agents__kpi--review' : 'num'}>{value}</b></div>
          ))}
        </div>
      )}
      <ul ref={feedRef} className="feed">
        {d.items.map(([icon, text, time]) => (
          <li key={time + text} className="feed__item">
            <span className="feed__icon" aria-hidden="true"><TaskIcon icon={icon} /></span>
            <span>{text}</span>
            <time className="num">{time}</time>
          </li>
        ))}
      </ul>
    </>
  )
}

export function Review({ d, l }) {
  return (
    <div className="review">
      <p className="review__label">{l.review}</p>
      <p className="review__title">{d.title}</p>
      <div className="review__compare">
        {[d.left, d.right].map(([label, value]) => <div key={label}><small>{label}</small><span className="num">{value}</span></div>)}
      </div>
      <div className="review__actions">
        {d.actions.map((a, i) => <span key={a + i} className={i === 0 ? 'review__action review__action--primary' : 'review__action'}>{a}</span>)}
      </div>
    </div>
  )
}

// El endpoint de los ejemplos de código es ilustrativo: la nota del contenido lo dice en pantalla.
export function CodeBlock({ d }) {
  return (
    <div className="code">
      <div className="code__bar"><span>{d.lang.toUpperCase()}</span></div>
      <pre className="code__body"><code>{d.code}</code></pre>
      <p className="code__note">{d.note}</p>
    </div>
  )
}

export function CaseHeadline({ c }) {
  return (
    <div className="case-headline">
      <img src="/logos/clients/tgp.webp" alt={c.company} width="88" height="24" />
      <p className="case-headline__descriptor">{c.descriptor}</p>
      <p className="case-headline__value num">{c.headline.value}</p>
      <p className="case-headline__label">{c.headline.label}</p>
      <p className="case-headline__sub">{c.headline.sub}</p>
    </div>
  )
}
