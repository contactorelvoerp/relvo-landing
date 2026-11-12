import { PAGE_DEFINITIONS, PAGE_MODULES } from './manifest.js'

const modules = import.meta.glob(['/src/pages/**/*Page.jsx', '/src/landing/LandingPage.jsx'])

// The server has already rendered the complete page. Download only its component
// before hydrating that HTML, without a Suspense fallback or a second render.
export async function loadPage(route) {
  if (route.status !== 'live') return null
  const entry = PAGE_MODULES[PAGE_DEFINITIONS[route.id]?.kind]
  if (!entry) return null
  const module = await modules[`/${entry.file}`]()
  return module[entry.name]
}
