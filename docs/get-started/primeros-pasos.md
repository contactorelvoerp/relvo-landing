# Primeros pasos

Esta guía es el recorrido operativo para setear Relvo desde cero. Mantiene el mapa conceptual de quote-to-cash, pero lo traduce a acciones concretas dentro de la plataforma.

> **Orden recomendado:** Cliente → Cuenta de facturación → Items → Métricas de cobro → Plan opcional → Contrato → Uso → Próximos cobros.

## Qué vas a configurar

1. [Crear un cliente](./crear-cliente.md).
2. [Crear una cuenta de facturación](./cuenta-facturacion.md).
3. [Crear items y métricas de cobro](./items-y-metricas.md).
4. [Crear un plan](./crear-plan.md), si vas a reutilizar pricing.
5. [Entender fases y cargos](./fases-y-cargos.md).
6. [Crear un contrato](./crear-contrato.md).
7. [Registrar uso](./registrar-uso.md) o [importar uso por CSV](./importar-uso-csv.md).
8. [Revisar cobros y facturación](./revisar-cobros-facturacion.md).

## Qué necesitas antes de empezar

Ten a mano la información comercial y operativa del cliente:

- Nombre y código del cliente, si ya existe un identificador interno.
- Razón social, RUT o identificación tributaria y dirección.
- Moneda de facturación y términos de pago.
- Contactos de facturación, cobranza y referencias comerciales.
- Condiciones comerciales del contrato.
- Reglas de pricing: fijo, variable, porcentaje, tiers o mínimos.
- Eventos de uso que se van a medir, si hay cargos variables.
- Requisitos de OC, HES, confirmación o aprobación antes de facturar.

## Qué es obligatorio y qué puede esperar

Para facturar de forma ordenada necesitas:

- Cliente creado.
- Cuenta de facturación completa y marcada como principal cuando aplique.
- Contrato activo.
- Cargos asociados a una cuenta de facturación.
- Calendario de facturación.
- Moneda consistente o política de FX definida.
- Uso cargado para cargos variables.
- OC o aprobación si el contrato la requiere.

Puedes dejar para después:

- Plan de precios, si el contrato es único.
- Contactos secundarios.
- Múltiples fases.
- Reglas avanzadas.
- Descuentos, máximos o mínimos especiales.
- SQL en métricas, si el builder visual resuelve la medición.

## Flujo mental

Relvo funciona mejor cuando separas la configuración en tres capas:

1. Base del cliente: cliente y cuenta de facturación.
2. Base comercial: items, métricas, planes y contrato.
3. Operación del periodo: uso, próximos cobros, bloqueos, borradores y emisión.

Si algo no aparece en facturación, revisa primero qué capa falta: cuenta de facturación, contrato activo, cargo configurado, uso, OC o FX.
