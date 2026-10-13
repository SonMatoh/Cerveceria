// Vista que muestra todos los productos en oferta (nueva vista - Anexo 1).

import { useStore } from '../hooks/useStore.js';
import { suscribirInventario, productosEnOferta } from '../data/inventarioStore.js';
import ProductoCard from '../components/organisms/ProductCard.jsx';

export default function Ofertas() {
  const ofertas = useStore(suscribirInventario, productosEnOferta);

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
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
