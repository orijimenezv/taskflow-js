'use strict';
const $ = selector => document.querySelector(selector);
const elementos = {
  form: $('#formTarea'), descripcion: $('#descripcion'), fecha: $('#fechaLimite'), lista: $('#listaTareas'), filtro: $('#filtro'), guardar: $('#guardarTarea'), ejemplos: $('#cargarEjemplos'), estadoApi: $('#estadoApi'), notificacion: $('#notificacion'), contador: $('#contadorTexto'), total: $('#totalTareas'), pendientes: $('#tareasPendientes'), completadas: $('#tareasCompletadas')
};
// El acceso al almacenamiento también puede fallar por permisos del navegador.
const almacenamiento = { getItem: clave => window.localStorage.getItem(clave), setItem: (clave, valor) => window.localStorage.setItem(clave, valor) };
const gestor = new GestorTareas(almacenamiento);
let temporizadorNotificacion;
const mostrarNotificacion = mensaje => {
  clearTimeout(temporizadorNotificacion);
  elementos.notificacion.textContent = mensaje;
  elementos.notificacion.classList.add('visible');
  temporizadorNotificacion = setTimeout(() => elementos.notificacion.classList.remove('visible'), 5000);
};
const tiempoRestante = fecha => {
  const segundos = Math.max(0, Math.floor((new Date(`${fecha}T23:59:59`) - new Date()) / 1000));
  if (!segundos) return 'Plazo vencido';
  return `Tiempo restante: ${Math.floor(segundos / 86400)}d ${Math.floor(segundos % 86400 / 3600)}h ${Math.floor(segundos % 3600 / 60)}m ${segundos % 60}s`;
};
const actualizarTiempos = () => {
  elementos.lista.querySelectorAll('[data-fecha]').forEach(nodo => { nodo.textContent = tiempoRestante(nodo.dataset.fecha); });
  elementos.fecha.min = fechaLocal();
};
const crearTarjeta = tarea => {
  const articulo = document.createElement('article');
  articulo.className = `tarea ${tarea.estado}`;
  articulo.dataset.id = tarea.id;
  articulo.innerHTML = '<div><h3></h3><p class="fechas"></p><p class="tiempo"></p></div><div class="botones"></div>';
  articulo.querySelector('h3').textContent = tarea.descripcion;
  const formato = new Intl.DateTimeFormat('es-CL');
  articulo.querySelector('.fechas').textContent = `Creada ${formato.format(new Date(tarea.fechaCreacion))} · fecha límite ${formato.format(new Date(`${tarea.fechaLimite}T00:00:00`))}`;
  const tiempo = articulo.querySelector('.tiempo');
  if (tarea.estado === 'completada') tiempo.textContent = 'Tarea completada';
  else { tiempo.dataset.fecha = tarea.fechaLimite; tiempo.textContent = tiempoRestante(tarea.fechaLimite); }
  [['estado', tarea.estado === 'pendiente' ? 'Completar' : 'Reabrir', 'completar'], ['editar', 'Editar', 'secundario'], ['eliminar', 'Eliminar', 'peligro']].forEach(([accion, texto, clase]) => {
    const boton = document.createElement('button');
    boton.type = 'button'; boton.dataset.accion = accion; boton.className = clase;
    boton.textContent = texto; boton.setAttribute('aria-label', `${texto}: ${tarea.descripcion}`);
    articulo.querySelector('.botones').append(boton);
  });
  return articulo;
};
const renderizar = () => {
  const tareas = gestor.filtrar(elementos.filtro.value);
  elementos.lista.replaceChildren(...tareas.map(crearTarjeta));
  if (!tareas.length) elementos.lista.innerHTML = '<p class="vacio">No hay tareas en esta sección.</p>';
  const completadas = gestor.filtrar('completada').length;
  elementos.total.textContent = gestor.tareas.length;
  elementos.completadas.textContent = completadas;
  elementos.pendientes.textContent = gestor.tareas.length - completadas;
};
const enfocarAccion = (id, accion) => {
  const tarjeta = [...elementos.lista.children].find(n => n.dataset.id === id);
  (tarjeta?.querySelector(`[data-accion="${accion}"]`) || elementos.filtro).focus();
};
let eliminarId = null;
$('#cancelarEliminar').addEventListener('click', () => $('#eliminarDialogo').close());
$('#eliminarDialogo').addEventListener('close', () => { enfocarAccion(eliminarId, 'eliminar'); eliminarId = null; });
$('#confirmarEliminar').addEventListener('click', () => {
  try { gestor.eliminar(eliminarId); renderizar(); $('#eliminarDialogo').close(); mostrarNotificacion('Tarea eliminada.'); }
  catch (error) { $('#errorEliminar').textContent = error.message; }
});
let edicionId = null;
const dialogo = $('#editarDialogo');
const formEditar = $('#formEditar');
const descripcionEditar = $('#editarDescripcion');
const fechaEditar = $('#editarFecha');
const cerrarEdicion = () => { dialogo.close(); };
dialogo.addEventListener('close', () => { enfocarAccion(edicionId, 'editar'); edicionId = null; });
$('#cancelarEdicion').addEventListener('click', cerrarEdicion);
descripcionEditar.addEventListener('input', () => { $('#contadorEdicion').textContent = `${descripcionEditar.value.length} de 80`; });
formEditar.addEventListener('submit', evento => {
  evento.preventDefault();
  try {
    gestor.editar(edicionId, { descripcion: descripcionEditar.value, fechaLimite: fechaEditar.value });
    renderizar(); cerrarEdicion(); mostrarNotificacion('Tarea editada y guardada en este navegador.');
  } catch (error) { $('#errorEdicion').textContent = error.message; }
});
elementos.form.addEventListener('submit', async evento => {
  evento.preventDefault();
  elementos.guardar.disabled = true;
  let tarea;
  try {
    tarea = gestor.agregar({ descripcion: elementos.descripcion.value, fechaLimite: elementos.fecha.value });
    renderizar(); elementos.form.reset(); elementos.contador.textContent = '0 de 80';
    $('#errorFormulario').textContent = '';
    mostrarNotificacion('Tarea guardada en este navegador.');
  } catch (error) { $('#errorFormulario').textContent = error.message; }
  finally { elementos.guardar.disabled = false; }
  if (!tarea) return;
  elementos.estadoApi.textContent = 'Probando POST en la API de demostración…';
  try { await guardarTareaEnApi(tarea); elementos.estadoApi.textContent = 'POST simulado correctamente. La tarea real está guardada solo en este navegador.'; }
  catch { elementos.estadoApi.textContent = 'API no disponible. La tarea sigue guardada en este navegador.'; }
});
elementos.lista.addEventListener('click', ({ target }) => {
  const boton = target.closest('button');
  if (!boton) return;
  const id = boton.closest('.tarea').dataset.id;
  const accion = boton.dataset.accion;
  if (accion === 'editar') {
    const tarea = gestor.tareas.find(t => t.id === id);
    edicionId = id; descripcionEditar.value = tarea.descripcion; fechaEditar.value = tarea.fechaLimite;
    fechaEditar.min = fechaLocal(); $('#contadorEdicion').textContent = `${tarea.descripcion.length} de 80`; $('#errorEdicion').textContent = '';
    dialogo.showModal(); descripcionEditar.focus(); return;
  }
  if (accion === 'eliminar') {
    eliminarId = id; $('#errorEliminar').textContent = ''; $('#eliminarDialogo').showModal(); $('#cancelarEliminar').focus(); return;
  }
  try {
    if (accion === 'estado') gestor.cambiarEstado(id);
    if (accion === 'eliminar') gestor.eliminar(id);
    renderizar(); enfocarAccion(id, accion); mostrarNotificacion('Cambio guardado en este navegador.');
  } catch (error) { mostrarNotificacion(error.message); }
});
elementos.descripcion.addEventListener('input', () => { elementos.contador.textContent = `${elementos.descripcion.value.length} de 80`; });
elementos.filtro.addEventListener('change', renderizar);
elementos.ejemplos.addEventListener('click', async () => {
  elementos.ejemplos.disabled = true;
  elementos.estadoApi.textContent = 'Cargando ejemplos de JSONPlaceholder…';
  try {
    const cantidad = gestor.importar(await recuperarTareasDeApi());
    renderizar(); elementos.estadoApi.textContent = cantidad ? `${cantidad} tareas de demostración importadas y guardadas localmente.` : 'Estos ejemplos ya están en tu lista. No se agregaron duplicados.';
  } catch (error) { elementos.estadoApi.textContent = `No se pudo importar. ${error.message}`; }
  finally { elementos.ejemplos.disabled = false; }
});
try { gestor.iniciarEjemplos(); } catch (error) { gestor.aviso = error.message; }
if (gestor.aviso) $('#avisoAlmacenamiento').textContent = gestor.aviso;
renderizar(); actualizarTiempos();
const intervaloContador = setInterval(actualizarTiempos, 1000);
window.addEventListener('beforeunload', () => { clearInterval(intervaloContador); clearTimeout(temporizadorNotificacion); });
