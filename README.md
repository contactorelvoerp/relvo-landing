# Relvo — sitio público (getrelvo.ai)

Web 3.0 de Relvo. Sitio estático generado con Vite + React: cada ruta se prerenderiza a HTML con su metadata de SEO y se hidrata en el navegador.

## Fuentes de verdad

- Brief maestro "Web 3.0" en Notion (copy y estructura).
- `reference/seo-metadata.json`: URLs, titles y descriptions por página e idioma.
- `reference/Relvo Design System v1.5.html`: tokens y componentes. `src/styles/tokens.css` es su copia.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `localhost:3000` |
| `npm run build` | Build del cliente, build SSR y prerender a `dist/` |
| `npm run preview` | Sirve `dist/` |
| `npm run lint` | ESLint |
| `npm run knip` | Archivos, exports y dependencias sin uso |
| `npm run check:links` | Links internos y redirects de `vercel.json` contra `dist/` |
| `npm run check:design` | Gate de `impeccable detect` sobre `dist/` |

## Cómo se publica una página

1. Crear la página en `src/pages/<id>/`, con el `id` de `reference/seo-metadata.json`.
2. Registrarla en `src/pages/registry.js`.

Una página sin registrar es **pendiente**: en previews y en local se genera con un placeholder `[PENDIENTE]`; en producción no se genera, no aparece en el menú ni en el sitemap.

## Producción vs. preview

`VERCEL_ENV=production` es lo único que hace el sitio indexable. Cualquier otro build (previews de Vercel, local) lleva `noindex`, `robots.txt` con `Disallow: /` y no carga analítica.

## Idiomas

ES es el principal y EN vive bajo `/en`. Los textos de interfaz están en `src/i18n/es.js` y `src/i18n/en.js`; las URLs de ambos idiomas salen de `seo-metadata.json`.

## Powered by Relvo distribution

PDF footers use `/powered-by-relvo` with the existing campaign taxonomy:
`utm_source=prefactura`, `utm_medium=pdf`, `utm_campaign=powered_by_relvo`,
`utm_content=footer`. `ref=v1.<snapshot-sha256>` identifies a document snapshot;
it contains no customer/contract IDs and grants no access to the document.

The client keeps first and latest explicit campaign touches for 30 days. Direct
navigation does not overwrite them. GA receives only bounded distribution/form
fields and sanitized page URLs; opaque references stay in first-party storage.
Legacy PDF URLs have raw billing IDs removed before GA and Apollo load.
Previews do not load tracking. The reference never enters a GA custom dimension.

Production setup, in order:

1. Apply `supabase/migrations/202610210001_distribution_attribution.sql` to the
   existing landing Supabase project. It only adds columns/tables/indexes; the
   old app keeps inserting leads and can be rolled back after the migration.
2. Set server-only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and a random
   `DISTRIBUTION_OUTCOME_SECRET` in the landing Vercel project. The service-role
   key is required for new lead deduplication/representation and event writes;
   it must never use a `VITE_` prefix. No secrets belong in the browser bundle.
3. Deploy the landing before the billing backend that generates the new URL.
   Existing PDFs stay unchanged. The billing renderer's template-version bump
   gives new requests their ordinary lazy cache miss.
4. Connect the existing Attio/booking automation to
   `POST /api/distribution-outcome` with `Authorization: Bearer <secret>`.
   Send `{event_id, submission_id, stage}` where stage is `qualified_lead`,
   `demo_booked` or `customer`. Retain the landing's submission ID on the CRM
   lead. A demo click/form submission is never a booked demo.
   `customer` also requires a stable `customer_reference` (the CRM company ID),
   so multiple people from the same acquired company cannot count twice.
   For a customer's first contract value, optionally include `revenue_amount`
   as an exact decimal string and `currency` as an ISO currency code. This is
   booked acquisition value, not recognized revenue or a mix of MRR and ARR.
5. Inspect the GA plan with `GA_PROPERTY_ID` (numeric property ID) and an OAuth
   token with `analytics.edit` scope in `GA_ADMIN_ACCESS_TOKEN`:
   `node scripts/configure-analytics.mjs`. After reviewing the plan, add
   `--apply`. It creates missing event dimensions, registers `generate_lead`
   as a key event, and copies the default channels into a separate **Relvo
   distribution** group with Powered by Relvo first. It never replaces the
   property's primary group. Use that group in acquisition reports. No live
   GA configuration is changed by builds or tests.

`supabase/distribution-funnel.sql` reports landing sessions, demo clicks, form
starts, submitted leads, qualified leads, booked demos and acquired companies
by reference, under separate first/latest-touch models. Revenue stays separated
by currency. Never add both attribution models together. Browser sessions are
per-tab with a 30-minute inactivity timeout; these counts are not GA's modeled
users. Public event ingestion cannot record CRM milestones. Duplicate visitor
steps, lead retries and CRM retries are ignored without rewriting earlier facts.

For account attribution, export the first query to CSV and use the billing
repo's read-only command:
`uv run python -m scripts.resolve_powered_by_reference --organization-id UUID --funnel-csv FILE`.
Use `--reference v1.HASH` instead to investigate one reference. It checks tenant
scope, joins the existing artifact and email attachment evidence, and reports
provider-accepted/delivered messages separately. Generation observations come
from `distribution.powered_by_pdf_generated` in backend logs, deduplicated by
reference. No PDF-view/impression count is inferred from generation or delivery.
Unknown references are reported, never guessed or resolved across organizations.

Verification: `npm test`, `npm run test:schema` (disposable Docker PostgreSQL,
no host ports or configured database), production build, `npm run test:browser`,
`npm run lint`, `npm run knip`, and the existing link/SEO/design checks. Browser
tests intercept every request and create no production leads, events or CRM
updates. They include first-touch persistence, validation, a failed submission,
a stable retry ID, success-only conversion, and mobile/reduced-motion rendering.
