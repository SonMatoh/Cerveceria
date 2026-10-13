// ============================================================================
// FUNCIONES DE VALIDACIÓN (lógica pura, sin DOM)
// Reutilizadas por Contacto, Registro y Login, y testeables con Jasmine.
// ============================================================================

export const PATRON_CORREO =
  /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

export function validarNombre(valor) {
  const texto = String(valor || '').trim();
  if (texto.length < 2) {
    return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres.' };
  }
  return { valido: true, mensaje: '' };
}

export function validarEmail(valor) {
  const texto = String(valor || '').trim().toLowerCase();
  if (!PATRON_CORREO.test(texto)) {
    return {
      valido: false,
      mensaje: 'Correo inválido. Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.',
    };
  }
  return { valido: true, mensaje: '' };
}

export function validarPassword(valor) {
  const texto = String(valor || '');
  if (texto.length < 4 || texto.length > 10) {
    return { valido: false, mensaje: 'La contraseña debe tener entre 4 y 10 caracteres.' };
  }
  return { valido: true, mensaje: '' };
}

export function validarPassword2(password, repetida) {
  if (!repetida || repetida !== password) {
    return { valido: false, mensaje: 'Las contraseñas no coinciden.' };
  }
  return { valido: true, mensaje: '' };
}

export function validarEdadAceptada(aceptado) {
  if (!aceptado) {
    return { valido: false, mensaje: 'Debes confirmar que eres mayor de 18 años.' };
  }
  return { valido: true, mensaje: '' };
}

export function validarAsunto(valor) {
  if (!String(valor || '').trim()) {
    return { valido: false, mensaje: 'El asunto es obligatorio.' };
  }
  return { valido: true, mensaje: '' };
}

export function validarMensaje(valor) {
  const texto = String(valor || '').trim();
  if (texto.length < 10) {
    return { valido: false, mensaje: 'El mensaje debe tener al menos 10 caracteres.' };
  }
  return { valido: true, mensaje: '' };
}

// Devuelve true solo si todos los resultados son válidos.
export function todoValido(...resultados) {
  return resultados.every((r) => r.valido);
}
