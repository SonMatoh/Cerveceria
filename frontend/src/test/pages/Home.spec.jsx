import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home.jsx';
import { restaurarInventario } from '../../data/Products.js';

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
    const title = screen.getByText('TIENDA ONLINE');
    expect(title).toBeTruthy();
  });

  it('renderiza el párrafo de bienvenida', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const paragraph = screen.getByText(/Bienvenido a la mejor cervecería/);
    expect(paragraph).toBeTruthy();
  });

  it('renderiza el contenedor de Bootstrap', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const container = screen.getByText('TIENDA ONLINE').closest('div.container');
    expect(container).toHaveClass('container');
  });
});