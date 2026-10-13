// Pruebas de la lógica de ofertas del día para socios (lógica pura):
// selección determinista por fecha y descuento del 10% solo con sesión.

import {
  productosDelDia,
  esElegido,
  precioSocio,
} from '../../utils/socios.js';
import {
  restaurarInventario,
  obtenerProductos,
} from '../../data/inventarioStore.js';
import { cerrarSesion } from '../../data/sesionStore.js';

describe('socios (ofertas del día)', () => {
  const sesion = { nombre: 'Socio', email: 'cliente@duoc.cl' };

  beforeEach(() => {
    restaurarInventario();
    cerrarSesion();
  });

  afterEach(() => {
    cerrarSesion();
  });

  it('SELECCIÓN: entrega 3 productos del día y [] si el inventario está vacío', () => {
    expect(productosDelDia().length).toBe(3);
    expect(productosDelDia([])).toEqual([]);
  });

  it('DETERMINISTA: dos cálculos seguidos devuelven los mismos productos (sin Math.random)', () => {
    const primero = productosDelDia();
    const segundo = productosDelDia();

    expect(primero.map((p) => p.id)).toEqual(segundo.map((p) => p.id));
    expect(primero.length).toBe(3);
  });

  it('SIN SESIÓN: no aplica descuento aunque el producto esté en la oferta', () => {
    const elegido = productosDelDia()[0];

    expect(esElegido(null, elegido.id)).toBeFalse();
    expect(precioSocio(5000, null, elegido.id)).toBe(5000);
  });

  it('CON SESIÓN: aplica -10% solo a los 3 elegidos del día', () => {
    const elegido = productosDelDia()[0];

    expect(esElegido(sesion, elegido.id)).toBeTrue();
    expect(precioSocio(5000, sesion, elegido.id)).toBe(4500);

    // un producto fuera de la oferta mantiene su precio
    const fuera = obtenerProductos().find(
      (p) => !productosDelDia().some((e) => e.id === p.id)
    );
    expect(esElegido(sesion, fuera.id)).toBeFalse();
    expect(precioSocio(5000, sesion, fuera.id)).toBe(5000);
  });
});
