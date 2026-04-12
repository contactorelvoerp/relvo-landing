# Cómo importar uso por CSV

La vista `Importar uso (CSV)` es el flujo guiado para cargar eventos de consumo en lote. Es la opción más adecuada cuando recibes uso desde una fuente externa o cuando haces una carga histórica.

## Cuándo usar esta vista

Usa esta vista si el volumen de eventos hace poco práctico el alta manual. También te conviene cuando necesitas validar muchas filas antes de confirmar su ingreso.

## Cómo funciona la importación

1. Carga un archivo CSV.
2. Relvo previsualiza y valida las filas.
3. Confirma la importación.
4. Revisa el resultado, incluyendo ingresados, duplicados y rechazados.

Este flujo secuencial te permite detectar problemas antes de confirmar la carga definitiva.
