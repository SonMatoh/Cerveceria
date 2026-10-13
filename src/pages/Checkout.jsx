// ============================================================================
// CHECKOUT (paso de pago) - nueva vista del Anexo 1.
// - Formulario con ESTADO local controlado (React state).
// - Se autocompleta con los datos de la sesión si el usuario inició sesión.
// - Valida los campos antes de generar el resumen de compra.
// - Genera la compra exitosa o fallida según el resultado del pago.
// ============================================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore.js';
import {
  suscribirCarrito,
  obtenerCarrito,
  totalCarrito,
  vaciarCarrito,
} from '../data/carritoStore.js';
import { suscribirSesion, obtenerSesion } from '../data/sesionStore.js';
import { validarNombre, validarEmail } from '../utils/validaciones.js';
import { precioSocio } from '../utils/socios.js';
import { formatoClp } from '../utils/imagenes.js';

const CLAVE_RESUMEN = 'resumenCompra';

const estadoInicial = {
  nombre: '',
  email: '',
  direccion: '',
  comuna: '',
  entrega: 'domicilio',
  pago: 'tarjeta',
  rechazarPago: false,
};

export default function Checkout() {
  const carrito = useStore(suscribirCarrito, obtenerCarrito);
  const sesion = useStore(suscribirSesion, obtenerSesion);
  // Total con la oferta del día aplicada (se recalcula al confirmar).
  const total = totalCarrito(sesion);
  const navigate = useNavigate();

  // Estado inicial: autocompleta desde la sesión si existe.
  const [datos, setDatos] = useState(() =>
    sesion
      ? {
          ...estadoInicial,
          nombre: sesion.nombre || '',
          email: sesion.email || '',
          direccion: sesion.direccion || '',
          comuna: sesion.comuna || '',
        }
      : estadoInicial
  );
  const [errores, setErrores] = useState({});

  const cambiar = (campo) => (evento) => {
    const valor =
      evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value;
    setDatos((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: '' }));
  };

  if (carrito.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h1 className="h3">Checkout</h1>
        <div className="alert alert-light border py-5">
          <p className="mb-4 text-secondary">
            No hay productos en el carrito para pagar.
          </p>
          <Link to="/productos" className="btn btn-primary">
            Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  const enviar = (evento) => {
    evento.preventDefault();

    const resultados = {
      nombre: validarNombre(datos.nombre),
      email: validarEmail(datos.email),
      direccion:
        datos.entrega === 'domicilio' && !datos.direccion.trim()
          ? { valido: false, mensaje: 'Debes indicar una dirección de envío.' }
          : { valido: true, mensaje: '' },
      comuna:
        datos.entrega === 'domicilio' && !datos.comuna.trim()
          ? { valido: false, mensaje: 'Debes indicar la comuna.' }
          : { valido: true, mensaje: '' },
    };

    const nuevosErrores = Object.fromEntries(
      Object.entries(resultados)
        .filter(([, r]) => !r.valido)
        .map(([campo, r]) => [campo, r.mensaje])
    );

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const resumen = {
      fecha: new Date().toLocaleString('es-CL'),
      items: carrito,
      total,
      datos: {
        nombre: datos.nombre,
        email: datos.email,
        entrega: datos.entrega,
        direccion: datos.direccion,
        comuna: datos.comuna,
        pago: datos.pago,
      },
      estado: datos.rechazarPago ? 'rechazada' : 'aprobada',
    };
    localStorage.setItem(CLAVE_RESUMEN, JSON.stringify(resumen));

    if (datos.rechazarPago) {
      // Pago fallido: el carrito se conserva para reintentar.
      navigate('/compra-fallida');
    } else {
      vaciarCarrito();
      navigate('/compra-exitosa');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="h3 mb-4">Checkout — Paso de pago</h1>

      <div className="row g-4">
        {/* Formulario */}
        <div className="col-lg-7">
          <form onSubmit={enviar} noValidate>
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">1. Datos de entrega</h2>

                <div className="mb-3">
                  <label htmlFor="co-nombre" className="form-label">
                    Nombre completo
                  </label>
                  <input
                    id="co-nombre"
                    type="text"
                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                    value={datos.nombre}
                    onChange={cambiar('nombre')}
                  />
                  <div className="invalid-feedback">{errores.nombre}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="co-email" className="form-label">
                    Correo electrónico
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                    value={datos.email}
                    onChange={cambiar('email')}
                  />
                  <div className="invalid-feedback">{errores.email}</div>
                </div>

                <div className="mb-3">
                  <span className="form-label d-block">Tipo de entrega</span>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="entrega"
                      id="entrega-domicilio"
                      value="domicilio"
                      checked={datos.entrega === 'domicilio'}
                      onChange={cambiar('entrega')}
                    />
                    <label className="form-check-label" htmlFor="entrega-domicilio">
                      Envío a domicilio
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="entrega"
                      id="entrega-retiro"
                      value="retiro"
                      checked={datos.entrega === 'retiro'}
                      onChange={cambiar('entrega')}
                    />
                    <label className="form-check-label" htmlFor="entrega-retiro">
                      Retiro en tienda
                    </label>
                  </div>
                </div>

                {datos.entrega === 'domicilio' && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="co-direccion" className="form-label">
                        Dirección
                      </label>
                      <input
                        id="co-direccion"
                        type="text"
                        className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                        value={datos.direccion}
                        onChange={cambiar('direccion')}
                      />
                      <div className="invalid-feedback">{errores.direccion}</div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="co-comuna" className="form-label">
                        Comuna
                      </label>
                      <input
                        id="co-comuna"
                        type="text"
                        className={`form-control ${errores.comuna ? 'is-invalid' : ''}`}
                        value={datos.comuna}
                        onChange={cambiar('comuna')}
                      />
                      <div className="invalid-feedback">{errores.comuna}</div>
                    </div>
                  </>
                )}

                <h2 className="h5 mt-4 mb-3">2. Método de pago</h2>
                <div className="mb-3">
                  <label htmlFor="co-pago" className="form-label">
                    Medio de pago
                  </label>
                  <select
                    id="co-pago"
                    className="form-select"
                    value={datos.pago}
                    onChange={cambiar('pago')}
                  >
                    <option value="tarjeta">Tarjeta de crédito</option>
                    <option value="debito">Tarjeta de débito</option>
                    <option value="transferencia">Transferencia bancaria</option>
                  </select>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="co-rechazar"
                    checked={datos.rechazarPago}
                    onChange={cambiar('rechazarPago')}
                  />
                  <label className="form-check-label small text-secondary" htmlFor="co-rechazar">
                    Simular pago rechazado (demostración de la vista de compra fallida)
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold">
                  Confirmar compra — {formatoClp(total)}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Resumen */}
        <div className="col-lg-5">
          <div className="resumen-caja p-4 sticky-lg-top">
            <h2 className="h5 mb-3">Resumen del pedido</h2>
            <ul className="list-unstyled mb-3">
              {carrito.map((item) => (
                <li
                  key={item.id}
                  className="d-flex justify-content-between small mb-2"
                >
                  <span>
                    {item.nombre} × {item.cantidad}
                  </span>
                  <span className="fw-semibold">
                    {formatoClp(precioSocio(item.precioFinal, sesion, item.id) * item.cantidad)}
                  </span>
                </li>
              ))}
            </ul>
            <hr />
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Total</span>
              <span className="fw-bold text-primary fs-5">{formatoClp(total)}</span>
            </div>
            {sesion && (
              <p className="small text-success mt-3 mb-0">
                ✓ Tus datos se completaron automáticamente desde tu sesión.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
