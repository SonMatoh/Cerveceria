import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contacto from '../../pages/Contacto.jsx';

describe('Contacto Page', () => {
  it('muestra errores de validación al enviar vacío', async () => {
    render(<Contacto />);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    await waitFor(() => {
      expect(
        screen.getByText('El nombre debe tener al menos 2 caracteres.')
      ).toBeTruthy();
    });
  });

  it('envía datos válidos y muestra el mensaje de éxito', async () => {
    render(<Contacto />);

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ana@duoc.cl' },
    });
    fireEvent.change(screen.getByLabelText('Asunto'), {
      target: { value: 'Consulta' },
    });
    fireEvent.change(screen.getByLabelText('Mensaje'), {
      target: { value: 'Quisiera información sobre sus cervezas.' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }));

    await waitFor(() => {
      expect(screen.getByText(/Mensaje enviado correctamente/)).toBeTruthy();
    });
  });
});