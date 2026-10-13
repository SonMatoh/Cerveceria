// ORGANISMO: Tarjeta de producto.
// Combina átomos (Image, Button, Text) + molécula (CardBody).
// - Recibe el producto por PROPS.
// - Gestiona su propio ESTADO local (cantidad a comprar).
// - Responde a EVENTOS (sumar/restar/agregar/ver detalles).

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

import Image from '../atoms/Image.jsx';
import Button from '../atoms/Button.jsx';
import CardBody from '../molecules/CardBody.jsx';
import { useStore } from '../../hooks/useStore.js';
import { agregarAlCarrito } from '../../data/carritoStore.js';
import { abrirDetalle } from '../../data/uiStore.js';
import { suscribirSesion, obtenerSesion } from '../../data/sesionStore.js';
import { esElegido, precioSocio } from '../../utils/socios.js';
import { imgUrl, formatoClp, precioFinal } from '../../utils/imagenes.js';

export function ProductoCard({ producto }) {
  const [cantidad, setCantidad] = useState(1);
  const sesion = useStore(suscribirSesion, obtenerSesion);

  const enOferta = Number(producto.descuento) > 0;
  const socioElegido = esElegido(sesion, producto.id);
  const final = precioSocio(precioFinal(producto), sesion, producto.id);

  const sumar = () => setCantidad((c) => c + 1);
  const restar = () => setCantidad((c) => (c > 1 ? c - 1 : 1));

  const agregar = () => {
    agregarAlCarrito(producto, cantidad);
    setCantidad(1);
  };

  // Click normal → popup en la misma página.
  // Ctrl/Cmd + clic o clic central → pestaña nueva con la página completa
  // (el href se conserva, así el enlace sigue siendo "abrir en otra pestaña").
  const abrirPopup = (evento) => {
    if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) {
      return;
    }
    evento.preventDefault();
    abrirDetalle(producto);
  };

  return (
    <div className="col-12 col-md-6 col-xl-4 mb-4">
      <Card className="card-producto h-100 border-0 shadow-sm">
        <div className="img-wrap text-center position-relative">
          {enOferta && (
            <span className="badge badge-oferta position-absolute top-0 end-0 m-2">
              -{producto.descuento}%
            </span>
          )}
          {socioElegido && (
            <span className="badge text-bg-success position-absolute top-0 start-0 m-2">
              🎉 -10% Socio
            </span>
          )}
          <Image src={imgUrl(producto.imagen)} alt={producto.nombre} />
        </div>

        <Card.Body>
          <CardBody
            title={producto.nombre}
            tag={producto.estilo}
            description={producto.descripcion}
            oldPrice={enOferta || socioElegido ? formatoClp(producto.precio) : null}
            price={formatoClp(final)}
          />
        </Card.Body>

        <Card.Footer className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="small text-secondary">Unidades:</span>
          <div className="btn-group btn-group-sm" role="group" aria-label="Cantidad">
            <button type="button" className="btn btn-outline-danger" onClick={restar}>
              −
            </button>
            <span className="btn btn-light disabled fw-bold" aria-live="polite">
              {cantidad}
            </span>
            <button type="button" className="btn btn-outline-success" onClick={sumar}>
              +
            </button>
          </div>
          <div className="d-flex gap-2">
            <Link
              to={`/productos/${producto.id}`}
              className="btn btn-outline-secondary btn-sm"
              onClick={abrirPopup}
            >
              Ver detalles
            </Link>
            <Button variant="primary" size="sm" onClick={agregar}>
              Agregar 🛒
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default ProductoCard;
