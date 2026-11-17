import React from 'react';
import { render, screen } from '@testing-library/react';
import FormField from '../../../components/molecules/FormField.jsx';

describe('FormField Component', () => {
  it('renderiza el label asociado por htmlFor y los children', () => {
    render(
      <FormField htmlFor="correo" label="Correo">
        <input id="correo" type="email" />
      </FormField>
    );
    const label = screen.getByText('Correo');
    expect(label).toBeTruthy();
    expect(label.getAttribute('for')).toBe('correo');
    expect(screen.getByLabelText('Correo')).toBeTruthy();
  });

  it('muestra el hint cuando no hay error', () => {
    render(
      <FormField htmlFor="usuario" label="Usuario" hint="Mínimo 3 caracteres">
        <input id="usuario" />
      </FormField>
    );
    expect(screen.getByText('Mínimo 3 caracteres')).toHaveClass('form-text');
  });

  it('oculta el hint y muestra el error cuando existe error', () => {
    render(
      <FormField
        htmlFor="usuario"
        label="Usuario"
        hint="Mínimo 3 caracteres"
        error="Campo obligatorio"
      >
        <input id="usuario" />
      </FormField>
    );
    expect(screen.queryByText('Mínimo 3 caracteres')).toBeNull();
    const error = screen.getByText('Campo obligatorio');
    expect(error).toHaveClass('invalid-feedback');
    expect(error).toHaveClass('d-block');
  });
});