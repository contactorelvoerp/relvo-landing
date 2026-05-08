# Crear un plan

Un plan es una plantilla reutilizable de pricing. Sirve para agrupar fases, cargos y condiciones que luego puedes usar al crear contratos.

El plan no reemplaza al contrato. El contrato puede tomar el plan como base y adaptar la configuración para un cliente específico.

## Cuándo usar un plan

Usa planes cuando varios clientes comparten una estructura comercial parecida.

Ejemplos:

- Plan SaaS mensual.
- Plan delivery por orden.
- Plan marketplace con comisión.
- Plan enterprise con fijo más variable.

Puedes saltarte el plan si estás creando un contrato único con condiciones totalmente personalizadas.

## Ruta en la plataforma

1. Entra a `Catálogo y precios` o `Pricing`.
2. Abre el tab `Planes`.
3. Haz clic en `Nuevo plan`.
4. Completa la información base.
5. Agrega fases y cargos.
6. Guarda el plan.

## Campos principales

- `Nombre`: nombre comercial del plan.
- `Código`: identificador único del plan.
- `Moneda de precio`: moneda en la que se definen los precios.
- Fases: periodos o etapas del plan, si la lógica cambia en el tiempo.
- Cargos: líneas de cobro que podrá heredar un contrato.

## Fases y cargos en un plan

Las fases y cargos se configuran con la misma lógica que en un contrato, pero dentro de un plan funcionan como plantilla.

Esto significa:

- No están asociados todavía a un cliente específico.
- No reemplazan la revisión del contrato final.
- Ayudan a reutilizar una estructura comercial en varios contratos.
- Pueden incluir cargos únicos, recurrentes, por uso o por asientos.
- Pueden usar modelos de cobro y reglas avanzadas cuando el acuerdo lo requiere.

Para entender tipos de cargo, modelos de cobro y reglas avanzadas, revisa [Fases y cargos](./fases-y-cargos.md).

## Qué revisar antes de guardar

- Que el código del plan sea único.
- Que la moneda sea la correcta.
- Que las fases representen la estructura comercial reutilizable.
- Que los cargos por uso tengan una métrica de cobro asociada.
- Que el nombre de cada cargo sea entendible para operaciones y finanzas.
- Que las reglas avanzadas estén configuradas solo donde aplican.

## Hints

- Usa planes para evitar crear la misma estructura de pricing en cada contrato.
- No uses un plan si el acuerdo es completamente excepcional.
- Si cambias un plan, valida si afecta solo nuevos contratos o también contratos ya creados. Este comportamiento debe confirmarse según la configuración vigente.
- Documenta internamente cuándo se debe elegir cada plan para evitar contratos inconsistentes.

## Después de crear el plan

Continúa con [Crear un contrato](./crear-contrato.md) y usa el plan como base si el cliente tendrá esa estructura comercial.
