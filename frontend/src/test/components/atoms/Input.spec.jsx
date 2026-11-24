import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import Input from '../../../components/atoms/Input.jsx';

describe('Input Component', () => {
  it('renderiza un input con la clase form-control', () => {
    render(<Input placeholder="Escribe aquí" />);
    const input = screen.getByPlaceholderText('Escribe aquí');
    expect(input).toBeTruthy();
    expect(input).toHaveClass('form-control');
  });

  it('agrega el className propio junto a form-control', () => {
    render(<Input className="input-personalizado" placeholder="Campo" />);
    const input = screen.getByPlaceholderText('Campo');
    expect(input).toHaveClass('form-control');
    expect(input).toHaveClass('input-personalizado');
  });

  it('reenvía la ref al elemento input y acepta sus props', () => {
    const ref = createRef();
    render(<Input ref={ref} type="email" placeholder="correo" defaultValue="a@b.cl" />);
    expect(ref.current).toBeTruthy();
    expect(ref.current.tagName).toBe('INPUT');
    expect(ref.current.getAttribute('type')).toBe('email');
  });
});