import { HomePage } from './home/HomePage'
import { DemoPage } from './demo/DemoPage'

// id de página (reference/seo-metadata.json) → componente.
// Una página se publica en producción solo cuando está registrada acá.
export const PAGE_COMPONENTS = {
  home: HomePage,
  demo: DemoPage,
}
