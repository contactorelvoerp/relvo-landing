import { useEffect, useRef } from 'react'
import { Texture } from '../../components/Texture'

// 02 Agentes (prototipo home v2): tareas del día, registro con íconos y un caso de revisión
// (OC contra contrato) sobre la textura Pulso. El registro se va llenando en loop solo mientras
// está en pantalla; sin JS o con movimiento reducido se ve completo.
const ICONS = {
  doc: <><path d="M4 1.5h5l3 3v10H4z" /><path d="M9 1.5v3h3M6 8h4M6 10.5h4" /></>,
  mail: <><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" /><path d="m2 4.5 6 4.5 6-4.5" /></>,
  channel: <path d="M6 2 4.5 14M11.5 2 10 14M2.5 5.5h11M2 10.5h11" />,
  plug: <path d="M5.5 1.5v3M10.5 1.5v3M3.5 4.5h9v3a4.5 4.5 0 0 1-9 0zM8 12v2.5" />,
}

export function Agents({ c, example }) {
  const feed = useRef(null)

  useEffect(() => {
    const items = [...feed.current.querySelectorAll('li')]
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let timer = 0, k = 0
    const step = () => {
      if (k < items.length) { items[k++].classList.add('feed__item--in'); timer = setTimeout(step, 900) }
      else timer = setTimeout(() => { items.forEach((i) => i.classList.remove('feed__item--in')); k = 0; timer = setTimeout(step, 700) }, 5000)
    }
    feed.current.classList.add('feed--animated')
    const io = new IntersectionObserver(([e]) => { clearTimeout(timer); if (e.isIntersecting) step() }, { threshold: 0.3 })
    io.observe(feed.current)
    return () => { clearTimeout(timer); io.disconnect() }
  }, [])

  const { review } = c
  return (
    <>
      <div className="agents">
        <div className="agents__bg"><Texture kind="pulse" /></div>
        <div className="pane">
          <div className="agents__kpis">
            {c.kpis.map(([label, value], i) => (
              <div key={label}><small>{label}</small><b className={i === 1 ? 'num agents__kpi--review' : 'num'}>{value}</b></div>
            ))}
            <span className="example-tag example-tag--on-ink">{example}</span>
          </div>
          <ul ref={feed} className="feed">
            {c.log.map((item) => (
              <li key={item.time} className="feed__item">
                <span className="feed__icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">{ICONS[item.icon]}</svg>
                </span>
                <span>{item.text}</span>
                <time className="num">{item.time}</time>
              </li>
            ))}
          </ul>
        </div>
        <div className="pane review">
          <p className="review__label">{review.label}</p>
          <p className="review__title">{review.title}</p>
          <div className="review__compare">
            {review.compare.map(([label, value]) => <div key={label}><small>{label}</small><span className="num">{value}</span></div>)}
          </div>
          <div className="review__actions">
            {review.actions.map((a, i) => <span key={a + i} className={i === 0 ? 'review__action review__action--primary' : 'review__action'}>{a}</span>)}
          </div>
        </div>
      </div>
      <p className="principle">{c.principle}</p>
    </>
  )
}
