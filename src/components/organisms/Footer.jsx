// ORGANISMO: Pie de página reutilizable (átomos Text).

import Text from '../atoms/Text.jsx';

export function Footer() {
  return (
    <footer className="footer-taberna py-4 mt-5">
      <div className="container text-center">
        <Text variant="p" className="mb-1">
          <strong>La Taberna de Snorlax</strong> &copy; 
        </Text>
        <Text variant="p" className="small mb-0 opacity-75">
        Si no pudiste ser el mejor entrenando, al menos sé el mejor Tomando! 🍺
        </Text>
        <Text variant="p" className="small mb-0 opacity-75">
          
          Venta solo para mayores de 18 años 🍻
        </Text>
      </div>
    </footer>
  );
}

export default Footer;
