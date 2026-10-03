import { useEffect, useRef } from 'react'
import { Texture } from '../../components/Texture'

// 02 Agentes (prototipo home v1): feed de actividad + bandeja de revisión sobre la textura Pulso.
// El feed se va llenando en loop solo mientras está en pantalla; sin JS o con movimiento
// reducido se ve completo.
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

  return (
    <>
      <div className="agents">
        <div className="agents__bg"><Texture kind="pulse" /></div>
        <div className="pane">
          <p className="pane__title"><span>{c.feedTitle}</span><span className="example-tag example-tag--on-ink">{example}</span></p>
          <ul ref={feed} className="feed">
            {c.feed.map((item) => (
              <li key={item.time} className="feed__item">
                <time className="num">{item.time}</time>
                <span>{item.text}</span>
                <span className={`chip${item.status === 'running' ? ' chip--run' : ''}`}>{item.status === 'running' ? c.running : c.done}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="pane">
          <p className="pane__title"><span>{c.inboxTitle}</span><span className="num">{c.inbox.length}</span></p>
          <ul className="inbox">
            {c.inbox.map((item) => (
              <li key={item.title}>
                <b>{item.title}</b>
                <span>{item.text}</span>
                <div className="inbox__actions">
                  {item.actions.map((a, i) => <span key={a + i} className={i === 0 ? 'inbox__action--primary' : undefined}>{a}</span>)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="principle"><b>{c.principleStrong}</b> {c.principle}</p>
    </>
  )
}
