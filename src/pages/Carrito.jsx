// Vista del carrito de compras (organismo: usa la molécula CartItem).

import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

import Button from '../components/atoms/Button.jsx';
import Text from '../components/atoms/Text.jsx';
import CartItem from '../components/molecules/CartItem.jsx';
import { useStore } from '../hooks/useStore.js';
import {
  suscribirCarrito,
  obtenerCarrito,
  totalCarrito,
} from '../data/carritoStore.js';
import { suscribirSesion, obtenerSesion } from '../data/sesionStore.js';
import { formatoClp } from '../utils/imagenes.js';

export default function Carrito() {
  const carrito = useStore(suscribirCarrito, obtenerCarrito);
  const sesion = useStore(suscribirSesion, obtenerSesion);
  // El total se recalcula con la oferta del día vigente (si es socio).
  const total = totalCarrito(sesion);
  const navigate = useNavigate();

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
              <CartItem key={item.id} item={item} />
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
                className="w-100 fw-bold"
                variant="primary"
                onClick={() => navigate('/checkout')}
              >
                Proceder al Pago
              </Button>
              <Button
                as={Link}
                to="/productos"
                variant="link"
                className="mt-2 text-decoration-none"
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
