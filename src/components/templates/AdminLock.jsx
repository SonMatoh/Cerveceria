import React from 'react';
import { Navigate } from 'react-router-dom';
import { obtenerSesion, esAdmin } from '../../data/Products.js';

export function AdminLock({ children }) {
  const sesion = obtenerSesion();

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  if (!esAdmin(sesion.email)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminLock;