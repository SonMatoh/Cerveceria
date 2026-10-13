// Pruebas del Checkout: autocompletado desde la sesión,
// estado del formulario, validación condicional y envío del pago.

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Checkout from '../../pages/Checkout.jsx';
import CompraExitosa from '../../pages/CompraExitosa.jsx';
import {
  agregarAlCarrito,
  vaciarCarrito,
  contarItems,
} from '../../data/carritoStore.js';
import { iniciarSesion, cerrarSesion } from '../../data/sesionStore.js';

const producto = {
  id: 703,
  nombre: 'Cerveza Checkout',
  imagen: 'imagenes/pika.png',
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

describe('vista Checkout', () => {
  beforeEach(() => {
    vaciarCarrito();
    cerrarSesion();
    localStorage.removeItem('resumenCompra');
    agregarAlCarrito(producto, 1);
  });

  it('PROPS/PERSISTENCIA: autocompleta el formulario si hay sesión iniciada', () => {
    iniciarSesion({
      nombre: 'Ana Pérez',
      email: 'ana@duoc.cl',
      direccion: 'Av. Siempreviva 742',
      comuna: 'Springfield',
    });

    renderCheckout();

    expect(screen.getByLabelText('Nombre completo').value).toBe('Ana Pérez');
    expect(screen.getByLabelText('Correo electrónico').value).toBe('ana@duoc.cl');
    expect(screen.getByLabelText('Dirección').value).toBe('Av. Siempreviva 742');
    expect(screen.getByText(/se completaron automáticamente/)).toBeTruthy();
  });

  it('ESTADO: escribir en los campos actualiza el estado del formulario', () => {
    renderCheckout();

    const inputNombre = screen.getByLabelText('Nombre completo');
    fireEvent.change(inputNombre, { target: { value: 'Brock' } });
    expect(inputNombre.value).toBe('Brock');

    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'brock@duoc.cl' },
    });
    expect(screen.getByLabelText('Correo electrónico').value).toBe('brock@duoc.cl');
  });

  it('RENDERIZADO CONDICIONAL: muestra errores de validación al enviar incompleto', () => {
    renderCheckout();

    expect(
      screen.queryByText('El nombre debe tener al menos 2 caracteres.')
    ).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Confirmar compra/ }));

    expect(screen.getByText('El nombre debe tener al menos 2 caracteres.')).toBeTruthy();
    expect(screen.getByText('Debes indicar una dirección de envío.')).toBeTruthy();
    expect(screen.getByText('Debes indicar la comuna.')).toBeTruthy();
    // no navegó a la vista de éxito
    expect(screen.queryByText('¡Compra realizada con éxito!')).toBeNull();
  });

  it('EVENTO: al confirmar un pago válido navega al resumen de compra exitosa', () => {
    iniciarSesion({
      nombre: 'Ana Pérez',
      email: 'ana@duoc.cl',
      direccion: 'Av. Siempreviva 742',
      comuna: 'Springfield',
    });

    renderCheckout();

    fireEvent.click(screen.getByRole('button', { name: /Confirmar compra/ }));

    // navegó a la vista de éxito y el carrito quedó vacío
    expect(screen.getByText('¡Compra realizada con éxito!')).toBeTruthy();
    expect(contarItems()).toBe(0);

    const resumen = JSON.parse(localStorage.getItem('resumenCompra'));
    expect(resumen.estado).toBe('aprobada');
    expect(resumen.total).toBe(2000);
    expect(resumen.items.length).toBe(1);
  });
});
