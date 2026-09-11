# Resultados de pruebas de TaskFlow

Fecha: 10 de septiembre de 2026.

## Pruebas automatizadas

Comando: `node --test tests/taskflow.test.cjs`.

Resultado: **16 pruebas aprobadas, 0 fallidas, 0 omitidas**. Se ejecutaron nuevamente después de incorporar la confirmación de eliminación integrada.

| Caso | Resultado |
|---|---|
| Crear tarea válida y reconstruir instancias | Aprobado |
| Rechazar fechas inválidas/imposibles al crear y editar | Aprobado |
| Rechazar descripción larga, vacía y fechas pasadas | Aprobado |
| Editar conservando identidad | Aprobado |
| Completar y reabrir | Aprobado |
| Eliminar y conservar lista vacía tras reiniciar gestor | Aprobado |
| Recuperar JSON corrupto sin sobrescribir ni cargar demos | Aprobado |
| Omitir registros inválidos/duplicados y conservar tareas vencidas | Aprobado |
| Fallo de escritura sin cambiar colección ni almacenamiento anterior | Aprobado |
| Fallo de lectura con aviso | Aprobado |
| Importación sin duplicados, incluso tras recuperar almacenamiento | Aprobado |
| Respuesta API inválida sin importación parcial | Aprobado |
| Filtros por estado | Aprobado |
| Calendario local y año bisiesto | Aprobado |
| Recursos HTML, IDs únicos y controles usados por JavaScript | Aprobado |
| GET/POST, fallo HTTP/red y limpieza del temporizador | Aprobado |

Además, `node --check` aprobó app.js, modelos.js y api.js.

Las pruebas usan almacenamiento en memoria y respuestas HTTP simuladas. No escriben en el localStorage del usuario ni requieren conexión a JSONPlaceholder.

## Revisión interactiva en navegador

Navegador integrado de Codex, aplicación servida por HTTP local en 127.0.0.1:8765. Se interactuó con controles reales y se revisaron el DOM accesible y una captura de la vista móvil.

| Recorrido | Evidencia observada |
|---|---|
| Creación | La tarea «Prueba de portafolio» apareció con fecha 20-12-2026 y el total pasó de 3 a 4 |
| POST real | Mensaje «POST simulado correctamente»; no se afirmó persistencia remota |
| Edición | Se guardó «Prueba editada» con fecha 21-12-2026; el foco regresó a Editar |
| Cancelación | Se escribió «No guardar» y se cerró con Escape: se conservó «Prueba editada» |
| Completar y filtrar | El filtro completadas mostró dos tareas, incluida la tarea de prueba |
| Reabrir y persistencia | Tras reabrir y recargar, la tarea editada permaneció pendiente con su fecha |
| GET real | Se importaron tres ejemplos; el total pasó de 4 a 7 |
| Importación repetida | Total 7 y mensaje que informa que no se agregaron duplicados |
| Eliminación final | Confirmación integrada con Cancelar enfocado; al confirmar, el total pasó de 7 a 6 y desapareció la tarea de prueba |
| Teclado | Enter abrió edición; Tab llevó de descripción a fecha; Escape cerró. Se observó foco de Editar conservado entre actualizaciones del contador |
| Móvil | Viewport 375 × 812, revisión visual de formulario, resumen y tarjetas. Ancho de documento observado 360 px, sin desbordamiento horizontal |
| API no disponible | En tests/sin-api.html, crear mostró que la tarea seguía guardada localmente; importar mostró el fallo simulado |

## Incidencias de la revisión

La confirmación original mediante window.confirm bloqueó el control del navegador de pruebas. Se sustituyó por un diálogo HTML integrado y la eliminación se comprobó correctamente en una pestaña nueva con la versión actual. No se presenta el intento bloqueado como prueba aprobada.

## Límites y pendientes

- La indisponibilidad de API se simuló rechazando fetch dentro de la aplicación; no se desconectó físicamente la red ni se probó una PWA offline.
- La corrupción y los fallos de cuota/permisos se verificaron con almacenamiento simulado, no alterando cuotas reales del navegador.
- La lista vacía persistente se comprobó automáticamente; no se eliminaron manualmente todos los ejemplos del navegador.
- La prueba móvil utilizó emulación de viewport, no un teléfono físico.
- No se ejecutó una auditoría con lector de pantalla, una matriz Firefox/Safari ni pruebas exhaustivas de contraste.
- El escenario sin API comparte el almacenamiento del origen local; usar datos de prueba. No ejecutarlo simultáneamente con ediciones en otras pestañas.
- Durante la revisión local original no se generaron capturas permanentes ni se publicó la demo. La publicación y las comprobaciones posteriores de la autora se registran en la sección de GitHub Pages. Las capturas siguen pendientes.
- El PDF académico no fue regenerado; conserva el documento original.

## Repetición manual del fallo de API

Servir el proyecto y abrir `tests/sin-api.html`. Crear una tarea de prueba con fecha futura y comprobar el mensaje de guardado local; intentar importar y comprobar el error. Volver a index.html para el comportamiento normal. La página de prueba modifica fetch solo dentro de su iframe y no cambia la configuración de red del navegador.

## Verificación de cierre

11 de septiembre de 2026: se repitió la suite completa, con 16 pruebas aprobadas y 0 fallidas. La revisión interactiva descrita arriba corresponde al 10 de septiembre.

## Verificación de la demo en GitHub Pages por la autora

Demo: [Ver demo](https://orijimenezv.github.io/taskflow-js/).

Orielle Jiménez confirmó haber verificado estos recorridos en la demo pública:

- Abrir la página.
- Crear una tarea.
- Editar una tarea.
- Completar y reabrir una tarea.

Este registro recoge únicamente las comprobaciones comunicadas por la autora. No se atribuyen a esta revisión pública pruebas de eliminación, filtros, persistencia tras recarga, importación desde la API, uso sin conexión, teclado ni responsive. Las pruebas locales anteriores se conservan por separado.
