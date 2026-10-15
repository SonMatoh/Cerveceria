import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input({ className = '', ...props }, ref) {
  return <input ref={ref} className={`form-control ${className}`.trim()} {...props} />;
});

export default Input;