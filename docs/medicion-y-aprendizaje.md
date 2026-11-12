# Medición y aprendizaje del sitio

Cómo el sitio mide lo que pasa, cómo cada lead llega al CRM y cómo lo que pasa en el CRM vuelve a Google Ads y a los reportes. El objetivo es saber qué páginas, campañas y mensajes traen **clientes**, no solo formularios.

```
Visita ──► GA4 (eventos, web vitals, canales)          Google Ads ◄── feed CSV diario (api/ads-conversions.js)
  │                                                        ▲
  ▼                                                        │ gclid + etapa
Formulario ──► /api/lead ─────────────┐                    │
Reserva Cal.com ──► webhook firmado ──┴──► Supabase `leads` ┤   (la reserva además registra demo_booked)
  (api/cal-booking.js)                    │  webhook       │
                                          ├──► /api/lead-notify ──► Slack #ventas
                                          └──► Edge Function lead-to-attio ──► Attio (persona + empresa + nota)
                                                                                   │ workflow por etapa
                                          Supabase `distribution_outcomes` ◄── /api/distribution-outcome
```

## 1. Eventos que manda el sitio (GA4)

Todos salen de `src/analytics.js` y `src/components/LeadForm.jsx`. Solo en producción (`VERCEL_ENV=production`): los previews no cargan ningún tracking. Ningún evento lleva datos personales ni IDs de clientes.

| Evento | Cuándo | Parámetros |
|---|---|---|
| `generate_lead` (**key event**) | Formulario guardado en Supabase | `form`, `locale`, `plan` / `intent` cuando vienen de precios |
| `demo_agendada` (**key event**) | Reserva hecha en el calendario de Cal.com (`/agendar-demo`, `/en/book-a-demo`, `/lp/facturacion-b2b`, `/powered-by-relvo`) | `form`, `locale`, `plan` / `intent` cuando vienen de precios |
| `calendar_view` | Calendario listo para reservar, una vez por página (no significa reserva iniciada) | `form`, `locale`, `plan` / `intent` si existen |
| `calendar_error` | Fallo al cargar el calendario o timeout; se muestra el enlace de respaldo | `form`, `locale`, `reason` (`load` / `timeout`) |
| `form_start` | Primer foco en un formulario | `form`, `locale` |
| `form_error` | Validación fallida o error al enviar | `form`, `locale`, `reason` (`validation` / `server`) |
| `cta_click` | Click en un botón (`.btn`) o en cualquier link a la demo | `placement` (id de la sección, `hero`, `nav`, `footer`), `destination` (ruta o dominio) |
| `scroll_depth` | 25 / 50 / 75 / 100 % de la página, una vez cada uno | `percent` |
| `LCP`, `INP`, `CLS`, `FCP`, `TTFB` | Core Web Vitals de usuarios reales (librería `web-vitals`) | `value`, `metric_rating`, `metric_value`, `page_path` |
| `powered_by_*` | Embudo de distribución (PDF de facturas). `form_start` también se guarda en Supabase como `powered_by_form_start` | ver `docs/` del embudo y `shared/attribution.js` |

Además: la conversión de Google Ads de `/lp/facturacion-b2b` (`ads-conversion.js`) y el evento `scroll` al 90 % de la medición mejorada de GA4.

### Configurar la propiedad de GA4

`scripts/configure-analytics.mjs` deja la propiedad como la necesita el sitio: key events (`generate_lead`, `demo_agendada`), dimensiones personalizadas de los parámetros de arriba y un grupo de canales "Relvo distribution" que separa **Powered by Relvo** y **AI assistants** (ChatGPT, Perplexity, Claude, Gemini, Copilot, etc.) del resto. No toca el grupo de canales principal. Valida que el stream web corresponda a `G-3612NJ7H02` (o `GA_MEASUREMENT_ID`) antes de modificar nada. Desactiva las interacciones automáticas de formularios y los pageviews por cambios de historial: el formulario ya emite sus propios eventos y el sitio navega con documentos completos. También desactiva los clicks salientes automáticos: el enlace de respaldo de Cal.com contiene metadata de atribución, incluidas referencias opacas que no deben entrar en GA4, y esos eventos enviarían el URL completo. `cta_click` sigue midiendo botones con solo la ruta o el dominio de destino. Conserva las demás opciones de medición mejorada. Registra también `plan` e `intent` para analizar las consultas de precios.

```bash
# Cargar GA_PROPERTY_ID (numérico) y GA_ADMIN_ACCESS_TOKEN de forma segura en el entorno.
# El token necesita analytics.edit; nunca guardarlo en el repo ni usar un prefijo VITE_.
npm run analytics:plan     # solo lee; revisar los cambios
npm run analytics:apply    # aplica el plan calculado con el estado actual
```

## 2. Atribución y click de Google Ads

- **Campañas (UTM):** primer y último toque en `localStorage` por 30 días (`src/attribution.js`), guardados con cada lead en `leads.attribution`.
- **Click de Ads (`gclid`, `gbraid`, `wbraid` + UTM):** cookie propia `relvo_ads_click` por 90 días (`src/adsClick.js`). Se captura **en cualquier página** al cargar (antes solo en la landing de Ads) y **todos** los formularios la envían con el lead. Así cualquier lead que vino de un anuncio se puede devolver a Google Ads con su etapa del CRM.

## 3. Consentimiento (Consent Mode v2)

- En el EEE, Reino Unido y Suiza, GA4 y Google Ads arrancan con todo **denegado** (`gtag('consent','default', {..., region: [...]})`): Google solo recibe pings sin cookies y modela las conversiones. `ads_data_redaction` activo.
- En esas regiones (detectadas por la zona horaria del navegador) tampoco se carga Apollo ni se guarda la cookie del click de Ads.
- En el resto (LatAm, EE. UU.) el comportamiento sigue igual que antes.

**Pendiente (decisión legal + copy):** banner de consentimiento. La Ley 21.719 de protección de datos de Chile entraría en vigencia el 1 de diciembre de 2026 (confirmar con legal el alcance para cookies de analítica y publicidad). Cuando haya decisión y texto aprobado, el banner solo tiene que llamar a `gtag('consent', 'update', {...})`. Hasta entonces no se publica un banner con texto inventado.

## 4. Leads → Attio (Edge Function `lead-to-attio`)

Cada fila nueva en `public.leads` llega a Attio:

1. **Empresa**, por el dominio del email (los dominios personales como gmail.com no crean empresa). Solo se envía el dominio: Attio completa nombre y datos, y no se pisa un nombre ya curado.
2. **Persona**, por email: nombre, cargo y enlace a la empresa.
3. **Nota** en la persona con el contexto del formulario: empresa escrita, cargo, problema, formulario, página, campañas, si vino de Google Ads e ID de solicitud.

Código: `supabase/functions/lead-to-attio/` (`attio.js` con la lógica, probado en `tests/growth-loop.test.mjs`; `index.ts` con HTTP y secretos). El aviso a Slack sigue en `api/lead-notify.js`, sin cambios. Los webhooks de base de datos de Supabase no reintentan, así que la función reintenta ella misma los 429 y 5xx de Attio (hasta 3 intentos, respetando `Retry-After`). Si Attio sigue caído, el lead igual queda en Supabase y en Slack, y el error queda en los logs de la función.

### Puesta en marcha (una vez)

1. **Attio:** Settings → Developers → nueva API key de workspace con los scopes `record_permission:read-write`, `object_configuration:read` y `note:read-write`.
2. **Secretos y despliegue** (Supabase CLI, en el proyecto de producción):
   ```bash
   supabase secrets set ATTIO_API_KEY=<token> LEAD_WEBHOOK_SECRET=<valor aleatorio largo>
   supabase functions deploy lead-to-attio --no-verify-jwt   # la función valida su propio secreto
   ```
3. **Webhook de la tabla:** Supabase → Database → Webhooks → nuevo: tabla `leads`, evento `INSERT`, tipo *Supabase Edge Functions* → `lead-to-attio`, header `x-webhook-secret: <LEAD_WEBHOOK_SECRET>`.
4. **Probar:** enviar el formulario de `/agendar-demo` en un preview y revisar que la persona aparezca en Attio con su nota (logs: Supabase → Edge Functions → lead-to-attio).

## 5. Etapas del CRM → Supabase (`/api/distribution-outcome`)

Cuando un lead avanza en Attio, un workflow de Attio avisa al sitio. Las etapas posibles son `qualified_lead`, `demo_booked` y `customer` (con ingreso opcional).

Workflow en Attio (uno por etapa): disparador "Record updated" en el deal/persona cuando cambia la etapa → acción **Send HTTP request**:

```
POST https://getrelvo.ai/api/distribution-outcome
Authorization: Bearer <DISTRIBUTION_OUTCOME_SECRET>
Content-Type: application/json

{ "stage": "qualified_lead", "email": "<email de la persona>", "event_id": "attio:<record id>:qualified_lead" }
```

- `email` (nuevo) o `submission_id`: con el email, el sitio busca el lead (sin distinguir mayúsculas). Si la persona tiene varios, gana el que vino de un anuncio de Google. Responde 404 si no hay lead.
- `customer` además exige `customer_reference` y acepta `revenue_amount` (texto decimal, p. ej. `"1200.00"`) y `currency` (`"USD"`, `"CLP"`).
- `event_id` estable: los reintentos no duplican nada.
- **Demo agendada:** no hace falta workflow. La registra el webhook de Cal.com (§5b) en el momento de la reserva.

## 5b. Reservas de Cal.com → lead + `demo_booked` (`/api/cal-booking`)

El evento del calendario embebido (`bookingSuccessfulV2`) no trae nombre ni email de quien reserva (documentación de Cal.com), así que la reserva se registra desde el servidor con el webhook de Cal.com:

1. Verifica la firma `X-Cal-Signature-256` (HMAC-SHA256 del cuerpo con el secreto del webhook).
2. Crea el lead en `leads` con `fuente = cal_booking`: nombre y email del asistente, empresa/cargo/notas si el formulario de reserva de Cal.com los pregunta, y la atribución que viaja en la metadata del booking. El embed manda `gclid`/`gbraid`/`wbraid` + UTM del click de Ads o, si no hubo anuncio, la última campaña (UTM) de la visita. El plan y la intención comercial también viajan como metadata y se conservan en el contexto del lead. Así llegan el aviso a Slack y la sincronización con Attio, igual que con un formulario.
3. Registra la etapa `demo_booked` de ese lead, que entra al feed de Google Ads (§6) si hubo `gclid`.

Cada reserva genera un `submission_id` fijo derivado de su `uid`: los reintentos de Cal.com no duplican nada. Las reprogramaciones y cancelaciones se ignoran.

El calendario y su enlace de respaldo también conservan `relvo_first_touch` y `relvo_last_touch` como JSON en la metadata. Incluyen la referencia opaca del documento y su superficie cuando existen, incluso si después hubo un click de Ads. El webhook vuelve a validar estos campos con `cleanAttribution`; no guarda IDs de clientes ni campos ajenos a la atribución.

### Puesta en marcha (una vez)

1. Vercel (producción): `CAL_WEBHOOK_SECRET` = un valor aleatorio largo.
2. Cal.com → Settings → Developer → Webhooks → nuevo: URL `https://getrelvo.ai/api/cal-booking`, evento **Booking Created**, *Secret* = el mismo valor. Si la integración Cal.com → Attio de Ricardo sigue activa, no hay conflicto: la persona se deduplica por email en Attio.
3. Hacer una reserva de prueba y revisar la fila en `leads` (`fuente = cal_booking`), el aviso en Slack y la nota en Attio. Después borrar la reserva de prueba.

## 6. Etapas → Google Ads (conversiones offline)

`GET /api/ads-conversions` devuelve un CSV con el formato de importación de Google Ads: cada etapa registrada en los últimos 90 días cuyo lead tenga `gclid`. Así la puja aprende de leads calificados, demos y clientes, no de formularios.

### Puesta en marcha (una vez)

1. **Variables en Vercel (producción):** `ADS_FEED_USER`, `ADS_FEED_PASSWORD` (valores aleatorios largos). Opcionales: `ADS_CONVERSION_QUALIFIED_LEAD`, `ADS_CONVERSION_DEMO_BOOKED`, `ADS_CONVERSION_CUSTOMER` si los nombres en Google Ads son otros, y `ADS_VALUE_QUALIFIED_LEAD` / `ADS_VALUE_DEMO_BOOKED` / `ADS_VALUE_CUSTOMER` (USD) como valor fijo cuando la etapa no trae ingreso.
2. **Google Ads → Objetivos → Conversiones → Nueva → Importar → Otras fuentes de datos o CRM → Seguimiento de conversiones desde clics.** Crear tres acciones con estos nombres exactos (o los de las variables):
   - `Relvo - Lead calificado`
   - `Relvo - Demo agendada (CRM)`
   - `Relvo - Cliente`
3. **Herramientas → Cargas → Programaciones → Nueva:** fuente **HTTPS**, URL `https://getrelvo.ai/api/ads-conversions`, usuario y contraseña de arriba, frecuencia diaria.
4. **Puja:** cuando haya volumen (referencia: unas 30 conversiones al mes en la etapa elegida), usar `Relvo - Lead calificado` como conversión principal de la campaña. La conversión de formulario y la de demo de la landing quedan como secundarias.

El feed repite cada día los últimos 90 días: Google ignora las filas repetidas (mismo `gclid`, nombre y hora de conversión), así que no se duplica nada.

Limitaciones:
- Solo `gclid`: los clicks de iOS con `gbraid`/`wbraid` no entran en este feed. Google rechaza clicks de más de 90 días. Revisar la primera carga en *Cargas → Historial* por errores de formato.
- Google marca la importación por archivo como funcionalidad *legacy* y recomienda Data Manager. Las cargas programadas por HTTPS siguen funcionando y no tienen fecha de retiro publicada. Si Google la anuncia, el mismo feed es la fuente para migrar.
- Recomendado: definir `ADS_VALUE_*` para que todas las filas lleven valor y moneda. Sin valor, Google usa el valor por defecto de la acción de conversión.

## 7. Anti-spam (Cloudflare Turnstile, opcional)

Además del honeypot. Invisible salvo que Cloudflare pida una interacción, y el script se carga recién cuando la persona empieza a llenar el formulario. Si alguien envía antes de que llegue el token (autocompletado), el envío lo espera hasta 8 s.

1. Cloudflare → Turnstile → nuevo widget para `getrelvo.ai` (modo *Managed*).
2. Vercel: `VITE_TURNSTILE_SITE_KEY` (pública, va al navegador en el build) y `TURNSTILE_SECRET_KEY` (servidor). **Las dos en el mismo deploy:** si solo existe la secreta, `/api/lead` rechaza todos los formularios.

## 8. Rendimiento

- **CI (Lighthouse mobile, `lighthouserc.json`, `npm run check:lighthouse`, que corre `npx @lhci/cli@0.15.1`; no es dependencia del proyecto porque su cadena de dependencias trae avisos de seguridad):** home, precios, agendar demo, una página de producto y una de solución, 5 corridas, con scripts de terceros bloqueados para que el resultado sea estable. **Bloquean:** SEO 100, accesibilidad ≥ 95 y CLS < 0,1. **Avisan:** rendimiento ≥ 90 y LCP < 2,5 s. Los reportes quedan como artefacto del job.
- **Usuarios reales:** eventos `LCP`/`INP`/`CLS` en GA4 (ver §1). Es la medida que cuenta para Core Web Vitals: revisar el p75 por página.
- **Hallazgo abierto: LCP de la home en laboratorio.** La home queda entre 2,7 y 3,5 s de LCP (puntaje de rendimiento entre 0,88 y 0,95). El elemento LCP es la figura del anillo del hero, y casi todo el tiempo es *render delay* por trabajo de estilos, layout y script en el hilo principal (unos 1,4 s), no por descarga. Para arreglarlo hay que revisar las texturas y animaciones de la home, lo que toca el diseño, así que es su propio PR. Cuando la home pase, cambiar `categories:performance` y `largest-contentful-paint` a `error` en `lighthouserc.json`.
- **Mejora incluida:** cada página precarga solo las fuentes que usa. Fujiwara A solo en la home; en el resto, Instrument Sans Medium (la del H1). En las páginas internas el LCP bajó de 2,4–3,3 s a unos 2,3 s en laboratorio.

## 9. Rutina para aprender (semanal)

1. **GA4 → Exploraciones:** dos embudos, por página de entrada, canal, dispositivo e idioma. Formulario: `page_view` → `form_start` → `generate_lead`. Calendario: `page_view` → `calendar_view` → `demo_agendada`. Permitir pasos intermedios y entrada directa a la página de demo; `cta_click` es un diagnóstico opcional, nunca un requisito para contar una reserva. `calendar_view` mide disponibilidad del calendario, no una interacción dentro del iframe. Revisar `calendar_error` por `reason` para detectar fallos del embed. No sumar los dos embudos como personas únicas: alguien puede enviar una consulta y reservar.
2. **`cta_click` por `placement`:** qué secciones mueven a la demo y cuáles no. **`form_error` por `reason`:** dónde se cae el formulario.
3. **`scroll_depth` en home y precios:** hasta dónde se lee antes del primer CTA.
4. **Supabase (calidad, no volumen):** ejecutar `supabase/growth-funnel.sql` con un rol de servidor. Reporta cohortes semanales de leads por formulario, source/medium y campaña, con leads únicos, calificados, demos y empresas adquiridas. Cada lead se cuenta una vez aunque tenga varias etapas. El valor de adquisición va en una consulta separada por moneda. Comparar cohortes con la misma madurez (p. ej. 30 días desde el lead); las etapas tardías actualizan su cohorte original. `fuente = cal_booking` son reservas creadas desde el webhook, no formularios enviados. La atribución CRM guarda campañas explícitas (UTM), no los referrers orgánicos: `(unattributed)` no significa tráfico directo; los canales de adquisición orgánica se analizan en GA4. GA4 y Supabase usan identidades distintas: sus totales no tienen por qué coincidir.
5. **Un cambio a la vez:** con este volumen de tráfico B2B un test A/B rara vez llega a un resultado significativo. Cada cambio de copy o estructura sale con una hipótesis escrita ("cambiar X debería subir Y en la página Z") y se compara el embudo de 4 semanas antes y después. Los textos siguen saliendo del brief.

### Cierre semanal del aprendizaje

Registrar visitas y tasa de conversión en GA4; leads, calificados, demos, clientes y valor por moneda en Supabase. El embudo CRM permanece en Supabase/Attio: no se envían etapas offline a GA4 ni se promete atribución de ingresos allí. El feed de Google Ads devuelve las etapas con `gclid` para optimización de campañas.

En la revisión de ventas, anotar las objeciones y motivos de descalificación sin enviar texto libre ni datos personales a GA4. Para cada cambio, registrar fecha, página, hipótesis, métrica principal, métricas de calidad, ventana de evaluación y decisión (mantener/revertir/seguir observando). Revisar el mix de canales antes de atribuir una mejora al cambio. Responsable sugerido: marketing para adquisición/UX y ventas para calidad/objeciones; asignar nombres al activar el proceso.

## 10. Lo que falta y de quién depende

| Pendiente | Por qué no está | Depende de |
|---|---|---|
| Banner de consentimiento | Necesita decisión legal (Ley 21.719) y copy aprobado | Legal + Ricardo |
| Grabación de sesiones / heatmaps (p. ej. Microsoft Clarity) | Requiere consentimiento en las regiones que lo exigen y una decisión de privacidad | Después del banner |
| Más casos de clientes y testimonios junto al CTA | Nunca se inventan clientes ni citas | Contenido aprobado |
| Páginas por integración y comparativas (p. ej. Relvo vs. hojas de cálculo) | Páginas nuevas: tienen que estar en el brief | Brief |
| Sitio en inglés | Sin copy EN aprobado | Brief |
| Formulario en dos pasos / enriquecimiento con Apollo | Cambia la UX y los textos del formulario | Aprobación de Ricardo |
| LCP de la home en laboratorio | Ver §8 | PR de rendimiento de la home |
| Configuraciones externas de §3–§7 | Secretos y cuentas fuera del repo | Quien administra Attio, Supabase, Google Ads, Cloudflare |

## Activación cuando estén disponibles los accesos

1. **Vercel + Cal.com:** configurar el mismo `CAL_WEBHOOK_SECRET` en Vercel Production y en el webhook **Booking Created** de Cal.com, destino `https://getrelvo.ai/api/cal-booking`. Redeploy para que Vercel cargue la variable. No sustituir la firma por un endpoint público sin autenticación.
2. **GA4 Editor:** obtener el ID numérico de la propiedad que contiene `G-3612NJ7H02` y un token OAuth con `analytics.edit`; ejecutar `npm run analytics:plan`, revisar y ejecutar `npm run analytics:apply`. Volver a ejecutar el plan: debe devolver `changes: []`. El script no se ejecuta automáticamente en builds.
3. **Comprobación sin datos nuevos:** `npm run check:prod-flows` debe pasar. Un 503 en `/api/cal-booking` sin firma indica que falta la configuración del webhook; un 401 confirma que está protegido, pero no prueba la entrega desde Cal.com ni la escritura en la base.
4. **Prueba integrada controlada:** con un lead y una reserva de prueba, verificar GA4 DebugView (`calendar_view` / `form_start`, y solo tras éxito `demo_agendada` / `generate_lead`), la fila en Supabase, la nota en Attio y la etapa `demo_booked`. Probar un reintento firmado para confirmar que no duplica. Verificar los workflows de etapas de Attio y una carga del feed en Google Ads. Usar Tag Assistant para habilitar debug; no activar `debug_mode` globalmente en producción.
5. **Reporting:** guardar las dos exploraciones anteriores y ejecutar el SQL semanal. No usar `form_submit` automático ni clicks como conversiones. No habilitar una segunda etiqueta GA4 en GTM si el sitio ya carga gtag.

Sin acceso a estas cuentas, los cambios del repo quedan verificables localmente, pero la activación externa no se considera terminada.

## 11. Verificación

| Qué | Dónde | Cuándo |
|---|---|---|
| Lógica de cada handler (mocks) | `npm test` (`tests/growth-loop.test.mjs` y otros) | Cada PR (CI) |
| Formulario, reserva, etapa por email y feed contra Postgres + PostgREST reales con las migraciones | `npm run test:flows` (`scripts/check-lead-flows.mjs`, Docker) | Cada PR (CI) |
| Edge Function en Deno | `docker run --rm -v "$PWD/supabase/functions/lead-to-attio:/fn:ro" -w /fn --entrypoint deno denoland/deno:2.1.4 check index.ts` | Al cambiar la función |
| Cada función desplegada, con sus secretos, sin escribir datos | `npm run check:prod-flows` (`scripts/check-prod-flows.mjs`) | Después de cada deploy de producción y a diario (`seo-prod.yml`) |
| Integraciones reales (Attio, Cal.com, Google Ads, Slack) | Prueba manual de §4, §5b y §6 con un lead y una reserva de prueba | Una vez, al activar cada una |

## Variables de entorno nuevas

| Variable | Dónde | Para qué |
|---|---|---|
| `ATTIO_API_KEY` | Supabase secrets | Edge Function `lead-to-attio` |
| `LEAD_WEBHOOK_SECRET` | Supabase secrets | Valida el webhook de `leads` hacia la Edge Function |
| `CAL_WEBHOOK_SECRET` | Vercel | Firma del webhook de Cal.com (`/api/cal-booking`) |
| `ADS_FEED_USER`, `ADS_FEED_PASSWORD` | Vercel | Basic auth del feed de Google Ads |
| `ADS_CONVERSION_*`, `ADS_VALUE_*` | Vercel (opcional) | Nombres y valores de las conversiones offline |
| `VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Vercel (opcional, juntas) | Turnstile |

Las existentes no cambian: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SLACK_LEADS_WEBHOOK_URL`, `SUPABASE_WEBHOOK_SECRET` y `DISTRIBUTION_OUTCOME_SECRET`.
