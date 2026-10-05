import { ProductCard } from '../../visuals/Bento'

// Bento de productos (prototipo home v2). Las tarjetas son las de la librería de visuales: el
// bloque related de las páginas de plantilla usa las mismas.
const LAYOUT = [['contratos', true], ['medicion'], ['aprobaciones'], ['cxc', true], ['agentes'], ['reporteria', true]]

export function Products({ c, pages, locale }) {
  return (
    <div className="bento">
      {LAYOUT.map(([id, wide]) => <ProductCard key={id} id={id} wide={wide} name={pages[id].name} card={c[id]} locale={locale} />)}
    </div>
  )
}
