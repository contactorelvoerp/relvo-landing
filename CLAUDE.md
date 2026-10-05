# Relvo — Web 3.0 (getrelvo.ai)

Refactor total del sitio público de Relvo. La web actual NO es base: estructura, secciones, copy y visuales salen del brief.

## Fuentes de verdad (en este orden)
1. Brief maestro en Notion: "Web 3.0" (Relvo Wiki). Secciones clave: 4b regla cero, 5.x decisiones, 6.x menú, 7.x home y plantillas, 8 design system, 9 técnico.
2. Subpáginas: "Copy — Páginas de producto", "Estructura — Página de precios", "Brief — Ilustraciones de la home".
3. Design System v1.4 (Claude Design) y mockup aprobado de la home.
4. Componentes de referencia (código para portar tal cual): `relvo-texturas.html`, `relvo-tres-capas.html`, `relvo-integraciones-orbita.html`.
5. `seo-metadata.json`: URLs, titles y meta descriptions de cada página en ES y EN. Se usan tal cual.

Si algo no está en el brief, no va en la web. Si falta un texto, se pide; no se inventa.

## Reglas de contenido
- Copy exacto del brief. No reescribir ni "mejorar" textos.
- Nunca inventar cifras, clientes, citas ni logos. Todo lo marcado `[PENDIENTE]` se renderiza como placeholder visible en preview y NO se publica en producción (secciones condicionales se ocultan).
- Datos de ejemplo en visuales: marcados como ejemplo, nombres ficticios.
- Para el cliente se dice "Planes recurrentes" y "Contratos con pricing híbrido". PLG/SLG son términos internos.
- Prohibido: "product-led scale / sales-led complexity" (frase de Metronome) y palabras vacías (potencia, revoluciona, sin fricción, seamless, next-gen, desbloquea).
- Integraciones visibles: solo las en vivo (HubSpot, Sintropix, Stripe, Toku, Fintoc, Slack, Google Chat, MCP).

## Regla cero: prohibido el AI slop
- Sin degradados, blur, glow, glassmorphism, cards dentro de cards, grillas de 3 cards con ícono, ilustraciones abstractas genéricas ni fotos stock.
- Un solo eyebrow en todo el sitio: el del hero de la home.
- Filetes: máximo uno por sección (el que la abre). Los filetes con significado (2px dato exacto, punteado inferido, doble total) solo dentro de visuales de producto.
- Una textura generativa por sección y una sola tarjeta encima (un dato + una frase).
- Movimiento lento, con propósito, pausado fuera de pantalla y desactivado con `prefers-reduced-motion`.
- Test: si una sección podría estar en la web de otro SaaS cambiando el logo, se rehace.

## Design tokens (DS v1.4, solo modo claro)
- Acento único: verde #186666 (hover #2E8080, pressed #0F4A4A). Menta #DFF4EB. Positivo #3F7A1C. Requiere revisión: tono ámbar del DS.
- Texto: #13131E (nunca negro puro), jerarquía de 4 niveles; #ABABB7 nunca como texto sobre blanco. Contraste mínimo 4,5:1.
- Tipografía: Fujiwara A SOLO para el H1 del hero de la home (licencia web comprada, fallback sans-serif). Todos los demás títulos y textos en Instrument Sans. Números en Instrument Sans con cifras tabulares (no monoespaciada).
- Acento de uso: morado de la paleta Relvo #633BF2 (suave: tint lila #E6DCEF; secundario: lila vivo #E3C0F2). Solo para representar consumo/uso (tokens, llamadas, barras y series de consumo). Nunca en botones, CTAs ni texto largo.
- Radios 4–10px, sombras mínimas. Modo oscuro: fuera del MVP (las bandas oscuras de la home no son modo oscuro).

## Flujo de trabajo
- Una rama y un PR por fase o sección. Cada PR genera preview en Vercel para revisión de Ricardo.
- Push directo a `main` solo para fixes urgentes de una línea, con build local previo.
- Cero código legacy: al reemplazar una sección se borra en el mismo PR todo lo que quede sin uso (componentes, estilos, assets, rutas, dependencias), en un commit aparte `chore: remove legacy <sección>`. Detectar con `knip` y búsqueda de assets sin referencias; si algo externo podría depender de eso, preguntar antes.
- Toda URL pública eliminada o renombrada lleva redirect 301.

## Definición de terminado (cada PR)
- Build sin errores.
- `knip` limpio.
- `npx impeccable detect` sin findings (gate en CI).
- Redirects probados.
- Revisado en desktop (1440) y mobile (390), y con movimiento reducido.
- Copy idéntico al brief.
- SEO de cada página nueva o modificada: title y description únicos, canonical, hreflang, OG, JSON-LD válido, un solo H1, sin links rotos.
- Lighthouse en mobile: SEO 100, Accesibilidad ≥ 95, Rendimiento ≥ 90, Core Web Vitals en verde.

## Técnico
- Producción indexable; previews de Vercel con noindex (controlado por `VERCEL_ENV`).
- i18n ES (principal) / EN desde el inicio.
- Dominio único getrelvo.ai (blog y docs incluidos), con redirects desde relvoerp.
- Leads: formulario → API route en Vercel → tabla `leads` en Supabase → webhook → Edge Function que crea/actualiza persona y empresa en Attio y avisa en Slack. Ninguna API key en el navegador. Anti-spam con honeypot o Turnstile.
- Analytics: métricas de éxito = formularios enviados y demos agendadas (eventos de conversión).
## SEO: fundamental, no opcional
El SEO es una pieza central del proyecto. La web actual tiene fallas de SEO (incluido un noindex en producción), así que no se asume nada: cada pieza se implementa, se verifica y se mide. Una página no está terminada si su SEO no funciona.

**Indexación y URLs**
- Un solo host canónico: `https://getrelvo.ai`. `www`, `http` y los dominios `relvoerp` (app/blog) redirigen con 301 donde corresponda.
- Canonical absoluto y autorreferente en cada página. Barra final consistente en todo el sitio.
- `robots.txt` que permite producción y apunta al sitemap. Noindex solo en previews (`VERCEL_ENV`).
- Mapa de redirects 301 desde cada URL de la web actual a su equivalente nueva. Ninguna URL indexada queda en 404.
- Página 404 real (status 404, no 200).

**Contenido renderizado**
- Todo el texto importante va en el HTML inicial (SSR o SSG), no solo en JavaScript del cliente. Nada de texto relevante dentro de canvas, SVG decorativos o imágenes.
- Un solo H1 por página y jerarquía H2/H3 lógica.
- Texto alternativo descriptivo en imágenes con contenido (ES y EN); las decorativas con `alt=""` o `aria-hidden`.

**Metadata (por página e idioma)**
- Title único (máx. ~60 caracteres) y meta description única (máx. ~155), tomados del brief. Si faltan, se piden.
- Open Graph y Twitter Card con imagen propia 1200×630 por página.
- `lang` correcto en `<html>`, `hreflang` es / en / x-default recíprocos y URLs por idioma (`/en/...`).

**Datos estructurados (JSON-LD, validados con Rich Results Test)**
- `Organization` (nombre, logo, sameAs) y `WebSite` en todo el sitio.
- `SoftwareApplication` en home y producto. `BreadcrumbList` en páginas internas.
- `FAQPage` solo donde haya preguntas frecuentes visibles en la página.

**Sitemap**
- `sitemap.xml` generado automáticamente con todas las páginas públicas en ambos idiomas y `lastmod` real. Se envía a Google Search Console.

**Rendimiento (Core Web Vitals, medido en mobile)**
- LCP < 2,5 s, INP < 200 ms, CLS < 0,1.
- Fuentes con `font-display: swap` y precarga de las críticas. Imágenes en AVIF/WebP con dimensiones declaradas; lazy load bajo el pliegue.
- Texturas y animaciones no bloquean el render y se pausan fuera de pantalla.

**Enlaces**
- Enlazado interno entre home, producto, soluciones y precios, con texto de enlace descriptivo (nunca "clic aquí").
- Cero links rotos (chequeo automático en CI).

**GEO (buscadores con IA)**
- `llms.txt` con la descripción de Relvo, productos y páginas clave.
- Nombre de la entidad consistente en todo el sitio: "Relvo".
- No bloquear a los crawlers de IA salvo que Ricardo indique lo contrario.

**SEO sin slop**
- Nada de keyword stuffing, texto oculto, páginas generadas en masa ni contenido de relleno para posicionar.
- Nada de datos estructurados falsos (reseñas, ratings o FAQs que no estén en la página).
- Titles y descriptions escritos para personas, con el posicionamiento real de Relvo. Prohibido lo genérico tipo "La mejor plataforma de facturación con IA".

**Medición**
- Google Search Console verificado (dominio completo) y sitemap enviado.
- Revisar cobertura e indexación después de cada deploy grande.

- Title/OG de la home: "Relvo | Revenue Engine para SaaS e IA".
