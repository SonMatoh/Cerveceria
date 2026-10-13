// MOLÉCULA: Campo de formulario (label + control + mensaje de error).

export function FormField({ htmlFor, label, error, hint, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={htmlFor} className="form-label">
        {label}
      </label>
      {children}
      {hint && !error && <div className="form-text">{hint}</div>}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}

export default FormField;
