import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Carrito from '../../pages/Carrito.jsx';
import { agregarAlCarrito, vaciarCarrito, contarItems } from '../../data/Products.js';

const producto = {
  id: 701,
  nombre: 'Cerveza del Carrito',
  imagen: '/imagenes/pika.png',
  precio: 1000,
  descuento: 0,
};

describe('Carrito Page', () => {
  beforeEach(() => {
    vaciarCarrito();
  });

  it('muestra el mensaje de carrito vacío cuando no hay ítems', () => {
    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );
    expect(screen.getByText('Tu carrito de compras está vacío.')).toBeTruthy();
  });

  it('lista los ítems, calcula el total y permite quitar un producto', () => {
    agregarAlCarrito(producto, 2);
    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );
    expect(screen.getByText('Cerveza del Carrito')).toBeTruthy();
    expect(screen.getAllByText(/\$2[.,]?000/).length).toBe(2);

    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));
    expect(contarItems()).toBe(0);
  });
});