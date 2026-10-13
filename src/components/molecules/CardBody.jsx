// MOLÉCULA: Contenido de la tarjeta de producto (título, estilo, descripción y precio).
// Une los átomos Text para mostrar los datos que recibe por props.

import Text from '../atoms/Text.jsx';

export function CardBody({ title, tag, description, price, oldPrice }) {
  return (
    <>
      <Text variant="h5" className="card-title fw-bold mb-1">
        {title}
      </Text>
      {tag && (
        <span className="badge text-bg-warning mb-2 d-inline-block">{tag}</span>
      )}
      <Text variant="p" className="descripcion mb-2">
        {description}
      </Text>
      <Text variant="p" className="mb-0">
        {oldPrice && <span className="precio-tachado">{oldPrice}</span>}
        <span className="fw-bold fs-5 text-primary">{price}</span>
      </Text>
    </>
  );
}

export default CardBody;
