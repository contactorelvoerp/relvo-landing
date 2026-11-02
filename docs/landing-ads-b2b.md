# Landing Google Ads — Facturación B2B (`/lp/facturacion-b2b`)

**Fase 1 — Propuesta.** No hay código todavía. Este documento se aprueba línea por línea antes de pasar a Fase 2.

Contexto de campaña: Search, solo Chile, en español. Público: empresas de servicios B2B que facturan una y otra vez a los mismos clientes —con cadencia fija o sin ella— (SaaS/IA, logística, 3PL, última milla, staffing, estudios contables, seguridad, renting de maquinaria). Objetivo único de conversión: agendar demo. Secundario: formulario de contacto. Sin nav ni links de salida.

> **Ajuste de Ricardo (2026-10-31):** "contratos recurrentes" no es el encuadre correcto, porque deja afuera a empresas que facturan varias veces al mismo cliente sin tener una recurrencia fija (ej. una logística que le emite varias facturas al mes al mismo cliente, por envío). El copy de abajo ya está ajustado a "facturar una y otra vez a los mismos clientes", sin exigir cadencia fija.

Todo texto marcado **[PROPUESTA]** no viene del brief ni de copy ya aprobado en otra página: necesita tu OK explícito, línea por línea. El resto es copy ya aprobado (home, precios o páginas de soluciones) reutilizado tal cual, o un dato que me diste directamente en este pedido (precio, implementación, cifras permitidas).

---

## 1. Estructura de secciones

| # | Sección | Propósito |
|---|---|---|
| 1 | **Hero** | Message match inmediato con el anuncio: promesa + CTA único. Decide en 3 segundos si sigue leyendo. |
| 2 | **Para quién es** | Que la persona se reconozca ("esto es para empresas como la mía") sin grilla de cards con íconos — lista de industrias en texto. |
| 3 | **Qué resuelve** | Plantea los dos modelos de cobro (planes recurrentes / contratos con pricing híbrido) y cómo Relvo opera cada uno. Reutiliza copy ya aprobado de las páginas de soluciones. |
| 4 | **Cifras** | Prueba social cuantitativa, sin clientes ni logos inventados. |
| 5 | **Integraciones** | Reduce la objeción "¿se conecta con lo que ya uso?". |
| 6 | **Precio de entrada** | Cumple la promesa "Desde USD 299 al mes" con el plan real (Startup), sin tabla completa de precios. |
| 7 | **Agenda tu demo** | Conversión principal (Cal.com embed) + conversión secundaria (formulario) en la misma sección, sin obligar a elegir. |
| 8 | **Footer mínimo** | Legales y confianza (marca, Start-Up Chile), sin la navegación completa del sitio. |

No hay sección de testimonios/caso de cliente (TGP) porque el caso vive en otras páginas del sitio con su propio contexto; traerlo sin más cifras que las permitidas lo dejaría débil. Si prefieres incluir una mención breve al caso TGP, dímelo y lo sumo entre 4 y 5.

---

## 2. Copy completo

### 2.1 Hero

Sin eyebrow: el brief fija un solo eyebrow en todo el sitio (el del hero de la home); duplicarlo aquí rompería esa regla. Esta sección abre directo con el H1.

- **H1:** `Revenue Engine para B2B: factura, cobra y concilia a los clientes a los que facturas una y otra vez.` **[PROPUESTA]** — combina los dos primeros ganchos del anuncio ("Revenue Engine para B2B" + "Factura, cobra y concilia"), sin encasillar en "contratos recurrentes": una empresa de logística que factura varias veces al mes al mismo cliente, sin una recurrencia fija, también debe reconocerse acá.
- **Subtítulo:** `Planes recurrentes o contratos con pricing híbrido, con tarjeta, transferencia o ambas. Un solo sistema para calcular, facturar, cobrar y conciliar cada peso.` **[PROPUESTA]** — recoge "Planes recurrentes y por uso" y "Contratos con pricing híbrido" del anuncio con la terminología oficial del cliente.
- **CTA primario:** `Agenda una demo` — texto exacto del anuncio, ancla a la sección 7.
- **Visual:** una sola tarjeta (no ventana completa de la app) mostrando una factura con estado "Pagada" y el dato "1.000+ facturas emitidas y conciliadas al mes" como única frase de apoyo — mismo patrón de dato + frase del resto del sitio, sin repetir la composición completa del hero de la home.

### 2.2 Para quién es

- **H2:** `Para empresas B2B que facturan una y otra vez a los mismos clientes.` **[PROPUESTA]** — cambia el encuadre de "contratos recurrentes" a "facturar repetido", para no excluir a quienes cobran varias veces al mismo cliente sin una cadencia fija (ej. logística que emite varias facturas al mes por envío).
- **Lead:** `SaaS e IA, logística, 3PL, última milla, staffing, estudios contables, seguridad y renting de maquinaria: si le facturas más de una vez al mismo cliente, con contrato fijo o sin él.` **[PROPUESTA]** — lista literal de industrias del público de campaña, con el cierre ajustado para no exigir una recurrencia fija. Va como texto corrido o lista en línea, nunca como grilla de cards con ícono por industria (regla cero).
- Sin cards, sin íconos por industria. Si una industria necesita una frase propia más adelante (p. ej. "para 3PL" con su propio dolor), lo vemos en una iteración futura, no en esta LP.

### 2.3 Qué resuelve

- **H2:** `Dos formas de cobrar, un solo motor.` **[PROPUESTA]**
- **Línea puente (nueva):** `¿Facturas siempre lo mismo, cada mes? Eso es un plan recurrente. ¿Facturas varias veces al mismo cliente según lo que pasó —envíos, pedidos, horas, hitos— aunque no tengas una cadencia fija? Eso es un contrato con pricing híbrido.` **[PROPUESTA]** — ayuda a que una empresa como una 3PL, de staffing o de seguridad se ubique en el segundo bloque sin que "contrato" suene a algo que hay que firmar con cadencia fija.
- Dos bloques lado a lado (sin link de salida a `/soluciones/...`, a diferencia de la home):

**Planes recurrentes** — copy tomado tal cual de `content/es/soluciones/planes-recurrentes.json` (aprobado):
> `Planes fijos cobrados cada mes o cada año, con tarjeta, link de pago o transferencia. Facturas, cobranza y conciliación en un solo flujo.`

**Contratos con pricing híbrido** — copy tomado tal cual de `content/es/soluciones/contratos-con-pricing-hibrido.json` (aprobado):
> `Relvo convierte cada condición negociada en reglas, gestiona las órdenes de compra, divide facturas entre sociedades y cobra.`

- Debajo de los dos bloques, visual único: versión compacta de "Tres capas, un solo motor" (Rieles / Agentes / Inteligencia), con el texto ya aprobado de `home/copy.js → layers`. No se inventa copy nuevo acá.
- Sin CTA de salida en esta sección (en la home cada bloque linkea a `/soluciones/...`; en la LP no, para no abrir una salida).

### 2.4 Cifras

Copy tomado de `home/copy.js → stats` para las dos primeras (ya aprobadas, se excluye "2 meses"), más tres cifras nuevas que me diste en este pedido — el dato es tuyo, la redacción exacta es **[PROPUESTA]**:

- **H2:** `Operando hoy en LatAm.` (ya aprobado, home)
- `1.000+` — `facturas emitidas y conciliadas cada mes con Relvo` (ya aprobado)
- `3` — `países en operación: Chile, México y Colombia` (ya aprobado)
- `-70%` — `menos trabajo manual en la operación de cobro` **[PROPUESTA]**
- `2 a 3 días` — `que tu equipo recupera cada mes, en promedio, al dejar de operar el cobro a mano` **[PROPUESTA]** — interpreté "días calle" como tiempo que tu equipo deja de gastar operando a mano. Confírmame si es ese el sentido (ver sección 4, punto 7).
- `Opera y escala` — `sin sumar personas a tu equipo de operaciones` **[PROPUESTA]**
- Quedan 5 cifras en total; en Fase 2 decidimos el layout (dos filas, o una fila más chica) sin volverlo una grilla de cards con ícono.

### 2.5 Integraciones

- **H2:** `Se conecta a lo que ya usas.` (ya aprobado, home)
- Carrusel de logos ampliado para esta LP (reutiliza `src/blocks/Integrations.jsx`, ya portado), con la lista que me diste: **HubSpot, Toku, Fintoc, Sintropix, Odoo, Attio, SII, bancos, Claude, ChatGPT.**
- Esta lista difiere de la del resto del sitio (home: HubSpot, Stripe, Toku, Fintoc, Slack, Google Chat; CLAUDE.md suma Sintropix y MCP). Antes de codificar necesito que confirmes (sección 4, puntos 3 a 5): si Stripe, Slack y Google Chat quedan fuera a propósito, y que Odoo, Attio, SII y "bancos" son integraciones en vivo hoy — el CLAUDE.md exige mostrar solo las que están en vivo, nunca roadmap.
- **MCP** se mantiene como ítem aparte, no como logo (no tiene marca propia): los logos de **Claude** y **ChatGPT** en el carrusel son los que comunican "se usa desde tu asistente de IA", y la línea ya aprobada de abajo sigue haciendo esa llamada a la acción.
- Líneas de salida ya aprobadas, sin cambios: `¿Usas otro sistema? Conéctalo por API` / `¿Trabajas con herramientas de IA? Conecta Relvo vía MCP`.

### 2.6 Precio de entrada

- **H2:** `Desde USD 299 al mes.` **[PROPUESTA]** — título nuevo que repite la promesa exacta del anuncio; el resto de la tarjeta reutiliza datos ya aprobados del plan Startup (`pricing/copy.js`), salvo el "para quién", que ajusto abajo.
- Una sola tarjeta (no la tabla completa de precios):
  - `Startup` — `USD 299 / mes`
  - `Para empresas de servicios B2B con hasta 50 contratos y operación en un solo país.` **[PROPUESTA]** — reemplaza el "para quién" que hoy tiene `/precios` ("Para SaaS e IA que cobran planes fijos...") porque encasilla el precio a una sola industria; me dijiste que aplica a todas las de esta campaña (SaaS/IA, logística, 3PL, última milla, staffing, estudios contables, seguridad, renting de maquinaria) mientras tengan ≤50 contratos y operen en un solo país. Los números "Hasta 50" / "1 país" ya están aprobados en `pricing/copy.js → limits`; lo nuevo es solo cómo los presento en una frase.
  - Incluye (ya aprobado): `Planes mensuales y anuales`, `Facturación electrónica en Chile o México`, `Conciliación de pagos`, `MRR, ARR y recaudación`.
  - Línea nueva: `Implementación en 2 semanas.` — dato que me diste en este pedido, no inventado.
- CTA de la tarjeta: `Agenda una demo` (ancla a sección 7), no "Ver precios" ni "Crear cuenta".
- **Quito la línea de salida** `¿Cobras con contrato, uso u órdenes de compra? Hablemos.` de la versión anterior: si el Startup ya cubre a quien factura con pricing híbrido mientras tenga ≤50 contratos, esa línea sobra. Pero tengo una duda abierta antes de confirmar esto (sección 4, punto 8): hoy en `/precios`, "Pricing híbrido" y "Órdenes de compra" figuran solo como funciones de "A medida", no de Startup. Necesito que me confirmes si una logística o staffing con ≤50 contratos que cobra con OC/pricing híbrido entra en Startup igual, o si para ese caso sigue siendo "A medida" aunque el volumen sea bajo.

### 2.7 Agenda tu demo

- **H2:** `Agenda tu demo.` **[PROPUESTA]**
- **Lead:** `Una sesión de 30 minutos con tu caso: cómo cobras hoy y cómo lo automatiza Relvo.` **[PROPUESTA]**
- Embed de Cal.com inline (evento "Demo Relvo", link pendiente — ver sección 4).
- Debajo o al lado, opción secundaria: `¿Prefieres que te contactemos nosotros?` **[PROPUESTA]** + formulario de contacto reutilizando `LeadForm.jsx` tal cual (mismos campos: nombre, email, empresa, cargo, problema opcional), con `fuente="lp-facturacion-b2b"` y botón `Enviar` (o el texto que ya usa el componente).

### 2.8 Footer mínimo

- Logo de Relvo (oficial, del Design System; sin link, para no abrir una salida de la página — a confirmar, ver sección 4).
- Línea de datos ilustrativos (la del DS, ya aprobada): `Las pantallas de producto muestran datos ilustrativos.` — solo si el hero/visual de la sección 2.3 usa algún dato de ejemplo; a confirmar si aplica.
- Legales: `Términos` y `Privacidad` (páginas ya existentes).
- Dominio (`getrelvo.ai`), igual que el Footer actual.
- **Sin** las columnas de Producto / Soluciones / Casos de uso / Recursos del Footer actual: esas son links de salida que la LP no debe tener. Esto implica un componente de footer nuevo y más chico (`LpFooter`), no el `Footer.jsx` actual.

---

## 3. Componentes de referencia a reutilizar

| Componente | De dónde | Dónde se usa en esta LP | Cómo |
|---|---|---|---|
| `src/pages/home/ThreeLayers.jsx` (`relvo-tres-capas`) | Ya portado al repo | Sección "Qué resuelve" | Tal cual, con el copy ya aprobado de `layers` en `home/copy.js`. Es la única "tarjeta" de esa sección (cumple la regla de una tarjeta por sección). |
| `src/blocks/Integrations.jsx` | Ya portado (`relvo-integraciones-carrusel.html`) | Sección "Integraciones" | Tal cual, sumando Sintropix, Odoo, Attio, SII, bancos, Claude y ChatGPT al array `LOGOS`/`names` (MCP queda fuera del carrusel, ver 2.5). **No** uso `relvo-integraciones-orbita.html` que menciona el CLAUDE.md: la órbita la rechazaste el 2026-10-03 y la reemplazamos por este carrusel, que es lo que ya está construido y aprobado. |
| `src/components/Texture.jsx` / `BandTexture.jsx` (`relvo-texturas`) | Ya portados | Fondo de cada sección | Tal cual: una textura generativa por sección, pausada fuera de pantalla y desactivada con `prefers-reduced-motion`, como en el resto del sitio. |
| `src/components/LeadForm.jsx` | Ya existe | Sección "Agenda tu demo" (conversión secundaria) | Tal cual, sin cambios de campos; solo cambia `fuente`. |
| Tarjeta de factura del hero (`HeroStage.jsx`, composición del prototipo v2) | Ya existe en la home | Visual del Hero (2.1) | Adaptada: solo la tarjeta de factura con estado "Pagada", sin el resto de la composición (tokens → factura → pago), para respetar "una tarjeta, un dato, una frase". |
| Tarjeta de plan (`PricingPage.jsx`) | Ya existe en `/precios` | Sección "Precio de entrada" (2.6) | Solo la tarjeta del plan Startup, sin la tabla completa ni el comparador con "A medida". |

No se crean componentes visuales nuevos desde cero: todo sale de piezas ya construidas y aprobadas en el sitio. Lo único nuevo es un footer reducido (`LpFooter`, sin columnas de navegación) y el ensamblaje de la página (`src/landing-ads/...` o donde decidamos que viva, fuera de la plantilla genérica `LandingPage` porque esta página no lleva subnav ni menú).

---

## 4. Lo que me falta de ti

1. Link del evento de Cal.com "Demo Relvo" (ya avisado como pendiente).
2. ID/label de las acciones de conversión de Google Ads: `generate_lead` y `demo_agendada` (ya avisado como pendiente).
3. **Logos que no existen hoy** en `public/logos/integrations/`: Sintropix, Odoo, Attio, SII, Claude, ChatGPT, y el/los logo(s) de banco para "bancos" — ¿cuáles bancos exactamente? (hoy solo existen HubSpot, Stripe, Toku, Fintoc, Slack, Google Chat).
4. **¿Odoo, Attio, SII y "bancos" son integraciones en vivo hoy?** El CLAUDE.md es explícito: solo se muestran integraciones en vivo, nunca roadmap. Antes de ponerlas en el carrusel necesito tu confirmación de que están realmente operativas (Attio en particular: por lo que tengo entendido es el CRM interno de Relvo para sus propios leads, no algo que tus clientes conecten — confírmame si además es una integración de producto para clientes).
5. **¿Stripe, Slack y Google Chat se quedan fuera del carrusel de esta LP** (tu lista nueva no las menciona), **o las sumamos también** junto con las nuevas?
6. **Tratamiento de MCP** que propongo en 2.5: aparte del carrusel, sin logo propio, apoyado por los logos de Claude y ChatGPT. Avísame si lo prefieres distinto.
7. **Redacción exacta de "2 a 3 días calle al mes":** interpreté que es tiempo que tu equipo deja de gastar operando a mano (ver 2.4). Confírmame si es ese el sentido o si te referías a otra cosa.
8. **Plan Startup y pricing híbrido:** hoy en `/precios`, "Pricing híbrido" y "Órdenes de compra" figuran solo como funciones de "A medida", no de Startup, aunque el límite de Startup sea "hasta 50 contratos" sin distinguir el tipo de cobro. Para decir en esta LP que el precio de entrada sirve para logística/staffing/seguridad que cobran con OC o pricing híbrido (mientras tengan ≤50 contratos), necesito que confirmes si eso es así hoy en el producto, o si esos casos siguen necesitando "A medida" aunque el volumen sea bajo.
9. Relacionado con el punto anterior: el "para quién" del plan Startup en `/precios` (página pública, no solo esta LP) hoy dice "Para SaaS e IA..." — si el precio de entrada en realidad sirve para todas las industrias de esta campaña, ¿también actualizamos esa frase en `/precios`, o la dejamos así y esta LP simplemente usa una frase distinta para el mismo plan?
10. **Aprobación línea por línea** de todo lo marcado [PROPUESTA] arriba (hero, "para quién", "qué resuelve", cifras nuevas, precio de entrada, "agenda tu demo").
11. ¿El logo del footer va sin link, o prefieres que lleve a la home en una pestaña nueva?
12. Title, meta description, OG y canonical de esta página: no existen en `seo-metadata.json`. Propongo: `Title: "Revenue Engine para B2B | Relvo"`, `Description: "Factura, cobra y concilia a los clientes a los que facturas una y otra vez. Planes recurrentes o pricing híbrido, desde USD 299 al mes. Agenda una demo."` — confírmamelo o ajústalo.
13. ¿Confirmas que no se incluye el caso de TGP (ver nota al final de la sección 1)?
14. Moneda e impuestos del precio: la FAQ de `/precios` tiene esas dos preguntas pendientes (`[PENDIENTE]`). No bloquea esta página, pero puede salir en la demo.

Quedo esperando tu aprobación de este documento antes de pasar a Fase 2 (construcción, ruta, SEO técnico y medición).
