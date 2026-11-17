import React from 'react';
import { render, screen } from '@testing-library/react';
import CardBody from '../../../components/molecules/CardBody.jsx';

describe('CardBody Component', () => {
  it('renderiza el título, la descripción y el precio', () => {
    render(<CardBody title="Cerveza Pika" description="IPA intensa" price="$3.000" />);
    expect(screen.getByText('Cerveza Pika')).toBeTruthy();
    expect(screen.getByText('IPA intensa')).toBeTruthy();
    expect(screen.getByText('$3.000')).toBeTruthy();
  });

  it('muestra el badge solo cuando recibe tag', () => {
    const { container } = render(<CardBody title="T" description="D" price="$1.000" />);
    expect(container.querySelector('.badge')).toBeNull();

    const conTag = render(<CardBody title="T" description="D" price="$1.000" tag="Oferta" />);
    const badge = conTag.container.querySelector('.badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent).toBe('Oferta');
  });

  it('muestra el precio tachado cuando recibe oldPrice', () => {
    const { container } = render(
      <CardBody title="T" description="D" price="$2.000" oldPrice="$3.000" />
    );
    const tachado = container.querySelector('.precio-tachado');
    expect(tachado).toBeTruthy();
    expect(tachado.textContent).toBe('$3.000');
  });
});