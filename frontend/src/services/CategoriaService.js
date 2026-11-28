import axios from 'axios';

const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:8080/api';

class CategoriaService {
  async listarCategorias() {
    const response = await axios.get(`${BASE_URL}/categorias`);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && data._embedded && Array.isArray(data._embedded.categoriaList)) {
      return data._embedded.categoriaList;
    }
    return [];
  }
}

export default new CategoriaService();