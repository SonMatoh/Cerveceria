import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import Button from '../components/atoms/Button.jsx';
import { blogsIniciales } from '../data/Products.js';

export function Blog() {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <Text variant="h1" className="h3 mb-2">
        Noticias y Blog Cervecero
      </Text>
      <Text variant="p" className="text-secondary mb-4">
        Historias, procesos de fermentación y novedades de La Taberna de Snorlax.
      </Text>

      <Row className="g-4">
        {blogsIniciales.map((post) => (
          <Col md={6} key={post.id}>
            <Card className="card-producto border-0 shadow-sm h-100">
              <div className="img-wrap text-center">
                <Image src={post.imagen} alt={post.titulo} />
              </div>
              <Card.Body>
                <small className="text-secondary d-block mb-1">
                  {post.fecha} • Por {post.autor}
                </small>
                <Text variant="h2" className="h5 fw-bold">
                  {post.titulo}
                </Text>
                <Text variant="p" className="text-secondary small">
                  {post.resumen}
                </Text>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  Leer artículo completo
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Blog;