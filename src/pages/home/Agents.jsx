import { useEffect, useRef } from 'react'
import { Texture } from '../../components/Texture'
import { AgentFeed, Review } from '../../visuals/cards'
import { labelsFor } from '../../visuals/labels'

// 02 Agentes (prototipo home v2): tareas del día, registro con íconos y un caso de revisión
// (OC contra contrato) sobre la textura Pulso, con los visuales agentFeed y review de la librería
// en su versión oscura. El registro se va llenando en loop solo mientras está en pantalla; sin JS o
// con movimiento reducido se ve completo.
export function Agents({ c, locale }) {
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

  const feedData = { kpis: c.kpis, items: c.log.map((item) => [item.icon, item.text, item.time]) }
  return (
    <>
      <div className="agents agents--ink">
        <div className="agents__bg"><Texture kind="pulse" /></div>
        <div className="pane"><AgentFeed d={feedData} feedRef={feed} /></div>
        <div className="pane"><Review d={c.review} l={{ ...labelsFor(locale), review: c.review.label }} /></div>
      </div>
      <p className="principle">{c.principle}</p>
    </>
  )
}
