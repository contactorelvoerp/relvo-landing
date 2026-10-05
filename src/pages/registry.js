import { HomePage } from './home/HomePage'
import { DemoPage } from './demo/DemoPage'
import { LandingPage } from '../landing/LandingPage'

// Páginas de plantilla publicadas: se renderizan desde su archivo de contenido
// (content/<idioma>/<url>.json). El resto de los archivos de content/ se valida pero no se publica.
export const LANDINGS = ['cxc']

// id de página (reference/seo-metadata.json) → componente.
// Una página se publica en producción solo cuando está registrada acá.
export const PAGE_COMPONENTS = {
  home: HomePage,
  demo: DemoPage,
  ...Object.fromEntries(LANDINGS.map((id) => [id, LandingPage])),
}

// Idiomas con copy aprobado por página. Si una página no aparece acá, está lista en todos.
// Home en inglés: pendiente de traducir el copy del prototipo. Plantillas: el inglés queda para
// después (rutas /en preparadas, sin publicar).
export const PAGE_LOCALES = {
  home: ['es'],
  ...Object.fromEntries(LANDINGS.map((id) => [id, ['es']])),
}
