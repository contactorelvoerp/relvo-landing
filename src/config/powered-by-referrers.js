// Allowlist de clientes que autorizaron que /powered-by-relvo muestre su nombre a quien llega
// desde su correo (factura, recordatorio o pago conciliado). slug -> nombre a mostrar.
// El slug viaja en la URL como `?cliente=<slug>` (src/pages/powered-by/referrer.js): un parámetro
// nuevo y legible, separado del `?ref=` que ya existe en producción para la atribución de ingresos
// por documento (shared/attribution.js, token opaco `v1.<hash>`) — no se reutiliza ese parámetro
// para no arriesgar esa atribución real.
// Vacía por defecto: sin entrada para un slug, o sin `?cliente=`, la página usa el copy genérico
// (PoweredByPage.jsx). Pide la lista de clientes con permiso antes de agregar una fila.
export const POWERED_BY_REFERRERS = {
  // 'nimbo-ai': 'Nimbo AI',
}
