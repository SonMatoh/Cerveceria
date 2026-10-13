// Vista de portada (Home).

import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore.js';
import { suscribirInventario, obtenerProductos, obtenerCategorias } from '../data/inventarioStore.js';
import ProductoCard from '../components/organisms/ProductCard.jsx';

export default function Home() {
  const productos = useStore(suscribirInventario, obtenerProductos);
  const categorias = useStore(suscribirInventario, obtenerCategorias);
  const destacados = productos.slice(0, 3);

  return (
    <>
      {/* Hero principal */}
      <section className="hero-taberna py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold">TIENDA ONLINE</h1>
              <p className="lead mb-4">
                Bienvenido a la mejor cervecería del mejor país de Chile.
                Disfruta de nuestras recetas artesanales preparadas con ingredientes
                de alta calidad y el descanso digno de un Snorlax.
              </p>
              <Link to="/productos" className="btn btn-light btn-lg me-2">
                Ver productos
              </Link>
              <Link to="/ofertas" className="btn btn-outline-light btn-lg">
                Ver ofertas
              </Link>
            </div>
            <div className="col-lg-5 text-center mt-4 mt-lg-0">
              <img
                src="/imagenes/Char.png"
                alt="Mascota de la Taberna"
                style={{ maxHeight: '240px', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container my-5">
        <h2 className="h4 mb-3">Explora por categoría</h2>
        <div className="d-flex flex-wrap gap-2">
          {categorias.map((cat) => (
            <Link key={cat} to="/categorias" className="btn btn-outline-primary btn-sm">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="container my-5">
        <h2 className="h4 mb-4">Destacados de la casa</h2>
        <div className="row">
          {destacados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>

      {/* Video de elaboración */}
      <section className="container my-5 mb-5">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h3 className="h5">Elaboración en La Taberna</h3>
            <p className="text-secondary mb-3">
              Conoce el proceso de elaboración de nuestras cervezas.
            </p>
            <div className="video-contenedor">
              <iframe
                src="https://www.youtube.com/embed/b9-8DCwniM4"
                title="Taverna Snorlax"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
