// Pruebas del átomo Button (patrón de la guía de pruebas unitarias).

import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../components/atoms/Button.jsx';

describe('Button Component', () => {
  it('renderiza el botón correctamente', () => {
    render(<Button>Haz click</Button>);
    expect(screen.getByText('Haz click')).toBeTruthy();
  });

  it('aplica los props de variante correctamente', () => {
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
