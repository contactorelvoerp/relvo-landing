# Fases y cargos

Las fases y cargos se configuran de la misma forma en planes y contratos.

La diferencia es el contexto:

- En un `Plan`, fases y cargos funcionan como plantilla reutilizable.
- En un `Contrato`, fases y cargos quedan aplicados a un cliente, una cuenta de facturación y un calendario específico.

## Cómo pensarlo

Una forma simple de entender esta parte:

- La fase define cuándo aplica una configuración comercial.
- El cargo define qué se cobra.
- El tipo de cargo define la naturaleza del cobro.
- El modelo de cobro define cómo se calcula el monto.
- La métrica de cobro define cómo se mide el uso, cuando el cargo depende de usage.
- Las reglas avanzadas ajustan o controlan el resultado del cargo.

> **Regla mental:** si un cobro no calcula como esperas, revisa fase, cargo, tipo, modelo de cobro, métrica, calendario y cuenta de facturación.

## Qué es una fase

Una fase es un tramo donde aplica una configuración de precios.

Sirve cuando el acuerdo cambia en el tiempo.

Ejemplos:

- Primeros 3 meses con descuento.
- Onboarding con cargo único al inicio.
- Pricing distinto después de una fecha.
- Renovación con nuevos precios.
- Piloto y luego operación normal.

Si el plan o contrato tiene una sola lógica durante toda su vigencia, normalmente basta con una fase.

## Qué revisar en una fase

Antes de agregar cargos, revisa:

- Fecha de inicio de la fase.
- Fecha de término, si aplica.
- Moneda de precio.
- Cargos incluidos.
- Si la fase se superpone con otra.
- Si la fase representa el acuerdo comercial real.

Evita crear muchas fases si solo necesitas varios cargos dentro del mismo periodo. Usa fases cuando cambia el periodo o la lógica comercial.

## Qué es un cargo

Un cargo es una línea de cobro.

Ejemplos:

- Fee mensual base.
- Setup fee.
- Comisión por monto transaccionado.
- Cobro por orden procesada.
- Cargo por asiento.
- Mínimo mensual configurado como regla avanzada.
- Descuento comercial configurado como regla avanzada.

Cada cargo debe tener suficiente información para que Relvo pueda calcularlo y mostrarlo en próximos cobros.

## Tipos de cargo

Los tipos de cargo son la primera decisión que debes tomar al configurar qué se cobra.

En Relvo, los tipos principales son:

- `Único`: se cobra una sola vez.
- `Recurrente`: se cobra de forma repetida según el calendario.
- `Por uso`: se calcula usando el consumo real del periodo.
- `Por asientos`: se calcula según una cantidad de seats, usuarios o unidades contratadas.

No confundas tipo de cargo con modelo de cobro. El tipo define la naturaleza del cargo. El modelo define cómo se calcula el monto dentro de ese tipo.

## Cargo único

Un cargo único se cobra una sola vez.

Úsalo para cobros como:

- Setup.
- Implementación.
- Activación.
- Migración.
- Fee inicial.

Ejemplo:

- Cargo: implementación.
- Tipo: `Único`.
- Monto: $800.000.
- Cuándo facturar: al inicio del contrato.

En un cargo único, el modelo más común es un monto fijo. Si la UI ofrece otros modelos para este tipo de cargo, valida que el acuerdo comercial realmente lo necesite antes de usarlo.

## Cargo recurrente

Un cargo recurrente se cobra en cada ciclo definido por el calendario de facturación.

Úsalo para cobros como:

- Fee mensual.
- Suscripción base.
- Retainer.
- Cargo fijo trimestral.

Ejemplo:

- Cargo: fee mensual base.
- Tipo: `Recurrente`.
- Monto: 30 UF.
- Frecuencia: mensual.

Este tipo de cargo no depende del usage. Si el cliente no tuvo consumo durante el periodo, el cargo recurrente igual puede cobrarse si el contrato lo define así.

## Cargo por uso

Un cargo por uso depende del consumo real del cliente durante el periodo.

Úsalo cuando el contrato dice algo como:

- $300 por orden procesada.
- 0,8% sobre monto transaccionado.
- Precio por tier según leads generados.
- $50.000 por cada paquete de 1.000 eventos.

Para que un cargo por uso funcione, necesitas:

- `Ítem del catálogo`.
- `Métrica de cobro`.
- Evento de uso que alimente esa métrica.
- Modelo de cobro.
- Periodo de facturación.
- Usage cargado para ese periodo.

Si falta usage, el cobro puede quedar bloqueado o incompleto.

## Cargo por asientos

Un cargo por asientos se calcula usando una cantidad de seats, usuarios, licencias o unidades contratadas.

Úsalo cuando el contrato cobra por cantidad de accesos o capacidad contratada.

Ejemplo:

- Cargo: usuarios activos contratados.
- Tipo: `Por asientos`.
- Cantidad: 25 asientos.
- Precio: $12.000 por asiento al mes.
- Total mensual: 25 x $12.000 = $300.000.

Este tipo de cargo se parece a un recurrente, pero el monto depende de la cantidad de asientos configurada. Si la cantidad cambia durante el contrato, valida cómo la UI maneja vigencias, prorrateos o cambios de fase antes de guardar.

## Campos clave de un cargo por uso

- `Ítem del catálogo`: lo que se está cobrando o midiendo, por ejemplo orders, leads o transactions.
- `Métrica de cobro`: cómo se mide el uso, por ejemplo contar órdenes o sumar monto transaccionado.
- `Modelo de cobro`: cómo se convierte ese uso en precio.
- `Cuándo facturar`: momento en que Relvo debe preparar el cobro.
- Cuenta de facturación: razón social a la que se asociará el cargo.
- Reglas avanzadas: mínimos, topes, descuentos, pooling u otras condiciones adicionales si el contrato lo requiere.

## Modelos de cobro

El modelo de cobro define cómo Relvo convierte un monto, una cantidad de asientos o una métrica de uso en un valor a cobrar.

Los modelos disponibles pueden cambiar según el tipo de cargo. No todos los modelos aplican a todos los cargos.

Como regla general:

- En cargos `Único`, normalmente usas un monto fijo.
- En cargos `Recurrente`, normalmente usas un monto fijo por ciclo.
- En cargos `Por uso`, puedes usar modelos como estándar, paquete o graduado.
- En cargos `Por asientos`, normalmente usas precio por asiento y cantidad de asientos.

## Modelo estándar

El modelo estándar cobra un precio unitario simple por cada unidad.

Úsalo cuando cada unidad vale lo mismo.

Ejemplo:

- Métrica: órdenes procesadas.
- Uso del mes: 1.000 órdenes.
- Precio estándar: $300 por orden.
- Total: 1.000 x $300 = $300.000.

Este modelo es el más fácil de auditar. Sirve para precio por orden, lead, ticket o asiento cuando cada unidad vale lo mismo.

## Modelo paquete

El modelo paquete cobra por bloques o paquetes de unidades.

Úsalo cuando el contrato vende unidades agrupadas, no unidad por unidad.

Ejemplo:

- Paquete: 1.000 eventos.
- Precio por paquete: $50.000.
- Uso del mes: 2.400 eventos.
- Relvo calcula 3 paquetes si el contrato cobra paquete completo.
- Total: 3 x $50.000 = $150.000.

Antes de usar paquete, confirma cómo debe redondearse el consumo:

- Si se cobra paquete completo al superar cualquier parte del bloque.
- Si se permite prorrateo.
- Si hay una bolsa incluida y luego paquetes adicionales.

Si esa regla no está clara en el acuerdo comercial, no configures el cargo hasta confirmarla.

## Modelo graduado

El modelo graduado cobra por tramos de uso. Cada tramo puede tener un precio distinto.

Úsalo cuando el precio cambia a medida que aumenta el volumen.

Ejemplo:

- 0 a 2.000 leads: 0,015 UF por lead.
- 2.001 a 4.000 leads: 0,0135 UF por lead.
- 4.001 a 10.000 leads: 0,0095 UF por lead.
- 10.001 o más leads: 0,0085 UF por lead.

Este modelo sirve para descuentos por volumen, pricing por tiers o contratos donde el precio cambia cuando el cliente supera ciertos umbrales.

## Modelo porcentual

El modelo porcentual calcula el cargo como un porcentaje sobre una base.

Úsalo cuando el contrato cobra comisión, take rate o porcentaje sobre un monto.

Ejemplo:

- Métrica: monto transaccionado del mes.
- Uso del mes: $82.000.000.
- Porcentaje: 5%.
- Total: $82.000.000 x 5% = $4.100.000.

Este modelo normalmente depende de una métrica que entregue una base monetaria, por ejemplo suma de transacciones o monto vendido. Antes de usarlo, revisa que la métrica mida monto y no conteo.

## Reglas avanzadas

Las reglas avanzadas no son tipos de cargo. Son condiciones adicionales que modifican o controlan el resultado de un cargo.

Úsalas solo cuando el acuerdo comercial lo requiere y cuando puedas validar el resultado en la simulación.

## Mínimo garantizado

Un mínimo garantizado asegura que el cliente pague al menos cierto monto, aunque el cálculo del cargo dé menos.

Ejemplo:

- Cargo por uso calculado: $700.000.
- Mínimo garantizado: $1.000.000.
- Total a cobrar: $1.000.000.

Sirve para contratos con compromiso mínimo mensual o revenue mínimo garantizado.

## Tope máximo

Un tope máximo limita cuánto se puede cobrar por un cargo o periodo.

Ejemplo:

- Cargo por uso calculado: $1.800.000.
- Tope máximo: $1.500.000.
- Total a cobrar: $1.500.000.

Sirve cuando el contrato protege al cliente con un cap de facturación.

## Descuento

Un descuento reduce el monto calculado.

Ejemplo:

- Cargo calculado: $1.000.000.
- Descuento: 20%.
- Total a cobrar: $800.000.

Puede usarse para promociones, ramp-up, acuerdos comerciales o ajustes temporales. Si el descuento aplica solo durante un periodo, evalúa si corresponde configurarlo en una fase específica.

## Pooling de cargos

El pooling agrupa cargos o consumos para aplicar una regla de forma conjunta.

Ejemplo:

- El contrato tiene dos cargos por uso relacionados.
- Ambos consumos se agrupan para evaluar un mínimo o tope compartido.
- Relvo calcula la regla sobre el conjunto, no sobre cada cargo por separado.

Úsalo cuando el contrato habla de bolsas, mínimos compartidos o reglas agregadas entre cargos.

## Selectores de montos

Los selectores de montos permiten elegir qué monto usar como base de cálculo cuando existen varias fuentes posibles.

Ejemplo:

- Monto transaccionado.
- Monto aprobado.
- Monto neto.
- Monto final después de ajustes.

Sirven cuando el contrato necesita calcular sobre una base específica y esa base no debe confundirse con otras propiedades del usage.

## Cómo decidir el modelo

Usa esta guía rápida:

- Si todas las unidades cuestan lo mismo, usa estándar.
- Si se cobra por bloques de unidades, usa paquete.
- Si el precio cambia por tramo de volumen, usa graduado.
- Si el contrato depende de porcentaje sobre un monto, usa un modelo porcentual con una métrica que mida monto.
- Si existe un mínimo mensual, tope, descuento o pooling, configúralo como regla avanzada, no como tipo de cargo.

## Checklist antes de guardar

Revisa:

- Cada fase tiene fechas correctas.
- Cada cargo tiene nombre claro.
- Cada cargo tiene cuenta de facturación cuando se usa en contrato.
- Los cargos por uso tienen item y métrica.
- El modelo de cobro coincide con el acuerdo comercial.
- Los precios están en la moneda correcta.
- Los cargos únicos no quedaron como recurrentes.
- Los cargos recurrentes tienen frecuencia correcta.
- Los tramos del modelo graduado no se pisan.
- Los paquetes tienen tamaño y regla de cobro clara.
- Las reglas avanzadas están configuradas solo donde aplican.
- Los mínimos, topes y descuentos se ven correctamente en la simulación.
