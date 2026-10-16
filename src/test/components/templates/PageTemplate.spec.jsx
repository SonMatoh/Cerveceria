import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PageTemplate from '../../../components/templates/PageTemplate.jsx';
import { vaciarCarrito, cerrarSesion } from '../../../data/Products.js';

const montarTemplate = () =>
  render(
    <MemoryRouter>
      <PageTemplate>
        <p>Contenido de la página</p>
      </PageTemplate>
    </MemoryRouter>
  );

describe('PageTemplate Component', () => {
  beforeEach(() => {
    vaciarCarrito();
    cerrarSesion();
  });

  it('renderiza el contenido hijo dentro de un main', () => {
    montarTemplate();
    const main = document.querySelector('main');
    expect(main).toBeTruthy();
    expect(screen.getByText('Contenido de la página')).toBeTruthy();
  });

  it('incluye la Navbar y el Footer', () => {
    montarTemplate();
    expect(screen.getByText(/Cart \(0\)/)).toBeTruthy();
    expect(screen.getByText('La Taberna de Snorlax')).toBeTruthy();
  });

  it('ubica el Footer despues del contenido principal', () => {
    const { container } = montarTemplate();
    const main = container.querySelector('main');
    const footer = container.querySelector('footer');
    expect(main).toBeTruthy();
    expect(footer).toBeTruthy();
    // el nodo <footer> debe estar despues de <main> en el orden del documento
    expect(main.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});