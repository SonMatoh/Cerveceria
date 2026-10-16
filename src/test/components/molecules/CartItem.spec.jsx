import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '../../../components/molecules/CartItem.jsx';
import {
  agregarAlCarrito,
  vaciarCarrito,
  obtenerCarrito,
  contarItems,
  cerrarSesion,
} from '../../../data/Products.js';

describe('CartItem Component', () => {
  const producto = {
    id: 702,
    nombre: 'Cerveza CartItem',
    imagen: '/imagenes/pika.png',
    precio: 3000,
    descuento: 0,
  };

  const itemEnCarrito = { ...producto, precioFinal: 3000, cantidad: 2 };
  let onRemove;

  beforeEach(() => {
    vaciarCarrito();
    cerrarSesion();
    agregarAlCarrito(producto, 2);
    onRemove = jasmine.createSpy('onRemove');
  });

  afterEach(() => {
    vaciarCarrito();
    cerrarSesion();
  });

  it('muestra el nombre, el precio unitario y la cantidad', () => {
    render(<CartItem item={itemEnCarrito} onRemove={onRemove} />);
    expect(screen.getByText('Cerveza CartItem')).toBeTruthy();
    expect(screen.getByText(/3\.000/)).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('cambia la cantidad del carrito al presionar + y -', () => {
    render(<CartItem item={itemEnCarrito} onRemove={onRemove} />);

    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(contarItems()).toBe(3);
    expect(onRemove).toHaveBeenCalledWith(producto.id);

    fireEvent.click(screen.getByRole('button', { name: '\u2212' }));
    expect(contarItems()).toBe(2);
  });

  it('elimina el producto del carrito al presionar Quitar', () => {
    render(<CartItem item={itemEnCarrito} onRemove={onRemove} />);

    fireEvent.click(screen.getByRole('button', { name: /Quitar/ }));

    expect(obtenerCarrito()).toEqual([]);
    expect(contarItems()).toBe(0);
    expect(onRemove).toHaveBeenCalledWith(producto.id);
  });
});