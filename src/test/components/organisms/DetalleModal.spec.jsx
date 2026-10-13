// Pruebas del popup de detalle (DetalleModal):
// apertura desde ProductCard sin cambiar de página, precios de socio,
// cierre y agregar al carrito desde el modal.

import {
  render,
  screen,
  fireEvent,
  act,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ProductCard from '../../../components/organisms/ProductCard.jsx';
import DetalleModal from '../../../components/organisms/DetalleModal.jsx';
import { contarItems, vaciarCarrito } from '../../../data/carritoStore.js';
import { cerrarDetalle, obtenerDetalle } from '../../../data/uiStore.js';
import { restaurarInventario } from '../../../data/inventarioStore.js';
import { iniciarSesion, cerrarSesion } from '../../../data/sesionStore.js';
import { productosDelDia } from '../../../utils/socios.js';
import { formatoClp, precioFinal } from '../../../utils/imagenes.js';

const productoBase = {
  id: 901,
  nombre: 'Cerveza Unitaria',
  estilo: 'IPA de Prueba (5.0° ABV)',
  descripcion: 'Una cerveza creada exclusivamente para el test unitario.',
  precio: 5000,
  imagen: 'imagenes/pika.png',
  categoria: 'Cervezas',
  descuento: 0,
};

const renderVista = (producto) =>
  render(
    <MemoryRouter>
      <ProductCard producto={producto} />
      <DetalleModal />
    </MemoryRouter>
  );

describe('DetalleModal (popup de detalle)', () => {
  beforeEach(() => {
    cerrarDetalle();
    act(() => {
      vaciarCarrito();
      restaurarInventario();
      cerrarSesion();
    });
  });

  afterEach(() => {
    act(() => cerrarSesion());
  });

  it('APERTURA: el clic en "Ver detalles" abre el popup con los datos sin salir de la página', () => {
    renderVista(productoBase);

    fireEvent.click(screen.getByText('Ver detalles'));

    const dialogo = screen.getByRole('dialog');
    expect(within(dialogo).getByText('Cerveza Unitaria')).toBeTruthy();
    expect(within(dialogo).getByText(formatoClp(5000))).toBeTruthy();
    expect(within(dialogo).getByText(/Una cerveza creada/)).toBeTruthy();
    // la tarjeta sigue visible: no hubo navegación
    expect(screen.getByRole('link', { name: 'Ver detalles' })).toBeTruthy();
    // y el popup ofrece ir a la página completa (ruta dinámica intacta)
    const enlaceCompleto = within(dialogo).getByRole('link', {
      name: 'Ver página completa',
    });
    expect(enlaceCompleto.getAttribute('href')).toBe('/productos/901');
  });

  it('PRECIO: con sesión de socio muestra la insignia y el -10% del día', () => {
    act(() => iniciarSesion({ nombre: 'Socio', email: 'cliente@duoc.cl' }));
    const elegido = productosDelDia()[0];

    renderVista(elegido);
    fireEvent.click(screen.getByText('Ver detalles'));

    const dialogo = screen.getByRole('dialog');
    expect(within(dialogo).getByText(/-10% Socio/)).toBeTruthy();

    const esperado = Math.round(precioFinal(elegido) * 0.9);
    expect(within(dialogo).getByText(formatoClp(esperado))).toBeTruthy();
    // el precio completo queda tachado dentro del popup
    expect(within(dialogo).getByText(formatoClp(elegido.precio))).toBeTruthy();
  });

  it('CIERRE: el botón "Cerrar detalle" cierra el popup y limpia el estado', () => {
    renderVista(productoBase);

    fireEvent.click(screen.getByText('Ver detalles'));
    expect(screen.getByRole('dialog')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar detalle' }));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(obtenerDetalle()).toBeNull();
  });

  it('EVENTOS: cantidad + "Agregar al carrito" desde el popup suma unidades y lo cierra', () => {
    renderVista(productoBase);

    fireEvent.click(screen.getByText('Ver detalles'));
    fireEvent.click(screen.getByRole('button', { name: 'Sumar cantidad' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sumar cantidad' }));

    const dialogo = screen.getByRole('dialog');
    expect(within(dialogo).getByText('3')).toBeTruthy();

    fireEvent.click(
      within(dialogo).getByRole('button', { name: 'Agregar 3 al carrito' })
    );

    expect(contarItems()).toBe(3);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
