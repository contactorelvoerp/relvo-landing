// Conversiones de Google Ads de esta campaña (cuenta AW-18546425614, dato de Ricardo). Son
// distintas de generate_lead/demo_agendada (src/analytics.js → GA4): estas usan
// gtag('event','conversion', {send_to: ...}) para que Google Ads las vea y pueda pujar con ellas.
// Las dos se disparan juntas, nunca una sola.
export const GOOGLE_ADS_CONVERSIONS = {
  demo: { sendTo: 'AW-18546425614/f76DCIjjwq8dEI7-z4tF', value: 100, currency: 'USD' },
  form: { sendTo: 'AW-18546425614/QRcsCIvjwq8dEI7-z4tF', value: 50, currency: 'USD' },
}

// `transactionId` es obligatorio: es lo que evita que Google cuente dos veces la misma conversión
// (un reintento del formulario, o que bookingSuccessful se dispare más de una vez).
// Fuera de producción gtag no existe (src/analytics.js lo deja sin definir en previews): se deja
// un console.log con el mismo payload para poder revisar el cableado desde un preview de Vercel.
// Mismo fallback si por algún motivo gtag sí existe pero el host no es el de producción (Ricardo,
// 2026-11-01): un deploy de producción (VERCEL_ENV=production, rama main) sigue siendo accesible
// por su URL de Vercel además del dominio propio, y ahí no deben contarse conversiones reales.
// `browser` es inyectable (igual que src/attribution.js → captureAttribution) para poder probar
// esto sin un DOM real.
const CANONICAL_HOST = 'getrelvo.ai'

export function fireAdsConversion({ sendTo, value, currency, transactionId, email, phone }, browser = window) {
  const userData = { email, ...(phone ? { phone_number: phone } : {}) }
  const conversion = { send_to: sendTo, value, currency, transaction_id: transactionId }
  const onCanonicalHost = browser.location?.hostname === CANONICAL_HOST
  if (typeof browser.gtag !== 'function' || !onCanonicalHost) {
    console.log('[ads-conversion]', { user_data: userData, ...conversion })
    return
  }
  browser.gtag('set', 'user_data', userData)
  browser.gtag('event', 'conversion', conversion)
}

// Normaliza un teléfono a E.164 (+<código><número>, sin espacios ni separadores) para
// user_data.phone_number. Sin "+" en el valor ingresado, se asume igual con el signo: Google Ads
// exige el formato completo y no hay forma de adivinar el código de país que falte.
export function toE164(raw) {
  if (!raw) return undefined
  const digits = raw.replace(/[^\d]/g, '')
  return digits ? `+${digits}` : undefined
}
