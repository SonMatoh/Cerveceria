// TEMPLATE: estructura base de todas las páginas
// (navbar + contenido + footer), patrón atomic design.

import Navbar from '../organisms/Navbar.jsx';
import Footer from '../organisms/Footer.jsx';

export function PageTemplate({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default PageTemplate;
