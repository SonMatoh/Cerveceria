import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import ProductCard from '../../../components/organisms/ProductCard.jsx';
import { contarItems, vaciarCarrito, cerrarSesion } from '../../../data/Products.js';

const MockRouter = ({ children, mockNavigate }) => {
  const router = createMemoryRouter(
    [{ path: '*', element: children }],
    { initialEntries: ['/'] }
  );
  router.navigate = mockNavigate;
  return <RouterProvider router={router} />;
};

describe('ProductCard Component', () => {
  const mockNavigate = jasmine.createSpy('navigate');
  const mockProduct = {
    id: 1,
    nombre: 'Producto Test',
    estilo: 'IPA Test',
    descripcion: 'Descripción test',
    precio: 10000,
    imagen: '/imagenes/pika.png',
    descuento: 0,
  };

  beforeEach(() => {
    vaciarCarrito();
    cerrarSesion();
    mockNavigate.calls.reset();
  });

  it('renderiza el título del producto', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard producto={mockProduct} />
      </MockRouter>
    );
    expect(screen.getByText(mockProduct.nombre)).toBeTruthy();
  });

  it('renderiza la descripción del producto', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard producto={mockProduct} />
      </MockRouter>
    );
    expect(screen.getByText(mockProduct.descripcion)).toBeTruthy();
  });

  it('renderiza el precio del producto', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard producto={mockProduct} />
      </MockRouter>
    );
    expect(screen.getByText(/\$10[.,]?000/)).toBeTruthy();
  });

  it('renderiza la imagen del producto', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard producto={mockProduct} />
      </MockRouter>
    );
    const image = screen.getByRole('img', { name: mockProduct.nombre });
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe(mockProduct.imagen);
  });

  it('navega a detalles al hacer click en el botón Ver detalles', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard producto={mockProduct} />
      </MockRouter>
    );
    const button = screen.getByText('Ver detalles');
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/productos/1', jasmine.any(Object));
  });

  it('permite cambiar la cantidad con + / - y agregar al carrito', () => {
    render(
      <MockRouter mockNavigate={mockNavigate}>
        <ProductCard producto={mockProduct} />
      </MockRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('2')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Agregar/ }));
    expect(contarItems()).toBe(2);
  });
});