import axios from 'axios';

const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:8080/api';

function extraerLista(data, clave) {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && data._embedded) {
    if (Array.isArray(data._embedded[clave])) {
      return data._embedded[clave];
    }
    const listas = Object.values(data._embedded);
    if (listas.length > 0 && Array.isArray(listas[0])) {
      return listas[0];
    }
  }
  return [];
}

class BlogService {
  async listarBlog() {
    const response = await axios.get(`${BASE_URL}/blog`);
    return extraerLista(response.data, 'blogList');
  }

  async obtenerBlog(id) {
    const response = await axios.get(`${BASE_URL}/blog/${id}`);
    return response.data;
  }
}

export default new BlogService();