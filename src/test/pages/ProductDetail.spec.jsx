// Pruebas de la página ProductDetail (ruta dinámica con useParams),
// incluye prueba de rendimiento con <Profiler> (patrón de la guía).

import { render, screen } from '@testing-library/react';
import { Profiler } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDetail from '../../pages/ProductDetail.jsx';
import { restaurarInventario } from '../../data/inventarioStore.js';
import { cerrarSesion } from '../../data/sesionStore.js';

const renderDetalle = (id) =>
  render(
    <MemoryRouter initialEntries={[`/productos/${id}`]}>
      <Routes>
        <Route path="/productos/:id" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  );

describe('ProductDetail Page', () => {
  let renderSpy;

  beforeEach(() => {
    restaurarInventario();
    // Sin sesión no hay descuento de socio: el precio del test se mantiene.
    cerrarSesion();
    renderSpy = jasmine.createSpy('onRender');
  });

  it('muestra mensaje de error cuando el producto no existe', () => {
    renderDetalle(999);
    expect(screen.getByText('Producto no encontrado')).toBeTruthy();
  });

  it('renderiza los datos del producto existente (nombre, precio e imagen)', () => {
    renderDetalle(1);

    expect(screen.getByText(/Pikachoque Radioactivo/)).toBeTruthy();
    expect(screen.getByText(/\$4[.,]?600/)).toBeTruthy();
    expect(
      screen.getByRole('img', { name: /Pikachoque Radioactivo/ })
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: /Agregar al carrito/ })).toBeTruthy();
  });

  it('mide el tiempo de renderizado del componente (< 100 ms)', () => {
    render(
      <Profiler id="ProductDetail" onRender={renderSpy}>
        <MemoryRouter initialEntries={['/productos/1']}>
          <Routes>
            <Route path="/productos/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Profiler>
    );

    expect(renderSpy).toHaveBeenCalled();
    const duracion = renderSpy.calls.mostRecent().args[3]; // actualDuration
    expect(duracion).toBeLessThan(100);
  });
});
