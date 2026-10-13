// ÁTOMO: Imagen reutilizable.

export function Image({ src, alt, className, style }) {
  return <img src={src} alt={alt} className={className} style={style} loading="lazy" />;
}

export default Image;
