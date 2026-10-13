// Pruebas del formulario de contacto (react-hook-form + validaciones).
// Nota: react-hook-form valida y actualiza el estado en un microtask,
// por eso se usa waitFor() antes de las aserciones.

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contacto from '../../pages/Contacto.jsx';

describe('vista Contacto (react-hook-form)', () => {
  it('RENDERIZADO CONDICIONAL: muestra errores de validación al enviar vacío', async () => {
    render(<Contacto />);

    expect(screen.queryByText('El nombre debe tener al menos 2 caracteres.')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    // los errores aparecen después de la validación asíncrona
    await waitFor(() => {
      expect(screen.getByText('El nombre debe tener al menos 2 caracteres.')).toBeTruthy();
    });
    expect(screen.getByText(/Correo inválido/)).toBeTruthy();
    expect(screen.getByText('El asunto es obligatorio.')).toBeTruthy();
    expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeTruthy();
    // no aparece el mensaje de éxito
    expect(screen.queryByText(/Mensaje enviado correctamente/)).toBeNull();
  });

  it('ESTADO + EVENTO: enviar datos válidos muestra el mensaje de éxito y limpia el formulario', async () => {
    render(<Contacto />);

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ana@duoc.cl' } });
    fireEvent.change(screen.getByLabelText('Asunto'), { target: { value: 'Consulta' } });
    fireEvent.change(screen.getByLabelText('Mensaje'), {
      target: { value: 'Quisiera información sobre sus cervezas.' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    await waitFor(() => {
      expect(screen.getByText(/Mensaje enviado correctamente/)).toBeTruthy();
    });
    // el formulario se limpia después de enviar
    await waitFor(() => {
      expect(screen.getByLabelText('Nombre').value).toBe('');
    });
    expect(screen.getByLabelText('Mensaje').value).toBe('');
  });
});
