'use strict';
// Fechas de calendario locales; ISO con hora se reserva para fechaCreacion.
const fechaLocal = (fecha = new Date()) => `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
const fechaValida = valor => {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00`);
  return !Number.isNaN(fecha.getTime()) && fechaLocal(fecha) === valor;
};
const validarDatos = ({ descripcion, fechaLimite }, permitirVencida = false) => {
  if (typeof descripcion !== 'string' || !descripcion.trim() || descripcion.trim().length > 80) throw new Error('La descripción debe tener entre 1 y 80 caracteres.');
  if (!fechaValida(fechaLimite)) throw new Error('Ingresa una fecha válida.');
  if (!permitirVencida && fechaLimite < fechaLocal()) throw new Error('La fecha límite no puede ser anterior a hoy.');
};
class Tarea {
  constructor({ id = `${Date.now()}-${Math.random().toString(16).slice(2)}`, descripcion, estado = 'pendiente', fechaCreacion = new Date().toISOString(), fechaLimite, origenApi }) {
    validarDatos({ descripcion, fechaLimite }, true);
    if (typeof id !== 'string' || !id || !['pendiente', 'completada'].includes(estado) || typeof fechaCreacion !== 'string' || !Number.isFinite(Date.parse(fechaCreacion))) throw new Error('Datos de tarea inválidos.');
    if (origenApi !== undefined && (!Number.isInteger(origenApi) || origenApi < 1)) throw new Error('Origen API inválido.');
    Object.assign(this, { id, descripcion: descripcion.trim(), estado, fechaCreacion, fechaLimite });
    if (origenApi !== undefined) this.origenApi = origenApi;
  }
  cambiarEstado() { this.estado = this.estado === 'pendiente' ? 'completada' : 'pendiente'; }
}
class GestorTareas {
  constructor(almacenamiento, clave = 'taskflow_tareas') {
    this.almacenamiento = almacenamiento;
    this.clave = clave;
    this.aviso = '';
    this.esNuevo = false;
    this.tareas = this.recuperar();
  }
  recuperar() {
    try {
      const texto = this.almacenamiento.getItem(this.clave);
      this.esNuevo = texto === null;
      if (texto === null) return [];
      const datos = JSON.parse(texto);
      if (!Array.isArray(datos)) throw new Error('Formato inválido');
      const ids = new Set();
      return datos.flatMap(dato => {
        try {
          const tarea = new Tarea(dato);
          if (ids.has(tarea.id)) throw new Error('ID repetido');
          ids.add(tarea.id);
          return [tarea];
        } catch {
          this.aviso = 'Se omitieron tareas guardadas inválidas. El almacenamiento original no se cambia hasta que guardes una modificación.';
          return [];
        }
      });
    } catch {
      this.aviso = 'No se pudieron recuperar las tareas. El almacenamiento original no se cambia hasta que guardes una modificación.';
      return [];
    }
  }
  // Persistir antes de cambiar la colección evita mostrar como guardado un cambio fallido.
  guardar(tareas) {
    try { this.almacenamiento.setItem(this.clave, JSON.stringify(tareas)); }
    catch { throw new Error('No se pudo guardar en este navegador. Revisa el espacio o los permisos de almacenamiento e intenta nuevamente.'); }
    this.tareas = tareas;
    this.esNuevo = false;
  }
  agregar(datos) {
    validarDatos(datos);
    const tarea = new Tarea(datos);
    this.guardar([...this.tareas, tarea]);
    return tarea;
  }
  editar(id, cambios) {
    validarDatos(cambios);
    this.guardar(this.tareas.map(t => t.id === id ? new Tarea({ ...t, ...cambios, id: t.id }) : t));
  }
  cambiarEstado(id) {
    this.guardar(this.tareas.map(t => {
      const copia = new Tarea(t);
      if (t.id === id) copia.cambiarEstado();
      return copia;
    }));
  }
  eliminar(id) { this.guardar(this.tareas.filter(t => t.id !== id)); }
  filtrar(estado) { return this.tareas.filter(t => estado === 'todas' || t.estado === estado); }
  iniciarEjemplos() {
    if (!this.esNuevo) return;
    const tareas = ['Prueba módulo 4', 'Reunión de apoderados', 'Entregar proyecto módulo 4'].map((descripcion, i) => {
      const fecha = new Date(); fecha.setDate(fecha.getDate() + (i + 1) * 7);
      return new Tarea({ descripcion, fechaLimite: fechaLocal(fecha), estado: i === 2 ? 'completada' : 'pendiente' });
    });
    this.guardar(tareas);
  }
  importar(datos) {
    if (!Array.isArray(datos)) throw new Error('Respuesta de API inválida.');
    const origenes = new Set(this.tareas.map(t => t.origenApi));
    const fecha = new Date(); fecha.setDate(fecha.getDate() + 7);
    const nuevas = [];
    for (const dato of datos) {
      if (!dato || !Number.isInteger(dato.id) || dato.id < 1 || typeof dato.completed !== 'boolean') throw new Error('Respuesta de API inválida.');
      if (origenes.has(dato.id)) continue;
      nuevas.push(new Tarea({ descripcion: dato.title, estado: dato.completed ? 'completada' : 'pendiente', fechaLimite: fechaLocal(fecha), origenApi: dato.id }));
      origenes.add(dato.id);
    }
    if (nuevas.length) this.guardar([...this.tareas, ...nuevas]);
    return nuevas.length;
  }
}
// Exportación opcional para pruebas con Node; en el navegador se carga como script clásico.
if (typeof module !== 'undefined') module.exports = { Tarea, GestorTareas, fechaLocal, fechaValida, validarDatos };
