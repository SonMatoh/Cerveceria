// Pruebas del archivo de datos de usuarios:
// credenciales por defecto, autenticación, registro y control de rol.

import {
  obtenerUsuarios,
  autenticar,
  registrarUsuario,
  esAdmin,
  restaurarUsuarios,
} from '../../data/usuariosStore.js';

describe('usuariosStore (archivo de datos de usuarios)', () => {
  beforeEach(() => {
    restaurarUsuarios();
  });

  it('incluye las credenciales por defecto del proyecto (admin y cliente)', () => {
    expect(obtenerUsuarios().length).toBeGreaterThanOrEqual(2);

    const admin = autenticar('admin@duoc.cl', 'admin123');
    expect(admin).not.toBeNull();
    expect(admin.nombre).toBe('Administrador');

    const cliente = autenticar('cliente@duoc.cl', 'cliente123');
    expect(cliente).not.toBeNull();
    expect(cliente.nombre).toBe('Cliente Demo');
  });

  it('AUTENTICAR: devuelve null con credenciales incorrectas', () => {
    expect(autenticar('admin@duoc.cl', 'clave-mala')).toBeNull();
    expect(autenticar('noexiste@duoc.cl', 'admin123')).toBeNull();
    expect(autenticar('', '')).toBeNull();
  });

  it('REGISTRAR: crea un usuario nuevo (rol cliente) que ya puede iniciar sesión', () => {
    const resultado = registrarUsuario({
      nombre: 'Nuevo Socio',
      email: 'nuevo@duoc.cl',
      password: 'clave12',
    });
    expect(resultado.ok).toBeTrue();

    const usuario = autenticar('nuevo@duoc.cl', 'clave12');
    expect(usuario).not.toBeNull();
    expect(usuario.nombre).toBe('Nuevo Socio');
    expect(usuario.rol).toBe('cliente');
    expect(esAdmin('nuevo@duoc.cl')).toBeFalse();
  });

  it('REGISTRAR: rechaza correos ya registrados sin tocar la contraseña original', () => {
    const duplicado = registrarUsuario({
      nombre: 'Impostor',
      email: 'admin@duoc.cl',
      password: 'otra-clave',
    });
    expect(duplicado.ok).toBeFalse();

    // la contraseña original sigue funcionando
    expect(autenticar('admin@duoc.cl', 'admin123')).not.toBeNull();
  });

  it('ROL: solo el administrador del seed es admin (fail-closed para el resto)', () => {
    expect(esAdmin('admin@duoc.cl')).toBeTrue();
    expect(esAdmin('cliente@duoc.cl')).toBeFalse();
    expect(esAdmin('nadie@duoc.cl')).toBeFalse();
    expect(esAdmin('')).toBeFalse();
    expect(esAdmin(null)).toBeFalse();
  });
});
