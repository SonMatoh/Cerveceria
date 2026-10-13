// Pruebas del archivo de persistencia: operaciones CRUD
// (Crear, Leer, Actualizar, Eliminar) sobre el inventario.

import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  restaurarInventario,
} from '../../data/inventarioStore.js';

describe('inventarioStore (base de datos simulada)', () => {
  beforeEach(() => {
    restaurarInventario();
  });

  it('lee el inventario completo con la semilla de productos', () => {
    const productos = obtenerProductos();
    expect(productos.length).toBeGreaterThan(0);
    expect(productos[0].nombre).toBeDefined();
    expect(productos[0].categoria).toBeDefined();
  });

  it('CREAR: agrega un producto nuevo y se puede leer por id', () => {
    const nuevo = crearProducto({
      nombre: 'Cerveza de Prueba',
      estilo: 'Test IPA (5.0° ABV)',
      descripcion: 'Cerveza creada durante el test unitario.',
      precio: 4990,
      imagen: 'imagenes/pika.png',
      categoria: 'Cervezas',
      descuento: 0,
    });

    expect(obtenerProductoPorId(nuevo.id).nombre).toBe('Cerveza de Prueba');
    expect(obtenerProductos().some((p) => p.id === nuevo.id)).toBeTrue();
  });

  it('ACTUALIZAR: modifica los datos de un producto existente', () => {
    const [primero] = obtenerProductos();
    const ok = actualizarProducto(primero.id, { precio: 1234, descuento: 25 });

    expect(ok).toBeTrue();
    expect(obtenerProductoPorId(primero.id).precio).toBe(1234);
    expect(obtenerProductoPorId(primero.id).descuento).toBe(25);
  });

  it('ELIMINAR: quita un producto del inventario', () => {
    const antes = obtenerProductos().length;
    const [primero] = obtenerProductos();

    expect(eliminarProducto(primero.id)).toBeTrue();
    expect(obtenerProductos().length).toBe(antes - 1);
    expect(obtenerProductoPorId(primero.id)).toBeNull();
  });
});
