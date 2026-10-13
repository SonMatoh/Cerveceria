// ORGANISMO: Barra de navegación (react-bootstrap + lógica de stores).
// - Contador del carrito en tiempo real.
// - Renderizado condicional de la zona de sesión (iniciar/cerrar).

import { Link, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';

import Button from '../atoms/Button.jsx';
import { useStore } from '../../hooks/useStore.js';
import { suscribirCarrito, contarItems } from '../../data/carritoStore.js';
import { suscribirSesion, obtenerSesion, cerrarSesion } from '../../data/sesionStore.js';
import { esAdmin } from '../../data/usuariosStore.js';

const links = [
  { ruta: '/', texto: 'Home' },
  { ruta: '/productos', texto: 'Productos' },
  { ruta: '/categorias', texto: 'Categorías' },
  { ruta: '/ofertas', texto: 'Ofertas' },
  { ruta: '/contacto', texto: 'Contacto' },
];

export function Navbar() {
  const totalItems = useStore(suscribirCarrito, contarItems);
  const sesion = useStore(suscribirSesion, obtenerSesion);
  const { pathname } = useLocation();

  const esActiva = (ruta) =>
    ruta === '/' ? pathname === '/' : pathname.startsWith(ruta);

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

        <BootstrapNavbar.Toggle aria-controls="menu-principal" />
        <BootstrapNavbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            {links.map((link) => (
              <Nav.Link key={link.ruta} as={Link} to={link.ruta} active={esActiva(link.ruta)}>
                {link.texto}
              </Nav.Link>
            ))}
            {sesion && esAdmin(sesion.email) && (
              <Nav.Link as={Link} to="/admin" active={esActiva('/admin')}>
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
                <Button variant="outline-secondary" size="sm" onClick={cerrarSesion}>
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
