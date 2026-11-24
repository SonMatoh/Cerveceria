import React from 'react';
import Image from '../atoms/Image.jsx';
import Button from '../atoms/Button.jsx';
import Text from '../atoms/Text.jsx';
import {
  formatoClp,
  precioSocio,
  obtenerSesion,
  eliminarDelCarrito,
  cambiarCantidadCarrito,
} from '../../data/Products.js';

export function CartItem({ item, onRemove }) {
  const sesion = obtenerSesion();
  const unitario = precioSocio(item.precioFinal, sesion, item.id);

  const quitar = () => {
    eliminarDelCarrito(item.id);
    if (onRemove) onRemove(item.id);
  };

  const cambiar = (delta) => {
    cambiarCantidadCarrito(item.id, delta);
    if (onRemove) onRemove(item.id);
  };

  return (
    <div className="card border-0 shadow-sm p-3">
      <div className="row align-items-center g-2">
        <div className="col-auto">
          <Image
            src={item.imagen}
            alt={item.nombre}
            style={{ width: 54, height: 54, objectFit: 'contain' }}
          />
        </div>
        <div className="col-12 col-sm">
          <Text variant="span" className="fw-bold">
            {item.nombre}
          </Text>
          <div className="small text-secondary">
            {formatoClp(unitario)} × {item.cantidad} un.
          </div>
        </div>
        <div className="col-auto d-flex align-items-center gap-1">
          <Button variant="outline-secondary" size="sm" onClick={() => cambiar(-1)}>
            −
          </Button>
          <span className="px-2 fw-bold">{item.cantidad}</span>
          <Button variant="outline-secondary" size="sm" onClick={() => cambiar(1)}>
            +
          </Button>
        </div>
        <div className="col-6 col-sm-auto text-sm-end">
          <Text variant="span" className="fw-bold text-primary">
            {formatoClp(unitario * item.cantidad)}
          </Text>
        </div>
        <div className="col-6 col-sm-auto text-end">
          <Button variant="outline-danger" size="sm" onClick={quitar}>
            Quitar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;