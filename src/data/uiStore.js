// ============================================================================
// ESTADO DE UI (sin persistencia): popup de detalle de producto.
// Permite abrir el detalle en modal desde cualquier página sin cambiar
// de ruta. La ruta /productos/:id sigue existiendo para acceso directo.
// ============================================================================

const oyentes = new Set();

let estado = { producto: null };

export function obtenerDetalle() {
  return estado.producto;
}

export function abrirDetalle(producto) {
  estado = { producto };
  oyentes.forEach((oyente) => oyente());
}

export function cerrarDetalle() {
  estado = { producto: null };
  oyentes.forEach((oyente) => oyente());
}

export function suscribirDetalle(oyente) {
  oyentes.add(oyente);
  return () => oyentes.delete(oyente);
}
