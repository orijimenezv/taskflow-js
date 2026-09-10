// =============================================================
// TaskFlow - Evaluación Módulo 4
// Programación avanzada en JavaScript
// Contenidos: POO, ES6+, DOM, eventos, asincronía, API y localStorage
// =============================================================

// 1. ORIENTACIÓN A OBJETOS
class Tarea {
  constructor({
    id = `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    descripcion,
    estado = 'pendiente',
    fechaCreacion = new Date().toISOString(),
    fechaLimite
  }) {
    this.id = id;
    this.descripcion = descripcion;
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
    this.fechaLimite = fechaLimite;
  }

  cambiarEstado() {
    this.estado = this.estado === 'pendiente' ? 'completada' : 'pendiente';
  }

  // Método solicitado para eliminar una tarea.
  // Devuelve su id para que GestorTareas pueda quitarla de la colección.
  eliminar() {
    return this.id;
  }
}

class GestorTareas {
  constructor(clave = 'taskflow_tareas') {
    this.clave = clave;
    this.tareas = this.recuperar();
  }

  agregar(datos) {
    const tarea = new Tarea(datos);
    this.tareas = [...this.tareas, tarea]; // spread ES6
    this.guardar();
    return tarea;
  }

  eliminar(id) {
    const tarea = this.tareas.find(item => item.id === id);
    if (!tarea) return;

    const idAEliminar = tarea.eliminar();
    this.tareas = this.tareas.filter(item => item.id !== idAEliminar);
    this.guardar();
  }

  editar(id, cambios = {}) {
    const tarea = this.tareas.find(item => item.id === id);
    if (!tarea) return;

    const { descripcion, fechaLimite } = cambios; // destructuring ES6
    if (descripcion?.trim()) tarea.descripcion = descripcion.trim();
    if (fechaLimite) tarea.fechaLimite = fechaLimite;
    this.guardar();
  }

  cambiarEstado(id) {
    const tarea = this.tareas.find(item => item.id === id);
    if (tarea) tarea.cambiarEstado();
    this.guardar();
  }

  guardar() {
    localStorage.setItem(this.clave, JSON.stringify(this.tareas));
  }

  recuperar() {
    try {
      const guardadas = localStorage.getItem(this.clave);
      if (!guardadas) return [];
      return JSON.parse(guardadas).map(datos => new Tarea(datos));
    } catch (error) {
      console.error('No fue posible recuperar las tareas', error);
      return [];
    }
  }
}

// 2. ES6+ Y MANIPULACIÓN DEL DOM
const gestor = new GestorTareas();

// Tareas de ejemplo para que la aplicación muestre contenido desde el inicio.
// Solo se agregan cuando no existen tareas guardadas previamente en localStorage.
if (gestor.tareas.length === 0) {
  const crearFechaEjemplo = dias => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
  };

  gestor.agregar({
    descripcion: 'Prueba módulo 4',
    fechaLimite: crearFechaEjemplo(7)
  });

  gestor.agregar({
    descripcion: 'Reunión de apoderados',
    fechaLimite: crearFechaEjemplo(14)
  });

  gestor.agregar({
    descripcion: 'Entregar proyecto módulo 4',
    fechaLimite: crearFechaEjemplo(21),
    estado: 'completada'
  });
}

const $ = selector => document.querySelector(selector);

const elementos = {
  form: $('#formTarea'),
  descripcion: $('#descripcion'),
  fecha: $('#fechaLimite'),
  lista: $('#listaTareas'),
  filtro: $('#filtro'),
  guardar: $('#guardarTarea'),
  ejemplos: $('#cargarEjemplos'),
  estadoApi: $('#estadoApi'),
  notificacion: $('#notificacion'),
  contador: $('#contadorTexto'),
  total: $('#totalTareas'),
  pendientes: $('#tareasPendientes'),
  completadas: $('#tareasCompletadas')
};

const esperar = milisegundos => new Promise(resolve => setTimeout(resolve, milisegundos));

const fechaISO = fecha => fecha.toISOString().slice(0, 10);
const formatearFecha = fecha => new Intl.DateTimeFormat('es-CL').format(new Date(`${fecha}T00:00:00`));

const escaparHTML = texto => texto.replace(/[&<>'"]/g, caracter => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}[caracter]));

const tiempoRestante = fecha => {
  const limite = new Date(`${fecha}T23:59:59`);
  const diferencia = limite - new Date();

  if (diferencia <= 0) return 'plazo vencido';

  const segundosTotales = Math.floor(diferencia / 1000);
  const dias = Math.floor(segundosTotales / 86400);
  const horas = Math.floor((segundosTotales % 86400) / 3600);
  const minutos = Math.floor((segundosTotales % 3600) / 60);
  const segundos = segundosTotales % 60;

  return `${dias}d ${horas}h ${minutos}m ${segundos}s`;
};

const mostrarNotificacion = mensaje => {
  elementos.notificacion.textContent = mensaje;
  elementos.notificacion.classList.add('visible');
  setTimeout(() => elementos.notificacion.classList.remove('visible'), 2500);
};

// Requisito de asincronía: la notificación aparece después de 2 segundos.
const notificarDespuesDeDosSegundos = mensaje => {
  setTimeout(() => mostrarNotificacion(mensaje), 2000);
};

const crearTarjeta = tarea => {
  const textoLimite = tarea.estado === 'completada'
    ? 'tarea completada'
    : `tiempo restante ${tiempoRestante(tarea.fechaLimite)}`;

  const articulo = document.createElement('article');
  articulo.className = `tarea ${tarea.estado}`;
  articulo.dataset.id = tarea.id;
  articulo.innerHTML = `
    <div>
      <h3>${escaparHTML(tarea.descripcion)}</h3>
      <p>creada ${new Date(tarea.fechaCreacion).toLocaleDateString('es-CL')} · fecha límite ${formatearFecha(tarea.fechaLimite)}</p>
      <p>${textoLimite}</p>
    </div>
    <div class="botones">
      <button class="completar" data-accion="estado" type="button">${tarea.estado === 'pendiente' ? 'completar' : 'reabrir'}</button>
      <button class="secundario" data-accion="editar" type="button">editar</button>
      <button class="peligro" data-accion="eliminar" type="button">eliminar</button>
    </div>`;

  return articulo;
};

const renderizar = () => {
  const filtro = elementos.filtro.value;
  const tareasFiltradas = gestor.tareas.filter(tarea => filtro === 'todas' || tarea.estado === filtro);

  elementos.lista.replaceChildren(...tareasFiltradas.map(crearTarjeta));

  if (!tareasFiltradas.length) {
    elementos.lista.innerHTML = '<p class="vacio">no hay tareas en esta sección</p>';
  }

  const completadas = gestor.tareas.filter(({ estado }) => estado === 'completada').length;
  elementos.total.textContent = gestor.tareas.length;
  elementos.completadas.textContent = completadas;
  elementos.pendientes.textContent = gestor.tareas.length - completadas;
};

// 3. CONSUMO DE API
// Función que guarda/sincroniza una tarea en una API externa.
const guardarTareaEnApi = async tarea => {
  const respuesta = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: tarea.descripcion,
      completed: tarea.estado === 'completada',
      userId: 1
    })
  });

  if (!respuesta.ok) throw new Error('Error al guardar la tarea en la API');
  return respuesta.json();
};

// Función que recupera tareas desde una API externa.
const recuperarTareasDeApi = async () => {
  const respuesta = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=3');
  if (!respuesta.ok) throw new Error('Error al recuperar tareas desde la API');
  return respuesta.json();
};

const cargarEjemplos = async () => {
  elementos.ejemplos.disabled = true;
  elementos.estadoApi.textContent = 'cargando tareas desde la API';

  try {
    const datos = await recuperarTareasDeApi();
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 7);

    datos.forEach(({ title, completed }) => {
      gestor.agregar({
        descripcion: title,
        estado: completed ? 'completada' : 'pendiente',
        fechaLimite: fechaISO(fecha)
      });
    });

    elementos.estadoApi.textContent = 'tareas recuperadas correctamente desde la API';
    mostrarNotificacion('tareas de ejemplo agregadas');
    renderizar();
  } catch (error) {
    console.error(error);
    elementos.estadoApi.textContent = 'no se pudo conectar con la API';
  } finally {
    elementos.ejemplos.disabled = false;
  }
};

// 4. EVENTOS DEL DOM
// submit + asincronía con retardo al agregar una tarea
elementos.form.addEventListener('submit', async evento => {
  evento.preventDefault();

  const descripcion = elementos.descripcion.value.trim();
  const fechaLimite = elementos.fecha.value;
  if (!descripcion || !fechaLimite) return;

  elementos.guardar.disabled = true;
  elementos.guardar.textContent = 'agregando...';

  // Simula un pequeño retardo antes de agregar la tarea.
  await esperar(800);

  const tarea = gestor.agregar({ descripcion, fechaLimite });
  renderizar();
  elementos.form.reset();
  elementos.contador.textContent = '0 de 80';
  elementos.guardar.disabled = false;
  elementos.guardar.textContent = 'agregar tarea';

  // La notificación se muestra 2 segundos después.
  notificarDespuesDeDosSegundos('tarea agregada correctamente');

  try {
    await guardarTareaEnApi(tarea);
    elementos.estadoApi.textContent = 'última tarea sincronizada con la API';
  } catch (error) {
    console.error(error);
    elementos.estadoApi.textContent = 'tarea guardada en localStorage sin sincronización externa';
  }
});

// click: completar/reabrir, editar y eliminar
elementos.lista.addEventListener('click', ({ target }) => {
  const boton = target.closest('button');
  if (!boton) return;

  const tarjeta = boton.closest('.tarea');
  const id = tarjeta?.dataset.id;
  if (!id) return;

  if (boton.dataset.accion === 'estado') {
    gestor.cambiarEstado(id);
  }

  if (boton.dataset.accion === 'eliminar') {
    const confirmar = window.confirm('¿quieres eliminar esta tarea?');
    if (confirmar) gestor.eliminar(id);
  }

  if (boton.dataset.accion === 'editar') {
    const tarea = gestor.tareas.find(item => item.id === id);
    if (!tarea) return;

    const nuevaDescripcion = window.prompt('edita la descripción', tarea.descripcion);
    if (nuevaDescripcion === null) return;

    const nuevaFecha = window.prompt('edita la fecha límite (AAAA-MM-DD)', tarea.fechaLimite);
    gestor.editar(id, {
      descripcion: nuevaDescripcion,
      fechaLimite: nuevaFecha || tarea.fechaLimite
    });
  }

  renderizar();
});

// mouseover solicitado en la consigna
elementos.lista.addEventListener('mouseover', ({ target }) => {
  target.closest('.tarea')?.classList.add('destacada');
});

elementos.lista.addEventListener('mouseout', ({ target }) => {
  target.closest('.tarea')?.classList.remove('destacada');
});

// keyup solicitado en la consigna
elementos.descripcion.addEventListener('keyup', () => {
  elementos.contador.textContent = `${elementos.descripcion.value.length} de 80`;
});

elementos.filtro.addEventListener('change', renderizar);
elementos.ejemplos.addEventListener('click', cargarEjemplos);

// Fecha mínima: hoy
const hoy = new Date();
elementos.fecha.min = fechaISO(hoy);

// Requisito setInterval: contador regresivo actualizado cada segundo.
let intervaloContador = setInterval(renderizar, 1000);

// Evita mantener el intervalo si la página se cierra.
window.addEventListener('beforeunload', () => clearInterval(intervaloContador));

renderizar();
