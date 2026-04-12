# Documentación de Relvo

Relvo es la infraestructura que convierte tu pricing en revenue ejecutado.
Define cómo le cobras a tus clientes, registra uso y automatiza la facturación de punta a punta.

Antes de cargar clientes o emitir facturas, te conviene decidir qué lógica comercial vas a operar en Relvo. Esa definición afecta qué datos necesitas completar, cómo se calcula el cobro y qué revisiones debes hacer antes de cerrar cada período de facturación.

## Empieza por aquí

1. [Cómo funciona Relvo](./como-funciona-relvo.md): entiende el orden operativo del producto y cómo se conectan sus módulos.
2. [Flujo recomendado](./flujo-recomendado.md): sigue el recorrido sugerido para una implementación o capacitación inicial.
3. [Conceptos clave](./conceptos-clave.md): revisa los términos que se repiten en toda la operación.

## Diseña tu operación de pricing y facturación

1. [Cobro por consumo](../pricing/metricas.md): usa esta lógica si facturas al cierre del período según el uso real. Define con claridad cada métrica de cobro, valida que el consumo esté completo y revisa la factura antes de emitirla.
2. [Contratos con compromiso mínimo](../pricing/planes.md): si trabajas con acuerdos negociados, combina el plan de pricing con las condiciones del contrato para reflejar compromisos mínimos, cargos únicos, renovaciones y otras condiciones comerciales.
3. [Plan de pricing recurrente con uso](../pricing/planes.md): considera este esquema cuando necesitas cobrar un cargo fijo y además una parte variable por consumo dentro del mismo contrato.
4. Créditos prepagados: si tu operación depende de bolsas de crédito consumidas antes de facturar, define desde el inicio cómo se descuentan, cuándo se reponen y qué ocurre si se agotan.

> **Nota:** Esta funcionalidad puede estar en desarrollo en Relvo. Consulta con tu equipo antes de depender de ella.

## Qué conviene definir antes de empezar

1. Tu modelo de cobro principal: aclara si vas a cobrar solo por uso, con compromiso mínimo, con cargos recurrentes o con una combinación de estos elementos.
2. El punto de control del período: define quién revisa consumo, contratos y aprobaciones antes de emitir facturas.
3. Las reglas de excepción: identifica desde el principio qué casos requieren revisión manual, por ejemplo faltas de OC, aprobaciones pendientes o datos incompletos.
4. La consistencia entre pricing y contratos: asegúrate de que los planes de pricing y los acuerdos comerciales usen la misma lógica para evitar diferencias al momento de facturar.

## Elige tu punto de partida

1. Si todavía estás armando tu oferta, empieza en [Pricing](../pricing/overview.md) para definir items, métricas de cobro y planes reutilizables.
2. Si ya tienes acuerdos cerrados con clientes, sigue por [Contratos](../contratos/overview.md) para reflejar condiciones comerciales, vigencias y aprobaciones.
3. Si necesitas preparar el cierre de un período, revisa [Uso](../uso/overview.md) y después [Facturación](../facturacion/overview.md) para validar consumo, prefacturas y emisión.
4. Si primero necesitas contexto general, parte en [Panel](../panel/overview.md) y [Notificaciones](../notificaciones/overview.md) para detectar actividad reciente, alertas y pendientes operativos.

## Secciones principales

1. [Panel](../panel/overview.md): revisa contexto general y KPIs antes de entrar a la operación detallada.
2. [Clientes](../clientes/overview.md): crea clientes, revisa su estado operativo y entra a su contexto completo.
3. [Contratos](../contratos/overview.md): da de alta acuerdos comerciales y opera cada contrato desde su detalle.
4. [Uso](../uso/overview.md): registra eventos de consumo manualmente o por importación.
5. [Facturación](../facturacion/overview.md): revisa pre-facturas, procesa emisión y sigue el estado de cada documento.
6. [Aprobaciones](../aprobaciones/overview.md): resuelve pasos pendientes, OC y aprobaciones internas.
7. [Notificaciones](../notificaciones/overview.md): revisa alertas operativas y acciones pendientes.
8. [Pricing](../pricing/overview.md): define items, métricas y planes reutilizables.
9. [Configuración](../configuracion/overview.md): ajusta políticas globales de aprobación y preferencias de facturación.
10. [Referencia](../referencia/navegacion.md): consulta patrones de navegación, vistas en desarrollo y reglas prácticas de operación.
