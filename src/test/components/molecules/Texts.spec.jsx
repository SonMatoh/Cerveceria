import React from 'react';
import { render, screen } from '@testing-library/react';
import Texts from '../../../components/molecules/Texts.jsx';

describe('Texts Component', () => {
  const items = [
    { text: 'Cerveza Pika', variant: 'h1', className: 'titulo' },
    { text: 'Descripción de la cerveza', variant: 'p', className: 'descripcion' },
    { text: 'Precio', variant: 'span' },
  ];

  it('renderiza un elemento por cada item recibido', () => {
    render(<Texts items={items} />);
    expect(screen.getByText('Cerveza Pika')).toBeTruthy();
    expect(screen.getByText('Descripción de la cerveza')).toBeTruthy();
    expect(screen.getByText('Precio')).toBeTruthy();
  });

  it('respeta el variant de cada item', () => {
    render(<Texts items={items} />);
    expect(screen.getByText('Cerveza Pika').tagName).toBe('H1');
    expect(screen.getByText('Descripción de la cerveza').tagName).toBe('P');
    expect(screen.getByText('Precio').tagName).toBe('SPAN');
  });

  it('no renderiza nada cuando no recibe items', () => {
    const { container } = render(<Texts />);
    expect(container.textContent).toBe('');
  });
});