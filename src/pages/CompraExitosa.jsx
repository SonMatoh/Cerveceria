import React from 'react';
import { Link } from 'react-router-dom';
import { formatoClp } from '../data/Products.js';

const CLAVE_RESUMEN = 'resumenCompra';

function leerResumen() {
  const guardado = localStorage.getItem(CLAVE_RESUMEN);
  return guardado ? JSON.parse(guardado) : null;
}

export function CompraExitosa() {
  const resumen = leerResumen();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-5">
              <div className="display-4 mb-3">🍻</div>
              <h1 className="h3 text-success">¡Compra realizada con éxito!</h1>
              {resumen?.nroOrden && (
                <p className="fw-bold text-primary mb-2">
                  Código de orden: {resumen.nroOrden}
                </p>
              )}
              <p className="text-secondary mb-0">
                Gracias por tu pedido. Recibirás la confirmación en tu correo.
                ¡Salud!
              </p>
            </div>
          </div>

          {resumen && (
            <div className="resumen-caja p-4 mt-4 text-start">
              <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                <h2 className="h5 mb-0">
                  Resumen de la compra{' '}
                  {resumen.nroOrden ? `(${resumen.nroOrden})` : ''}
                </h2>
                <span className="badge text-bg-success align-self-start">
                  Pago {resumen.estado}
                </span>
              </div>

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
                <span className="fw-bold">Total pagado</span>
                <span className="fw-bold text-primary fs-5">
                  {formatoClp(resumen.total)}
                </span>
              </div>

              <hr />
              <p className="small text-secondary mb-1">
                <strong>Cliente:</strong> {resumen.datos?.nombre} — {resumen.datos?.email}{' '}
                {resumen.datos?.modalidad ? `(${resumen.datos.modalidad})` : ''}
              </p>
              <p className="small text-secondary mb-1">
                <strong>Entrega:</strong>{' '}
                {resumen.datos?.entrega === 'domicilio'
                  ? `Envío a ${resumen.datos?.direccion}, ${resumen.datos?.comuna}`
                  : 'Retiro en tienda'}
              </p>
              <p className="small text-secondary mb-0">
                <strong>Fecha:</strong> {resumen.fecha}
              </p>
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/productos" className="btn btn-primary me-2">
              Seguir comprando
            </Link>
            <Link to="/" className="btn btn-outline-secondary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompraExitosa;