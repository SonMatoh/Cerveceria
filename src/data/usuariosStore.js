// ============================================================================
// ARCHIVO DE PERSISTENCIA: USUARIOS DE LA TIENDA
// Usuarios semilla (credenciales por defecto) + los que se registran.
// Operaciones: autenticar / registrar, con suscripción para React.
// ============================================================================

const CLAVE_USUARIOS = 'usuariosTaberna';
const oyentes = new Set();

// Credenciales por defecto del proyecto:
const SEMILLA = [
  {
    nombre: 'Administrador',
    email: 'admin@duoc.cl',
    password: 'admin123',
    rol: 'admin',
  },
  {
    nombre: 'Cliente Demo',
    email: 'cliente@duoc.cl',
    password: 'cliente123',
    rol: 'cliente',
  },
];

let estado = cargar();

function cargar() {
  let guardados = [];
  try {
    const dato = JSON.parse(localStorage.getItem(CLAVE_USUARIOS));
    if (Array.isArray(dato)) guardados = dato;
  } catch {
    // archivo corrupto: se vuelve a la semilla
  }

  // Garantiza que las credenciales por defecto siempre existan.
  const emails = new Set(guardados.map((u) => String(u.email || '').toLowerCase()));
  const lista = SEMILLA.map((u) => ({ ...u })).filter((u) => !emails.has(u.email));
  return [...lista, ...guardados];
}

function guardarYNotificar() {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(estado));
  oyentes.forEach((oyente) => oyente());
}

export function obtenerUsuarios() {
  return estado;
}

// ¿El correo corresponde a un usuario con rol administrador?
// (Se consulta aquí y no en la sesión: el rol siempre está actualizado.
//  Fail-closed: correo desconocido → false.)
export function esAdmin(email) {
  const correo = String(email || '').trim().toLowerCase();
  return estado.some(
    (u) =>
      String(u.email || '').toLowerCase() === correo && u.rol === 'admin'
  );
}

// Reinicia los usuarios a la semilla (lo usan los tests,
// igual que restaurarInventario del inventario).
export function restaurarUsuarios() {
  estado = SEMILLA.map((u) => ({ ...u }));
  guardarYNotificar();
}

// Devuelve el usuario si el correo y la contraseña coinciden, si no null.
export function autenticar(email, password) {
  const correo = String(email || '').trim().toLowerCase();
  const clave = String(password || '');
  return (
    estado.find(
      (u) =>
        String(u.email || '').toLowerCase() === correo &&
        String(u.password || '') === clave
    ) || null
  );
}

// Registra un usuario nuevo. Si el correo ya existe devuelve { ok: false }.
export function registrarUsuario({ nombre, email, password }) {
  const correo = String(email || '').trim().toLowerCase();
  const existente = estado.find(
    (u) => String(u.email || '').toLowerCase() === correo
  );

  // Un usuario antiguo sin contraseña (registrado antes de este cambio)
  // se completa con los nuevos datos en vez de bloquear el registro.
  if (existente && existente.password) {
    return { ok: false, motivo: 'ya existe' };
  }

  if (existente) {
    estado = estado.map((u) =>
      u.email === existente.email
        ? { ...u, nombre: String(nombre || '').trim(), password: String(password || '') }
        : u
    );
  } else {
    estado = [
      ...estado,
      {
        nombre: String(nombre || '').trim(),
        email: correo,
        password: String(password || ''),
        rol: 'cliente',
      },
    ];
  }

  guardarYNotificar();
  return { ok: true };
}

export function suscribirUsuarios(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}
