import { SITE_URL } from '../site'

// Footer mínimo para landings de campañas pagadas (src/pages/standalone.js): mismo look del
// Footer del sitio (marca + legales + dominio) pero sin las columnas de navegación, para no abrir
// ninguna salida de la página. `showIllustrative` solo si algún visual de la página usa datos de
// ejemplo (DS: la línea es obligatoria en ese caso, no decorativa). `tagline` (opcional): reemplaza
// la bajada compartida (src/i18n/es.js) sin tocarla, para no cambiarla en el resto del sitio.
//
// Legal (Ricardo, 2026-11-02, Google Ads lo exige por el formulario): /terminos y /privacidad
// todavía no existen en este sitio (devuelven 404 en producción — Footer.jsx, el del resto del
// sitio, tiene el mismo hueco; no es solo de esta landing). Hasta que existan esas páginas en
// getrelvo.ai, se enlaza a los Términos y la Política de privacidad reales y ya publicados de la
// plataforma (app.relvoerp.com) — no se inventa el texto legal.
const LEGAL = [
  { name: 'Términos', href: 'https://app.relvoerp.com/terms' },
  { name: 'Privacidad', href: 'https://app.relvoerp.com/privacy' },
]

export function LpFooter({ t, showIllustrative, tagline }) {
  return (
    <footer className="footer footer--lp">
      <div className="footer__brand">
        <img src="/logo-logotype-light.svg" alt="Relvo" width="102" height="26" loading="lazy" />
        <p className="footer__tagline">{tagline ?? t.footer.tagline}</p>
      </div>
      {showIllustrative && <p className="footer__illustrative">{t.footer.illustrative}</p>}
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
