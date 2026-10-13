// Pruebas del organismo ProductCard:
// renderizado con props, renderizado condicional y eventos.

import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../../../components/organisms/ProductCard.jsx';
import { contarItems, vaciarCarrito } from '../../../data/carritoStore.js';
import {
  restaurarInventario,
  obtenerProductos,
} from '../../../data/inventarioStore.js';
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

const renderCard = (producto) =>
  render(
    <MemoryRouter>
      <ProductCard producto={producto} />
    </MemoryRouter>
  );

describe('ProductCard (organismo)', () => {
  beforeEach(() => {
    vaciarCarrito();
  });

  it('RENDERIZADO: muestra los datos que recibe por props (nombre, estilo y precio)', () => {
    renderCard(productoBase);

    expect(screen.getByText('Cerveza Unitaria')).toBeTruthy();
    expect(screen.getByText('IPA de Prueba (5.0° ABV)')).toBeTruthy();
    expect(screen.getByText(/\$5[.,]?000/)).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Cerveza Unitaria' })).toBeTruthy();
  });

  it('RENDERIZADO CONDICIONAL: solo muestra la insignia de oferta si tiene descuento', () => {
    const { rerender } = renderCard(productoBase);
    expect(screen.queryByText(/-0%/)).toBeNull();

    rerender(
      <MemoryRouter>
        <ProductCard producto={{ ...productoBase, descuento: 20 }} />
      </MemoryRouter>
    );
    expect(screen.getByText('-20%')).toBeTruthy();
    // precio con 20% de descuento: 5000 -> 4000
    expect(screen.getByText(/\$4[.,]?000/)).toBeTruthy();
  });

  it('EVENTOS + ESTADO: los botones + / − cambian la cantidad y "Agregar" lleva al carrito', () => {
    renderCard(productoBase);

    const botonSumar = screen.getByRole('button', { name: '+' });
    fireEvent.click(botonSumar);
    fireEvent.click(botonSumar);
    expect(screen.getByText('3')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '−' }));
    expect(screen.getByText('2')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Agregar/ }));
    expect(contarItems()).toBe(2);
    // la cantidad vuelve a 1 después de agregar
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('EVENTO: el enlace "Ver detalles" apunta a la ruta dinámica del producto', () => {
    renderCard(productoBase);

    const enlace = screen.getByRole('link', { name: 'Ver detalles' });
    expect(enlace).toBeTruthy();
    expect(enlace).toHaveClass('btn-outline-secondary');
    expect(enlace.getAttribute('href')).toBe('/productos/901');
  });
});

describe('ProductCard: ofertas del día para socios', () => {
  beforeEach(() => {
    act(() => {
      vaciarCarrito();
      restaurarInventario();
      cerrarSesion();
    });
  });

  afterEach(() => {
    act(() => cerrarSesion());
  });

  it('CON SESIÓN + PRODUCTO ELEGIDO: muestra la insignia y el precio con -10%', () => {
    act(() => iniciarSesion({ nombre: 'Socio', email: 'cliente@duoc.cl' }));
    const elegido = productosDelDia()[0];

    renderCard(elegido);

    expect(screen.getByText(/-10% Socio/)).toBeTruthy();
    // precio final = 90% del precio con su propio descuento aplicado
    const esperado = Math.round(precioFinal(elegido) * 0.9);
    expect(screen.getByText(formatoClp(esperado))).toBeTruthy();
    // y el precio completo queda tachado
    expect(screen.getByText(formatoClp(elegido.precio))).toBeTruthy();
  });

  it('CON SESIÓN PERO FUERA DE LA OFERTA: sin insignia ni descuento', () => {
    act(() => iniciarSesion({ nombre: 'Socio', email: 'cliente@duoc.cl' }));
    const fuera = obtenerProductos().find(
      (p) => !productosDelDia().some((e) => e.id === p.id)
    );

    renderCard(fuera);

    expect(screen.queryByText(/-10% Socio/)).toBeNull();
    expect(screen.getByText(formatoClp(precioFinal(fuera)))).toBeTruthy();
  });

  it('SIN SESIÓN: aunque el producto esté en la oferta no hay descuento', () => {
    const elegido = productosDelDia()[0];

    renderCard(elegido);

    expect(screen.queryByText(/-10% Socio/)).toBeNull();
    expect(screen.getByText(formatoClp(precioFinal(elegido)))).toBeTruthy();
  });
});
