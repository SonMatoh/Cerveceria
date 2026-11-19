import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ProductoService {
  async getAllProductos() {
    const response = await axios.get(BASE_URL);
    return response.data._embedded?.productoList ?? response.data;
  }

  async getProductoById(id) {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  }

  async createProducto(producto) {
    const response = await axios.post(BASE_URL, producto);
    return response.data;
  }

  async updateProducto(id, producto) {
    const response = await axios.put(`${BASE_URL}/${id}`, producto);
    return response.data;
  }

  async deleteProducto(id) {
    await axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new ProductoService();