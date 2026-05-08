# Revisar cobros y facturación

La sección de facturación permite revisar qué se va a cobrar, qué ya fue generado y qué bloqueos impiden avanzar.

En la UI, el término principal es `Próximos cobros`. Una prefactura puede entenderse como una vista previa o borrador operativo del cobro antes de emitir un documento final.

## Ruta en la plataforma

1. Entra a `Facturación`.
2. Revisa el tab `Próximos cobros`.
3. Abre el detalle del cobro que quieras validar.
4. Resuelve bloqueos si aparecen.
5. Avanza hacia borrador o emisión cuando esté disponible.

## Tabs principales

- `Próximos cobros`: cobros esperados o pendientes de preparar.
- `Cobros generados`: cobros que ya avanzaron en el proceso.
- `Simulador`: revisión de escenarios sin emitir documentos.

## Qué revisar en próximos cobros

Revisa columnas y señales como:

- Cliente.
- Fecha de cobro.
- Periodo.
- Monto.
- Cobro.
- Factura.
- Pago.
- OC, HES o confirmación.
- Bloqueos.
- Uso.
- FX.
- Acciones disponibles.

## Bloqueos comunes

- Falta uso: el contrato tiene cargos variables, pero aún no existe uso suficiente para calcular.
- Falta FX: precio y facturación usan monedas distintas y falta definir tipo de cambio.
- Falta OC: el contrato requiere orden de compra antes de facturar.
- Falta cuenta de facturación: el cobro no tiene razón social o datos legales completos.
- Falta aprobación: existe un flujo de validación pendiente.

## Acciones frecuentes

Según el estado del cobro, la UI puede permitir acciones como:

- Ver detalle.
- Revisar PDF preliminar.
- Agregar uso.
- Pedir OC por correo.
- Subir OC.
- Cambiar FX.
- Recalcular cobro.
- Simular facturación.

## Hints

- Revisa primero `Próximos cobros`; ahí se detectan bloqueos antes de emitir.
- Si aparece `Falta uso`, vuelve a [Registrar uso](./registrar-uso.md) o [Importar uso por CSV](./importar-uso-csv.md).
- Si aparece `Falta FX`, define o corrige el tipo de cambio.
- Si aparece `Falta OC`, usa la acción disponible para pedirla o subirla.
- No confundas próximo cobro con documento fiscal emitido.
- Usa `Simulador` para revisar escenarios sin emitir.

## Sobre conciliación

La conciliación conecta facturas emitidas con pagos recibidos. Si tu operación ya usa sincronización fiscal, banco o estados de pago, revisa esos estados desde las vistas disponibles.

El flujo completo de conciliación puede depender de integraciones y configuración por país, por lo que debe confirmarse antes de documentar una guía end-to-end más específica.
