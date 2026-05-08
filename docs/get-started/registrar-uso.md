# Registrar uso

El uso representa eventos o actividad real del cliente durante un periodo. Relvo lo usa para calcular cargos variables.

Ejemplos de uso:

- Órdenes procesadas.
- Leads generados.
- Usuarios activos.
- Transacciones.
- Monto vendido.
- Horas trabajadas.
- Tickets resueltos.

## Ruta en la plataforma

1. Entra a `Uso`.
2. Abre el tab `Añadir`.
3. Elige `Crear evento` para cargar un evento individual.
4. Completa los datos del evento.
5. Guarda.

También puedes revisar eventos existentes desde `Todos los eventos`.

## Campos principales

- `Cliente`: cliente al que pertenece el evento.
- `Tipo de evento`: nombre del evento que la métrica de cobro espera recibir.
- `Fecha y hora`: momento en que ocurrió el evento.
- `Propiedades`: datos adicionales usados por la métrica, como monto, cantidad, estado o categoría.

Si el uso viene desde una integración, CSV o API, el identificador enviado debe coincidir con el `Código cliente` configurado al crear el cliente. Ese match es lo que permite asociar el evento al cliente correcto.

## Tipos de uso

Relvo puede usar distintos tipos de uso según cómo esté configurada la métrica:

- Conteo de eventos: contar cuántas veces ocurrió algo.
- Suma de propiedades: sumar montos, cantidades o valores.
- Promedio: calcular el promedio de una propiedad.
- Máximo o mínimo: tomar el valor más alto o más bajo del periodo.
- Conteo único: contar valores únicos, como usuarios activos.
- Porcentaje sobre monto: usar una propiedad monetaria como base de comisión.

## Qué revisar antes de guardar

- Que el cliente sea el correcto.
- Que el identificador del cliente coincida con el `Código cliente` usado en Relvo cuando el uso viene de una fuente externa.
- Que el tipo de evento coincida con la métrica de cobro.
- Que la fecha pertenezca al periodo que quieres cobrar.
- Que las propiedades tengan los mismos nombres esperados por la métrica.
- Que los montos y cantidades usen el formato correcto.

## Hints

- Usa `Crear evento` para pruebas, correcciones puntuales o bajo volumen.
- Usa CSV cuando necesites cargar muchos eventos.
- No cambies nombres de propiedades al azar: la métrica puede dejar de leerlas.
- Si editar uso está deshabilitado, corrige según la política operativa definida por tu equipo, normalmente con un nuevo evento o una nueva importación.

## Después de registrar uso

Revisa [Cobros y facturación](./revisar-cobros-facturacion.md) para validar si el cargo variable ya aparece en próximos cobros o si existe algún bloqueo.
