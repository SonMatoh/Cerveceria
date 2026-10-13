// Pruebas del guard de rutas AdminLock:
// redirección por sesión y por rol administrador.

import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';

import AdminLock from '../../components/templates/AdminLock.jsx';
import { iniciarSesion, cerrarSesion } from '../../data/sesionStore.js';

function PantallaLogin() {
  const location = useLocation();
  return (
    <div>
      <span>Pantalla de login</span>
      <span>Ruta origen: {String(location.state?.from || 'ninguna')}</span>
    </div>
  );
}

function PantallaHome() {
  return <div>Pantalla principal</div>;
}

function Panel() {
  return <div>Panel de administración</div>;
}

const renderAdmin = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/" element={<PantallaHome />} />
        <Route path="/login" element={<PantallaLogin />} />
        <Route
          path="/admin"
          element={
            <AdminLock>
              <Panel />
            </AdminLock>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe('AdminLock (plantilla: guard de rutas)', () => {
  beforeEach(() => {
    act(() => cerrarSesion());
  });

  afterEach(() => {
    act(() => cerrarSesion());
  });

  it('SIN SESIÓN: redirige al login sin mostrar el panel y recuerda el origen', () => {
    renderAdmin();

    expect(screen.queryByText('Panel de administración')).toBeNull();
    expect(screen.getByText('Pantalla de login')).toBeTruthy();
    expect(screen.getByText('Ruta origen: /admin')).toBeTruthy();
  });

  it('ROL CLIENTE: con sesión pero sin rol admin redirige al home (no al panel)', () => {
    act(() => iniciarSesion({ nombre: 'Cliente Demo', email: 'cliente@duoc.cl' }));
    renderAdmin();

    expect(screen.queryByText('Panel de administración')).toBeNull();
    expect(screen.getByText('Pantalla principal')).toBeTruthy();
    // ya tiene sesión: no debe volver a pedir login
    expect(screen.queryByText('Pantalla de login')).toBeNull();
  });

  it('ROL ADMIN: con sesión de administrador sí muestra el panel', () => {
    act(() => iniciarSesion({ nombre: 'Administrador', email: 'admin@duoc.cl' }));
    renderAdmin();

    expect(screen.getByText('Panel de administración')).toBeTruthy();
    expect(screen.queryByText('Pantalla principal')).toBeNull();
  });
});
