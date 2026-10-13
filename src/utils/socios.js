// ============================================================================
// OFERTAS DEL DÍA PARA SOCIOS (lógica pura, sin React)
// - Solo los usuarios con sesión iniciada ("socios") ven los descuentos.
// - La selección es DETERMINISTA según la fecha: los mismos 3 productos
//   para todos durante todo el día, y cambian al cambiar de día.
// - El descuento NUNCA se guarda en el carrito: se calcula al mostrar,
//   por eso si el producto deja de estar en la oferta su precio se revierte.
// ============================================================================

import { obtenerProductos } from '../data/inventarioStore.js';

// Descuento extra del 10% para socios sobre el precio actual.
export const DESCUENTO_SOCIO = 10;

// Devuelve los 3 productos elegidos del día.
// Usa una rotación simple según el día del año (sin Math.random,
// así el resultado es estable y fácil de testear).
export function productosDelDia(productos = obtenerProductos()) {
  const lista = Array.isArray(productos) ? productos : [];
  if (lista.length === 0) return [];

  const hoy = new Date();
  const inicioAnio = new Date(hoy.getFullYear(), 0, 0);
  const diaDelAnio = Math.floor((hoy - inicioAnio) / 86400000);

  const inicio = diaDelAnio % lista.length;
  const rotada = [...lista.slice(inicio), ...lista.slice(0, inicio)];
  return rotada.slice(0, Math.min(3, rotada.length));
}

// ¿El producto está en la oferta del día y el usuario es socio?
export function esElegido(sesion, productoId) {
  if (!sesion) return false;
  return productosDelDia().some((p) => Number(p.id) === Number(productoId));
}

// Precio final aplicando el -10% del día solo si corresponde.
export function precioSocio(precio, sesion, productoId) {
  const valor = Number(precio) || 0;
  if (!esElegido(sesion, productoId)) return valor;
  return Math.round(valor * (1 - DESCUENTO_SOCIO / 100));
}
