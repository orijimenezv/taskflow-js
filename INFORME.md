# Informe breve - TaskFlow

## Contexto y descripción

Proyecto de la evaluación del Módulo 4, Programación avanzada en JavaScript, actualizado para portafolio trainee. Permite crear, editar, completar, reabrir, eliminar y filtrar tareas, con persistencia en el navegador.

## Programación orientada a objetos

`Tarea` representa una tarea validada y permite cambiar su estado. `GestorTareas` administra colección, edición, eliminación, filtros, importación y almacenamiento. El método de eliminación pertenece al gestor. Se reconstruyen instancias al recuperar JSON.

## JavaScript y DOM

Se utilizan clases, const/let, funciones flecha, template literals, destructuring, spread y encadenamiento opcional. El código se organiza en modelos.js, api.js y app.js. El formulario usa submit, las acciones click, el filtro change y el contador input. El resaltado visual usa CSS. La edición utiliza un diálogo nativo, con cancelación y retorno del foco.

## Asincronía

Las peticiones utilizan fetch y async/await. setTimeout limita la duración de peticiones y controla notificaciones, cancelando temporizadores anteriores. setInterval actualiza únicamente la cuenta regresiva y la fecha mínima. Se retiraron los retardos artificiales de creación y notificación de la entrega original para ofrecer respuesta inmediata.

## API y almacenamiento

JSONPlaceholder permite recuperar ejemplos mediante GET y simular una creación mediante POST. No existe sincronización ni persistencia remota. Las tareas reales se conservan en localStorage. Se validan datos recuperados, se informa sobre corrupción y se evita cambiar la colección si falla la escritura. Una lista vacía se conserva sin volver a cargar ejemplos.

## Resultado y verificación

La versión de portafolio conserva el alcance de gestión de tareas, con validaciones compartidas, importación sin duplicados presentes, fechas locales y mejoras de accesibilidad/responsive. La evidencia de pruebas y sus limitaciones se encuentran en tests/RESULTADOS.md; no se afirma una auditoría universal de compatibilidad o accesibilidad.

INFORME.pdf se conserva como documento histórico de la entrega original y puede describir comportamientos académicos anteriores.

## Autora

Orielle Jiménez.
