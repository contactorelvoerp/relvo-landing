// Landing de Google Ads "Facturación B2B" (docs/landing-ads-b2b.md, aprobado por Ricardo).
// Solo ES: la campaña es Search en Chile, en español. Todo lo de acá es nuevo para esta página
// (no viene del brief de la web 3.0), salvo donde el comentario dice lo contrario.
// Revisión del 2026-11-01 (prompt de Ricardo, copy aprobado tal cual): calendario primero,
// mockup del hero con 3 casos, sección de dolor, "Un solo motor" en beneficio del cliente,
// cifras recortadas a las 3 aprobadas, integraciones acotadas a las confirmadas, FAQ nuevo.

export const copy = {
  es: {
    hero: {
      // Eyebrow propio de esta página (Ricardo, 2026-10-31): el brief fija un solo eyebrow para el
      // resto del sitio (el de la home), pero esta es una landing de campaña aparte.
      eyebrow: 'Facturación y cobranza automatizadas para B2B',
      h1: 'Factura, cobra y concilia, sin trabajo manual.',
      subtitle: 'Agentes que calculan, facturan, cobran y concilian cada pago de tus clientes recurrentes, para que cobres antes y sin planillas.',
      cta: 'Agendar demo',
      microcopy: '30 minutos · Sin compromiso',
    },
    // Mockup del hero con 3 casos (Ricardo, 2026-11-01): antes era 100% SaaS/tokens y no conectaba
    // con logística, staffing ni seguridad. Logística es el tab por defecto. El caso de SaaS e IA
    // reusa el mismo objeto que el hero de la home (homeCopy.es.hero.stage, LpHeroShowcase.jsx):
    // mismos datos aprobados, sin duplicarlos acá.
    heroTabs: {
      tablistLabel: 'Ejemplos de facturación',
      items: [
        {
          key: 'logistica',
          tabLabel: 'Logística',
          window: {
            url: 'app.getrelvo.ai/contratos/rutasur-logistica', nav: ['Contratos', 'Facturas', 'Cobranza', 'Reportes'],
            label: 'Contrato', name: 'RutaSur Logística', status: 'Activo',
            columns: ['Factura', 'Monto', 'Estado'],
            rows: [['F-2214', 'UF 102,5', 'Emitida'], ['F-2201', 'UF 98,0', 'Pagada']],
            paid: 'Pagada',
          },
          metric: { label: 'Envíos', unit: 'UF 0,05 por envío', value: '1.250' },
          invoice: {
            title: 'Factura de octubre', meta: 'Octubre', total: 'UF 102,5', totalLabel: 'Total',
            rows: [['Tarifa fija mensual', 'UF 40'], ['1.250 envíos × UF 0,05', 'UF 62,5']],
          },
          toast: { title: 'Pago conciliado', meta: 'RutaSur Logística, hace un momento' },
        },
        {
          key: 'staffing',
          tabLabel: 'Staffing',
          window: {
            url: 'app.getrelvo.ai/contratos/equipo-andino', nav: ['Contratos', 'Facturas', 'Cobranza', 'Reportes'],
            label: 'Contrato', name: 'Equipo Andino', status: 'Activo',
            columns: ['Factura', 'Monto', 'Estado'],
            rows: [['F-0876', 'CLP 17.480.000', 'Emitida'], ['F-0861', 'CLP 16.920.000', 'Pagada']],
            paid: 'Pagada',
          },
          metric: { label: 'Horas', unit: 'CLP 9.500 la hora', value: '1.840' },
          invoice: {
            title: 'Factura de octubre', meta: 'Octubre · 2 sociedades', total: 'CLP 17.480.000', totalLabel: 'Total',
            rows: [['1.840 horas facturables × CLP 9.500', 'CLP 17.480.000']],
            usageIndex: 0,
          },
          toast: { title: 'Pago conciliado', meta: 'Equipo Andino, hace un momento' },
        },
        { key: 'saas', tabLabel: 'SaaS e IA' },
      ],
    },
    // Sección "el dolor", justo después del hero (Ricardo, 2026-11-01).
    pain: {
      title: 'Si a fin de mes tu equipo…',
      items: [
        '…arma la facturación en una planilla, cliente por cliente.',
        '…persigue órdenes de compra y correos para poder facturar.',
        '…cruza la cartola del banco con cada factura para saber quién pagó.',
      ],
      closing: 'Relvo hace ese trabajo por ti, todos los meses.',
    },
    industrias: {
      title: 'Para empresas de servicios B2B con clientes recurrentes.',
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
      bridge: '¿Le cobras lo mismo cada mes? Eso es un plan recurrente. ¿Le cobras a cada cliente según lo que pasó en el período —envíos, horas, pedidos o hitos—? Eso es un contrato con pricing híbrido.',
      // Lead de cada solución, ya aprobado y publicado tal cual (sin reescribir):
      plans: {
        title: 'Planes recurrentes', body: 'Planes fijos cobrados cada mes o cada año, con tarjeta, link de pago o transferencia. Facturas, cobranza y conciliación en un solo flujo.', // content/es/soluciones/planes-recurrentes.json
        stat: ['214', 'planes activos', 'facturados este mes'],
      },
      contracts: {
        title: 'Contratos con pricing híbrido', body: 'Relvo convierte cada condición negociada en reglas, gestiona las órdenes de compra, divide facturas entre sociedades y cobra.', // content/es/soluciones/contratos-con-pricing-hibrido.json
        stat: ['USD 3.090', 'factura F-1042', 'fijo + uso, dividida entre 2 sociedades'],
      },
      ctaQuestion: '¿No sabes cuál es tu caso?',
      ctaLink: 'Agenda una demo y lo vemos juntos.',
    },
    // Reemplaza "Tres capas" (Rieles/Agentes/Inteligencia, que hablaba de nuestra arquitectura) por
    // beneficio para el cliente, mismo diseño de 3 tarjetas (Ricardo, 2026-11-01). Los ejemplos
    // dentro de las tarjetas usan el caso de Logística (ver nota de LpOneEngine.jsx).
    oneEngine: {
      title: 'Un solo motor para todo tu cobro.',
      calcula: {
        title: 'Calcula', sub: 'El monto exacto de cada cliente en cada período: fijos, variables, descuentos y prorrateos.',
        plan: 'Tarifa fija mensual', planAmount: 'UF 40',
        usage: '1.250 envíos × UF 0,05', usageAmount: 'UF 62,5',
        detail: '1.250 envíos a UF 0,05 cada uno',
        total: 'Total octubre', totalAmount: 'UF 102,5',
      },
      opera: {
        title: 'Opera', sub: 'Agentes que asocian órdenes de compra, emiten la factura y hacen el seguimiento del cobro por ti.',
        sender: 'Agente de Relvo',
        event: 'Orden de compra asociada.',
        context: 'La OC 8821-04 de RutaSur Logística calza con el contrato. La factura sale hoy.',
        done: 'Listo',
      },
      teMuestra: {
        title: 'Te muestra', sub: 'Cuánto facturas, cuánto recaudas y quién te debe, en tiempo real.',
        facturadoLabel: 'Facturado este mes', facturado: 'UF 102,5',
        recaudadoLabel: 'Recaudado', recaudado: 'UF 85,0',
        porCobrarLabel: 'Por cobrar', porCobrar: 'UF 17,5',
      },
    },
    // Solo las 3 cifras aprobadas (Ricardo, 2026-11-01): se sacaron "-70%", "2 a 3 días" y
    // "Opera y escala" del corte anterior.
    stats: {
      title: 'Operando hoy en LatAm.',
      items: [
        ['1.000+', 'facturas emitidas y conciliadas cada mes con Relvo'],
        ['3', 'países en operación: Chile, México y Colombia'],
        ['2 semanas', 'de implementación'],
      ],
      cta: 'Agendar demo',
    },
    // Solo las integraciones confirmadas por Ricardo (2026-11-01): Odoo, Attio, SII, Bancos, Claude
    // y ChatGPT salen del carrusel hasta que las confirme una por una.
    integrationNames: ['HubSpot', 'Sintropix', 'Stripe', 'Toku', 'Fintoc', 'Slack', 'Google Chat'],
    precio: {
      title: 'Desde USD 299 al mes.',
      who: 'Para empresas de servicios B2B con hasta 50 contratos y operación en un solo país.',
      implementation: 'Implementación en 2 semanas.',
      cta: 'Agendar demo',
      volume: '¿Más de 50 contratos o más de un país? Te cotizamos según tu volumen.',
    },
    faq: {
      title: 'Preguntas frecuentes',
      items: [
        { q: '¿Reemplaza mi ERP o mi sistema contable?', a: 'No. Relvo se encarga del ciclo de cobro —contratos, facturación, cobranza y conciliación— y se conecta a tu ERP o vía API.' },
        { q: '¿Emite facturas electrónicas válidas?', a: 'Sí. Relvo emite facturación electrónica en Chile y México.' },
        { q: '¿Sirve si le cobro distinto cada mes a mis clientes?', a: 'Sí. Relvo calcula lo que corresponde según consumo, horas, envíos o hitos, con las reglas de cada contrato.' },
      ],
    },
    demo: {
      title: 'Agendar demo.',
      lead: 'Una sesión de 30 minutos con tu caso: cómo cobras hoy y cómo lo automatiza Relvo.',
      formTitle: '¿Prefieres escribirnos?',
      formSubmit: 'Enviar consulta',
    },
    footer: {
      tagline: 'Facturación y cobranza automatizadas para B2B.',
    },
  },
}


// Las mismas preguntas y respuestas se muestran en la página y en el JSON-LD FAQPage.
export const answeredFaq = (locale) => copy[locale]?.faq.items ?? []
