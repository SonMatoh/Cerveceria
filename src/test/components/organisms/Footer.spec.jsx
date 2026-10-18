import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../../components/organisms/Footer.jsx';

describe('Footer Component', () => {
  it('renderiza el footer con la clase footer-taberna', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeTruthy();
    expect(footer).toHaveClass('footer-taberna');
  });

  it('muestra el nombre de la taberna', () => {
    render(<Footer />);
    expect(screen.getByText('La Taberna de Snorlax')).toBeTruthy();
  });

  it('muestra los avisos legales', () => {
    render(<Footer />);
    expect(screen.getByText(/Si no pudiste ser el mejor entrenando/)).toBeTruthy();
    expect(screen.getByText(/Venta solo para mayores de 18 años/)).toBeTruthy();
  });
});