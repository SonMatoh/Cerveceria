import axios from 'axios';

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:8080/api';

const BASE_URL = `${API_BASE}/productos`;

function normalizarProducto(p) {
  const rutaImagen = p.imagen || p.imagenUrl || '/imagenes/pika.png';
  return {
    ...p,
    imagen: rutaImagen,
    imagenUrl: rutaImagen,
  };
}

class ProductoService {
  async getAllProductos() {
    const response = await axios.get(BASE_URL);
    const lista = response.data?._embedded?.productoList ?? response.data;
    return Array.isArray(lista) ? lista.map(normalizarProducto) : [];
  }

  async getProductoById(id) {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return normalizarProducto(response.data);
  }

  async createProducto(producto) {
    const body = {
      nombre: producto.nombre,
      estilo: producto.estilo || '',
      descripcion: producto.descripcion || '',
      precio: Number(producto.precio),
      imagenUrl: producto.imagenUrl || producto.imagen || '/imagenes/pika.png',
      categoria: producto.categoria,
      descuento: Number(producto.descuento || 0),
    };
    const response = await axios.post(BASE_URL, body);
    return normalizarProducto(response.data);
  }

  async updateProducto(id, producto) {
    const body = {
      nombre: producto.nombre,
      estilo: producto.estilo || '',
      descripcion: producto.descripcion || '',
      precio: Number(producto.precio),
      imagenUrl: producto.imagenUrl || producto.imagen || '/imagenes/pika.png',
      categoria: producto.categoria,
      descuento: Number(producto.descuento || 0),
    };
    const response = await axios.put(`${BASE_URL}/${id}`, body);
    return normalizarProducto(response.data);
  }

  async deleteProducto(id) {
    await axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new ProductoService();