// Punto de entrada de la aplicación React.
// (patrón de la guía "Creando rutas con react-router-dom":
//  BrowserRouter envuelve a App y se cargan Bootstrap + estilos globales)

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
