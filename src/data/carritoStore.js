// ============================================================================
// PERSISTENCIA DEL CARRITO DE COMPRAS
// Operaciones CRUD sobre los ítems del carrito + suscripción para
// que los componentes React se actualicen en tiempo real.
// Nota: el precio final del ítem se guarda SIN descuento de socio;
// el -10% del día se aplica al calcular/mostrar (utils/socios.js).
// ============================================================================

import { precioSocio } from '../utils/socios.js';

const CLAVE_CARRITO = 'carritoTaberna';
const oyentes = new Set();

let estado = cargar();

function cargar() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

function guardarYNotificar() {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(estado));
  oyentes.forEach((oyente) => oyente());
}

export function obtenerCarrito() {
  return estado;
}

export function contarItems() {
  return estado.reduce((suma, item) => suma + item.cantidad, 0);
}

// Total del carrito aplicando el descuento de socio vigente (si corresponde).
export function totalCarrito(sesion = null) {
  return estado.reduce(
    (suma, item) =>
      suma + precioSocio(item.precioFinal, sesion, item.id) * item.cantidad,
    0
  );
}

export function agregarAlCarrito(producto, cantidad = 1) {
  const precioFinal =
    producto.descuento > 0
      ? Math.round(producto.precio * (1 - producto.descuento / 100))
      : producto.precio;

  const existe = estado.find((i) => i.id === producto.id);

  if (existe) {
    estado = estado.map((i) =>
      i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
    );
  } else {
    estado = [
      ...estado,
      {
        id: producto.id,
        nombre: producto.nombre,
        imagen: producto.imagen,
        precio: producto.precio,
        precioFinal,
        cantidad,
      },
    ];
  }
  guardarYNotificar();
}

export function cambiarCantidad(id, delta) {
  estado = estado
    .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + delta } : i))
    .filter((i) => i.cantidad > 0);
  guardarYNotificar();
}

export function eliminarDelCarrito(id) {
  estado = estado.filter((i) => i.id !== id);
  guardarYNotificar();
}

export function vaciarCarrito() {
  estado = [];
  guardarYNotificar();
}

export function suscribirCarrito(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}
