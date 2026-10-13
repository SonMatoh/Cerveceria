// Vista de compra fallida (pago rechazado).

import { Link } from 'react-router-dom';

export default function CompraFallida() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm text-center">
            <div className="card-body p-5">
              <div className="display-4 mb-3">💸</div>
              <h1 className="h3 text-danger">No se pudo realizar el pago</h1>
              <p className="text-secondary">
                Tu pago fue rechazado por el medio de pago seleccionado.
                <br />
                No se realizó ningún cobro y tu carrito se mantuvo intacto.
              </p>
              <div className="mt-4">
                <Link to="/carrito" className="btn btn-primary me-2">
                  Reintentar desde el carrito
                </Link>
                <Link to="/checkout" className="btn btn-outline-secondary">
                  Cambiar medio de pago
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
