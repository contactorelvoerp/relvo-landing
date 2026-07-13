// V2 redesign copy — EN (global) + ES (V1 LATAM).
// Source of truth: relvo-landing-copy.md / relvo-landing-copy-ES.md

export const LANGS = ['es', 'en']

export const paths = {
  es: {
    home: '/',
    pricing: '/precios',
    solutions: '/soluciones',
    solutionRole: (slug) => `/soluciones/${slug}`,
    docs: '/docs',
    about: '/about-us',
  },
  en: {
    home: '/en',
    pricing: '/en/pricing',
    solutions: '/en/solutions',
    solutionRole: (slug) => `/en/solutions/${slug}`,
    docs: '/docs',
    about: '/about-us',
  },
}

export const roleSlugs = {
  es: { founder: 'fundador-cfo', finance: 'finanzas-revops', revenue: 'head-of-revenue' },
  en: { founder: 'founder-cfo', finance: 'finance-revops', revenue: 'head-of-revenue' },
}

export const copy = {
  es: {
    meta: {
      title: 'Relvo | Infraestructura de revenue para empresas de tecnología',
      description:
        'Para negocios B2B con contratos recurrentes: convierte contratos en reglas, automatiza el flujo de aprobación y elimina los errores en la facturación.',
    },

    nav: {
      product: 'Producto',
      solutions: 'Soluciones',
      pricing: 'Precios',
      docs: 'Docs',
      login: 'Iniciar sesión',
      startFree: 'Empieza gratis',
      menuOpen: 'Abrir menú',
      menuClose: 'Cerrar menú',
      langSwitch: 'EN',
      langSwitchLabel: 'Switch to English',
    },

    hero: {
      eyebrow: 'INFRAESTRUCTURA DE REVENUE',
      title: 'Automatización de ingresos para empresas modernas',
      subhead:
        'Relvo opera tu ciclo de ingresos de forma autónoma: lee tus contratos recurrentes y los convierte en reglas, factura por uso y resultados, persigue aprobaciones y cobranza, y concilia cada pago contra el banco. Cero revenue leakage — para escalar del primer cliente al cliente mil.',
      ctaPrimary: 'Empieza gratis',
      ctaSecondary: 'Habla con nosotros',
    },

    proof: {
      label: 'EQUIPOS QUE YA GESTIONAN SU REVENUE CON RELVO',
    },

    problem: {
      eyebrow: 'EL PROBLEMA',
      title: 'Tu revenue vive en demasiados lugares',
      body:
        'El contrato es un PDF. El uso vive en un dashboard. Las aprobaciones pasan por correo y chat. La facturación corre en planillas. Cada traspaso es manual, y cada traspaso manual es donde el revenue se escapa en silencio — el tipo de fuga que la mayoría de los equipos ni siquiera mide. Y a medida que el pricing se mueve a uso y consumo medido por IA, el modelo manual se rompe aún más rápido.',
      kicker: 'RELVO LO CONVIERTE EN UN SOLO SISTEMA',
      points: [
        {
          title: 'Todo vive separado',
          body: 'El contrato es un PDF, el uso vive en un dashboard, las aprobaciones en correos y la facturación en planillas.',
        },
        {
          title: 'La fuga es silenciosa',
          body: 'Cada traspaso manual es donde el revenue se escapa — el tipo de fuga que la mayoría de los equipos ni siquiera mide.',
        },
        {
          title: 'Y se acelera',
          body: 'Con pricing por uso y consumo medido por IA, el modelo manual se rompe cada vez más rápido.',
        },
      ],
      fragments: ['Contrato en PDF', 'Uso en un dashboard', 'Aprobaciones por correo', 'Facturación en planillas'],
      oneSystem: 'UN SOLO SISTEMA',
    },

    features: [
      {
        id: 'contracts',
        eyebrow: 'CONTRATOS Y USO',
        title: 'Convierte cada contrato en reglas — automáticamente.',
        body:
          'Relvo lee los términos de tu pricing y arma la lógica de facturación por ti, luego se conecta al uso del cliente por API para que el contrato haga el cálculo en cada ciclo. La primera pieza de un motor de revenue nativo de IA.',
      },
      {
        id: 'approvals',
        eyebrow: 'APROBACIONES',
        title: 'Envía pre-facturas, recibe OCs, deja de perseguir aprobaciones.',
        body:
          'La cadena de aprobación que hoy vive en correos y chats, ahora en un solo lugar con el estado claro en cada factura.',
      },
      {
        id: 'invoicing',
        eyebrow: 'FACTURACIÓN',
        title: 'Factura como tu negocio realmente funciona.',
        body:
          'Divide un mismo cobro entre sociedades, aplica glosas distintas por cliente y maneja los casos borde que tu herramienta anterior no podía.',
      },
      {
        id: 'collection',
        eyebrow: 'ROUTER DE COBRANZA',
        title: 'Cobra por el medio que tu cliente use.',
        body:
          'Acepta pagos con tarjeta o transferencia tradicional, con Relvo automatizando los recordatorios de cobranza. Un solo flujo, todos los medios.',
      },
      {
        id: 'ar',
        eyebrow: 'CUENTAS POR COBRAR',
        title: 'Sabe quién te debe sin abrir una planilla.',
        body:
          'Conecta tus bancos, concilia la recaudación automáticamente y mira las cuentas por cobrar actualizarse solas, en tiempo real.',
      },
    ],

    usage: {
      eyebrow: 'HECHO PARA NEGOCIOS POR USO Y NATIVOS DE IA',
      title: 'El pricing se está moviendo a uso. Tu facturación también debería.',
      body:
        'El pricing por asientos era simple, pero se está quedando atrás. El software se cobra por consumo, resultados, tokens y acciones — y las empresas nativas de IA viven en el extremo de ese cambio. Relvo modela cualquiera de ellos: por unidad, por resultado, por tramos, híbrido, o todos en un mismo contrato.',
      chips: ['POR USO', 'POR RESULTADOS', 'CONSUMO DE IA'],
    },

    personas: {
      eyebrow: 'PARA QUIÉN ES',
      title: 'Hecho para quien sea que maneje el revenue',
      cards: [
        {
          role: 'founder',
          label: 'FUNDADOR HACIENDO DE CFO',
          body: 'Deja de manejar la facturación en una planilla que te da miedo tocar. Ve lo que te deben, siempre.',
          cta: 'Ver solución',
        },
        {
          role: 'finance',
          label: 'FINANZAS Y REVOPS',
          body: 'Cierra más rápido, concilia automáticamente y evita que el revenue se fugue entre el contrato y el cobro.',
          cta: 'Ver solución',
        },
        {
          role: 'revenue',
          label: 'HEAD OF REVENUE',
          body: 'Modela cualquier pricing — por uso, por hito, recurrente — sin esperar a ingeniería.',
          cta: 'Ver solución',
        },
      ],
    },

    integrations: {
      eyebrow: 'INTEGRACIONES',
      title: 'Se conecta al stack que ya usas',
      line: 'Medios de pago, bancos y tus datos de uso — conectados, no reconstruidos.',
      hubLabel: 'RELVO',
      groups: [
        { id: 'payments', label: 'MEDIOS DE PAGO', items: ['Stripe', 'Toku', 'Kushki', 'Rebill'] },
        { id: 'banks', label: 'BANCOS', items: ['Fintoc', 'Bancos locales'] },
        { id: 'erp', label: 'ERP / CONTABILIDAD', items: ['Vía API'] },
        { id: 'crm', label: 'CRM', items: ['Vía API'] },
      ],
    },

    closing: {
      title: 'Un solo sistema, del primer cliente al cliente mil',
      ctaPrimary: 'Empieza gratis',
      ctaSecondary: 'Habla con nosotros',
    },

    form: {
      title: 'Empieza gratis',
      subtitle: 'Cuéntanos de tu empresa y te damos acceso. Te contactamos en menos de 24 horas.',
      name: 'Nombre',
      email: 'Email corporativo',
      emailPlaceholder: 'nombre@empresa.com',
      namePlaceholder: 'Tu nombre',
      company: 'Empresa',
      companyPlaceholder: 'Nombre de tu empresa',
      role: 'Cargo',
      rolePlaceholder: 'Selecciona...',
      roleOptions: ['CFO / Director Financiero', 'Gerente Financiero', 'Founder / CEO', 'RevOps', 'Otro'],
      problem: '¿Qué problema quieres resolver?',
      problemOptional: '(opcional)',
      problemPlaceholder: 'Cuéntanos brevemente tu situación actual...',
      submit: 'Enviar',
      sending: 'Enviando...',
      retry: 'Reintentar',
      required: 'Campo requerido',
      invalidEmail: 'Email inválido',
      error: 'Hubo un error al enviar. Intenta de nuevo o escríbenos a contacto@relvoerp.com.',
      successTitle: '¡Listo! Te contactamos pronto.',
      successBody: 'Revisamos tu solicitud y te escribimos en menos de 24 horas.',
    },

    footer: {
      tagline: 'Infraestructura de revenue para empresas de tecnología.',
      rights: 'Todos los derechos reservados.',
      address: 'San Patricio 4264, Vitacura\nSantiago, Chile',
      columns: {
        product: {
          title: 'Producto',
          links: [
            { label: 'Contratos y uso', anchor: 'contracts' },
            { label: 'Aprobaciones', anchor: 'approvals' },
            { label: 'Facturación', anchor: 'invoicing' },
            { label: 'Cobranza', anchor: 'collection' },
            { label: 'Cuentas por cobrar', anchor: 'ar' },
          ],
        },
        solutions: { title: 'Soluciones' },
        company: {
          title: 'Empresa',
          about: 'Nosotros',
          blog: 'Blog',
          contact: 'contacto@relvoerp.com',
        },
        resources: { title: 'Recursos', pricing: 'Precios', docs: 'Docs', login: 'Iniciar sesión' },
      },
    },

    solutions: {
      index: {
        eyebrow: 'SOLUCIONES',
        title: 'Hecho para quien sea que maneje el revenue',
        body: 'Tres roles sienten el mismo dolor de formas distintas. Elige el tuyo.',
      },
      ctaLine: '¿Te suena familiar?',
      featuresLabel: 'LO QUE RESUELVE RELVO',
      roles: {
        founder: {
          label: 'FUNDADOR HACIENDO DE CFO',
          title: 'Deja de manejar la facturación en una planilla que te da miedo tocar.',
          body:
            'Estás construyendo producto y vendiendo — y además eres el CFO. Cada cierre de mes son días de planillas, correos de cobranza y conciliación a mano. Relvo corre ese ciclo por ti: ve lo que te deben, siempre, sin abrir Excel.',
          pains: [
            'La facturación del mes vive en una planilla que solo tú entiendes.',
            'No sabes cuánto te deben hasta que revisas el banco a mano.',
            'Cada cliente nuevo agrega horas de trabajo manual al cierre.',
          ],
          featureIds: ['contracts', 'ar', 'collection'],
        },
        finance: {
          label: 'FINANZAS Y REVOPS',
          title: 'Cierra más rápido, concilia automáticamente, sin fugas entre contrato y cobro.',
          body:
            'El contrato dice una cosa, la factura otra y el banco una tercera. Relvo une contrato, aprobación, factura y pago en un solo flujo con estado claro — para que el cierre deje de ser una investigación.',
          pains: [
            'Las aprobaciones y OCs se pierden entre correos y chats.',
            'La conciliación contra el banco se hace a mano, línea por línea.',
            'El revenue se fuga en los traspasos y nadie lo mide.',
          ],
          featureIds: ['approvals', 'ar', 'invoicing'],
        },
        revenue: {
          label: 'HEAD OF REVENUE',
          title: 'Modela cualquier pricing sin esperar a ingeniería.',
          body:
            'Cerrar el deal con un pricing creativo no debería significar tres sprints de ingeniería para poder facturarlo. Relvo convierte los términos del contrato en reglas de facturación — por uso, por hito, recurrente o híbrido.',
          pains: [
            'Cada pricing nuevo requiere trabajo manual o desarrollo interno.',
            'Los deals por uso o por resultado no caben en tu herramienta actual.',
            'No hay visibilidad de qué contratos generan qué revenue.',
          ],
          featureIds: ['contracts', 'invoicing', 'ar'],
        },
      },
    },
  },

  en: {
    meta: {
      title: 'Relvo | Revenue infrastructure for technology companies',
      description:
        'For B2B businesses with recurring contracts: turn contracts into rules, automate the approval flow, and bill without leakage.',
    },

    nav: {
      product: 'Product',
      solutions: 'Solutions',
      pricing: 'Pricing',
      docs: 'Docs',
      login: 'Log in',
      startFree: 'Start free',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      langSwitch: 'ES',
      langSwitchLabel: 'Cambiar a español',
    },

    hero: {
      eyebrow: 'REVENUE INFRASTRUCTURE',
      title: 'Revenue automation for modern companies',
      subhead:
        'Relvo runs your revenue cycle autonomously: it reads your recurring contracts and turns them into rules, bills on usage and outcomes, chases approvals and collections, and reconciles every payment against the bank. Zero revenue leakage — to scale from your first customer to your thousandth.',
      ctaPrimary: 'Start free',
      ctaSecondary: 'Talk to us',
    },

    proof: {
      label: 'TEAMS ALREADY RUNNING REVENUE ON RELVO',
    },

    problem: {
      eyebrow: 'THE PROBLEM',
      title: 'Your revenue lives in too many places',
      body:
        'The contract is a PDF. The usage sits in a dashboard. Approvals happen over email and chat. Invoicing runs on spreadsheets. Every handoff is manual, and every manual handoff is where revenue quietly slips — the kind of leakage most teams never even measure. And as pricing shifts to usage and AI-metered consumption, the manual model breaks even faster.',
      kicker: 'RELVO MAKES IT ONE SYSTEM',
      points: [
        {
          title: 'Everything lives apart',
          body: 'The contract is a PDF, usage sits in a dashboard, approvals happen over email, and invoicing runs on spreadsheets.',
        },
        {
          title: 'The leak is silent',
          body: 'Every manual handoff is where revenue quietly slips — the kind of leakage most teams never even measure.',
        },
        {
          title: 'And it compounds',
          body: 'As pricing shifts to usage and AI-metered consumption, the manual model breaks even faster.',
        },
      ],
      fragments: ['Contract in a PDF', 'Usage in a dashboard', 'Approvals over email', 'Invoicing on spreadsheets'],
      oneSystem: 'ONE SYSTEM',
    },

    features: [
      {
        id: 'contracts',
        eyebrow: 'CONTRACTS & USAGE',
        title: 'Turn every contract into rules — automatically.',
        body:
          'Relvo reads your pricing terms and builds the billing logic for you, then connects to customer usage over the API so the contract does the math on every cycle. The first piece of an AI-native revenue engine.',
      },
      {
        id: 'approvals',
        eyebrow: 'APPROVALS',
        title: 'Send pre-invoices, collect POs, stop chasing approvals.',
        body:
          'The approval chain that today lives in email and chat, now in one place with a clear status on every invoice.',
      },
      {
        id: 'invoicing',
        eyebrow: 'INVOICING',
        title: 'Invoice the way your business actually works.',
        body:
          "Split a single charge across legal entities, apply different line items per client, and handle the edge cases your old tool couldn't.",
      },
      {
        id: 'collection',
        eyebrow: 'COLLECTION ROUTER',
        title: 'Collect through whatever rail your customer pays on.',
        body:
          'Let customers pay by card or traditional bank transfer, with Relvo automating the collection reminders. One flow, every method.',
      },
      {
        id: 'ar',
        eyebrow: 'ACCOUNTS RECEIVABLE',
        title: 'Know who owes you without opening a spreadsheet.',
        body:
          'Connect your banks, auto-reconcile incoming payments, and watch live accounts receivable update on its own.',
      },
    ],

    usage: {
      eyebrow: 'BUILT FOR USAGE-BASED AND AI-NATIVE BUSINESSES',
      title: 'Pricing is moving to usage. Your billing should too.',
      body:
        'Seat-based pricing was simple, but it\'s fading. Software is billed by consumption, outcomes, tokens, and actions — and AI-native companies live at the far end of that shift. Relvo models any of it: per-unit, per-outcome, tiered, hybrid, or all of them in one contract.',
      chips: ['USAGE-BASED', 'OUTCOME-BASED', 'AI CONSUMPTION'],
    },

    personas: {
      eyebrow: "WHO IT'S FOR",
      title: 'Built for whoever owns the revenue',
      cards: [
        {
          role: 'founder',
          label: 'FOUNDERS ACTING AS CFO',
          body: "Stop running billing out of a spreadsheet you're scared to touch. See what you're owed, always.",
          cta: 'See solution',
        },
        {
          role: 'finance',
          label: 'FINANCE & REVOPS',
          body: 'Close faster, reconcile automatically, and stop revenue from leaking between contract and cash.',
          cta: 'See solution',
        },
        {
          role: 'revenue',
          label: 'HEADS OF REVENUE',
          body: 'Model any pricing — usage, milestone, recurring — without waiting on engineering.',
          cta: 'See solution',
        },
      ],
    },

    integrations: {
      eyebrow: 'INTEGRATIONS',
      title: 'Plugs into the stack you already run',
      line: 'Payment rails, banks, and your usage data — connected, not rebuilt.',
      hubLabel: 'RELVO',
      groups: [
        { id: 'payments', label: 'PAYMENT RAILS', items: ['Stripe', 'Toku', 'Kushki', 'Rebill'] },
        { id: 'banks', label: 'BANKS', items: ['Fintoc', 'Local banks'] },
        { id: 'erp', label: 'ERP / ACCOUNTING', items: ['Via API'] },
        { id: 'crm', label: 'CRM', items: ['Via API'] },
      ],
    },

    closing: {
      title: 'One system, from your first customer to your thousandth',
      ctaPrimary: 'Start free',
      ctaSecondary: 'Talk to us',
    },

    form: {
      title: 'Start free',
      subtitle: 'Tell us about your company and we\'ll set you up. We reply within 24 hours.',
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Work email',
      emailPlaceholder: 'name@company.com',
      company: 'Company',
      companyPlaceholder: 'Your company name',
      role: 'Role',
      rolePlaceholder: 'Select...',
      roleOptions: ['CFO / Finance Director', 'Finance Manager', 'Founder / CEO', 'RevOps', 'Other'],
      problem: 'What problem are you trying to solve?',
      problemOptional: '(optional)',
      problemPlaceholder: 'Briefly tell us about your current setup...',
      submit: 'Submit',
      sending: 'Sending...',
      retry: 'Retry',
      required: 'Required field',
      invalidEmail: 'Invalid email',
      error: 'Something went wrong. Try again or write to contacto@relvoerp.com.',
      successTitle: 'Done! We\'ll be in touch soon.',
      successBody: 'We review your request and write back within 24 hours.',
    },

    footer: {
      tagline: 'Revenue infrastructure for technology companies.',
      rights: 'All rights reserved.',
      address: 'San Patricio 4264, Vitacura\nSantiago, Chile',
      columns: {
        product: {
          title: 'Product',
          links: [
            { label: 'Contracts & usage', anchor: 'contracts' },
            { label: 'Approvals', anchor: 'approvals' },
            { label: 'Invoicing', anchor: 'invoicing' },
            { label: 'Collection', anchor: 'collection' },
            { label: 'Accounts receivable', anchor: 'ar' },
          ],
        },
        solutions: { title: 'Solutions' },
        company: {
          title: 'Company',
          about: 'About us',
          blog: 'Blog',
          contact: 'contacto@relvoerp.com',
        },
        resources: { title: 'Resources', pricing: 'Pricing', docs: 'Docs', login: 'Log in' },
      },
    },

    solutions: {
      index: {
        eyebrow: 'SOLUTIONS',
        title: 'Built for whoever owns the revenue',
        body: 'Three roles feel the same pain in different ways. Pick yours.',
      },
      ctaLine: 'Sound familiar?',
      featuresLabel: 'WHAT RELVO SOLVES',
      roles: {
        founder: {
          label: 'FOUNDERS ACTING AS CFO',
          title: "Stop running billing out of a spreadsheet you're scared to touch.",
          body:
            "You're building product and selling — and you're also the CFO. Every month-end close means days of spreadsheets, collection emails, and manual reconciliation. Relvo runs that cycle for you: see what you're owed, always, without opening Excel.",
          pains: [
            "The month's billing lives in a spreadsheet only you understand.",
            "You don't know what you're owed until you check the bank by hand.",
            'Every new customer adds hours of manual work to the close.',
          ],
          featureIds: ['contracts', 'ar', 'collection'],
        },
        finance: {
          label: 'FINANCE & REVOPS',
          title: 'Close faster, reconcile automatically, no leakage between contract and cash.',
          body:
            'The contract says one thing, the invoice another, and the bank a third. Relvo joins contract, approval, invoice, and payment into one flow with clear status — so the close stops being an investigation.',
          pains: [
            'Approvals and POs get lost across email and chat.',
            'Bank reconciliation happens by hand, line by line.',
            'Revenue leaks in the handoffs and nobody measures it.',
          ],
          featureIds: ['approvals', 'ar', 'invoicing'],
        },
        revenue: {
          label: 'HEADS OF REVENUE',
          title: 'Model any pricing without waiting on engineering.',
          body:
            "Closing a deal with creative pricing shouldn't mean three engineering sprints before you can bill it. Relvo turns contract terms into billing rules — usage, milestone, recurring, or hybrid.",
          pains: [
            'Every new pricing model means manual work or internal development.',
            "Usage or outcome deals don't fit your current tool.",
            'No visibility into which contracts drive which revenue.',
          ],
          featureIds: ['contracts', 'invoicing', 'ar'],
        },
      },
    },
  },
}

export const getLangFromPath = (pathname) => (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es')

// Strip the /en prefix → language-neutral internal key
export const stripLang = (pathname) => {
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  return pathname
}
