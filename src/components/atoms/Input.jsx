import React from 'react';

export function Input({ className = '', ...props }) {
  return <input className={`form-control ${className}`.trim()} {...props} />;
}

export default Input;