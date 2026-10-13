// Pruebas del átomo Text (variantes de etiqueta y clases).

import { render, screen } from '@testing-library/react';
import Text from '../../../components/atoms/Text.jsx';

describe('Text Component', () => {
  it('renderiza el variant solicitado (h1)', () => {
    render(<Text variant="h1">Título principal</Text>);
    const elemento = screen.getByText('Título principal');
    expect(elemento.tagName).toBe('H1');
  });

  it('usa el variant "p" por defecto', () => {
    render(<Text>Texto normal</Text>);
    const elemento = screen.getByText('Texto normal');
    expect(elemento.tagName).toBe('P');
  });

  it('aplica las clases recibidas por props', () => {
    render(
      <Text variant="h2" className="titulo-grande">
        Subtítulo
      </Text>
    );
    const elemento = screen.getByText('Subtítulo');
    expect(elemento.tagName).toBe('H2');
    expect(elemento).toHaveClass('titulo-grande');
  });
});
