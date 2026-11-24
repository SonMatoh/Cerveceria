import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

import Button from '../components/atoms/Button.jsx';
import Text from '../components/atoms/Text.jsx';
import CartItem from '../components/molecules/CartItem.jsx';
import {
  obtenerCarrito,
  totalCarrito,
  vaciarCarrito,
  obtenerSesion,
  formatoClp,
} from '../data/Products.js';

export function Carrito() {
  const [carrito, setCarrito] = useState(obtenerCarrito());
  const sesion = obtenerSesion();
  const total = totalCarrito(sesion);
  const navigate = useNavigate();

  const actualizarVista = () => {
    setCarrito(obtenerCarrito());
    if (window.actualizarNavbar) {
      window.actualizarNavbar();
    }
  };

  const limpiar = () => {
    vaciarCarrito();
    actualizarVista();
  };

  if (carrito.length === 0) {
    return (
      <Container className="py-5">
        <Text variant="h1" className="h3 mb-4">
          Tu carrito
        </Text>
        <div className="text-center py-5 border rounded bg-light">
          <p className="text-secondary mb-4">Tu carrito de compras está vacío.</p>
          <Button as={Link} to="/productos" variant="primary">
            Ver productos
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Text variant="h1" className="h3 mb-4">
        Tu carrito
      </Text>

      <Row className="g-4">
        <Col lg={8}>
          <div className="d-flex flex-column gap-3">
            {carrito.map((item) => (
              <CartItem key={item.id} item={item} onRemove={actualizarVista} />
            ))}
          </div>
        </Col>

        <Col lg={4}>
          <Card className="resumen-caja border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Text variant="span" className="fw-bold">
                  Total a pagar:
                </Text>
                <Text variant="span" className="fs-4 fw-bold text-primary">
                  {formatoClp(total)}
                </Text>
              </div>
              <Button
                className="w-100 fw-bold mb-2"
                variant="primary"
                onClick={() => navigate('/checkout')}
              >
                Proceder al Pago
              </Button>
              <Button
                className="w-100"
                variant="outline-secondary"
                size="sm"
                onClick={limpiar}
              >
                Limpiar carrito
              </Button>
              <Button
                as={Link}
                to="/productos"
                variant="link"
                className="mt-2 text-decoration-none d-block text-center"
              >
                Seguir comprando
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Carrito;