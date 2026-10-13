// Pruebas de la vista Carrito: renderizado condicional,
// cálculo de totales y eventos de eliminación.

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Carrito from '../../pages/Carrito.jsx';
import {
  agregarAlCarrito,
  vaciarCarrito,
  contarItems,
} from '../../data/carritoStore.js';

const producto = {
  id: 701,
  nombre: 'Cerveza del Carrito',
  imagen: 'imagenes/pika.png',
  precio: 1000,
  descuento: 0,
};

const renderCarrito = () =>
  render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  );

describe('vista Carrito', () => {
  beforeEach(() => {
    vaciarCarrito();
  });

  it('RENDERIZADO CONDICIONAL: muestra el mensaje de carrito vacío cuando no hay ítems', () => {
    renderCarrito();

    expect(screen.getByText('Tu carrito de compras está vacío.')).toBeTruthy();
    expect(screen.queryByText('Proceder al Pago')).toBeNull();
  });

  it('RENDERIZADO: lista los ítems y calcula el total a pagar', () => {
    agregarAlCarrito(producto, 2);
    renderCarrito();

    expect(screen.getByText('Cerveza del Carrito')).toBeTruthy();
    expect(screen.getByText('Proceder al Pago')).toBeTruthy();
    // total: 1000 x 2 = $2.000 (subtotal del ítem + total a pagar)
    const montos = screen.getAllByText(/\$2[.,]?000/);
    expect(montos.length).toBe(2);
  });

  it('EVENTO: el botón "Quitar" elimina el ítem del carrito', () => {
    agregarAlCarrito(producto, 1);
    renderCarrito();

    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));

    expect(contarItems()).toBe(0);
    expect(screen.getByText('Tu carrito de compras está vacío.')).toBeTruthy();
  });
});
