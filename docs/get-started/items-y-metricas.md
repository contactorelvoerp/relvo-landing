# Crear items y métricas de cobro

Los items y las métricas de cobro son la base para facturar uso variable.

Un `Item` representa lo que vendes o mides. Una `Métrica de cobro` define cómo Relvo calcula la cantidad facturable de ese item.

## Diferencia entre item y métrica

Ejemplo simple:

- Item: órdenes.
- Métrica de cobro: contar órdenes completadas del periodo.

Ejemplo monetario:

- Item: transacciones.
- Métrica de cobro: sumar el monto transaccionado durante el mes.

El item responde qué se mide. La métrica responde cómo se mide para cobrar.

## Ruta en la plataforma

1. Entra a `Catálogo y precios` o `Pricing`.
2. Abre el tab `Items` para revisar o crear items.
3. Abre el tab `Métricas de cobro` para crear la métrica.
4. Si no hay items, crea primero el item antes de configurar la métrica.

## Crear un item

Usa un item para representar una unidad comercial o de consumo.

Ejemplos:

- Orders.
- Leads.
- Users.
- Transactions.
- Deliveries.
- Seats.
- Hours.

Antes de guardar, revisa que el nombre sea consistente con el contrato y con los eventos de uso que vas a cargar.

## Crear una métrica de cobro

La creación de métricas puede aparecer como builder visual o como expresión SQL.

Campos y decisiones comunes:

- `Item del catálogo`: item sobre el que se calculará el uso.
- `Nombre`: nombre interno de la métrica.
- `Nombre en factura`: texto que puede aparecer en el detalle de cobro.
- `Evento`: evento de uso que alimenta la métrica.
- `Agregación`: forma de cálculo, como conteo, suma, promedio, máximo, mínimo o conteo único.
- `Filtros`: condiciones para incluir solo eventos relevantes.
- `Propiedades`: campos del evento usados para calcular o filtrar.
- `Expresión SQL`: modo avanzado para una medición más controlada.

## Builder visual o SQL

Usa builder visual cuando necesitas mediciones simples:

- Contar eventos.
- Sumar montos.
- Promediar valores.
- Tomar máximos o mínimos.
- Contar valores únicos.

Usa SQL solo si necesitas una expresión agregada más específica y alguien técnico puede validarla.

> **Advertencia:** SQL puede ser útil, pero también puede dejar una métrica difícil de auditar para usuarios de negocio. Si no necesitas una lógica especial, parte por el builder visual.

## Hints

- Primero crea un item; si no existe, la UI puede redirigirte a crearlo.
- El nombre del evento debe coincidir con el uso que vas a registrar o importar.
- Las propiedades deben usar los mismos nombres que vendrán en el uso.
- Define `Nombre en factura` con lenguaje entendible para el cliente.
- Revisa la vista previa o resumen antes de guardar.

## Después de crear la métrica

Usa la métrica en un cargo por uso dentro de un [Plan](./crear-plan.md) o directamente en un [Contrato](./crear-contrato.md).
