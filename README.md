# TaskFlow

Gestor de tareas desarrollado con JavaScript vanilla y POO con persistencia local e integración de una API de demostración.

Proyecto nacido en la evaluación del Módulo 4 del bootcamp Full Stack JavaScript Trainee y mejorado para portafolio. Su alcance actual es frontend: no incluye backend propio ni autenticación.

## Demo y capturas

**[Ver demo](https://orijimenezv.github.io/taskflow-js/)**

Demo pública verificada por Orielle Jiménez en GitHub Pages: apertura de la página, creación y edición de una tarea, completar y reabrir. Consulta el alcance de estas comprobaciones en [resultados de pruebas](tests/RESULTADOS.md).
- Capturas reales: pendientes de incorporar en `capturas/`. No se incluyen imágenes ficticias.

## Objetivo

Organizar pendientes con fecha límite y practicar JavaScript moderno, orientación a objetos, DOM, asincronía y tratamiento de errores en una aplicación pequeña y comprensible.

## Funcionalidades

- Crear, editar, completar, reabrir y eliminar tareas con confirmación.
- Filtrar por estado y consultar totales.
- Consultar fechas y cuenta regresiva actualizada sin reconstruir las tarjetas.
- Editar mediante un diálogo nativo con cancelación y retorno del foco.
- Guardar tareas en el navegador y conservar una lista voluntariamente vacía.
- Cargar tres ejemplos solamente cuando no existe la clave de almacenamiento.
- Importar ejemplos de JSONPlaceholder evitando repetir los que siguen en la lista.
- Simular la creación externa con POST al crear una tarea local.
- Mostrar mensajes de validación, almacenamiento y conexión.

## Tecnologías

HTML5, CSS (Grid, Flexbox, variables y media queries), JavaScript vanilla, clases, DOM, Fetch API, promesas, async/await, temporizadores, JSON y localStorage. Sin frameworks, librerías de interfaz ni herramientas de build.

Node.js se usa opcionalmente para ejecutar las pruebas, no como servidor de la aplicación.

## Ejecución

1. Abrir la carpeta en Visual Studio Code.
2. Servir `index.html` con Live Server u otro servidor HTTP estático local.
3. Abrir la dirección que indique el servidor.

No se necesita instalar dependencias del proyecto. Se recomienda un navegador actualizado con soporte de `dialog`. Mantén el mismo origen (protocolo, host y puerto) para acceder a las mismas tareas.

## Organización y POO

```text
index.html                 Interfaz y diálogo de edición
styles.css                 Diseño, responsive y foco visible
modelos.js                 Tarea, GestorTareas y validaciones
api.js                     GET/POST y timeout de solicitudes
app.js                     DOM, eventos y notificaciones
README.md                  Presentación y guía de uso
INFORME.md                 Informe académico actualizado
INFORME.pdf                Informe académico original conservado
capturas/LEEME.txt          Guía de capturas
 tests/taskflow.test.cjs    Pruebas con node:test
 tests/sin-api.html         Escenario manual de API no disponible
 tests/RESULTADOS.md        Evidencia y límites de verificación
```

`Tarea` valida y representa identidad, descripción, estado y fechas; permite cambiar el estado. `GestorTareas` administra operaciones, filtros, importación y persistencia. Recibe un almacenamiento como argumento para poder probar fallos sin tocar datos reales. Al recuperar, reconstruye instancias de `Tarea`.

Los tres scripts se cargan en orden, sin módulos ni compilación. Se conserva una arquitectura sencilla; el almacenamiento permanece dentro del gestor.

## Persistencia local

La clave `taskflow_tareas` contiene un arreglo JSON. La ausencia de clave identifica el primer uso; `[]` representa una lista vacía existente. Borrar los datos del sitio inicia nuevamente la aplicación con ejemplos.

Cada cambio se escribe antes de reemplazar la colección en memoria. Si la escritura falla, se conserva el estado previo y se informa el error. Los registros inválidos se omiten con un aviso; el contenido original no se sobrescribe automáticamente al leerlo. La siguiente modificación guardada reemplaza el contenido por la colección válida.

Las tareas dependen del navegador y del origen. No son una copia de seguridad ni se comparten entre dispositivos. Limpiar los datos del sitio las elimina.

## JSONPlaceholder: alcance real

[JSONPlaceholder](https://jsonplaceholder.typicode.com/guide/) es una API de demostración:

- GET `/todos?_limit=3` recupera ejemplos.
- POST `/todos` simula la creación; no guarda la tarea de forma remota.
- Crear una tarea envía su descripción, estado y `userId: 1` a este servicio público. No uses información sensible para las demostraciones.
- Editar, eliminar y cambiar estado son operaciones locales.
- Las solicitudes tienen un límite de 10 segundos. Si el POST falla, la tarea local se conserva.
- Se conserva el identificador de origen para evitar duplicados al importar. Un ejemplo eliminado se puede volver a importar.

## Validaciones y manejo de errores

Creación y edición comparten las reglas: descripción de 1 a 80 caracteres después de quitar espacios extremos y fecha de calendario válida, desde hoy. Las tareas ya guardadas pueden estar vencidas y se muestran normalmente; al editar una vencida hay que elegir hoy o una fecha posterior.

Se validan también identidad, estado, fecha de creación y origen de las tareas recuperadas. Las fechas límite usan calendario local; fecha de creación incluye hora. Los textos de tareas se insertan con `textContent`.

La interfaz vuelve a habilitar controles tras errores. Los mensajes de formulario y almacenamiento son accesibles; los botones tienen nombres contextualizados, foco visible y el diálogo permite Escape/Cancelar.

## Recorrido sugerido

1. Crear una tarea con una fecha futura y revisar el contador de caracteres.
2. Editar descripción y fecha; cancelar otra edición y comprobar que no cambió.
3. Completar, filtrar completadas y reabrir.
4. Recargar y comprobar persistencia.
5. Importar dos veces: la segunda no agrega los mismos ejemplos.
6. Eliminar todas las tareas y recargar: la lista permanece vacía.
7. Abrir `tests/sin-api.html` mediante el servidor para probar un fallo de API simulado. Comparte las tareas del mismo origen.
8. Recorrer con Tab, abrir edición con Enter y cerrar con Escape.
9. Revisar a 375 px, incluyendo descripciones largas.

## Pruebas

Con Node.js compatible con `node:test`:

```sh
node --test tests/taskflow.test.cjs
```

No requiere instalar paquetes. Las pruebas de modelo usan almacenamiento en memoria. Consulta [resultados y limitaciones](tests/RESULTADOS.md) para distinguir pruebas automatizadas, revisión en navegador y pendientes.

## Aprendizajes

Validación centralizada, separación sencilla de responsabilidades, reconstrucción de instancias desde JSON, persistencia ante fallos, delegación de eventos, actualización parcial del DOM, foco en diálogos y diferencias entre una API simulada y almacenamiento remoto real.

## Limitaciones actuales

Sin cuentas, backend, sincronización real, copia de seguridad ni coordinación entre pestañas concurrentes. La API depende de un servicio externo. El filtro no se conserva al recargar. La accesibilidad no tiene una auditoría completa con lectores de pantalla. El informe PDF refleja la entrega original.

## Posibles mejoras futuras

Búsqueda, orden por vencimiento, exportación/importación de respaldo y pruebas en más navegadores. Un backend sería una ampliación futura del alcance, no una función existente.

## Autoría

Orielle Jiménez.
