// Pruebas de la lógica de validación (lógica pura).

import {
  validarNombre,
  validarEmail,
  validarPassword,
  validarPassword2,
  validarMensaje,
} from '../../utils/validaciones.js';

describe('validaciones', () => {
  it('acepta correos de los dominios permitidos (duoc.cl, profesor.duoc.cl, gmail.com)', () => {
    expect(validarEmail('alumno@duoc.cl').valido).toBeTrue();
    expect(validarEmail('PROFESOR@duoc.cl').valido).toBeTrue();
    expect(validarEmail('profe@profesor.duoc.cl').valido).toBeTrue();
    expect(validarEmail('persona@gmail.com').valido).toBeTrue();
  });

  it('rechaza correos con dominios no permitidos o con formato inválido', () => {
    expect(validarEmail('alumno@correo.com').valido).toBeFalse();
    expect(validarEmail('sin-arroba.gmail.com').valido).toBeFalse();
    expect(validarEmail('').valido).toBeFalse();
  });

  it('valida que la contraseña tenga entre 4 y 10 caracteres', () => {
    expect(validarPassword('123').valido).toBeFalse();
    expect(validarPassword('12345678901').valido).toBeFalse();
    expect(validarPassword('1234').valido).toBeTrue();
    expect(validarPassword('1234567890').valido).toBeTrue();
  });

  it('detecta cuando la repetición de la contraseña no coincide', () => {
    expect(validarPassword2('clave123', 'clave123').valido).toBeTrue();
    expect(validarPassword2('clave123', 'clave124').valido).toBeFalse();
    expect(validarPassword2('clave123', '').valido).toBeFalse();
  });

  it('exige nombres y mensajes con largo mínimo', () => {
    expect(validarNombre('A').valido).toBeFalse();
    expect(validarNombre('Ana').valido).toBeTrue();
    expect(validarMensaje('hola').valido).toBeFalse();
    expect(validarMensaje('Hola, tengo una consulta sobre mi pedido.').valido).toBeTrue();
  });
});
