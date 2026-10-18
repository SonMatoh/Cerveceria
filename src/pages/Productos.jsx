import React, { useState } from 'react';
import { obtenerProductos, categoriasIniciales } from '../data/Products.js';
import ProductCard from '../components/organisms/ProductCard.jsx';

export function Productos() {
  const productos = obtenerProductos();
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

  const categoriasDisponibles = Array.from(
    new Set([...categoriasIniciales, ...productos.map((p) => p.categoria)])
  );

  const filtrados = productos.filter((p) => {
    const texto = busqueda.toLowerCase().trim();
    const coincide =
      !texto ||
      p.nombre.toLowerCase().includes(texto) ||
      p.estilo.toLowerCase().includes(texto);
    const porCategoria = categoria === 'Todas' || p.categoria === categoria;
    return coincide && porCategoria;
  });

  return (
    <div className="container py-5">
      <h1 className="h3 mb-4">Nuestros productos</h1>

      <div className="row g-3 mb-4 align-items-end">
        <div className="col-md-6">
          <label htmlFor="busqueda" className="form-label small">
            Buscar por nombre o estilo
          </label>
          <input
            id="busqueda"
            type="search"
            className="form-control"
            placeholder="Ej: IPA, Snorlax, sour..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="filtro-categoria" className="form-label small">
            Categoría
          </label>
          <select
            id="filtro-categoria"
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="Todas">Todas</option>
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <span className="badge text-bg-light border w-100 py-2">
            {filtrados.length} resultado{filtrados.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="alert alert-light border text-center py-5">
          <p className="mb-0 text-secondary">
            No se encontraron productos que coincidan con tu búsqueda 🍺
          </p>
        </div>
      ) : (
        <div className="row">
          {filtrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Productos;