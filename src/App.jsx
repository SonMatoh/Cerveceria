import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import PageTemplate from './components/templates/PageTemplate.jsx';
import AdminLock from './components/templates/AdminLock.jsx';

import Home from './pages/Home.jsx';
import Productos from './pages/Productos.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Categorias from './pages/Categorias.jsx';
import Ofertas from './pages/Ofertas.jsx';
import Carrito from './pages/Carrito.jsx';
import Checkout from './pages/Checkout.jsx';
import CompraExitosa from './pages/CompraExitosa.jsx';
import CompraFallida from './pages/CompraFallida.jsx';
import Contacto from './pages/Contacto.jsx';
import Login from './pages/Login.jsx';
import Registro from './pages/Registro.jsx';
import Admin from './pages/Admin.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Blog from './pages/Blog.jsx';
import BlogDetail from './pages/BlogDetail.jsx';

function NoEncontrado() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-1">🍻</h1>
      <h2>Página no encontrada</h2>
      <p className="text-secondary">Esta ruta no existe en la Taberna.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}

function App() {
  return (
    <PageTemplate>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/compra-fallida" element={<CompraFallida />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route
          path="/admin"
          element={
            <AdminLock>
              <Admin />
            </AdminLock>
          }
        />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </PageTemplate>
  );
}

export default App;