# Crear un cliente

El cliente representa la empresa a la que le vendes. Desde el cliente se conectan contratos, cuentas de facturación, uso y cobros.

## Cuándo crear un cliente

Crea un cliente antes de configurar contratos o cargar uso. Si el cliente no existe, no tendrás una cuenta comercial donde asociar condiciones de cobro, facturación o eventos.

## Ruta en la plataforma

1. Entra a `Clientes`.
2. Haz clic en `Crear cliente` o `Nuevo cliente`.
3. Completa el formulario.
4. Guarda el registro.

## Campos principales

- `Nombre`: nombre comercial del cliente. Es el nombre que el equipo va a reconocer en la operación diaria.
- `Código cliente`: identificador interno o externo. Déjalo vacío si quieres que Relvo lo genere desde el nombre, cuando esa opción esté disponible.

> **Importante:** si vas a inyectar usage desde CSV, API o una integración, el `Código cliente` debe coincidir con el identificador que vendrá en esos eventos. Relvo usa ese identificador para hacer match entre el uso recibido y el cliente correcto.

## Qué revisar antes de guardar

- Que el nombre sea claro para equipos de operaciones, finanzas y comercial.
- Que el código no duplique otro identificador ya usado.
- Que el código coincida con el identificador que enviará tu sistema de uso, si vas a cargar eventos por CSV, API o integración.
- Que el cliente correcto no exista previamente con otro nombre.

## Después de crear el cliente

Abre el detalle del cliente. La UI muestra secciones como `Resumen`, `Contratos` y `Facturación`.

Desde `Resumen`, completa la cuenta de facturación. Ese paso es necesario para que Relvo sepa con qué razón social, moneda, dirección y contactos debe preparar cobros.

## Hints

- Usa un nombre comercial reconocible, no solo la razón social.
- Si tu empresa ya usa IDs de cliente en ERP o CRM, usa ese valor como `Código cliente`.
- No cambies el `Código cliente` sin revisar primero cómo se inyecta usage; si deja de coincidir, los eventos pueden no hacer match con el cliente.
- No crees contratos antes de completar la cuenta de facturación si ya tienes los datos legales disponibles.
