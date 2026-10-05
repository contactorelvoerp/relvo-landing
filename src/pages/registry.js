import { HomePage } from './home/HomePage'
import { DemoPage } from './demo/DemoPage'

// id de página (reference/seo-metadata.json) → componente.
// Una página se publica en producción solo cuando está registrada acá.
export const PAGE_COMPONENTS = {
  home: HomePage,
  demo: DemoPage,
}

// Idiomas con copy aprobado por página. Si una página no aparece acá, está lista en todos.
// Home en inglés: pendiente de traducir el copy del prototipo home v1.
export const PAGE_LOCALES = {
  home: ['es'],
}
