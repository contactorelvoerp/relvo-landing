# Relvo — Web 3.0 (getrelvo.ai)

`CLAUDE.md` is the canonical instruction file. `AGENTS.md` is a relative symlink
to it so Codex and Claude Code read the same rules. Edit this file and preserve
the alias.

## One worktree and branch per agent thread

These rules apply to Codex and Claude Code, including threads already in progress.
Read-only investigation, searches and planning may use the current checkout.
Before the first edit, generator, dependency install or other command that writes
files, create or resume a worktree and branch owned by this thread. Do not create
a new worktree for every follow-up in the same thread.

- The primary checkout is the user's integration checkout, even when it has a
  feature branch checked out. Do not implement tasks there by default.
- Work directly on `main` or in the primary checkout only when the user explicitly
  asks for it for this task. Small or urgent fixes are not an exception. Permission
  to merge or deploy does not imply permission to develop in the shared checkout.
- Inspect `git status --short`, `git branch --show-current` and `git worktree list`
  before writing. Resume an existing worktree only when it belongs to this thread;
  a similar task name is not proof of ownership.
- Use a unique `agent/<task-slug>` branch and a sibling directory under
  `../relvo-landing-worktrees/`. If either name exists, choose a unique suffix;
  never force reuse, reset an existing branch or remove another thread's worktree.
- Run all subsequent edits, installs, generators, tests, builds and commits in
  that worktree. Set each command's working directory explicitly; a `cd` in one
  tool call may not persist in the next. Use absolute paths for file-editing tools.
- Never stash, reset, clean, switch branches, merge, apply stashes or change files
  in another thread's checkout to unblock your task. Do not copy unrelated pending
  changes into your worktree. If you accidentally edited the shared checkout,
  identify your exact changes before moving them; preserve everyone else's work.
- Keep dependencies and generated output local to each worktree. Do not symlink
  `node_modules`, `dist`, `dist-ssr` or source directories between checkouts.
  Install with `npm ci --prefer-offline` in your worktree only when needed.
- Use a free port for your preview. Do not stop or replace another thread's server.
- Commit and publish from the worktree where you edited. Do not copy changes back
  into the primary checkout as a publishing shortcut. Keep the worktree for
  review; report its path and branch in the handoff. Remove it only when its work
  is merged or intentionally discarded and it has no pending files or unpublished
  commits. Never use forced worktree removal.

### Creating the worktree

Find the primary checkout with `git worktree list`; do not assume the current
directory is the primary checkout. For a new independent task, fetch `origin`
and base the branch on local `main` if it contains `origin/main`, otherwise on
`origin/main`. This preserves local integration commits without starting behind
the remote. If fetching is unavailable, report that and use the available local
base without claiming it is current. For an explicit continuation of a feature,
use that feature's committed revision instead; pending files are not included.

Example, replacing the paths and slug with this repository's actual primary
checkout and a unique task name:

```bash
git -C /path/to/relvo-landing fetch origin
git -C /path/to/relvo-landing merge-base --is-ancestor origin/main main
# Exit 0: use main below. Exit 1: use origin/main. Other errors: inspect first.
git -C /path/to/relvo-landing worktree add \
  -b agent/<unique-task-slug> \
  /path/to/relvo-landing-worktrees/<unique-task-slug> main
```

Then explicitly use the new directory for every writing command and verify its
branch and status before starting implementation. If the user explicitly asks
to work on `main`, inspect pending changes first and preserve unrelated work;
that exception does not authorize destructive cleanup or a production push.

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
- Datos ilustrativos en visuales: nombres de clientes ficticios y números coherentes entre sí. SIN etiqueta "Ejemplo" en los visuales; en su lugar, una sola línea en el footer: "Las pantallas de producto muestran datos ilustrativos."
- Logo: usar siempre el logo oficial del Design System. Nunca recrearlo con formas.
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

## Skills: prioridad y alcance
- Este archivo manda. Si un skill contradice CLAUDE.md o tokens.css, gana CLAUDE.md.
- Invocar skills por nombre; no depender de la activación automática.
- taste-skill decide composición, layout, escala tipográfica y ritmo. NO elige colores, fuentes ni radios (salen de tokens.css), NO propone fotos stock, degradados, blur ni glow.
- Componentes: reutilizar src/blocks, src/visuals y src/components antes de crear nada nuevo. Impeccable (/audit, /polish) revisa la implementación; better-ui solo ajusta detalles dentro de tokens.css.
- Rendimiento: lo controla el CI del repo (Lighthouse mobile, knip, check:links), no un skill.
- Copy (hormozi): solo cifras, clientes y citas ya aprobados (1.000+ facturas/mes, 3 países, 80% menos tiempo, TGP 6→3 días y 70%, 2 semanas de implementación, desde USD 299). Prohibido inventar garantías, urgencia, escasez, bonos o testimonios. Todo copy nuevo se marca [PROPUESTA] hasta que Ricardo lo apruebe.
- Impeccable (npm run check:design) es el gate final; ningún skill lo reemplaza ni lo desactiva.
- Flujo: copy (hormozi) → dirección (taste-skill) → build con componentes existentes → Impeccable /audit y /polish → CI.

## Design tokens (DS v1.4, solo modo claro)
- Acento único: verde #186666 (hover #2E8080, pressed #0F4A4A). Menta #DFF4EB. Positivo #3F7A1C. Requiere revisión: tono ámbar del DS.
- Texto: #13131E (nunca negro puro), jerarquía de 4 niveles; #ABABB7 nunca como texto sobre blanco. Contraste mínimo 4,5:1.
- Tipografía: Fujiwara A SOLO para el H1 del hero de la home (licencia web comprada, fallback sans-serif). Todos los demás títulos y textos en Instrument Sans. Números en Instrument Sans con cifras tabulares (no monoespaciada).
- Acento de uso: morado de la paleta Relvo #633BF2 (suave: tint lila #E6DCEF; secundario: lila vivo #E3C0F2). Solo para representar consumo/uso (tokens, llamadas, barras y series de consumo). Nunca en botones, CTAs ni texto largo.
- Radios 4–10px, sombras mínimas. Modo oscuro: fuera del MVP (las bandas oscuras de la home no son modo oscuro).

## Flujo de trabajo
- Una rama y un PR por fase o sección. Cada PR genera preview en Vercel para revisión de Ricardo.
- Trabajar directamente en `main` o en el checkout principal requiere una petición explícita del usuario para esa tarea (ver las reglas de worktrees arriba). Los fixes urgentes también usan worktree por defecto; publicar o desplegar requiere autorización dentro del alcance de la tarea.
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

- Title/OG de la home: "Relvo | Facturación y cobranza automatizadas".
