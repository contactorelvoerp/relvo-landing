# Importar uso por CSV

La importación CSV sirve para cargar eventos de uso en lote. Es útil cuando el consumo viene desde una planilla, ERP, CRM, base de datos o exportación externa.

## Ruta en la plataforma

1. Entra a `Uso`.
2. Abre el tab `Añadir`.
3. Haz clic en `Importar CSV`.
4. Sube el archivo.
5. Revisa la vista previa.
6. Confirma la importación.
7. Revisa el resultado.

## Columnas esperadas

El CSV puede requerir columnas como:

- `event_name`: nombre del evento.
- `timestamp`: fecha y hora del evento.
- `idempotency_key`: clave única para evitar duplicados.
- `properties`: datos del evento.
- `customer_id` o `external_customer_id`: identificador del cliente.

La estructura exacta puede variar según la configuración de uso y métricas.

> **Importante:** el identificador de cliente del CSV debe hacer match con el `Código cliente` configurado en Relvo, salvo que tu integración use explícitamente otro ID interno. Si no coincide, Relvo puede no saber a qué cliente asociar el uso.

## Qué significa cada columna

- `event_name`: debe coincidir con el evento usado por la métrica de cobro.
- `timestamp`: define el periodo en que se considera el uso.
- `idempotency_key`: permite reintentar sin duplicar eventos ya aceptados.
- `properties`: contiene los valores usados para calcular, filtrar o agrupar.
- `customer_id`: identifica al cliente dentro de Relvo.
- `external_customer_id`: identifica al cliente usando un ID externo, normalmente el mismo valor definido como `Código cliente`.

## Antes de importar

Revisa:

- Que todos los clientes existan en Relvo.
- Que `customer_id` o `external_customer_id` coincida con el `Código cliente` esperado.
- Que los eventos coincidan con las métricas de cobro.
- Que las fechas estén en el periodo correcto.
- Que las propiedades tengan nombres consistentes.
- Que cada fila tenga una `idempotency_key` estable.

## Reintentos y duplicados

Si una fila fue aceptada, no cambies su `idempotency_key` para reintentar. Conservar la clave ayuda a evitar duplicados.

Si una fila fue rechazada, corrige el dato que falló y vuelve a importar solo lo necesario según el resultado de la carga.

## Hints

- Usa CSV para cargas masivas, no para un evento aislado.
- Revisa la vista previa antes de confirmar.
- Si aparece un error de cliente, valida `customer_id` o `external_customer_id`.
- Si aparece un error de métrica, revisa `event_name` y propiedades.
- Guarda una copia del archivo importado para auditoría operativa.

## Después de importar

Revisa `Uso` → `Todos los eventos` para confirmar la carga y luego revisa [Cobros y facturación](./revisar-cobros-facturacion.md).
