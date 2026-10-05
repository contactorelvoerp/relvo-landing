# Relvo: formato de contenido para páginas de plantilla

Una sola plantilla de landing construida con bloques. Cada página es un archivo de contenido:

```
content/
  es/producto/cuentas-por-cobrar.json
  es/soluciones/planes-recurrentes.json
  es/clientes/tgp.json
  en/product/accounts-receivable.json   (cuando exista la traducción)
```

La plantilla lee el archivo, renderiza los bloques en orden en el servidor (SSR/SSG) y genera la metadata, el JSON-LD y la imagen Open Graph. Una página nueva es un archivo nuevo, no código nuevo.

## 1. Estructura del archivo

```json
{
  "id": "cxc",
  "preset": "producto",
  "seo": "cxc",
  "keyword": "facturación, cobranza y conciliación",
  "breadcrumb": [
    { "label": "Inicio", "href": "/" },
    { "label": "Producto", "href": "/producto" },
    { "label": "Cuentas por cobrar" }
  ],
  "blocks": [ { "type": "hero", "...": "..." } ]
}
```

| Campo | Qué es |
|---|---|
| `id` | Identificador único de la página |
| `preset` | `producto`, `solucion` o `caso`. Define el orden sugerido de bloques |
| `seo` | El `id` de la página en `seo-metadata.json` (title, description, URLs ES/EN) |
| `keyword` | Palabra clave principal. Debe aparecer de forma natural en el H1 o la intro y en un H2. No se repite como principal en otra página |
| `breadcrumb` | Migas de pan visibles. Generan el `BreadcrumbList` |
| `subnav` | `true` muestra una barra secundaria fija bajo el menú principal, como en Stripe: nombre de la página a la izquierda y anclas a las secciones (cada bloque con `h2` genera su ancla), más un link a Docs a la derecha |
| `blocks` | Lista ordenada de bloques |

## 2. Bloques

Todos los bloques con título usan el formato de dos tonos: `h2` (negro) + `h2Soft` (gris, máximo 10 palabras, opcional).

### `hero`
```json
{ "type": "hero", "h1": "…", "lead": "… (máx. 30 palabras)", "intro": "… (40 a 70 palabras, bajo el hero, opcional)",
  "ctas": [{ "label": "Agendar demo", "href": "/agendar-demo", "style": "primary" },
           { "label": "Ver precios", "href": "/precios", "style": "secondary" }],
  "visual": { "id": "heroApp", "data": { } } }
```
El H1 de las páginas internas va en Instrument Sans (Fujiwara A es solo para el H1 de la home).

**`layout: "centered"`** (obligatorio en todas las páginas internas; el hero de la home es el único con texto a la izquierda y visual a la derecha). Inspirado en las páginas de producto de Stripe:
- Migas de pan, H1 (más chico que el de la home, en dos tonos si aplica), lead y CTAs, **todo centrado**, con un ancho máximo de ~760px.
- Debajo, el visual **a todo el ancho del contenedor**, como una ventana de producto que se corta un poco en el borde inferior del hero y entra en la sección siguiente.
- El `intro` va como un párrafo centrado bajo el visual.

### `beforeAfter` (nuevo)
```json
{ "type": "beforeAfter", "h2": "…", "h2Soft": "…",
  "before": ["…", "…", "…"], "after": ["…", "…", "…"] }
```
Tres puntos por lado, en paralelo: cada "después" responde a su "antes".

### `steps`
```json
{ "type": "steps", "h2": "Cómo funciona.", "h2Soft": "…",
  "steps": [{ "title": "Factura", "text": "…" }, { "title": "Cobra", "text": "…" }, { "title": "Concilia", "text": "…" }] }
```
Siempre 3 pasos, unidos por el riel. Fondo menta.

### `featureTabs`
```json
{ "type": "featureTabs", "h2": "…", "h2Soft": "…",
  "tabs": [{ "label": "Facturación compleja", "desc": "… (máx. 8 palabras)", "visual": { "id": "splitInvoice", "data": { } } }] }
```
De 3 a 4 tabs. Cada uno con su visual de la librería.

### `capabilities` (nuevo)
```json
{ "type": "capabilities", "h2": "…", "h2Soft": "…",
  "items": [{ "title": "Idempotencia", "text": "… (una línea)" }] }
```
De 4 a 6 capacidades concretas en una grilla de 2 o 3 columnas: título en negrita y una línea. Sin íconos ni tarjetas. Es donde vive el detalle técnico de cada producto.

### `metrics`
```json
{ "type": "metrics", "h2": "…", "h2Soft": "…",
  "kpis": [{ "label": "Días en facturar (DTI)", "value": "3" }],
  "note": "…", "chart": { "id": "lineChart", "data": { } } }
```

### `case`
```json
{ "type": "case", "ref": "tgp", "h2": "Lo que cambió para TGP." }
```
Lee los datos del caso desde `content/es/clientes/tgp.json`. Se omite si el caso no tiene datos reales.

### `related`
```json
{ "type": "related", "h2": "Funciona junto con.", "h2Soft": "…", "items": ["contratos", "aprobaciones", "reporteria"] }
```
Tres páginas. Toma título, descripción y mini visual de la tarjeta del bento de la home. Es el enlazado interno principal.

### `faq` (nuevo)
```json
{ "type": "faq", "h2": "Preguntas frecuentes sobre …",
  "items": [{ "q": "…", "a": "…" }] }
```
De 4 a 6 preguntas reales del tema. Genera `FAQPage` en JSON-LD con exactamente el mismo texto visible.

### `quote` (solo preset caso)
```json
{ "type": "quote", "ref": "tgp", "variant": "full" }
```

### `integrations` y `cta`
```json
{ "type": "integrations" }
{ "type": "cta" }
```
Iguales en todo el sitio. No cuentan como contenido propio de la página.

## 3. Librería de visuales

Todos son componentes de UI estilo producto (como Stripe), con datos ilustrativos (clientes ficticios, números coherentes). Sin etiqueta "Ejemplo": el aviso va una sola vez en el footer. Se reutilizan cambiando solo `data`.

| `id` | Qué muestra | `data` principal |
|---|---|---|
| `heroApp` | Ventana de la app + 1 o 2 tarjetas encima + notificación | `url`, `section`, `kpi`, `rows[]`, `card`, `toast` |
| `planCard` | Plan con precio, líneas y barra de tramos | `plan`, `price`, `lines[]`, `tiers`, `total` |
| `timeline` | Pasos con checks | `title`, `steps[] {label, sub, done}` |
| `splitInvoice` | Factura dividida en proporciones | `invoice`, `total`, `parts[] {entity, amount, pct}`, `glosa` |
| `payment` | Monto pagado, barra y eventos | `invoice`, `paid`, `total`, `events[]` |
| `emailPreview` | Correo de cobranza + calendario de envíos | `to`, `subject`, `body`, `schedule[]` |
| `methods` | Medios de pago con proveedor | `methods[] {label, provider, selected}`, `total` |
| `agentFeed` | KPIs + registro de tareas + caso de revisión | `kpis[]`, `items[]`, `review` |
| `usage` | Tokens con barra e histograma | `unit`, `price`, `used`, `included`, `series[]` |
| `barChart`, `lineChart`, `waterfall` | Gráficos de Inteligencia | `series[]`, `labels[]` |
| `review` | Caso de revisión: dos valores lado a lado y acciones | `title`, `left`, `right`, `actions[]` |
| `codeBlock` | Bloque de código para integraciones | `lang`, `code`, `note` |
| `caseHeadline` | Resultado grande del caso | toma los datos de `case` |
| `slackMessage` | Mensaje en un canal de Slack con la respuesta de Relvo | `channel`, `author`, `time`, `text`, `reply {author, text}` |
| `dtiBars` | Barras de días antes/después | `before`, `after`, `label` |
| `composition` | Combina 2 o 3 visuales superpuestos (como el hero de la home) | `pieces[]` (cada una con `id` y `data`) |

Si una página necesita algo que no está en la librería, se pide antes de crear un visual nuevo.

## 4. Presets (orden sugerido)

- **producto:** hero (centrado) → beforeAfter → steps → featureTabs → capabilities → metrics (opcional) → case (opcional) → related → faq → cta
- **solucion:** hero → beforeAfter (el dolor del segmento) → steps (cómo lo resuelve) → related (productos clave) → case (opcional) → faq → cta
- **caso:** hero (resultado grande) → beforeAfter → metrics → cita → related (productos que usa) → cta

## 5. Fuente de las afirmaciones de producto

Todo lo que una página afirma del producto debe estar respaldado por la documentación de Relvo (app.relvoerp.com/docs/product) o el brochure. Si la web y la documentación dicen cosas distintas, manda la documentación y se pregunta. Ejemplo: la conciliación **propone** el match con su evidencia y **una persona confirma**; no es 100% automática.

## 6. Reglas de SEO del contenido

- **Entre 450 y 700 palabras propias por página**, sin contar bloques compartidos (integraciones, CTA, navegación). La profundidad extra va en la FAQ (acordeón, indexable) y en la intro, no en más bloques de texto visibles: la página se mantiene liviana.
- **Nada de texto intercambiado:** dos páginas no pueden compartir frases salvo en los bloques compartidos.
- **Una palabra clave principal por página** (`keyword`), en el H1 o la intro y en un H2, de forma natural.
- **FAQ visible = FAQ en JSON-LD.** Nunca marcado estructurado sin su texto en la página.
- **Enlazado interno:** `related` y las migas de pan siempre presentes en producto y solución.
- **JSON-LD por página:** `BreadcrumbList`, `SoftwareApplication` (producto y solución) y `FAQPage` (si hay FAQ).
- **Open Graph:** imagen generada automáticamente con el H1 sobre fondo de marca.
- **Regla cero:** sin palabras vacías y sin cifras inventadas sobre Relvo o sus clientes. Los datos de los visuales son ilustrativos y se avisan una sola vez en el footer.
