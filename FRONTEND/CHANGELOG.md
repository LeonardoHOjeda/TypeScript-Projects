# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

## [Sin liberar]
## [1.1.8] - 27-09-2023
### Agregado
- Se agregó la opción de descargar el archivo completo del ultimo periodo desde el menu principal.
### Cambiado
- Se cambió el nombre de las rutas del iconMapping para que pueda observarse qué opción del menú está seleccionado.

## [1.1.7.1] - 14-09-2023
### Corregido
- Se corrigió un bug que no mostraba el fondo de ahorro del empleado.
## [1.1.7] - 06-09-2023
### Corregido
- Se corrigió un bug que mostraba los tiempos una semana antes del periodo seleccionado (Sección: Consulta Tiempos).
## [1.1.6] - 23-08-2023
### Corregido
- Se corrigió que, al seleccionar la fecha, mostraba una fecha de inicio aún con la configuración desactivada para esa característica.
## [1.1.5] - 18-08-2023
### Corregido
- Se agregó que el calendario inicie con la fecha inicial de la configuración de la Base de Datos.
## [1.1.4] - 18-08-2023
### Agregado
- Se agregó la validación de días sí está configurado en el sistema.
- Los días se deshabilitan en el calendario si no están en el periodo indicado.
## [1.1.3] - 14-08-2023
### Cambiado
- Se quitó la hora de la bitácora, ahora solo muestra la pura fecha.
- Se cambió la descripción de la bitácora, ahora muestra el texto de la "etiqueta".
## [1.1.2] - 14-08-2023
### Incorporado
- Incorporando cambios de la versión 1.0.29.
## [1.1.1] - 11-08-2023
### Corregido
- Se corrige el bug que no permitía hacer scroll cuando se abría el acordeón de la bitácora.
- Se corrige el bug que permitía hacer scroll a la página de fondo cuando el modal de la bitácora estaba abierto.

## [1.1.0] - 11-08-2023
### Agregado
- Se agrega una opción a la tabla para visualizar la bitácora del justificante.
- Se agrega un modal para visualizar la bitácora sin cambiar de página.
- Se crea un 'Accordion' por cada justificante de la tabla de bitácora.
- Se agregan colores a los estatus de la bitácora dependiendo del nivel de estatus.
## [1.0.29] - 14-08-2023
### Agregado
- Se agrega la columna 'Etiqueta' a la tabla 'Nivel Estatus' en la sección de 'Justificantes'.
### Corregido
- Se corrige el bug que no permite subir el mismo archivo una vez que se haya enviado otro justificante.
- Se corrige el bug que mostraba un mensaje de éxito en los archivos cuando había un error al subir el justificante.

## [1.0.28] - 08-08-2023

### Corregido
- Se corrige el bug de que aparezca el mensaje de exito al subir el justificante n veces, donde n es el numero de archivos a subir.
- Se corrige el bug de que aparezca información en la 'Consulta de Tiempos' sin haber seleccionado un periodo.
## [1.0.27] - 02-08-2023
### Agregado
- Se agregan filtros para aceptar únicamente archivos permitidos.

### Corregido
- Se corrige el bug que, al eliminar un archivo, no permitía subir el mismo archivo de nuevo.
## [1.0.26] - 02-08-2023
### Agregado
- Se deshabilita el boton si no se tiene un archivo seleccionado y es obligatorio.
### Corregido
- Se corrige el bug que, al eliminar el archivo, no aparecia el mensaje de que es obligatorio de nuevo.
## [1.0.25] - 31-07-2023
### Agregado
- Se elimina el justificante en caso de que la subida de archivos falle.

## [1.0.24] - 31-07-2023
### Corregido
- Se arregla bug que no permitía descargar el pdf de la nomina en tipo timbrado o en tipo web.
- Se arregla bug que mostraba el periodos del mes y el mes siguiente del seleccionado.
## [1.0.23] - 28-07-2023
### Corregido
- Se elimina el contenido del motivo al cambiar el Tipo de Solicitud, antes se mantenía el motivo de la incidencia y se enviaba en la incapacidad.
- Se arregla bug de poder subir un justificante sin archivo adjunto y que fuera obligatorio subirlo.

## [1.0.22] - 28-07-2023
### Agregado
- Badges al nivel_estatus de la tabla de justificantes.
- Ahora se puede eliminar la fecha seleccionada en el DatePicker. Cuando el usuario sube un justificante, la fecha se establece selectedDate como null, lo que permite dejar el campo de fecha vacío.

### Cambiado
- Algunos cambios realizados.

### Corregido
- Se corrigieron algunos errores.
- Se agregó una condición en el manejo de archivos en la función handleSubmit. Ahora, si no se seleccionan archivos, se establece el estado isLoadingButton como false y se sale de la función para evitar operaciones innecesarias.

[Sin liberar]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.1.8...develop
[1.1.8]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.1.7.1...v1.1.8
[1.1.7.1]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.1.7...v1.1.7.1
[1.1.7]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.1.6...v1.1.7
[1.1.6]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.1.5...v1.1.6
[1.1.5]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.1.4...v1.1.5
[1.1.4]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.1.3...v1.1.4
[1.1.3]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.1.2...v1.1.3
[1.1.2]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.1.1...v1.1.2
[1.1.1]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.1.0...v1.1.1
[1.1.0]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.0.28...v1.1.0
[1.0.29]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.0.28...v1.0.29
[1.0.28]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.0.27...v1.0.28
[1.0.27]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.0.26...v1.0.27
[1.0.26]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.0.25...v1.0.26
[1.0.25]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.0.24...v1.0.25
[1.0.24]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.0.23...v1.0.24
[1.0.23]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/v1.0.22...v1.0.23
[1.0.22]: https://gitlab.gobdigital.com/nomina/kiosko_front_react/-/compare/a2bbb2b72a61237398dcc930ff20669ce562b86a...v1.0.22
