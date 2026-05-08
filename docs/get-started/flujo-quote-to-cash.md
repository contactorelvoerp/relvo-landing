# Flujo quote-to-cash

Relvo automatiza el Quote-to-cash, que corresponde al flujo desde el acuerdo comercial (contrato) hasta que el dinero entra al  banco y es conciliado.

## 1. Quote o acuerdo comercial

Todo parte con una regla comercial.

Ejemplos:

- Al cliente se le cobra un fijo mensual de 30 UF más $300 por orden procesada.
- Se cobra por tiers según la cantidad de leads generados durante el mes.
- El cliente paga un 5% sobre el monto transaccionado.

Estas reglas normalmente están en contratos, anexos, propuestas comerciales o planillas.

Relvo permite convertir esas reglas en una configuración estructurada.

## 2. Contract setup

En Relvo, el contrato se configura con:

- Cliente.
- Fechas de vigencia.
- Moneda.
- Fases.
- Cargos.
- Modelos de pricing.
- Reglas de facturación.
- Flujo de aprobación.

Esto permite que cada contrato tenga su propia lógica de cobro.

Un cliente puede tener uno o varios contratos activos.

## 3. Usage ingestion

Si el contrato tiene cargos variables, Relvo necesita recibir el uso del periodo.

Ejemplos de uso:

- Órdenes procesadas.
- Leads generados.
- Usuarios activos.
- Transacciones.
- Monto vendido.
- Kilómetros recorridos.
- Horas trabajadas.
- Tickets resueltos.

El uso puede venir desde carga manual, CSV, API, integraciones, base de datos, ERP o CRM.

Relvo usa ese consumo para calcular cuánto corresponde cobrar.

## 4. Rating o cálculo de cargos

Relvo toma el uso y aplica las reglas del contrato.

Ejemplo:

Cliente: Toku

Uso del mes: 12.000 leads

Pricing:

- 0 - 2.000 leads: 0,015 UF.
- 2.001 - 4.000 leads: 0,0135 UF.
- 4.001 - 10.000 leads: 0,0095 UF.
- 10.001+ leads: 0,0085 UF.

Relvo calcula automáticamente el monto correspondiente según el modelo de pricing configurado.

## 5. Prefactura

Antes de emitir la factura final, Relvo puede generar una prefactura.

La prefactura permite revisar:

- Cliente.
- Periodo.
- Contrato.
- Cargos fijos.
- Cargos variables.
- Uso considerado.
- Descuentos.
- Impuestos.
- Total a cobrar.

Esto es útil cuando el cliente o el equipo interno necesita validar el monto antes de facturar.

## 6. Approval flow

Algunas empresas requieren aprobaciones antes de facturar.

Por ejemplo:

- Aprobación del KAM.
- Aprobación del cliente.
- Carga de orden de compra.
- Validación de finanzas.
- Revisión de operaciones.

Relvo permite estructurar estos pasos para evitar que el proceso dependa de correos, WhatsApp o planillas desordenadas.

## 7. Facturación

Una vez aprobada la prefactura, Relvo puede avanzar hacia la emisión de la factura.

La factura se genera usando:

- Datos legales del cliente.
- Condiciones tributarias.
- Moneda de facturación.
- Detalle de cargos.
- Periodo de cobro.
- Condición de pago.

Dependiendo del país e integración, la emisión puede conectarse con sistemas de facturación electrónica o ERPs externos.

## 8. Conciliación

Después de emitir la factura, Relvo ayuda a identificar si el pago fue recibido.

El objetivo es conectar:

- Factura emitida.
- Cliente.
- Monto esperado.
- Pago recibido.
- Banco.
- Estado de conciliación.

Esto permite saber qué revenue fue cobrado, qué está pendiente y qué diferencias existen entre lo facturado y lo recibido.
