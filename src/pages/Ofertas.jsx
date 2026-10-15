import React from 'react';
import { obtenerProductos } from '../data/Products.js';
import ProductCard from '../components/organisms/ProductCard.jsx';

export function Ofertas() {
  const productos = obtenerProductos();
  const ofertas = productos.filter((p) => Number(p.descuento) > 0);

  return (
    <div className="container py-5">
      <h1 className="h3 mb-1">🔥 Ofertas de la semana</h1>
      <p className="text-secondary mb-4">
        Productos con descuento por tiempo limitado.
      </p>

      {ofertas.length === 0 ? (
        <div className="alert alert-light border text-center py-5">
          <p className="mb-0 text-secondary">
            No hay ofertas activas en este momento. ¡Vuelve pronto! 🍻
          </p>
        </div>
      ) : (
        <div className="row">
          {ofertas.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Ofertas;