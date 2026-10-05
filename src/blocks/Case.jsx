// Caso TGP (home y bloque case de la plantilla): resultado principal, DTI antes y después, y la cita.
import '../styles/blocks.css'

const Bars = ({ count, on }) => (
  <div className={`case__bars${on ? ' case__bars--on' : ''}`} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => <i key={i} />)}
  </div>
)

// `link` (opcional): { href, label } hacia la página del caso
export function Case({ c, link }) {
  const before = c.beforeDays ?? 6, after = c.afterDays ?? 3
  return (
    <div className="case">
      <div>
        <p className="case__company">
          <img src="/logos/clients/tgp.webp" alt={c.company} width="88" height="24" loading="lazy" />
          {c.about}
        </p>
        <p className="case__big">{c.big}</p>
        <p className="case__big-label">{c.bigLabel}</p>
        <p className="case__sub">{c.bigSub}</p>
      </div>
      <div>
        <p className="case__metric"><b>{c.metricStrong}</b>{c.metric}</p>
        <div className="case__dd case__dd--before">
          <div className="case__dd-label">{c.before}</div>
          <div className="case__dd-value"><b>{before}</b><small>{c.days}</small></div>
          <Bars count={before} />
        </div>
        <div className="case__dd">
          <div className="case__dd-label case__dd-label--on">{c.after}</div>
          <div className="case__dd-value"><b>{after}</b><small>{c.days}</small></div>
          <Bars count={after} on />
        </div>
      </div>
      <figure className="case__quote">
        <blockquote>“{c.quote}”</blockquote>
        <figcaption>{c.author}<span>{c.role}</span></figcaption>
        {link && <p className="case__link"><a className="link" href={link.href}>{link.label}</a></p>}
      </figure>
    </div>
  )
}
