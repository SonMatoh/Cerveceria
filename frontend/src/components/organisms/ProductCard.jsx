import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Modal } from 'react-bootstrap';

import Image from '../atoms/Image.jsx';
import Button from '../atoms/Button.jsx';
import Text from '../atoms/Text.jsx';
import CardBody from '../molecules/CardBody.jsx';
import {
  agregarAlCarrito,
  obtenerSesion,
  esElegido,
  precioSocio,
  formatoClp,
  precioFinal,
} from '../../data/Products.js';

export function ProductCard({ producto, product }) {
  const item = producto || product;
  const [cantidad, setCantidad] = useState(1);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const navigate = useNavigate();
  const sesion = obtenerSesion();

  const nombre = item.nombre || item.name;
  const descripcion = item.descripcion || item.description;
  const imagen = item.imagen || item.image;
  const precioBase = item.precio ?? item.price ?? 0;

  const enOferta = Number(item.descuento) > 0;
  const socioElegido = esElegido(sesion, item.id);
  const final = precioSocio(
    precioFinal({ precio: precioBase, descuento: item.descuento }),
    sesion,
    item.id
  );

  const sumar = () => setCantidad((c) => c + 1);
  const restar = () => setCantidad((c) => (c > 1 ? c - 1 : 1));

  const agregar = () => {
    agregarAlCarrito(
      {
        id: item.id,
        nombre: nombre,
        imagen: imagen,
        precio: precioBase,
        descuento: item.descuento || 0,
      },
      cantidad
    );
    setCantidad(1);
    setMostrarDetalle(false);
    if (window.actualizarNavbar) {
      window.actualizarNavbar();
    }
  };

  return (
    <div className="col-12 col-md-6 col-xl-4 mb-4">
      <Card className="card-producto h-100 border-0 shadow-sm">
        {/* Al presionar la imagen o el cuerpo de la tarjeta, el producto se agranda en un Modal */}
        <div
          className="img-wrap text-center position-relative"
          style={{ cursor: 'pointer' }}
          onClick={() => setMostrarDetalle(true)}
          title="Haz clic para agrandar y ver detalles"
        >
          {enOferta && (
            <span className="badge badge-oferta position-absolute top-0 end-0 m-2">
              -{item.descuento}%
            </span>
          )}
          {socioElegido && (
            <span className="badge text-bg-success position-absolute top-0 start-0 m-2">
              🎉 -10% Socio
            </span>
          )}
          <Image src={imagen} alt={nombre} className="card-img-top" />
        </div>

        <Card.Body
          style={{ cursor: 'pointer' }}
          onClick={() => setMostrarDetalle(true)}
          title="Haz clic para agrandar y ver detalles"
        >
          <CardBody
            title={nombre}
            tag={item.estilo}
            description={descripcion}
            oldPrice={enOferta || socioElegido ? formatoClp(precioBase) : null}
            price={formatoClp(final)}
          />
        </Card.Body>

        <Card.Footer className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="small text-secondary">Unidades:</span>
          <div className="btn-group btn-group-sm" role="group" aria-label="Cantidad">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={restar}
            >
              −
            </button>
            <span className="btn btn-light disabled fw-bold" aria-live="polite">
              {cantidad}
            </span>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={sumar}
            >
              +
            </button>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setMostrarDetalle(true)}
            >
              Ampliar 🔍
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => navigate(`/productos/${item.id}`)}
            >
              Ver detalles
            </Button>
            <Button variant="primary" size="sm" onClick={agregar}>
              Agregar 🛒
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* Ventana ampliada con todos los detalles del producto al presionarlo */}
      <Modal
        show={mostrarDetalle}
        onHide={() => setMostrarDetalle(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">{nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-4 align-items-center">
            <div className="col-md-5 text-center">
              <div className="detalle-imagen p-3">
                <Image
                  src={imagen}
                  alt={nombre}
                  className="img-fluid"
                  style={{ maxHeight: '280px', objectFit: 'contain' }}
                />
              </div>
            </div>
            <div className="col-md-7">
              <div className="mb-2">
                {item.categoria && (
                  <span className="badge text-bg-dark me-2">{item.categoria}</span>
                )}
                {item.estilo && (
                  <span className="badge text-bg-warning me-2">{item.estilo}</span>
                )}
                {enOferta && (
                  <span className="badge badge-oferta me-2">-{item.descuento}%</span>
                )}
                {socioElegido && (
                  <span className="badge text-bg-success">🎉 -10% Socio</span>
                )}
              </div>

              <Text variant="p" className="text-secondary mt-3">
                {descripcion}
              </Text>

              <div className="my-3">
                {(enOferta || socioElegido) && (
                  <span className="precio-tachado me-2">
                    {formatoClp(precioBase)}
                  </span>
                )}
                <span className="fw-bold fs-3 text-primary">
                  {formatoClp(final)}
                </span>
              </div>

              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="small text-secondary">Cantidad:</span>
                <Button variant="outline-danger" size="sm" onClick={restar}>
                  −
                </Button>
                <span className="fw-bold px-2">{cantidad}</span>
                <Button variant="outline-success" size="sm" onClick={sumar}>
                  +
                </Button>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <Button variant="primary" onClick={agregar}>
                  Agregar {cantidad} al carrito 🛒
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setMostrarDetalle(false);
                    navigate(`/productos/${item.id}`);
                  }}
                >
                  Ir a la página del producto
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProductCard;