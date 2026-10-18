import React from 'react';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import AdminLock from '../../../components/templates/AdminLock.jsx';
import { iniciarSesion, cerrarSesion } from '../../../data/Products.js';

const montarAdminLock = () => {
  const router = createMemoryRouter(
    [
      { path: '/login', element: <p>Pantalla de login</p> },
      { path: '/', element: <p>Inicio</p> },
      {
        path: '/admin',
        element: (
          <AdminLock>
            <p>Panel secreto</p>
          </AdminLock>
        ),
      },
    ],
    { initialEntries: ['/admin'] }
  );

  render(<RouterProvider router={router} />);
  return router;
};

describe('AdminLock Component', () => {
  beforeEach(() => {
    cerrarSesion();
  });

  it('redirige a /login cuando no hay sesión iniciada', () => {
    const router = montarAdminLock();
    expect(router.state.location.pathname).toBe('/login');
    expect(screen.getByText('Pantalla de login')).toBeTruthy();
    expect(screen.queryByText('Panel secreto')).toBeNull();
  });

  it('redirige a / cuando la sesión no tiene rol admin', () => {
    iniciarSesion({ nombre: 'Cliente Demo', email: 'cliente@duoc.cl', rol: 'cliente' });
    const router = montarAdminLock();
    expect(router.state.location.pathname).toBe('/');
    expect(screen.getByText('Inicio')).toBeTruthy();
    expect(screen.queryByText('Panel secreto')).toBeNull();
  });

  it('muestra el contenido cuando la sesión es admin', () => {
    iniciarSesion({ nombre: 'Administrador', email: 'admin@duoc.cl', rol: 'admin' });
    const router = montarAdminLock();
    expect(router.state.location.pathname).toBe('/admin');
    expect(screen.getByText('Panel secreto')).toBeTruthy();
  });
});