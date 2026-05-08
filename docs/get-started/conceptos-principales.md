# Conceptos principales

Relvo se organiza en algunos objetos principales. Entenderlos ayuda a leer la plataforma con el flujo mental correcto: clientes → contratos → cargos → uso → prefacturas → facturas → pagos.

## Cliente

El cliente representa la empresa a la que le vendes.

Puede tener:

- Nombre comercial.
- Razón social.
- RUT o Tax ID.
- País.
- Dirección.
- Contactos de facturación.
- Moneda de facturación.
- Condición de pago.
- Contratos asociados.

Antes de crear un contrato, normalmente debes crear o seleccionar un cliente.

## Contrato

El contrato define la relación comercial con un cliente.

Incluye:

- Fecha de inicio.
- Fecha de término.
- Moneda.
- Fases.
- Cargos.
- Modelos de pricing.
- Reglas de facturación.
- Flujo de aprobación.

Un contrato responde la pregunta: qué se le cobra a este cliente, desde cuándo, bajo qué reglas y con qué condiciones.

## Item

Un Item representa aquello que puede ser medido o cobrado.

Ejemplos:

- Orders.
- Leads.
- Users.
- Transactions.
- Deliveries.
- Seats.
- Hours.

El Item es la entidad base sobre la cual Relvo puede calcular uso.

## Billable Metric o BM

Un BM define cómo se mide un Item para efectos de cobro.

Ejemplo:

- Item: orders.
- BM: count_orders.
- Regla: contar todas las órdenes completadas del periodo.

Otro ejemplo:

- Item: transactions.
- BM: sum_transaction_amount.
- Regla: sumar el monto total transaccionado durante el mes.

El BM responde: cómo calculamos el uso que se va a cobrar.

## Plan

Un Plan es una plantilla de configuración comercial.

Sirve para no crear contratos desde cero cada vez.

Por ejemplo:

- Plan SaaS mensual.
- Plan delivery por orden.
- Plan marketplace con comisión.
- Plan enterprise con fijo más variable.

Un Plan puede definir cargos, pricing y reglas por defecto. Luego, cada contrato puede adaptar esos valores para un cliente específico.

## Charge o Cargo

Un cargo representa algo que Relvo debe cobrar.

Tipos principales:

- Único.
- Recurrente.
- Por uso.
- Por asientos.

El modelo de cobro y las reglas avanzadas definen cómo se calcula el cargo. Por ejemplo, un cargo por uso puede tener modelo estándar, paquete, graduado o porcentual. Mínimos garantizados, topes máximos, descuentos, pooling de cargos y selectores de montos son reglas avanzadas, no tipos de cargo.

Ejemplo:

- Cargo: Fee mensual base.
- Tipo: recurrente.
- Monto: 30 UF.
- Frecuencia: mensual.

Ejemplo variable:

- Cargo: Órdenes procesadas.
- Tipo: uso.
- Métrica: count_orders.
- Precio: $300 por orden.

## Usage o Uso

El uso representa la actividad real del cliente durante un periodo.

Ejemplo:

- Cliente: Acme.
- Periodo: abril 2026.
- Órdenes procesadas: 8.542.
- Usuarios activos: 321.
- Monto transaccionado: $82.000.000.

Relvo usa este dato para calcular cargos variables.

## Prefactura

La prefactura es una vista previa de lo que se va a cobrar.

Permite revisar el detalle antes de emitir la factura final.

Incluye:

- Periodo.
- Cliente.
- Contrato.
- Cargos.
- Uso.
- Subtotal.
- Impuestos.
- Total.
- Estado de aprobación.

## Approval flow

El flujo de aprobación define qué pasos deben cumplirse antes de facturar.

Ejemplo:

1. Relvo genera prefactura.
2. KAM revisa.
3. Cliente aprueba.
4. Cliente carga OC.
5. Finanzas emite factura.

Este flujo ayuda a ordenar procesos que normalmente viven en correos, WhatsApp o planillas.

## Factura

La factura es el documento tributario o comercial emitido al cliente.

Relvo puede ayudar a generarla usando la información del contrato, la prefactura y los datos legales del cliente.

## Conciliación

La conciliación conecta facturas emitidas con pagos recibidos.

Sirve para responder:

- Qué facturas ya fueron pagadas.
- Qué clientes tienen saldos pendientes.
- Qué pagos no hacen match.
- Qué revenue está facturado pero no cobrado.

## Resumen mental

La forma más simple de entender Relvo es:

Clientes → Contratos → Cargos → Uso → Prefacturas → Facturas → Pagos

La forma más completa es:

Items → Billable Metrics → Plans / Contracts → Charges → Usage → Rating → Prefactura → Aprobación → Factura → Conciliación
