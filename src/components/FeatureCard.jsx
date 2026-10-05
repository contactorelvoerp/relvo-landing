// Tarjeta destacada del DS v1.5: la única tarjeta que va sobre una textura.
export function FeatureCard({ tone = 'light', sender, title, context, amount, chip }) {
  return (
    <div className={`feature-card feature-card--${tone}`}>
      <div className="feature-card__sender">
        <span className="feature-card__mark">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7.5 6 10l5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>{sender}</span>
      </div>
      <p className="feature-card__title">{title}</p>
      <p className="feature-card__context">{context}</p>
      {amount && <p className="feature-card__amount">{amount}</p>}
      {chip && <span className="feature-card__chip">{chip}</span>}
    </div>
  )
}
