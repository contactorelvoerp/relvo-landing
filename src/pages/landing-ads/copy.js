// Landing de Google Ads "Facturación B2B" (docs/landing-ads-b2b.md, aprobado por Ricardo).
// Solo ES: la campaña es Search en Chile, en español. Todo lo de acá es nuevo para esta página
// (no viene del brief de la web 3.0), salvo donde el comentario dice lo contrario.
export const copy = {
  es: {
    hero: {
      // Eyebrow propio de esta página (Ricardo, 2026-10-31): el brief fija un solo eyebrow para el
      // resto del sitio (el de la home), pero esta es una landing de campaña aparte.
      eyebrow: 'Revenue Engine para B2B',
      h1: 'Factura, cobra y concilia, sin trabajo manual.',
      subtitle: 'Agentes que facturan, cobran y concilian cada pago de los clientes a los que facturas una y otra vez, para que la plata te llegue más rápido.',
      cta: 'Agenda una demo',
    },
    industrias: {
      title: 'Para empresas B2B que facturan una y otra vez a los mismos clientes.',
      lead: 'Si le facturas más de una vez al mismo cliente, con contrato fijo o sin él, Relvo te sirve.',
      items: [
        { key: 'saas', label: 'SaaS e IA' },
        { key: 'logistica', label: 'Logística' },
        { key: 'tresPl', label: '3PL' },
        { key: 'ultimaMilla', label: 'Última milla' },
        { key: 'staffing', label: 'Staffing' },
        { key: 'contables', label: 'Estudios contables' },
        { key: 'seguridad', label: 'Seguridad' },
        { key: 'maquinaria', label: 'Renting de maquinaria' },
      ],
    },
    queResuelve: {
      title: 'Dos formas de cobrar.',
      bridge: '¿Facturas siempre lo mismo, cada mes? Eso es un plan recurrente. ¿Facturas varias veces al mismo cliente según lo que pasó —envíos, pedidos, horas, hitos— aunque no tengas una cadencia fija? Eso es un contrato con pricing híbrido.',
      // Lead de cada solución, ya aprobado y publicado tal cual (sin reescribir):
      plans: {
        title: 'Planes recurrentes', body: 'Planes fijos cobrados cada mes o cada año, con tarjeta, link de pago o transferencia. Facturas, cobranza y conciliación en un solo flujo.', // content/es/soluciones/planes-recurrentes.json
        stat: ['214', 'planes activos', 'facturados este mes'],
      },
      contracts: {
        title: 'Contratos con pricing híbrido', body: 'Relvo convierte cada condición negociada en reglas, gestiona las órdenes de compra, divide facturas entre sociedades y cobra.', // content/es/soluciones/contratos-con-pricing-hibrido.json
        stat: ['USD 3.090', 'factura F-1042', 'fijo + uso, dividida entre 2 sociedades'],
      },
    },
    // Tres capas / Rieles-Agentes-Inteligencia: título y bajada ya aprobados, tal cual home/copy.js.
    agentes: {
      lead: 'Agentes que hacen el trabajo manual del cobro —leer una orden de compra, pedir una HES, avisar a tu equipo— para que la plata te llegue más rápido y sin que nadie lo opere a mano.',
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
