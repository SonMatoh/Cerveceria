// MOLÉCULA: Ítem del carrito (imagen + nombre + precio + botón quitar).

import Image from '../atoms/Image.jsx';
import Button from '../atoms/Button.jsx';
import Text from '../atoms/Text.jsx';
import { useStore } from '../../hooks/useStore.js';
import { imgUrl, formatoClp } from '../../utils/imagenes.js';
import { suscribirSesion, obtenerSesion } from '../../data/sesionStore.js';
import { precioSocio } from '../../utils/socios.js';
import { eliminarDelCarrito } from '../../data/carritoStore.js';

export function CartItem({ item }) {
  // Precio con la oferta del día si el usuario es socio (se recalcula
  // al mostrar: si el producto ya no está en la oferta, vuelve a su precio).
  const sesion = useStore(suscribirSesion, obtenerSesion);
  const unitario = precioSocio(item.precioFinal, sesion, item.id);

  return (
    <div className="card border-0 shadow-sm p-3">
      <div className="row align-items-center g-2">
        <div className="col-auto">
          <Image
            src={imgUrl(item.imagen)}
            alt={item.nombre}
            style={{ width: 54, height: 54, objectFit: 'contain' }}
          />
        </div>
        <div className="col-12 col-sm">
          <Text variant="span" className="fw-bold">
            {item.nombre}
          </Text>
          <div className="small text-secondary">
            {formatoClp(unitario)} × {item.cantidad} un.
          </div>
        </div>
        <div className="col-6 col-sm-auto text-sm-end">
          <Text variant="span" className="fw-bold text-primary">
            {formatoClp(unitario * item.cantidad)}
          </Text>
        </div>
        <div className="col-6 col-sm-auto text-end">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => eliminarDelCarrito(item.id)}
          >
            Quitar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
