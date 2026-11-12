import { hrefFor } from '../routes'
import { LINKEDIN_URL } from '../site'

const LEGAL = ['privacidad', 'terminos']

export function Footer({ t, locale }) {
  return (
    <footer className="footer footer--simple">
      <div className="footer__top">
        <div className="footer__brand">
          <img src="/logo-logotype-light.svg" alt="Relvo" width="102" height="26" loading="lazy" />
        </div>
        <img className="footer__badge" src="/logos/startup-chile-white.webp" alt="Start-Up Chile by Corfo" width="227" height="40" loading="lazy" />
        <a className="footer__social" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="Relvo LinkedIn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M5.37 24H.4V7.98h4.97ZM2.88 5.8A2.9 2.9 0 1 1 2.9 0a2.9 2.9 0 0 1-.02 5.8ZM24 24h-4.97v-7.8c0-1.86-.04-4.25-2.59-4.25-2.59 0-2.99 2.02-2.99 4.12V24H8.48V7.98h4.77v2.19h.07c.67-1.26 2.29-2.59 4.7-2.59 5.03 0 5.98 3.31 5.98 7.61Z" />
          </svg>
        </a>
      </div>
      <div className="footer__legal">
        <span>{t.footer.legal}</span>
        <div className="footer__legal-links">
          {LEGAL.map((id) => <a key={id} href={hrefFor(id, locale)}>{t.pages[id].name}</a>)}
        </div>
      </div>
    </footer>
  )
}
