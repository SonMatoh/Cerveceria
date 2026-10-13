// Pruebas del organismo Navbar: contador del carrito en tiempo real
// y renderizado condicional de la zona de sesión.

import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../../components/organisms/Navbar.jsx';
import { agregarAlCarrito, vaciarCarrito } from '../../../data/carritoStore.js';
import {
  iniciarSesion,
  cerrarSesion,
  obtenerSesion,
} from '../../../data/sesionStore.js';

const producto = {
  id: 702,
  nombre: 'Cerveza Navbar',
  imagen: 'imagenes/pika.png',
  precio: 3000,
  descuento: 0,
};

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar (organismo)', () => {
  beforeEach(() => {
    vaciarCarrito();
    cerrarSesion();
  });

  it('EVENTOS + ESTADO: el contador del carrito se actualiza en tiempo real', () => {
    renderNavbar();
    expect(screen.getByText(/Cart \(0\)/)).toBeTruthy();

    act(() => agregarAlCarrito(producto, 2));
    expect(screen.getByText(/Cart \(2\)/)).toBeTruthy();

    act(() => agregarAlCarrito(producto, 1));
    expect(screen.getByText(/Cart \(3\)/)).toBeTruthy();
  });

  it('RENDERIZADO CONDICIONAL: muestra login sin sesión y el usuario con sesión iniciada', () => {
    const { rerender } = renderNavbar();

    // sin sesión
    expect(screen.getByText('Iniciar sesión')).toBeTruthy();
    expect(screen.queryByText('Cerrar sesión')).toBeNull();

    // con sesión
    act(() => iniciarSesion({ nombre: 'AshK', email: 'ash@duoc.cl' }));
    rerender(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText('AshK')).toBeTruthy();
    expect(screen.getByText('Cerrar sesión')).toBeTruthy();
    expect(screen.queryByText('Iniciar sesión')).toBeNull();

    // y el botón cerrar sesión vuelve al estado inicial
    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(obtenerSesion()).toBeNull();
    expect(screen.getByText('Iniciar sesión')).toBeTruthy();
  });

  it('ROLES: el link "Administración" solo aparece para el administrador', () => {
    renderNavbar();

    // sin sesión: nunca aparece
    expect(screen.queryByText('Administración')).toBeNull();

    // cliente con sesión: sigue oculto
    act(() => iniciarSesion({ nombre: 'Cliente', email: 'cliente@duoc.cl' }));
    expect(screen.queryByText('Administración')).toBeNull();

    // administrador: sí aparece
    act(() =>
      iniciarSesion({ nombre: 'Administrador', email: 'admin@duoc.cl' })
    );
    expect(screen.getByText('Administración')).toBeTruthy();

    act(() => cerrarSesion());
  });
});
