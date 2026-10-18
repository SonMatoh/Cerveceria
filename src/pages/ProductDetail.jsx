import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col } from 'react-bootstrap';

import Text from '../components/atoms/Text.jsx';
import Image from '../components/atoms/Image.jsx';
import Button from '../components/atoms/Button.jsx';
import {
  obtenerProductos,
  obtenerSesion,
  agregarAlCarrito,
  esElegido,
  precioSocio,
  formatoClp,
  precioFinal,
} from '../data/Products.js';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productos = obtenerProductos();
  const producto = productos.find((p) => p.id === parseInt(id));
  const sesion = obtenerSesion();

  if (!producto) {
    return (
      <Container className="my-5">
        <h1>Producto no encontrado</h1>
        <Button variant="primary" className="mt-3" onClick={() => navigate('/productos')}>
          Volver a productos
        </Button>
      </Container>
    );
  }

  const enOferta = Number(producto.descuento) > 0;
  const socioElegido = esElegido(sesion, producto.id);
  const final = precioSocio(precioFinal(producto), sesion, producto.id);

  const agregar = () => {
    agregarAlCarrito(producto, 1);
    if (window.actualizarNavbar) {
      window.actualizarNavbar();
    }
  };

  return (
    <Container className="py-5">
      <Button
        variant="outline-secondary"
        size="sm"
        className="mb-4"
        onClick={() => navigate('/productos')}
      >
        ← Volver a productos
      </Button>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4 p-lg-5">
          <Row className="align-items-center g-4">
            <Col lg={5} className="text-center">
              <div className="img-wrap rounded-3">
                <Image
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="card-img-top"
                  style={{ maxHeight: 320, width: '100%', objectFit: 'contain' }}
                />
              </div>
            </Col>

            <Col lg={7}>
              {enOferta && (
                <span className="badge badge-oferta mb-2">
                  -{producto.descuento}% de descuento
                </span>
              )}
              {socioElegido && (
                <span className="badge text-bg-success ms-2 mb-2">
                  🎉 -10% Socio
                </span>
              )}

              <Text variant="h1" className="h2 fw-bold">
                {producto.nombre}
              </Text>

              <span className="badge text-bg-warning d-inline-block my-2">
                {producto.estilo}
              </span>

              <Text variant="p" className="text-secondary mt-3">
                {producto.descripcion}
              </Text>

              <Text variant="p" className="mt-3 mb-1">
                {(enOferta || socioElegido) && (
                  <span className="precio-tachado">
                    {formatoClp(producto.precio)}
                  </span>
                )}
                <span className="fw-bold fs-3 text-primary">
                  {formatoClp(final)}
                </span>
              </Text>

              <Text variant="p" className="small text-secondary mb-4">
                Categoría: <strong>{producto.categoria}</strong>
              </Text>

              <div className="d-flex gap-2 flex-wrap">
                <Button onClick={agregar} variant="primary" size="lg">
                  Agregar al carrito 🛒
                </Button>
                <Button as={Link} to="/carrito" variant="outline-primary" size="lg">
                  Ver carrito
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProductDetail;