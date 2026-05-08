# Crear una cuenta de facturación

La cuenta de facturación define la razón social y los datos operativos que Relvo usa para preparar cobros y facturas de un cliente.

Un cliente puede tener más de una cuenta de facturación, pero normalmente debes marcar una como principal para que sea usada por defecto.

## Ruta en la plataforma

1. Entra a `Clientes`.
2. Abre el cliente correspondiente.
3. En el `Resumen`, busca la sección de cuentas o datos de facturación.
4. Haz clic en `Agregar cuenta`, `Añadir cuenta de facturación` o la acción equivalente.
5. Completa los datos y guarda.

## Campos principales

- `RUT / identificación tributaria`: identificador legal usado para facturar.
- `Razón social`: nombre legal de la entidad que recibirá la factura.
- `Moneda de facturación`: moneda en la que se emitirán o prepararán los cobros.
- `Estado tributario`: estado fiscal o tributario cuando aplique.
- `Dirección`: dirección legal o fiscal de la cuenta.
- `Términos de pago`: condición acordada, por ejemplo pago inmediato, 15 días o 30 días.
- Emails de facturación, cobranza y referencias comerciales: contactos que reciben documentos, avisos o solicitudes.
- `Definir como cuenta principal`: marca esta opción si esta será la razón social usada por defecto.

## Qué revisar antes de guardar

- Que el RUT o Tax ID esté escrito como corresponde.
- Que la razón social coincida con el documento legal.
- Que la moneda de facturación sea la que se usará en contratos.
- Que exista un contacto de facturación válido.
- Que la cuenta principal sea la correcta si el cliente tiene varias razones sociales.

## Hints

- Marca `Definir como cuenta principal` cuando sea la cuenta que usará la mayoría de los contratos.
- Completa email de referencias comerciales si el contrato puede requerir OC, HES o confirmación.
- Evita cambiar la moneda después de crear contratos vinculados; la UI puede bloquearla o requerir revisión.
- Si el cliente factura por distintas razones sociales, crea una cuenta por cada entidad legal.

## Después de crear la cuenta

Continúa con [Items y métricas de cobro](./items-y-metricas.md) si necesitas cobrar por uso, o pasa a [Crear un contrato](./crear-contrato.md) si el contrato solo tiene cargos fijos o únicos.
