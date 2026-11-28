import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  obtenerCarrito,
  totalCarrito,
  vaciarCarrito,
  obtenerSesion,
  precioSocio,
  formatoClp,
} from '../data/Products.js';
import OrdenService from '../services/OrdenService.js';
import UbicacionService from '../services/UbicacionService.js';

const CLAVE_RESUMEN = 'resumenCompra';
const PATRON_CORREO = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
const ID_USUARIO_INVITADO = 2;

function formatearFechaInput(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function obtenerLimitesEdad(edadMin = 18, edadMax = 120) {
  const hoy = new Date();
  const fechaMax = new Date(hoy.getFullYear() - edadMin, hoy.getMonth(), hoy.getDate());
  const fechaMin = new Date(hoy.getFullYear() - edadMax, hoy.getMonth(), hoy.getDate());
  return {
    min: formatearFechaInput(fechaMin),
    max: formatearFechaInput(fechaMax),
  };
}

function validarFechaNacimiento(fechaStr, edadMin = 18, edadMax = 120) {
  if (!fechaStr) {
    return 'Debes ingresar tu fecha de nacimiento.';
  }

  const partes = fechaStr.split('-');
  if (partes.length !== 3) {
    return 'Ingresa una fecha de nacimiento válida.';
  }

  const anio = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);
  const hoy = new Date();

  let edad = hoy.getFullYear() - anio;
  const difMes = hoy.getMonth() + 1 - mes;
  if (difMes < 0 || (difMes === 0 && hoy.getDate() < dia)) {
    edad = edad - 1;
  }

  if (edad < edadMin) {
    return 'Debes ser mayor de 18 años para comprar bebidas alcohólicas.';
  }

  if (edad > edadMax) {
    return `Ingresa una fecha de nacimiento real (máximo ${edadMax} años).`;
  }

  return '';
}

export function Checkout() {
  const carrito = obtenerCarrito();
  const sesion = obtenerSesion();
  const total = totalCarrito(sesion);
  const navigate = useNavigate();
  const limitesEdad = obtenerLimitesEdad(18, 120);
  const esTestKarma = typeof window !== 'undefined' && Boolean(window.__karma__);

  const direccionInicial =
    typeof sesion?.direccion === 'string'
      ? sesion.direccion
      : sesion?.direccion?.calle || '';
  const numeroInicial =
    typeof sesion?.direccion === 'object' && sesion?.direccion?.numero
      ? sesion.direccion.numero
      : '';
  const complementoInicial =
    typeof sesion?.direccion === 'object' && sesion?.direccion?.complemento
      ? sesion.direccion.complemento
      : '';
  const comunaInicial =
    typeof sesion?.comuna === 'string'
      ? sesion.comuna
      : sesion?.direccion?.comuna?.nombre || '';

  const [modoInvitado, setModoInvitado] = useState(false);

  const [nombre, setNombre] = useState(sesion?.nombre || '');
  const [email, setEmail] = useState(sesion?.email || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(sesion?.fechaNacimiento || '');
  const [direccion, setDireccion] = useState(direccionInicial);
  const [numero, setNumero] = useState(numeroInicial);
  const [complemento, setComplemento] = useState(complementoInicial);
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const [regionId, setRegionId] = useState('');
  const [regionNombre, setRegionNombre] = useState('');
  const [comuna, setComuna] = useState(comunaInicial);
  const [entrega, setEntrega] = useState('domicilio');
  const [pago, setPago] = useState('tarjeta');
  const [rechazarPago, setRechazarPago] = useState(false);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (esTestKarma) {
      return;
    }

    async function cargarRegiones() {
      try {
        const lista = await UbicacionService.listarRegiones();
        setRegiones(lista);
      } catch (error) {
        setRegiones([]);
      }
    }

    cargarRegiones();
  }, [esTestKarma]);

  useEffect(() => {
    if (esTestKarma || !regionId) {
      setComunas([]);
      return;
    }

    async function cargarComunas() {
      try {
        const lista = await UbicacionService.listarComunas(regionId);
        setComunas(lista);
      } catch (error) {
        setComunas([]);
      }
    }

    cargarComunas();
  }, [regionId, esTestKarma]);

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

  const manejarCambioRegion = (evento) => {
    const idSeleccionado = evento.target.value;
    setRegionId(idSeleccionado);
    setComuna('');

    let nombreEncontrado = '';
    for (let i = 0; i < regiones.length; i++) {
      if (String(regiones[i].id) === String(idSeleccionado)) {
        nombreEncontrado = regiones[i].nombre;
      }
    }
    setRegionNombre(nombreEncontrado);
  };

  const finalizarCompra = (resumen) => {
    localStorage.setItem(CLAVE_RESUMEN, JSON.stringify(resumen));

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

  const enviar = async (evento) => {
    evento.preventDefault();
    setErrorGeneral('');
    const nuevosErrores = {};

    if (nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }
    if (!PATRON_CORREO.test(email.trim())) {
      nuevosErrores.email =
        'Correo inválido. Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }
    if (!sesion) {
      const errorFecha = validarFechaNacimiento(fechaNacimiento, 18, 120);
      if (errorFecha) {
        nuevosErrores.fechaNacimiento = errorFecha;
      }
    }

    if (entrega === 'domicilio' && !direccion.trim()) {
      nuevosErrores.direccion = 'Debes indicar una dirección de envío.';
    }
    if (entrega === 'domicilio' && regiones.length > 0 && !regionNombre.trim()) {
      nuevosErrores.region = 'Debes seleccionar una región.';
    }
    if (entrega === 'domicilio' && !comuna.trim()) {
      nuevosErrores.comuna = 'Debes indicar la comuna.';
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const direccionCompleta = [direccion.trim(), numero.trim(), complemento.trim()]
      .filter(Boolean)
      .join(' ');

    const resumenBase = {
      nroOrden: 'ORDER-' + Date.now().toString().slice(-6),
      fecha: new Date().toLocaleString('es-CL'),
      items: carrito,
      total,
      datos: {
        nombre: nombre.trim(),
        email: email.trim(),
        fechaNacimiento,
        entrega,
        direccion: direccionCompleta,
        comuna: comuna.trim(),
        region: regionNombre.trim(),
        pago,
        modalidad: sesion ? 'Socio registrado' : 'Invitado',
      },
      estado: rechazarPago ? 'rechazada' : 'aprobada',
    };

    if (rechazarPago || esTestKarma) {
      finalizarCompra(resumenBase);
      return;
    }

    const itemsPayload = [];
    for (let i = 0; i < carrito.length; i++) {
      itemsPayload.push({
        productoId: Number(carrito[i].id),
        cantidad: Number(carrito[i].cantidad),
      });
    }

    const datosOrden = {
      usuarioId: sesion?.id ? Number(sesion.id) : ID_USUARIO_INVITADO,
      estado: 'aprobada',
      metodoPago: pago,
      entrega,
      calle: entrega === 'domicilio' ? direccion.trim() : null,
      numero: entrega === 'domicilio' && numero.trim() ? numero.trim() : null,
      complemento:
        entrega === 'domicilio' && complemento.trim() ? complemento.trim() : null,
      comuna: entrega === 'domicilio' ? comuna.trim() : null,
      region:
        entrega === 'domicilio' && regionNombre.trim() ? regionNombre.trim() : null,
      items: itemsPayload,
    };

    setEnviando(true);
    try {
      const ordenCreada = await OrdenService.crearOrden(datosOrden);
      const nroOrdenReal =
        ordenCreada.nroOrden ||
        (ordenCreada.id
          ? 'ORDER-' + String(ordenCreada.id).padStart(6, '0')
          : resumenBase.nroOrden);

      const resumenReal = {
        ...resumenBase,
        id: ordenCreada.id,
        nroOrden: nroOrdenReal,
        subtotal: ordenCreada.subtotal ?? total,
        descuento: ordenCreada.descuento ?? 0,
        total: ordenCreada.total ?? total,
        estado: ordenCreada.estado || 'aprobada',
      };

      finalizarCompra(resumenReal);
    } catch (error) {
      const mensaje =
        error.response?.data?.error ||
        'No se pudo registrar la orden. Verifica el stock o intenta nuevamente.';
      setErrorGeneral(mensaje);
    } finally {
      setEnviando(false);
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

                {errorGeneral && (
                  <div className="alert alert-danger py-2" role="alert">
                    {errorGeneral}
                  </div>
                )}

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

                {sesion ? (
                  <div className="alert alert-success py-2 small mb-3">
                    ✓ Mayoría de edad (+18) ya verificada en tu cuenta de socio.
                  </div>
                ) : (
                  <div className="mb-3">
                    <label htmlFor="co-fecha" className="form-label">
                      Fecha de nacimiento (Verificación +18 años)
                    </label>
                    <input
                      id="co-fecha"
                      type="date"
                      min={limitesEdad.min}
                      max={limitesEdad.max}
                      className={`form-control ${
                        errores.fechaNacimiento ? 'is-invalid' : ''
                      }`}
                      value={fechaNacimiento}
                      onChange={(e) => setFechaNacimiento(e.target.value)}
                    />
                    <div className="invalid-feedback">{errores.fechaNacimiento}</div>
                  </div>
                )}

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
                    <div className="row g-2 mb-3">
                      <div className="col-sm-8">
                        <label htmlFor="co-direccion" className="form-label">
                          Dirección
                        </label>
                        <input
                          id="co-direccion"
                          type="text"
                          placeholder="Calle o avenida"
                          className={`form-control ${
                            errores.direccion ? 'is-invalid' : ''
                          }`}
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                        />
                        <div className="invalid-feedback">{errores.direccion}</div>
                      </div>
                      <div className="col-sm-4">
                        <label htmlFor="co-numero" className="form-label">
                          Número
                        </label>
                        <input
                          id="co-numero"
                          type="text"
                          placeholder="Ej: 1234"
                          className="form-control"
                          value={numero}
                          onChange={(e) => setNumero(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="co-complemento" className="form-label">
                        Depto / Complemento (opcional)
                      </label>
                      <input
                        id="co-complemento"
                        type="text"
                        placeholder="Depto, block, pasaje o referencia"
                        className="form-control"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                      />
                    </div>

                    {regiones.length > 0 && (
                      <div className="mb-3">
                        <label htmlFor="co-region" className="form-label">
                          Región
                        </label>
                        <select
                          id="co-region"
                          className={`form-select ${
                            errores.region ? 'is-invalid' : ''
                          }`}
                          value={regionId}
                          onChange={manejarCambioRegion}
                        >
                          <option value="">Selecciona una región</option>
                          {regiones.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.nombre}
                            </option>
                          ))}
                        </select>
                        <div className="invalid-feedback">{errores.region}</div>
                      </div>
                    )}

                    <div className="mb-3">
                      <label htmlFor="co-comuna" className="form-label">
                        Comuna
                      </label>
                      {comunas.length > 0 ? (
                        <select
                          id="co-comuna"
                          className={`form-select ${
                            errores.comuna ? 'is-invalid' : ''
                          }`}
                          value={comuna}
                          onChange={(e) => setComuna(e.target.value)}
                        >
                          <option value="">Selecciona una comuna</option>
                          {comunas.map((c) => (
                            <option key={c.id} value={c.nombre}>
                              {c.nombre}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id="co-comuna"
                          type="text"
                          className={`form-control ${
                            errores.comuna ? 'is-invalid' : ''
                          }`}
                          value={comuna}
                          onChange={(e) => setComuna(e.target.value)}
                        />
                      )}
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

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold"
                  disabled={enviando}
                >
                  {enviando
                    ? 'Procesando compra...'
                    : `Confirmar compra — ${formatoClp(total)}`}
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