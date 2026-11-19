import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import Button from '../components/atoms/Button.jsx';
import BlogService from '../services/BlogService.js';

export function Blog() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await BlogService.listarBlog();
        setBlogs(data);
        setLoading(false);
      } catch (error) {
        console.log('Error al obtener blog del backend:', error);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h2>Cargando artículos...</h2>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Text variant="h1" className="h3 mb-2">
        Noticias y Blog Cervecero
      </Text>
      <Text variant="p" className="text-secondary mb-4">
        Historias, procesos de fermentación y novedades de La Taberna de Snorlax.
      </Text>

      <Row className="g-4">
        {blogs.map((post) => (
          <Col md={6} key={post.id}>
            <Card className="card-producto border-0 shadow-sm h-100">
              <div className="img-wrap text-center">
                <Image src={post.imagenUrl || post.imagen} alt={post.titulo} />
              </div>
              <Card.Body>
                <small className="text-secondary d-block mb-1">
                  {post.fecha} — Por {post.autor}
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
