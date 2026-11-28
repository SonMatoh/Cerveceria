import axios from 'axios';

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:8080/api';

const BASE_URL = `${API_BASE}/productos`;
const IMAGEN_DEFECTO = 'https://i.ibb.co/GQGFSK2B/pika.png';

function normalizarUrl(url) {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url.trim();
  }
  return IMAGEN_DEFECTO;
}

function normalizarProducto(p) {
  const rutaImagen = p.imagenUrl || p.imagen || IMAGEN_DEFECTO;
  return {
    ...p,
    imagen: rutaImagen,
    imagenUrl: rutaImagen,
    stock: p.stock ?? 0,
    descuento: p.descuento ?? 0,
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
      imagenUrl: normalizarUrl(producto.imagenUrl || producto.imagen),
      categoria: producto.categoria,
      descuento: Number(producto.descuento || 0),
      stock: Number(producto.stock ?? 10),
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
      imagenUrl: normalizarUrl(producto.imagenUrl || producto.imagen),
      categoria: producto.categoria,
      descuento: Number(producto.descuento || 0),
      stock: Number(producto.stock ?? 10),
    };
    const response = await axios.put(`${BASE_URL}/${id}`, body);
    return normalizarProducto(response.data);
  }

  async deleteProducto(id) {
    await axios.delete(`${BASE_URL}/${id}`);
  }

  async subirImagen(id, archivo) {
    const formData = new FormData();
    formData.append('imagen', archivo);
    const response = await axios.post(`${BASE_URL}/${id}/imagen`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new ProductoService();