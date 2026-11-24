import React from 'react';
import { render, screen } from '@testing-library/react';
import Image from '../../../components/atoms/Image.jsx';

describe('Image Component', () => {
  const props = { src: '/imagenes/pika.png', alt: 'Cerveza Pika' };

  it('renderiza la imagen con su src y alt', () => {
    render(<Image {...props} />);
    const imagen = screen.getByRole('img', { name: 'Cerveza Pika' });
    expect(imagen).toBeTruthy();
    expect(imagen.getAttribute('src')).toBe(props.src);
  });

  it('aplica el className recibido', () => {
    render(<Image {...props} className="imagen-redonda" />);
    expect(screen.getByRole('img', { name: 'Cerveza Pika' })).toHaveClass('imagen-redonda');
  });

  it('aplica los estilos recibidos', () => {
    render(<Image {...props} style={{ width: 54, height: 54, objectFit: 'contain' }} />);
    const imagen = screen.getByRole('img', { name: 'Cerveza Pika' });
    expect(imagen.style.width).toBe('54px');
    expect(imagen.style.objectFit).toBe('contain');
  });
});