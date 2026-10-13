// ÁTOMO: Botón que envuelve el botón de react-bootstrap
// (patrón de la guía: recibe children y el resto de los props pasan directo).

import { Button as BootstrapButton } from 'react-bootstrap';

export function Button({ children, ...props }) {
  return <BootstrapButton {...props}>{children}</BootstrapButton>;
}

export default Button;
