// Link del evento "Demo Relvo" en Cal.com, en la variable de entorno VITE_CALCOM_LINK (Vercel →
// Project Settings → Environment Variables) si está configurada ahí — y si no, el slug de acá
// directo (Ricardo, 2026-11-02: no es secreto, y la variable nunca llegó a ningún build de
// producción pese a estar configurada en Vercel; en vez de seguir dependiendo de esa variable,
// CAL_LINK ya no puede quedar vacío). Esta app es Vite, no Next.js: solo las variables con prefijo
// VITE_ llegan al navegador, así que el nombre pedido (NEXT_PUBLIC_CALCOM_LINK) no serviría acá.
export const CAL_LINK = import.meta.env.VITE_CALCOM_LINK || 'ricardo-cerda-waak-z2uqe2/demo-relvo'

// Link de respaldo (URL completa, no el slug de arriba) para cuando el embed de Cal.com falla de
// verdad al cargar (evento linkFailed, o 10s sin linkReady — ver CalEmbed.jsx): CalEmbed.jsx
// muestra este link en vez de dejar la sección vacía sin avisar.
export const CAL_LINK_FALLBACK = 'https://cal.com/ricardo-cerda-waak-z2uqe2/demo-relvo'

// Caso de cliente (Ricardo, 2026-11-01): bloque preparado detrás de este flag, apagado hasta que
// entregue el texto, el logo y la cita aprobados. CLAUDE.md: nunca se inventan clientes ni citas,
// así que mientras no haya contenido esto se queda en false y el bloque no se publica ni en preview.
export const SHOW_CASE_TGP = false
