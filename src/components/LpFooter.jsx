import { hrefFor } from '../routes'
import { SITE_URL } from '../site'

// Footer mínimo para landings de campañas pagadas (src/pages/standalone.js): mismo look del
// Footer del sitio (marca + legales + dominio) pero sin las columnas de navegación, para no abrir
// ninguna salida de la página. `showIllustrative` solo si algún visual de la página usa datos de
// ejemplo (DS: la línea es obligatoria en ese caso, no decorativa). `tagline` (opcional): reemplaza
// la bajada compartida (src/i18n/es.js) sin tocarla, para no cambiarla en el resto del sitio.
const LEGAL = ['terminos', 'privacidad']

export function LpFooter({ t, locale, showIllustrative, tagline }) {
  const legal = LEGAL.map((id) => ({ id, href: hrefFor(id, locale), name: t.pages[id].name })).filter((l) => l.href)

  return (
    <footer className="footer footer--lp">
      <div className="footer__brand">
        <img src="/logo-logotype-light.svg" alt="Relvo" width="102" height="26" loading="lazy" />
        <p className="footer__tagline">{tagline ?? t.footer.tagline}</p>
      </div>
      {showIllustrative && <p className="footer__illustrative">{t.footer.illustrative}</p>}
      <div className="footer__legal">
        <span>{t.footer.legal}</span>
        {legal.map((l) => <a key={l.id} href={l.href}>{l.name}</a>)}
        <span className="footer__domain">{new URL(SITE_URL).host}</span>
      </div>
    </footer>
  )
}
