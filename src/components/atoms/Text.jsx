// ÁTOMO: Texto genérico (patrón de la guía "componentes atómicos").
// - children: contenido de la etiqueta
// - variant: etiqueta HTML ('h1', 'h2', 'p', 'span', ...)
// - className: clases del elemento

export function Text({ children, variant = 'p', className }) {
  const Tag = variant;
  return <Tag className={className}>{children}</Tag>;
}

export default Text;
