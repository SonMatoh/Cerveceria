import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';

import Button from '../atoms/Button.jsx';
import {
  contarItems,
  obtenerSesion,
  cerrarSesion,
  esAdmin,
} from '../../data/Products.js';

const links = [
  { ruta: '/', texto: 'Home' },
  { ruta: '/productos', texto: 'Productos' },
  { ruta: '/categorias', texto: 'Categorías' },
  { ruta: '/ofertas', texto: 'Ofertas' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/blog', texto: 'Blog' },
  { ruta: '/contacto', texto: 'Contacto' },
];

export function Navbar() {
  const [, setActualizar] = useState(0);
  const navigate = useNavigate();

  window.actualizarNavbar = () => setActualizar((n) => n + 1);

  const totalItems = contarItems();
  const sesion = obtenerSesion();

  const salir = () => {
    cerrarSesion();
    setActualizar((n) => n + 1);
    navigate('/');
  };

  return (
    <BootstrapNavbar
      expand="lg"
      sticky="top"
      className="navbar-taberna bg-body-tertiary"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          🍺 La Taberna de Snorlax
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {links.map((link) => (
              <Nav.Link key={link.ruta} as={Link} to={link.ruta}>
                {link.texto}
              </Nav.Link>
            ))}
            {sesion && esAdmin(sesion.email) && (
              <Nav.Link as={Link} to="/admin">
                Administración
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            {sesion ? (
              <>
                <span className="small text-secondary">
                  Hola, <strong>{sesion.nombre || sesion.email}</strong>
                </span>
                <Button variant="outline-secondary" size="sm" onClick={salir}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="small fw-semibold">
                  Iniciar sesión
                </Nav.Link>
                <span className="text-secondary">|</span>
                <Nav.Link as={Link} to="/registro" className="small fw-semibold">
                  Registrarse
                </Nav.Link>
              </>
            )}

            <Button as={Link} to="/carrito" variant="primary" size="sm">
              🛒 Cart ({totalItems})
            </Button>
          </div>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;