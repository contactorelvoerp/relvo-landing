# Reglas prácticas para operar Relvo

Estas reglas te ayudan a decidir por dónde empezar según la tarea que quieres resolver. No reemplazan los flujos del producto, pero sí te dan una forma rápida de diagnosticar problemas y avanzar con menos desvíos.

## Parte por clientes cuando necesitas contexto completo

Si necesitas entender una cuenta completa, parte por `Clientes` y entra al detalle. Esa vista reúne estado operativo, cuentas de facturación, contratos, uso y facturación dentro del mismo contexto.

## Parte por contratos cuando el problema está en un acuerdo puntual

Si necesitas operar la facturación de un acuerdo específico, empieza por `Contratos`. El detalle del contrato concentra condiciones comerciales, cargos, facturas asociadas y el workflow de aprobación.

## Si algo no factura como esperabas, revisa en este orden

Cuando un cobro no avanza como esperabas, revisa primero el contrato, después el uso, luego las aprobaciones y recién al final la bandeja de facturación. Este orden sigue la misma lógica operativa con la que Relvo organiza la generación de documentos.

## Usa importación masiva cuando el volumen lo justifica

Si vas a cargar muchos eventos, usa `Importar uso (CSV)` en vez del alta manual. El flujo guiado te permite validar filas, detectar duplicados y revisar rechazados antes de cerrar la carga.

## Si una factura está bloqueada, mira primero el workflow del contrato

Cuando una factura queda detenida, revisa primero el workflow del contrato y luego la bandeja de `Aprobaciones`. Así puedes identificar si el bloqueo está en la prefactura, en la aprobación interna, en la OC o en la emisión final.

## Toma las pantallas con backend pendiente como referencia funcional

Si una pantalla dice que el backend está pendiente, úsala como referencia funcional y no como un flujo ya habilitado de punta a punta. Esto es especialmente importante en módulos secundarios o en vistas que la guía marca como dependientes de desarrollo adicional.
