import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  obtenerCarrito,
  totalCarrito,
  vaciarCarrito,
  obtenerSesion,
  precioSocio,
  formatoClp,
  esMayorDeEdad,
  registrarOrden,
} from '../data/Products.js';

const CLAVE_RESUMEN = 'resumenCompra';
const PATRON_CORREO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

export function Checkout() {
  const carrito = obtenerCarrito();
  const sesion = obtenerSesion();
  const total = totalCarrito(sesion);
  const navigate = useNavigate();

  const [modoInvitado, setModoInvitado] = useState(false);

  const [nombre, setNombre] = useState(sesion?.nombre || '');
  const [email, setEmail] = useState(sesion?.email || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(sesion?.fechaNacimiento || '');
  const [direccion, setDireccion] = useState(sesion?.direccion || '');
  const [comuna, setComuna] = useState(sesion?.comuna || '');
  const [entrega, setEntrega] = useState('domicilio');
  const [pago, setPago] = useState('tarjeta');
  const [rechazarPago, setRechazarPago] = useState(false);
  const [errores, setErrores] = useState({});

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

  // Si no ha iniciado sesión y aún no ha elegido "Comprar como invitado", mostramos las 3 opciones
  if (!sesion && !modoInvitado) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4 text-center">
              <h1 className="h4 mb-2">¿Cómo deseas continuar con tu compra?</h1>
              <p className="text-secondary mb-4">
                Inicia sesión o regístrate para obtener beneficios de socio, o continúa
                comprando como invitado sin guardar tus datos.
              </p>

              <div className="row g-3">
                <div className="col-md-4">
                  <div className="border rounded p-3 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <h2 className="h6 fw-bold">Ya tengo cuenta</h2>
                      <p className="small text-secondary">
                        Accede con tu correo y contraseña para autocompletar tus datos.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={() => navigate('/login')}
                    >
                      Iniciar sesión
                    </button>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <h2 className="h6 fw-bold">Soy nuevo</h2>
                      <p className="small text-secondary">
                        Crea tu cuenta de socio (+18) para obtener descuentos del 10%.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary w-100"
                      onClick={() => navigate('/registro')}
                    >
                      Registrarse
                    </button>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded p-3 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <h2 className="h6 fw-bold">Compra rápida</h2>
                      <p className="small text-secondary">
                        Ingresa tus datos solo para este despacho sin crear una cuenta.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={() => setModoInvitado(true)}
                    >
                      Comprar como invitado
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const enviar = (evento) => {
    evento.preventDefault();
    const nuevosErrores = {};

    if (nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }
    if (!PATRON_CORREO.test(email.trim())) {
      nuevosErrores.email =
        'Correo inválido. Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }
    // Si compra como invitado o su sesión no tenía fecha de nacimiento, verificamos que sea +18
    if (!sesion) {
      if (!fechaNacimiento) {
        nuevosErrores.fechaNacimiento = 'Debes ingresar tu fecha de nacimiento.';
      } else if (!esMayorDeEdad(fechaNacimiento)) {
        nuevosErrores.fechaNacimiento =
          'Debes ser mayor de 18 años para comprar bebidas alcohólicas.';
      }
    } else if (fechaNacimiento && !esMayorDeEdad(fechaNacimiento)) {
      nuevosErrores.fechaNacimiento =
        'Debes ser mayor de 18 años para comprar bebidas alcohólicas.';
    }

    if (entrega === 'domicilio' && !direccion.trim()) {
      nuevosErrores.direccion = 'Debes indicar una dirección de envío.';
    }
    if (entrega === 'domicilio' && !comuna.trim()) {
      nuevosErrores.comuna = 'Debes indicar la comuna.';
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const resumen = {
      // CAMBIO 2: Generamos un código único de orden (ej. ORDER-482910)
      nroOrden: 'ORDER-' + Date.now().toString().slice(-6),
      fecha: new Date().toLocaleString('es-CL'),
      items: carrito,
      total,
      datos: {
        nombre,
        email,
        fechaNacimiento,
        entrega,
        direccion,
        comuna,
        pago,
        modalidad: sesion ? 'Socio registrado' : 'Invitado',
      },
      estado: rechazarPago ? 'rechazada' : 'aprobada',
    };

    localStorage.setItem(CLAVE_RESUMEN, JSON.stringify(resumen));

    // CAMBIO 3: Guardamos esta compra en el historial de órdenes/boletas de la tienda
    registrarOrden(resumen);

    if (rechazarPago) {
      navigate('/compra-fallida');
    } else {
      vaciarCarrito();
      if (window.actualizarNavbar) {
        window.actualizarNavbar();
      }
      navigate('/compra-exitosa');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="h3 mb-0">
          Checkout — {sesion ? 'Pago de Socio' : 'Comprando como Invitado'}
        </h1>
        {!sesion && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setModoInvitado(false)}
          >
            ← Cambiar opción (Iniciar sesión / Registrarse)
          </button>
        )}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <form onSubmit={enviar} noValidate>
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="h5 mb-3">1. Datos del comprador y entrega</h2>

                <div className="mb-3">
                  <label htmlFor="co-nombre" className="form-label">
                    Nombre completo
                  </label>
                  <input
                    id="co-nombre"
                    type="text"
                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="invalid-feedback">{errores.email}</div>
                </div>

                <div className="mb-3">
                  <label htmlFor="co-fecha" className="form-label">
                    Fecha de nacimiento (Verificación +18 años)
                  </label>
                  <input
                    id="co-fecha"
                    type="date"
                    className={`form-control ${
                      errores.fechaNacimiento ? 'is-invalid' : ''
                    }`}
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                  />
                  <div className="invalid-feedback">{errores.fechaNacimiento}</div>
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
                      checked={entrega === 'domicilio'}
                      onChange={(e) => setEntrega(e.target.value)}
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
                      checked={entrega === 'retiro'}
                      onChange={(e) => setEntrega(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="entrega-retiro">
                      Retiro en tienda
                    </label>
                  </div>
                </div>

                {entrega === 'domicilio' && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="co-direccion" className="form-label">
                        Dirección
                      </label>
                      <input
                        id="co-direccion"
                        type="text"
                        className={`form-control ${
                          errores.direccion ? 'is-invalid' : ''
                        }`}
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
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
                        value={comuna}
                        onChange={(e) => setComuna(e.target.value)}
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
                    value={pago}
                    onChange={(e) => setPago(e.target.value)}
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
                    checked={rechazarPago}
                    onChange={(e) => setRechazarPago(e.target.checked)}
                  />
                  <label
                    className="form-check-label small text-secondary"
                    htmlFor="co-rechazar"
                  >
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
                    {formatoClp(
                      precioSocio(item.precioFinal, sesion, item.id) * item.cantidad
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <hr />
            <div className="d-flex justify-content-between">
              <span className="fw-bold">Total</span>
              <span className="fw-bold text-primary fs-5">{formatoClp(total)}</span>
            </div>
            {sesion ? (
              <p className="small text-success mt-3 mb-0">
                ✓ Tus datos se completaron automáticamente desde tu sesión.
              </p>
            ) : (
              <p className="small text-secondary mt-3 mb-0">
                ℹ️ Estás comprando como invitado. Tus datos personales no se guardarán
                como cuenta.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;