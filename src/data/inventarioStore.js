// ============================================================================
// ARCHIVO DE PERSISTENCIA / BASE DE DATOS SIMULADA
// Fuente única de datos del inventario, con operaciones CRUD
// (Crear, Leer, Actualizar, Eliminar) sobre localStorage.
//
// Los componentes de React se conectan a este archivo mediante
// suscripción (notificación de cambios) para actualizar la interfaz
// en tiempo real sin recargar la página.
// ============================================================================

import { productosIniciales } from './productosIniciales.js';

const CLAVE_INVENTARIO = 'inventarioTaberna';
const oyentes = new Set();

let estado = cargar();
let siguienteId =
  estado.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;

// Caché de datos derivados: useSyncExternalStore exige que getSnapshot
// devuelva SIEMPRE la misma referencia si los datos no cambiaron.
// (sin esta caché, getters como obtenerCategorias() generan un array nuevo
//  en cada llamada y React entra en bucle de actualizaciones infinito)
let cacheCategorias = null;
let cacheOferta = null;

function invalidarCaches() {
  cacheCategorias = null;
  cacheOferta = null;
}

function cargar() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_INVENTARIO));
    if (Array.isArray(guardado) && guardado.length > 0) {
      return guardado;
    }
  } catch {
    // archivo corrupto: se restaura la semilla
  }
  localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(productosIniciales));
  return productosIniciales.map((p) => ({ ...p }));
}

function guardarYNotificar() {
  localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(estado));
  invalidarCaches();
  oyentes.forEach((oyente) => oyente());
}

// ---------- LECTURA ----------

export function obtenerProductos() {
  return estado;
}

export function obtenerProductoPorId(id) {
  return estado.find((p) => Number(p.id) === Number(id)) || null;
}

export function obtenerCategorias() {
  if (!cacheCategorias) {
    const set = new Set(estado.map((p) => p.categoria));
    cacheCategorias = [...set].sort();
  }
  return cacheCategorias;
}

export function productosEnOferta() {
  if (!cacheOferta) {
    cacheOferta = estado.filter((p) => Number(p.descuento) > 0);
  }
  return cacheOferta;
}

// ---------- CREAR ----------

export function crearProducto(datos) {
  const nuevo = {
    id: siguienteId++,
    nombre: String(datos.nombre || '').trim(),
    estilo: String(datos.estilo || '').trim(),
    descripcion: String(datos.descripcion || '').trim(),
    precio: Number(datos.precio) || 0,
    imagen: String(datos.imagen || '').trim(),
    categoria: String(datos.categoria || 'Cervezas').trim(),
    descuento: Number(datos.descuento) || 0,
  };
  estado = [...estado, nuevo];
  guardarYNotificar();
  return nuevo;
}

// ---------- ACTUALIZAR ----------

export function actualizarProducto(id, cambios) {
  let actualizado = false;
  estado = estado.map((producto) => {
    if (Number(producto.id) !== Number(id)) return producto;
    actualizado = true;
    return {
      ...producto,
      ...cambios,
      id: producto.id, // el id no se modifica
      precio: Number(cambios.precio ?? producto.precio),
      descuento: Number(cambios.descuento ?? producto.descuento),
    };
  });
  if (actualizado) guardarYNotificar();
  return actualizado;
}

// ---------- ELIMINAR ----------

export function eliminarProducto(id) {
  const antes = estado.length;
  estado = estado.filter((p) => Number(p.id) !== Number(id));
  const elimino = estado.length < antes;
  if (elimino) guardarYNotificar();
  return elimino;
}

// ---------- RESTAURAR (reset a la semilla) ----------

export function restaurarInventario() {
  estado = productosIniciales.map((p) => ({ ...p }));
  siguienteId =
    estado.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
  guardarYNotificar();
  return estado;
}

// ---------- SUSCRIPCIÓN (React se conecta aquí) ----------

export function suscribirInventario(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}
