// Vista de productos con búsqueda y filtro por categoría (estado local).

import { useState } from 'react';
import { useStore } from '../hooks/useStore.js';
import { suscribirInventario, obtenerProductos, obtenerCategorias } from '../data/inventarioStore.js';
import ProductoCard from '../components/organisms/ProductCard.jsx';

export default function Productos() {
  const productos = useStore(suscribirInventario, obtenerProductos);
  const categorias = useStore(suscribirInventario, obtenerCategorias);

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');

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
            {categorias.map((cat) => (
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
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
