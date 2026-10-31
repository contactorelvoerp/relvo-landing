// Landing de Google Ads "Facturación B2B" (docs/landing-ads-b2b.md, aprobado por Ricardo).
// Solo ES: la campaña es Search en Chile, en español. Todo lo de acá es nuevo para esta página
// (no viene del brief de la web 3.0), salvo donde el comentario dice lo contrario.
export const copy = {
  es: {
    hero: {
      h1: 'Revenue Engine para B2B: factura, cobra y concilia a los clientes a los que facturas una y otra vez.',
      subtitle: 'Planes recurrentes o contratos con pricing híbrido, con tarjeta, transferencia o ambas. Un solo sistema para calcular, facturar, cobrar y conciliar cada peso.',
      cta: 'Agenda una demo',
      // Visual: una sola tarjeta (una factura, no la composición completa del hero de la home) + un dato.
      invoice: {
        number: 'Factura F-1042', client: 'Nimbo AI', status: 'Pagada', total: 'USD 2.900',
      },
      stat: '1.000+ facturas emitidas y conciliadas al mes',
    },
    paraQuien: {
      title: 'Para empresas B2B que facturan una y otra vez a los mismos clientes.',
      lead: 'SaaS e IA, logística, 3PL, última milla, staffing, estudios contables, seguridad y renting de maquinaria: si le facturas más de una vez al mismo cliente, con contrato fijo o sin él.',
    },
    queResuelve: {
      title: 'Dos formas de cobrar, un solo motor.',
      bridge: '¿Facturas siempre lo mismo, cada mes? Eso es un plan recurrente. ¿Facturas varias veces al mismo cliente según lo que pasó —envíos, pedidos, horas, hitos— aunque no tengas una cadencia fija? Eso es un contrato con pricing híbrido.',
      // Lead de cada solución, ya aprobado y publicado tal cual (sin reescribir):
      plans: { title: 'Planes recurrentes', body: 'Planes fijos cobrados cada mes o cada año, con tarjeta, link de pago o transferencia. Facturas, cobranza y conciliación en un solo flujo.' }, // content/es/soluciones/planes-recurrentes.json
      contracts: { title: 'Contratos con pricing híbrido', body: 'Relvo convierte cada condición negociada en reglas, gestiona las órdenes de compra, divide facturas entre sociedades y cobra.' }, // content/es/soluciones/contratos-con-pricing-hibrido.json
    },
    // Las dos primeras cifras son las de home/copy.js → stats (ya aprobadas). Las tres siguientes
    // son nuevas, con el dato de Ricardo y la redacción propuesta en docs/landing-ads-b2b.md.
    stats: {
      title: 'Operando hoy en LatAm.',
      items: [
        ['1.000+', 'facturas emitidas y conciliadas cada mes con Relvo'],
        ['3', 'países en operación: Chile, México y Colombia'],
        ['-70%', 'menos trabajo manual en la operación de cobro'],
        ['2 a 3 días', 'que tu equipo recupera cada mes, en promedio, al dejar de operar el cobro a mano'],
        ['Opera y escala', 'sin sumar personas a tu equipo de operaciones'],
      ],
    },
    // Carrusel ampliado para esta campaña (confirmado por Ricardo): las integraciones de siempre más
    // Sintropix, Odoo, Attio, SII, Bancos, Claude y ChatGPT. MCP no va en el carrusel (sin logo
    // propio): sigue solo como la línea de salida de abajo.
    integrationNames: ['HubSpot', 'Stripe', 'Toku', 'Fintoc', 'Slack', 'Google Chat', 'Sintropix', 'Odoo', 'Attio', 'SII', 'Bancos', 'Claude', 'ChatGPT'],
    precio: {
      title: 'Desde USD 299 al mes.',
      who: 'Para empresas de servicios B2B con hasta 50 contratos y operación en un solo país.',
      implementation: 'Implementación en 2 semanas.',
      cta: 'Agenda una demo',
    },
    demo: {
      title: 'Agenda tu demo.',
      lead: 'Una sesión de 30 minutos con tu caso: cómo cobras hoy y cómo lo automatiza Relvo.',
      altQuestion: '¿Prefieres que te contactemos nosotros?',
      formSubmit: 'Enviar',
    },
  },
}
