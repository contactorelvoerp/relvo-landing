// Link del evento "Demo Relvo" en Cal.com, en la variable de entorno VITE_CALCOM_LINK (Vercel →
// Project Settings → Environment Variables). Esta app es Vite, no Next.js: solo las variables con
// prefijo VITE_ llegan al navegador, así que el nombre pedido (NEXT_PUBLIC_CALCOM_LINK) no serviría
// acá. Sin ella, src/pages/landing-ads/CalEmbed.jsx no pinta nada y la sección de agenda queda solo
// con el formulario de contacto.
export const CAL_LINK = import.meta.env.VITE_CALCOM_LINK ?? ''

// Link de respaldo del mismo evento "Demo Relvo" (Ricardo, 2026-11-02): si VITE_CALCOM_LINK falta
// o está mal escrita, CalEmbed.jsx muestra este link en vez de dejar la sección vacía sin avisar.
// No es sensible (es la URL pública del evento), así que puede ir hardcodeado.
export const CAL_LINK_FALLBACK = 'https://cal.com/ricardo-cerda-waak-z2uqe2/demo-relvo'

// Caso de cliente (Ricardo, 2026-11-01): bloque preparado detrás de este flag, apagado hasta que
// entregue el texto, el logo y la cita aprobados. CLAUDE.md: nunca se inventan clientes ni citas,
// así que mientras no haya contenido esto se queda en false y el bloque no se publica ni en preview.
export const SHOW_CASE_TGP = false
