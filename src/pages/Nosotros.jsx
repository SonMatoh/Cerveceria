import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';

export function Nosotros() {
  return (
    <Container className="py-5">
      <Row className="align-items-center g-4 mb-5">
        <Col lg={7}>
          <Text variant="h1" className="h2 fw-bold mb-3">
            Sobre La Taberna de Snorlax
          </Text>
          <Text variant="p" className="lead text-secondary">
            Nacimos en Santiago de Chile con la misión de fusionar la cultura geek y la
            cervecería artesanal de alta graduación.
          </Text>
          <Text variant="p" className="text-secondary">
            Cada una de nuestras recetas se cocina en pequeños lotes utilizando maltas
            seleccionadas, lúpulos frescos e ingredientes botánicos que rinden tributo a
            las criaturas más icónicas. Creemos en el consumo responsable, exclusivo para
            mayores de 18 años, y en ofrecer una experiencia única en cada botella.
          </Text>
        </Col>
        <Col lg={5} className="text-center">
          <Image
            src="/imagenes/Char.png"
            alt="Equipo de La Taberna de Snorlax"
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '260px' }}
          />
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100 p-3">
            <Card.Body>
              <Text variant="h3" className="h5 fw-bold text-primary">
                🍺 100% Artesanal
              </Text>
              <Text variant="p" className="small text-secondary mb-0">
                Elaboración propia sin aditivos artificiales, respetando los tiempos de
                fermentación y maduración en frío.
              </Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100 p-3">
            <Card.Body>
              <Text variant="h3" className="h5 fw-bold text-primary">
                🚚 Despacho en RM y Regiones
              </Text>
              <Text variant="p" className="small text-secondary mb-0">
                Enviamos tus pedidos refrigerados y protegidos a domicilio o con retiro
                directo en nuestra taberna.
              </Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100 p-3">
            <Card.Body>
              <Text variant="h3" className="h5 fw-bold text-primary">
                🔞 Compromiso +18
              </Text>
              <Text variant="p" className="small text-secondary mb-0">
                Verificamos la mayoría de edad en cada registro y compra para promover un
                consumo seguro.
              </Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Nosotros;