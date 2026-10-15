import React, { Profiler } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductDetail from '../../pages/ProductDetail.jsx';
import { restaurarInventario, cerrarSesion } from '../../data/Products.js';

describe('ProductDetail Page', () => {
  let renderSpy;

  beforeEach(() => {
    restaurarInventario();
    cerrarSesion();
    renderSpy = jasmine.createSpy('onRender');
  });

  it('muestra mensaje de error cuando el producto no existe', () => {
    render(
      <Profiler id="ProductDetail" onRender={renderSpy}>
        <MemoryRouter initialEntries={['/productos/999']}>
          <Routes>
            <Route path="/productos/:id" element={<ProductDetail />} />
          </Routes>
        </MemoryRouter>
      </Profiler>
    );
    expect(screen.getByText('Producto no encontrado')).toBeTruthy();
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

    expect(screen.getByText(/Pikachoque Radioactivo/)).toBeTruthy();
    expect(renderSpy).toHaveBeenCalled();
    const call = renderSpy.calls.mostRecent();
    const actualDuration = call.args[3];
    expect(actualDuration).toBeLessThan(100);
  });
});