// ÁTOMO: Input de formulario reutilizable.
// Usa forwardRef para que librerías como react-hook-form puedan
// registrar el campo (obtener la referencia del input real).

import { forwardRef } from 'react';

export const Input = forwardRef(function Input({ className = '', ...props }, ref) {
  return <input ref={ref} className={`form-control ${className}`.trim()} {...props} />;
});

export default Input;
