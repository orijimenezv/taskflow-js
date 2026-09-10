# Informe breve - TaskFlow

## Descripción

TaskFlow es una aplicación web para gestionar tareas. Permite crear, editar, completar, reabrir y eliminar tareas, además de filtrarlas por estado y conservarlas en el navegador.

## Programación orientada a objetos

Se creó la clase `Tarea`, que contiene las propiedades `id`, `descripcion`, `estado`, `fechaCreacion` y `fechaLimite`. La clase incluye métodos para cambiar el estado y participar en la eliminación de la tarea. También se creó la clase `GestorTareas`, encargada de administrar la lista, editar, eliminar, guardar y recuperar tareas.

## JavaScript ES6+

El código utiliza `let` y `const`, funciones flecha, template literals, destructuring y spread. Estas herramientas permiten escribir un código más claro y ordenado.

## DOM y eventos

La lista de tareas se construye dinámicamente desde JavaScript. El formulario utiliza el evento `submit`; los botones usan `click`; las tarjetas reaccionan a `mouseover` y `mouseout`; y el campo de descripción usa `keyup` para mostrar el contador de caracteres.

## Asincronía

Al crear una tarea se simula un pequeño retardo. También se utiliza `setTimeout` para mostrar una notificación después de dos segundos y `setInterval` para actualizar cada segundo el contador regresivo de las tareas con fecha límite.

## API y almacenamiento

La aplicación utiliza `fetch()` para recuperar tareas desde JSONPlaceholder y para simular el envío de una nueva tarea mediante una petición POST. Las peticiones se manejan con `async/await` y `try/catch`. Además, las tareas se almacenan en `localStorage`, por lo que se mantienen al recargar la página.

## Resultado

La aplicación cumple los principales requisitos de la evaluación: orientación a objetos, ES6+, manipulación del DOM, eventos, asincronía, consumo de API, manejo de errores y almacenamiento local.

## Autora

Orielle Jiménez
