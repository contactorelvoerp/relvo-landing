// Link del evento "Demo Relvo" en Cal.com, en la variable de entorno VITE_CALCOM_LINK (Vercel →
// Project Settings → Environment Variables). Esta app es Vite, no Next.js: solo las variables con
// prefijo VITE_ llegan al navegador, así que el nombre pedido (NEXT_PUBLIC_CALCOM_LINK) no serviría
// acá. Sin ella, src/pages/landing-ads/CalEmbed.jsx no pinta nada y la sección de agenda queda solo
// con el formulario de contacto.
export const CAL_LINK = import.meta.env.VITE_CALCOM_LINK ?? ''
