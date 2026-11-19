import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import Image from '../components/atoms/Image.jsx';
import Text from '../components/atoms/Text.jsx';
import Button from '../components/atoms/Button.jsx';
import BlogService from '../services/BlogService.js';

export function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await BlogService.obtenerBlog(parseInt(id));
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.log('Error al obtener artículo del backend:', error);
        setLoading(false);
      }
    };
    loadPost();
  }, [parseInt(id)]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h2>Cargando artículo...</h2>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container className="py-5">
        <Text variant="h1" className="h3">
          Artículo no encontrado
        </Text>
        <Button variant="primary" className="mt-3" onClick={() => navigate('/blog')}>
          Volver al Blog
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button
        variant="outline-secondary"
        size="sm"
        className="mb-4"
        onClick={() => navigate('/blog')}
      >
        ← Volver al Blog
      </Button>

      <Card className="border-0 shadow-sm p-4">
        <div className="text-center mb-4">
          <Image
            src={post.imagenUrl || post.imagen}
            alt={post.titulo}
            style={{ maxHeight: '240px', objectFit: 'contain' }}
          />
        </div>
        <Card.Body>
          <small className="text-secondary d-block mb-2">
            {post.fecha} — Escrito por <strong>{post.autor}</strong>
          </small>
          <Text variant="h1" className="h3 fw-bold mb-3">
            {post.titulo}
          </Text>
          <Text variant="p" className="lead text-secondary">
            {post.resumen}
          </Text>
          <Text variant="p" className="mt-3">
            {post.contenido}
          </Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BlogDetail;
