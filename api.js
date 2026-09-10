'use strict';
const solicitarApi = async (opciones) => {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 10000);
  try {
    const respuesta = await fetch(`https://jsonplaceholder.typicode.com/todos${opciones ? '' : '?_limit=3'}`, { ...opciones, signal: controlador.signal });
    if (!respuesta.ok) throw new Error('La API de demostración no respondió correctamente.');
    return await respuesta.json();
  } finally { clearTimeout(temporizador); }
};
const guardarTareaEnApi = tarea => solicitarApi({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: tarea.descripcion, completed: tarea.estado === 'completada', userId: 1 }) });
const recuperarTareasDeApi = () => solicitarApi();
