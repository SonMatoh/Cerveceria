import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../../components/organisms/Navbar.jsx';
import {
  agregarAlCarrito,
  vaciarCarrito,
  iniciarSesion,
  cerrarSesion,
  obtenerSesion,
} from '../../../data/Products.js';

const producto = {
  id: 702,
  nombre: 'Cerveza Navbar',
  imagen: '/imagenes/pika.png',
  precio: 3000,
  descuento: 0,
};

describe('Navbar Component', () => {
  beforeEach(() => {
    vaciarCarrito();
    cerrarSesion();
  });

  it('muestra el contador del carrito actualizado', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/Cart \(0\)/)).toBeTruthy();

    agregarAlCarrito(producto, 2);
    rerender(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/Cart \(2\)/)).toBeTruthy();
  });

  it('muestra Iniciar sesión cuando no hay sesión y el nombre cuando inicia sesión', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Iniciar sesión')).toBeTruthy();

    iniciarSesion({ nombre: 'AshK', email: 'ash@duoc.cl' });
    rerender(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('AshK')).toBeTruthy();
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(obtenerSesion()).toBeNull();
  });

  it('muestra el enlace Administración solo para el rol admin', () => {
    iniciarSesion({ nombre: 'Administrador', email: 'admin@duoc.cl', rol: 'admin' });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Administración')).toBeTruthy();
  });
});