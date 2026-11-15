import React from 'react';
import { Link } from 'react-router-dom';
import { formatoClp } from '../data/Products.js';

const CLAVE_RESUMEN = 'resumenCompra';

function leerResumen() {
  const guardado = localStorage.getItem(CLAVE_RESUMEN);
  return guardado ? JSON.parse(guardado) : null;
}

export function CompraFallida() {
  const resumen = leerResumen();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-5">
              <div className="display-4 mb-3">💸</div>
              <h1 className="h3 text-danger">
                No se pudo realizar el pago{' '}
                {resumen?.nroOrden ? `(${resumen.nroOrden})` : ''}
              </h1>
              <p className="text-secondary">
                Tu pago fue rechazado por el medio de pago seleccionado.
                <br />
                No se realizó ningún cobro y tu carrito se mantuvo intacto.
              </p>
              <div className="mt-4">
                <Link to="/checkout" className="btn btn-success me-2">
                  VOLVER A REALIZAR EL PAGO
                </Link>
                <Link to="/carrito" className="btn btn-outline-secondary">
                  Reintentar desde el carrito
                </Link>
              </div>
            </div>
          </div>

          {resumen && (
            <div className="resumen-caja p-4 mt-4 text-start">
              <h2 className="h5 mb-3">Detalle del intento de compra</h2>
              <p className="small text-secondary mb-1">
                <strong>Cliente:</strong> {resumen.datos?.nombre} — {resumen.datos?.email}
              </p>
              <p className="small text-secondary mb-3">
                <strong>Dirección:</strong>{' '}
                {resumen.datos?.entrega === 'domicilio'
                  ? `${resumen.datos?.direccion}, ${resumen.datos?.comuna}`
                  : 'Retiro en tienda'}
              </p>
              <ul className="list-unstyled">
                {resumen.items?.map((item) => (
                  <li
                    key={item.id}
                    className="d-flex justify-content-between small mb-2"
                  >
                    <span>
                      {item.nombre} × {item.cantidad}
                    </span>
                    <span className="fw-semibold">
                      {formatoClp(item.precioFinal * item.cantidad)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between border-top pt-3">
                <span className="fw-bold">Total intentado</span>
                <span className="fw-bold text-danger fs-5">
                  {formatoClp(resumen.total)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompraFallida;