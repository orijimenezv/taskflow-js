# TaskFlow - Proyecto Módulo 4

Aplicación web de gestión de tareas desarrollada con JavaScript moderno.

## Cómo probarla

1. Abre la carpeta en Visual Studio Code.
2. Abre `index.html` con Live Server.
3. Crea una tarea con descripción y fecha límite.
4. Prueba completar, reabrir, editar y eliminar.
5. Usa el filtro de tareas.
6. Presiona `cargar desde API` para recuperar tareas desde JSONPlaceholder.
7. Recarga la página para comprobar que las tareas se conservan en localStorage.

## Requisitos implementados

- POO con clases `Tarea` y `GestorTareas`.
- Métodos para cambiar estado y eliminar tareas.
- ES6+: `let`, `const`, template literals, arrow functions, destructuring y spread.
- Manipulación dinámica del DOM.
- Eventos `submit`, `click`, `mouseover`, `mouseout`, `keyup` y `change`.
- Asincronía con `async/await`, `setTimeout` y `setInterval`.
- Retardo al agregar una tarea.
- Notificación mostrada 2 segundos después.
- Contador regresivo para la fecha límite.
- `fetch()` con GET y POST sobre JSONPlaceholder.
- Manejo de errores con `try/catch`.
- Persistencia en `localStorage`.

## Archivos

- `index.html`: estructura.
- `styles.css`: estilos.
- `app.js`: lógica completa.
- `INFORME.pdf`: informe breve para la entrega.
- `INFORME.md`: versión editable del informe.
- `capturas/LEEME.txt`: guía de capturas sugeridas.

## Tareas de ejemplo

Al abrir la aplicación por primera vez se cargan automáticamente tres tareas de demostración: `Prueba módulo 4`, `Reunión de apoderados` y `Entregar proyecto módulo 4`. Las fechas se generan automáticamente a futuro para facilitar la prueba del contador regresivo.
