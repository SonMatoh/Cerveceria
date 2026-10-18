import React from 'react';
import { obtenerProductos, categoriasIniciales } from '../data/Products.js';
import ProductCard from '../components/organisms/ProductCard.jsx';

export function Categorias() {
  const productos = obtenerProductos();
  const categorias = Array.from(
    new Set([...categoriasIniciales, ...productos.map((p) => p.categoria)])
  );

  return (
    <div className="container py-5">
      <h1 className="h3 mb-1">Categorías</h1>
      <p className="text-secondary mb-4">
        Todos los productos de la Taberna separados por estilo de bebida.
      </p>

      {categorias.map((cat) => {
        const delGrupo = productos.filter((p) => p.categoria === cat);
        if (delGrupo.length === 0) return null;

        return (
          <section key={cat} className="mb-5">
            <div className="d-flex align-items-center gap-3 mb-3">
              <h2 className="h4 mb-0">{cat}</h2>
              <span className="badge text-bg-primary">{delGrupo.length} productos</span>
              <hr className="flex-grow-1 mb-0" />
            </div>
            <div className="row">
              {delGrupo.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default Categorias;