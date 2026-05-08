# Crear un contrato

El contrato define la relación comercial con un cliente: qué se cobra, desde cuándo, con qué moneda, bajo qué calendario y qué aprobaciones deben cumplirse.

En Relvo, el contrato es el punto que conecta cliente, cuenta de facturación, cargos, pricing, uso y próximos cobros.

## Ruta en la plataforma

1. Entra a `Contratos`.
2. Haz clic en `Nuevo contrato`.
3. Completa el wizard.
4. Revisa la simulación.
5. Guarda o activa según corresponda.

## Paso 1: Información general

En este paso defines la base del contrato.

Campos comunes:

- `Cliente`: empresa asociada al contrato.
- `Nombre contrato`: nombre interno para identificar el acuerdo.
- `Fecha de inicio`: fecha desde la que el contrato empieza a operar.
- `Responsable`: persona encargada de la relación o gestión.
- `Moneda de precio`: moneda en la que se definen los precios.
- `Moneda de facturación`: moneda usada para preparar el cobro.
- `FX`: política de conversión si precio y facturación usan monedas distintas.
- `Calendario de facturación`: frecuencia y fechas de cobro.
- `Estado inicial`: por ejemplo borrador o activo.
- `Cuenta de facturación`: razón social que recibirá los cobros.

## Paso 2: Fases y cargos

Esta es la parte más importante del contrato. Aquí defines qué se le cobra al cliente, durante qué periodo y bajo qué lógica.

Las fases y cargos se configuran con la misma lógica que en un plan. La diferencia es que en un contrato ya quedan aplicados a un cliente, una cuenta de facturación y un calendario específico.

Una forma simple de pensarlo:

- La fase define cuándo aplica una configuración comercial.
- El cargo define qué se cobra.
- El tipo de cargo define la naturaleza del cobro.
- El modelo de cobro define cómo se calcula el monto.
- La métrica de cobro define cómo se mide el uso, cuando el cargo depende de usage.
- Las reglas avanzadas ajustan o controlan el resultado del cargo.

Para ver la explicación completa de tipos de cargo, modelos de cobro y reglas avanzadas, revisa [Fases y cargos](./fases-y-cargos.md).

> **Regla mental:** si el contrato no calcula como esperas, revisa primero fase, cargo, métrica, modelo de cobro, calendario y cuenta de facturación.

## Qué revisar en fases y cargos

Antes de avanzar, revisa:

- Cada fase tiene fechas correctas.
- Cada cargo tiene nombre claro.
- Cada cargo tiene cuenta de facturación.
- Los cargos por uso tienen item y métrica.
- El modelo de cobro coincide con el acuerdo comercial.
- Los precios están en la moneda correcta.
- Los cargos únicos no quedaron como recurrentes.
- Los cargos recurrentes tienen frecuencia correcta.
- Las reglas avanzadas están configuradas solo donde aplican.
- Los mínimos, topes y descuentos se ven correctamente en la simulación.

## Paso 3: Aprobaciones

Usa este paso si el contrato requiere validaciones antes de facturar.

Ejemplos:

- Aprobación interna.
- Aprobación del cliente.
- Orden de compra.
- HES.
- Confirmación comercial.

Si el contrato requiere OC, valida que la cuenta de facturación tenga emails de referencias comerciales o contactos operativos suficientes.

## Paso 4: Simulación

La simulación sirve para revisar el resultado antes de activar u operar el contrato.

Revisa:

- Cliente y cuenta de facturación.
- Fechas.
- Moneda de precio y moneda de facturación.
- FX si aplica.
- Calendario de facturación.
- Cargos fijos y variables.
- Métricas de cobro.
- Bloqueos o advertencias.

Para contratos con cargos por uso, prueba al menos un escenario de volumen esperado. Si el modelo es paquete o graduado, valida un caso bajo, uno medio y uno alto.

## Borrador o activo

Usa `Borrador` mientras el contrato todavía está en revisión.

Activa el contrato solo cuando:

- La cuenta de facturación está completa.
- Los cargos están configurados.
- Las métricas existen para cargos por uso.
- La simulación no muestra bloqueos críticos.
- Las aprobaciones requeridas están definidas.

## Hints

- No actives un contrato antes de revisar la simulación.
- Si precio y facturación usan monedas distintas, define la política de FX.
- Si falta una cuenta de facturación, vuelve al cliente y complétala.
- Para cargos por asientos, valida soporte, vigencia y prorrateo en la simulación antes de activar el contrato.
- Si usas un plan, recuerda que el contrato es el lugar donde se adapta la configuración al cliente.
- Para cargos por uso, revisa siempre que la métrica lea el mismo evento que vas a cargar en `Uso`.
- Para reglas avanzadas, valida siempre el resultado en simulación antes de activar el contrato.

## Después de crear el contrato

Si el contrato tiene cargos por uso, continúa con [Registrar uso](./registrar-uso.md) o [Importar uso por CSV](./importar-uso-csv.md).

Si no tiene cargos por uso, revisa [Cobros y facturación](./revisar-cobros-facturacion.md) cuando corresponda el siguiente ciclo de cobro.
