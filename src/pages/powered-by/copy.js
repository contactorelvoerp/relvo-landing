// Copy aprobado por Ricardo (2026-11-02) para la nueva /powered-by-relvo: quien llega es el
// cliente de nuestro cliente, desde el link "Powered by Relvo" de una factura, un recordatorio o
// una confirmación de pago. Solo ES: sin traducción aprobada todavía para este rediseño, así que
// /en/powered-by-relvo sigue mostrando el contenido anterior (PoweredByPage.jsx →
// PoweredByLegacyEn) hasta que Ricardo entregue la traducción — no se traduce por cuenta propia.
export const copy = {
  es: {
    notice: '¿Tienes una duda sobre tu factura? Responde directamente a ese correo y tu proveedor la recibirá.',
    hero: {
      title: 'Ese correo no lo mandó una persona.',
      // `name`: nombre del cliente referente si `?cliente=` viene en la URL y está en el
      // allowlist (src/config/powered-by-referrers.js); si no, el genérico "Tu proveedor".
      lead: (name) => `${name ?? 'Tu proveedor'} usa Relvo para calcular, facturar, cobrar y conciliar. La factura, los recordatorios y el cuadre del pago salen solos. Si tu empresa también cobra todos los meses, puede funcionar igual.`,
      ctaPrimary: 'Agendar demo',
      ctaSecondary: 'Ver qué pasó detrás de tu correo ↓',
    },
    timeline: {
      heading: 'Lo que pasó detrás de ese correo',
      steps: [
        { title: 'Se calculó el cobro', text: 'Relvo cruzó el contrato con el consumo del mes: plan fijo, uso y descuentos.' },
        { title: 'Se emitió la factura', text: 'Factura electrónica emitida y enviada, sin que nadie la armara a mano.' },
        { title: 'Se hizo el seguimiento', text: 'Recordatorios automáticos hasta el pago.' },
        { title: 'Se concilió el pago', text: 'El pago llegó al banco y se cuadró solo con la factura.' },
      ],
    },
    // Cifras nuevas junto al caso TGP (que se mantiene tal cual, home/copy.js → case).
    stats: [['1.000+', 'facturas emitidas y conciliadas al mes'], ['3', 'países en operación']],
    fit: {
      heading: '¿Te sirve a ti?',
      recurring: '¿Cobras planes recurrentes?',
      hybrid: '¿Tus contratos mezclan fijo, uso e hitos?',
    },
    closing: {
      heading: 'Mira cómo funcionaría en tu empresa',
      formTitle: '¿Prefieres escribirnos?',
      formSubmit: 'Enviar consulta',
    },
  },
}
