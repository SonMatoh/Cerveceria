// ============================================================================
// HELPERS DE PRESENTACIÓN (imágenes y formato de precios)
// ============================================================================

// Convierte rutas relativas de imágenes ("imagenes/x.png") en rutas
// absolutas del servidor ("/imagenes/x.png"), respetando URLs externas.
export function imgUrl(ruta) {
  if (!ruta) return '';
  if (/^(https?:)?\/\//.test(ruta) || ruta.startsWith('data:')) return ruta;
  return '/' + String(ruta).replace(/^\.\.\//, '').replace(/^\//, '');
}

// Formato chileno: $4.600
export function formatoClp(valor) {
  return `$${Number(valor || 0).toLocaleString('es-CL')}`;
}

// Precio final aplicando el descuento de oferta (si tiene).
export function precioFinal(producto) {
  const descuento = Number(producto?.descuento) || 0;
  const precio = Number(producto?.precio) || 0;
  if (descuento > 0) {
    return Math.round(precio * (1 - descuento / 100));
  }
  return precio;
}
