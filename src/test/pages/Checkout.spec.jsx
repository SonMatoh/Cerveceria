import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Checkout from '../../pages/Checkout.jsx';
import CompraExitosa from '../../pages/CompraExitosa.jsx';
import {
  agregarAlCarrito,
  vaciarCarrito,
  iniciarSesion,
  cerrarSesion,
} from '../../data/Products.js';

const producto = {
  id: 703,
  nombre: 'Cerveza Checkout',
  imagen: '/imagenes/pika.png',
  precio: 2000,
  descuento: 0,
};

const renderCheckout = () =>
  render(
    <MemoryRouter initialEntries={['/checkout']}>
      <Routes>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
      </Routes>
    </MemoryRouter>
  );

describe('Checkout Page', () => {
  beforeEach(() => {
    vaciarCarrito();
    cerrarSesion();
    localStorage.removeItem('resumenCompra');
    agregarAlCarrito(producto, 1);
  });

  it('muestra las 3 opciones (Iniciar sesión, Registrarse, Comprar como invitado) cuando no hay sesión', () => {
    renderCheckout();
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Comprar como invitado' })).toBeTruthy();
  });

  it('impide comprar como invitado si la fecha de nacimiento es de un menor de 18 años', () => {
    renderCheckout();
    fireEvent.click(screen.getByRole('button', { name: 'Comprar como invitado' }));

    fireEvent.change(screen.getByLabelText('Nombre completo'), {
      target: { value: 'Joven Invitado' },
    });
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'joven@duoc.cl' },
    });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento/), {
      target: { value: '2015-05-10' },
    });
    fireEvent.change(screen.getByLabelText('Dirección'), {
      target: { value: 'Av. El Descanso 123' },
    });
    fireEvent.change(screen.getByLabelText('Comuna'), {
      target: { value: 'Maipú' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Confirmar compra/ }));

    expect(
      screen.getByText(
        'Debes ser mayor de 18 años para comprar bebidas alcohólicas.'
      )
    ).toBeTruthy();
  });

  it('autocompleta y confirma compra exitosa cuando hay sesión iniciada', () => {
    iniciarSesion({
      nombre: 'Ana Pérez',
      email: 'ana@duoc.cl',
      direccion: 'Av. Siempreviva 742',
      comuna: 'Maipú',
      fechaNacimiento: '1999-01-15',
    });

    renderCheckout();
    fireEvent.click(screen.getByRole('button', { name: /Confirmar compra/ }));
    expect(screen.getByText('¡Compra realizada con éxito!')).toBeTruthy();
  });
});