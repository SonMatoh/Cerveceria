// ORGANISMO: Popup (modal) con el detalle de un producto.
// Se abre desde "Ver detalles" en cualquier página SIN cambiar de ruta
// (la ruta /productos/:id sigue existiendo para acceso directo/refresh).
// El precio se calcula al mostrar: descuento propio + -10% si es socio
// y el producto está en la oferta del día.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import Image from '../atoms/Image.jsx';
import Button from '../atoms/Button.jsx';
import Text from '../atoms/Text.jsx';
import { useStore } from '../../hooks/useStore.js';
import {
  suscribirDetalle,
  obtenerDetalle,
  cerrarDetalle,
} from '../../data/uiStore.js';
import { suscribirSesion, obtenerSesion } from '../../data/sesionStore.js';
import { agregarAlCarrito } from '../../data/carritoStore.js';
import { esElegido, precioSocio } from '../../utils/socios.js';
import { imgUrl, formatoClp, precioFinal } from '../../utils/imagenes.js';

export function DetalleModal() {
  const producto = useStore(suscribirDetalle, obtenerDetalle);
  const sesion = useStore(suscribirSesion, obtenerSesion);
  const [cantidad, setCantidad] = useState(1);

  // Al abrir otro producto la cantidad vuelve a 1.
  useEffect(() => {
    setCantidad(1);
  }, [producto ? producto.id : null]);

  if (!producto) return null;

  const enOferta = Number(producto.descuento) > 0;
  const socioElegido = esElegido(sesion, producto.id);
  const final = precioSocio(precioFinal(producto), sesion, producto.id);

  const sumar = () => setCantidad((c) => c + 1);
  const restar = () => setCantidad((c) => (c > 1 ? c - 1 : 1));
  const agregar = () => {
    agregarAlCarrito(producto, cantidad);
    cerrarDetalle();
  };

  return (
    <Modal
      show
      onHide={cerrarDetalle}
      centered
      scrollable
      size="lg"
      aria-labelledby="detalle-nombre"
    >
      <Modal.Header closeButton closeLabel="Cerrar detalle">
        <Modal.Title id="detalle-nombre" as="h2" className="h4 mb-0">
          {producto.nombre}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row g-4 align-items-start">
          <div className="col-md-5">
            <div className="detalle-imagen text-center">
              <Image
                src={imgUrl(producto.imagen)}
                alt={producto.nombre}
                className="img-fluid"
              />
            </div>
          </div>

          <div className="col-md-7">
            <div className="mb-2">
              {producto.estilo && (
                <span className="badge text-bg-secondary me-2">
                  {producto.estilo}
                </span>
              )}
              {enOferta && (
                <span className="badge badge-oferta me-2">
                  -{producto.descuento}%
                </span>
              )}
              {socioElegido && (
                <span className="badge text-bg-success">🎉 -10% Socio</span>
              )}
            </div>

            <Text variant="p" className="text-secondary">
              {producto.descripcion}
            </Text>

            <div className="mb-3">
              {(enOferta || socioElegido) && (
                <span className="precio-tachado me-2">
                  {formatoClp(producto.precio)}
                </span>
              )}
              <span className="fw-bold fs-4 text-primary">
                {formatoClp(final)}
              </span>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="small text-secondary">Unidades:</span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={restar}
                aria-label="Restar cantidad"
              >
                −
              </Button>
              <span className="fw-bold" aria-live="polite">
                {cantidad}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={sumar}
                aria-label="Sumar cantidad"
              >
                +
              </Button>
            </div>

            <div className="d-flex gap-2 flex-wrap">
              <Button variant="primary" onClick={agregar}>
                Agregar {cantidad} al carrito
              </Button>
              <Link
                to={`/productos/${producto.id}`}
                className="btn btn-outline-secondary"
                onClick={cerrarDetalle}
              >
                Ver página completa
              </Link>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DetalleModal;
