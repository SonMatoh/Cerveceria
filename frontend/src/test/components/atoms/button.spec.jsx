import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../components/atoms/Button.jsx';

describe('Button Component', () => {
  it('renderiza el botón correctamente', () => {
    const { getByText } = render(<Button>Haz click</Button>);
    expect(getByText('Haz click')).toBeTruthy();
  });

  it('aplica los props correctamente', () => {
    render(<Button variant="primary">Haz click</Button>);
    const button = screen.getByText('Haz click');
    expect(button).toHaveClass('btn-primary');
  });

  it('responde al evento onClick', () => {
    const spy = jasmine.createSpy('onClick');
    render(<Button onClick={spy}>Presionar</Button>);
    fireEvent.click(screen.getByText('Presionar'));
    expect(spy).toHaveBeenCalled();
  });
});