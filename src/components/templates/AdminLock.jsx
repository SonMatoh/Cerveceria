// ADMINLOCK: guard de rutas (patrón plantilla del atomic design).
// Protege la vista de administración con 3 estados:
// 1. Sin sesión iniciada  → redirige a /login y recuerda la ruta de origen
//    para volver tras autenticarse.
// 2. Con sesión pero SIN rol administrador → redirige al home.
// 3. Con sesión de administrador → muestra el panel.

import { Navigate, useLocation } from 'react-router-dom';

import { useStore } from '../../hooks/useStore.js';
import {
  suscribirSesion,
  obtenerSesion,
} from '../../data/sesionStore.js';
import { esAdmin } from '../../data/usuariosStore.js';

export function AdminLock({ children }) {
  const sesion = useStore(suscribirSesion, obtenerSesion);
  const location = useLocation();

  if (!sesion) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!esAdmin(sesion.email)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminLock;
