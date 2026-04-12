# Guia de Usuario Final de Relvo

Esta guia explica como se navega hoy en Relvo segun el frontend actual y que se hace en cada vista. Esta pensada para usuarios operativos, KAMs, finanzas y revenue ops.

## 1. Como entender Relvo

Relvo organiza la operacion comercial y de facturacion en este orden:

1. Configuras la base operativa de la organizacion.
2. Defines catalogo, metricas y planes de pricing.
3. Creas clientes y sus cuentas de facturacion.
4. Creas contratos.
5. Registras uso.
6. Generas y sigues facturas.
7. Resuelves aprobaciones y alertas.

Conceptos clave:

- Cliente: la cuenta comercial a la que le vendes.
- Cuenta de facturacion: la configuracion legal y operativa con la que emites documentos.
- Contrato: el acuerdo comercial que define fechas, cargos, moneda, facturacion y aprobaciones.
- Uso: eventos de consumo que luego se transforman en cobros.
- Facturacion: la bandeja operativa donde revisas y procesas documentos.
- Aprobaciones: la cola donde se valida lo que no puede emitirse automaticamente.

## 2. Como se navega en Relvo

La navegacion principal vive en la barra lateral izquierda.

Menu principal actual:

- `Panel`
- `Clientes`
- `Contratos`
- `Uso`
- `Facturacion`
- `Aprobaciones`
- `Notificaciones`
- `Pricing`
- `Configuracion`

Patrones de navegacion que se repiten en casi toda la aplicacion:

- Las vistas de lista usan tablas con filtros, busqueda y acciones rapidas.
- Al hacer click en una fila normalmente abres un detalle.
- Los detalles muestran un resumen arriba y luego secciones o tabs abajo.
- Los formularios nuevos o edicion suelen tener acciones al final: cancelar y guardar.
- Algunos flujos, como importar uso, se muestran como pasos secuenciales.

## 3. Flujo recomendado de uso

Si estas implementando Relvo por primera vez, el recorrido recomendado es:

1. Ir a `Configuracion` para revisar preferencias de facturacion y aprobaciones.
2. Ir a `Pricing` para cargar items, metricas y planes.
3. Ir a `Clientes` para crear clientes y sus cuentas de facturacion.
4. Ir a `Contratos` para dar de alta acuerdos comerciales.
5. Ir a `Uso` para registrar eventos o importar CSVs.
6. Ir a `Facturacion` para revisar pre-facturas, emitir y seguir documentos.
7. Ir a `Aprobaciones` y `Notificaciones` para resolver pendientes operativos.

## 4. Vistas principales

### `/home` Dashboard

Es el resumen ejecutivo de la empresa. Sirve para mirar KPIs generales y entrar al trabajo operativo.

Aqui normalmente revisas:

- indicadores generales
- actividad reciente
- un panorama rapido antes de entrar a Ingresos

### `/ingresos` Panel de Ingresos

Es el dashboard operativo de revenue.

Aqui puedes:

- filtrar por periodo, clientes, contratos, perfiles de facturacion y metricas
- revisar KPIs como MRR contractual, revenue facturado, revenue por uso y base activa
- ver tendencia historica del revenue
- identificar clientes principales y concentracion comercial

Usa esta vista para entender el periodo antes de entrar al detalle.

### `/ingresos/clientes` Clientes

Es la bandeja principal de clientes.

Aqui haces:

- buscar clientes por nombre, RUT o estado
- revisar cantidad de contratos activos y proxima factura
- entrar al detalle de cada cliente
- crear un cliente nuevo

### `/ingresos/clientes/nuevo` Nuevo cliente

Se usa para dar de alta una cuenta comercial.

Aqui completas:

- datos del cliente
- direccion
- contexto comercial
- opcionalmente una cuenta de facturacion inicial

### `/ingresos/clientes/:clienteId` Detalle de cliente

Es la vista 360 del cliente. Tiene tabs para navegar la cuenta sin salir del contexto.

Tabs actuales:

- `Resumen`: estado operativo, readiness para facturar y estadisticas clave.
- `Cuentas de facturacion`: perfiles y datos legales para emitir.
- `Contratos`: contratos vinculados al cliente.
- `Uso`: consumo reciente del cliente.
- `Facturacion`: facturas, vencimientos y saldo abierto.

Usa esta vista cuando quieras entender si el cliente ya esta listo para ser facturado y que le falta.

### `/ingresos/contratos` Contratos

Es la bandeja principal de contratos.

Aqui haces:

- buscar contratos
- revisar cliente, vigencia, estado, moneda y facturacion
- abrir un contrato
- crear un contrato nuevo

### `/ingresos/contratos/nuevo` Nuevo contrato

Se usa para crear el acuerdo comercial que luego alimenta la facturacion.

En esta vista defines, segun el flujo actual:

- cliente asociado
- fechas y vigencia
- cargos y condiciones comerciales
- frecuencia de facturacion
- aprobaciones y requisitos externos cuando aplique

### `/ingresos/contratos/:contractId` Detalle de contrato

Es una de las vistas operativas mas importantes del producto.

Aqui puedes revisar:

- resumen del contrato
- condiciones comerciales
- facturas asociadas
- cargos y fases
- workflow de aprobacion
- documentos y anexos

La vista de aprobaciones dentro del contrato muestra el ciclo paso a paso:

- prefactura generada
- aprobacion interna
- aprobacion externa / OC
- factura emitida

Usa este detalle para operar un contrato concreto sin tener que cambiar entre pantallas.

### `/ingresos/contratos/:contractId/editar` Editar contrato

Se usa para modificar contratos editables o en borrador. Sirve para ajustar el acuerdo antes de dejarlo listo para operar.

### `/ingresos/uso` Uso

Es la bandeja de eventos de consumo.

Aqui haces:

- buscar eventos por transaccion, evento o cliente
- filtrar por cliente y tipo de evento
- revisar timestamp, idempotency key y propiedades
- agregar un evento manual
- importar eventos por CSV

Usa esta vista para validar que el consumo que alimenta la facturacion ya entro correctamente.

### `/ingresos/uso/nuevo` Agregar evento de uso

Se usa para registrar un evento puntual sin cargar archivo.

Aqui completas:

- cliente
- metrica
- evento
- fecha y hora
- propiedades del evento

### `/ingresos/uso/importar` Importar uso (CSV)

Es el flujo guiado de importacion en lote.

Paso a paso:

1. Cargas un archivo CSV.
2. Relvo previsualiza y valida las filas.
3. Confirmas la importacion.
4. Revisas el resultado: ingresados, duplicados y rechazados.

Esta vista es la mas adecuada cuando recibes uso desde una fuente externa o una carga historica.

### `/ingresos/facturacion` Facturacion

Es la bandeja operativa de emision y seguimiento de facturas.

Aqui puedes:

- filtrar por estado de factura
- filtrar por estado del workflow
- filtrar por cliente, origen o necesidad de OC
- abrir una preview draft
- procesar facturacion por contrato
- iniciar una creacion manual, que hoy aparece como capacidad futura

Piensa esta vista como el inbox principal de facturacion.

### `/ingresos/facturacion/:invoiceId` Detalle de factura

Se usa para revisar el documento y su contexto operativo.

Aqui puedes ver:

- resumen principal del documento
- lineas y montos
- workflow y aprobaciones
- timeline y eventos
- relaciones con cliente y contrato
- informacion de OC cuando aplique

### `/aprobaciones` Aprobaciones

Es la bandeja de trabajo para aprobadores y operadores.

Tabs actuales:

- `Aprobaciones internas`: pasos pendientes de aprobacion interna.
- `OC`: solicitudes de orden de compra o aprobacion externa.
- `Historial`: pasos ya resueltos.

Aqui normalmente haces:

- aprobar o rechazar pasos
- registrar una OC
- dejar notas
- entrar al contrato relacionado

### `/notificaciones` Notificaciones

Es la bandeja de alertas operativas.

Aqui puedes:

- ver notificaciones activas y resueltas
- filtrar por nivel de atencion
- revisar recordatorios y acciones requeridas
- cargar mas resultados si la bandeja tiene varias paginas

## 5. Pricing y configuracion comercial

### `/ingresos/configuracion-pricing` Catalogo y Pricing

Es el hub para construir la logica comercial que despues usan contratos y facturacion.

Tiene tres tabs:

- `Items`: productos o servicios base.
- `Metricas de Cobro`: define como medir el consumo y volverlo cantidad facturable.
- `Planes`: estructura reusable de cargos y condiciones.

### `/ingresos/catalogo/nuevo` Nueva metrica

Se usa para crear una metrica facturable.

Aqui defines:

- identidad comercial
- comportamiento de medicion
- filtros y dimensiones
- vista previa operativa

### `/ingresos/catalogo/:itemId` Detalle de item

Se usa para revisar o ajustar un item del catalogo y entender su impacto en planes.

### `/ingresos/planes` Planes

Es la lista de planes de precios reutilizables.

Aqui haces:

- buscar planes
- abrir un plan
- crear un nuevo plan

### `/ingresos/planes/nuevo` Nuevo plan

Se usa para definir una estructura reusable de pricing.

Aqui completas:

- identidad del plan
- moneda
- compromiso minimo si aplica
- cargos recurrentes
- cargos unicos
- cargos por uso
- fases del plan

### `/ingresos/planes/:planId` Detalle del plan

Sirve para revisar el snapshot vigente del plan y la composicion de cargos que heredaran los contratos nuevos.

## 6. Configuracion de la organizacion

### `/settings` Configuracion

Es el hub administrativo de la organizacion.

Las tarjetas visibles hoy organizan:

- empresa
- usuarios
- aprobaciones
- plan de cuentas
- preferencias de facturacion
- integraciones

No todas las tarjetas estan operativas con backend completo. La vista ya distingue lo que esta activo y lo que sigue en borrador.

### `/configuracion/aprobaciones` Politica global de aprobacion

Se usa para definir la politica base de aprobacion de toda la organizacion.

Aqui configuras:

- si la aprobacion interna esta activa por defecto
- si la OC es obligatoria por defecto
- quien puede aprobar
- a quienes se notifica

Esta configuracion se hereda en contratos, salvo override por contrato.

### `/configuracion/preferencias-facturacion` Preferencias de facturacion

Se usa para definir reglas globales de emision.

Aqui ajustas:

- ciclo de facturacion
- terminos de pago
- configuracion fiscal
- politica de reintentos

Usa esta vista antes de comenzar a emitir, para no depender de ajustes manuales contrato por contrato.

## 7. Vistas secundarias o en desarrollo

Estas pantallas existen en el frontend actual, pero algunas todavia dependen de backend parcial o futuro.

### `/ingresos/devengo` Devengo

Explica el concepto de reconocimiento de ingresos y muestra el modulo como pendiente. No es una vista operativa completa todavia.

### `/integrations` Integraciones

Pantalla de referencia para bancos, SII y facturacion electronica. Hoy se presenta como backend pendiente.

### `/caja` Gestion de caja

Pantalla pensada para saldos y movimientos recientes por cuenta bancaria. Hoy depende de backend futuro.

### `/reconciliations` Conciliaciones

Vista para conciliacion bancaria y matching contable. Existe en el producto, pero su alcance operativo depende de la integracion disponible.

### `/banking/statements` Extractos bancarios

Vista de gestion de importacion y conciliacion de extractos.

### `/banking/statements/import` Importar extracto bancario

Flujo guiado para subir archivos CSV, XLSX o XLS, validarlos y revisar resultados de importacion.

## 8. Reglas practicas para usuarios

- Si necesitas entender una cuenta completa, parte por `Clientes` y entra al detalle.
- Si necesitas operar facturacion de un acuerdo puntual, parte por `Contratos`.
- Si algo no factura como esperabas, revisa en este orden: contrato, uso, aprobaciones y luego facturacion.
- Si vas a cargar muchos eventos, usa `Importar uso (CSV)` en vez de alta manual.
- Si una factura esta bloqueada, mira primero el workflow del contrato y luego la bandeja de `Aprobaciones`.
- Si una pantalla dice que el backend esta pendiente, tomala como referencia funcional, no como flujo ya habilitado de punta a punta.

## 9. Recorrido corto recomendado para capacitacion

Para entrenar a un usuario nuevo, este orden funciona bien:

1. `Panel de Ingresos`
2. `Clientes`
3. `Detalle de cliente`
4. `Contratos`
5. `Detalle de contrato`
6. `Uso`
7. `Facturacion`
8. `Aprobaciones`
9. `Configuracion`

## 10. Alcance de esta guia

Esta guia esta basada en las vistas que hoy existen en el frontend. Si el producto cambia de navegacion, etiquetas o modulos, conviene actualizar este archivo junto con el frontend.
