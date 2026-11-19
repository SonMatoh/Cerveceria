import React, { useState, useEffect } from 'react';
import ProductCard from '../components/organisms/ProductCard.jsx';
import ProductoService from '../services/ProductoService.js';

export function Ofertas() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const data = await ProductoService.getAllProductos();
        setProductos(data);
      } catch (error) {
        console.log('Error al obtener productos del backend:', error);
      }
    };
    fetchOfertas();
  }, []);

  const ofertas = productos.filter((p) => Number(p.descuento) > 0);

  return (
    <div className="container py-5">
      <h1 className="h3 mb-1">{'\u{1F525}'} Ofertas de la semana</h1>
      <p className="text-secondary mb-4">
        Productos con descuento por tiempo limitado.
      </p>

      {ofertas.length === 0 ? (
        <div className="alert alert-light border text-center py-5">
          <p className="mb-0 text-secondary">
            No hay ofertas activas en este momento. ¡Vuelve pronto! {'\u{1F37B}'}
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
