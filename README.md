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

ES es el principal. EN se activa agregando su diccionario en `src/i18n/` cuando el copy en inglés esté aprobado; las URLs en inglés ya están en `seo-metadata.json`.
