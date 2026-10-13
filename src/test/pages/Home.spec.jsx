// Pruebas de la página Home (patrón de la guía: título, textos y clases).

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home.jsx';
import { restaurarInventario } from '../../data/inventarioStore.js';

describe('Home Page', () => {
  beforeEach(() => {
    restaurarInventario();
  });

  it('renderiza el título de la página de inicio', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('TIENDA ONLINE')).toBeTruthy();
  });

  it('renderiza el párrafo de bienvenida', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Bienvenido a la mejor cervecería/)).toBeTruthy();
  });

  it('renderiza el contenedor de Bootstrap del hero', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const contenedor = screen.getByText('TIENDA ONLINE').closest('div.container');
    expect(contenedor).toHaveClass('container');
  });

  it('renderiza los 3 productos destacados con su enlace de detalles', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getAllByRole('link', { name: 'Ver detalles' }).length).toBe(3);
  });
});
