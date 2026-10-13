// ============================================================================
// PERSISTENCIA DE SESIÓN DE USUARIO
// Simula el inicio/cierre de sesión y guarda los datos del usuario
// para autocompletar el formulario de compra (checkout).
// ============================================================================

const CLAVE_SESION = 'sesionTaberna';
const oyentes = new Set();

let estado = cargar();

function cargar() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null;
  } catch {
    return null;
  }
}

function guardarYNotificar() {
  if (estado) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(estado));
  } else {
    localStorage.removeItem(CLAVE_SESION);
  }
  oyentes.forEach((oyente) => oyente());
}

export function obtenerSesion() {
  return estado;
}

export function iniciarSesion({ nombre, email, direccion = '', comuna = '' }) {
  estado = {
    nombre: String(nombre || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    direccion: String(direccion || '').trim(),
    comuna: String(comuna || '').trim(),
  };
  guardarYNotificar();
  return estado;
}

export function cerrarSesion() {
  estado = null;
  guardarYNotificar();
}

export function suscribirSesion(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}
