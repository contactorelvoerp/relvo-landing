import { EXTERNAL_PAGES, SITE_URL } from '../site'

// Footer mínimo para landings de campañas pagadas (src/pages/standalone.js): mismo look del
// Footer del sitio (marca + legales + dominio) pero sin las columnas de navegación, para no abrir
// ninguna salida de la página. `tagline` (opcional): reemplaza
// la bajada compartida (src/i18n/es.js) sin tocarla, para no cambiarla en el resto del sitio.
//
// Legal (Ricardo, 2026-11-02, Google Ads lo exige por el formulario): los Términos y la Política de
// privacidad publicados de la plataforma, los mismos del Footer del sitio (EXTERNAL_PAGES).
const LEGAL = [
  { name: 'Términos', href: EXTERNAL_PAGES.terminos },
  { name: 'Privacidad', href: EXTERNAL_PAGES.privacidad },
]

export function LpFooter({ t, tagline }) {
  return (
    <footer className="footer footer--lp">
      <div className="footer__brand">
        <img src="/logo-logotype-light.svg" alt="Relvo" width="102" height="26" loading="lazy" />
        <p className="footer__tagline">{tagline ?? t.footer.tagline}</p>
      </div>
      <div className="footer__legal">
        <span>{t.footer.legal}</span>
        {/* Nueva pestaña: esta página no tiene más salidas, así que un link legal no debe sacar a
            la persona de la landing antes de que agende o deje sus datos. */}
        {LEGAL.map((l) => <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer">{l.name}</a>)}
        <span className="footer__domain">{new URL(SITE_URL).host}</span>
      </div>
    </footer>
  )
}
