import axios from 'axios';

const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:8080/api';

class OrdenService {
  async crearOrden(datos) {
    const response = await axios.post(`${BASE_URL}/ordenes`, datos);
    return response.data;
  }

  async listarOrdenes() {
    const response = await axios.get(`${BASE_URL}/ordenes`);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && data._embedded) {
      const listas = Object.values(data._embedded);
      if (listas.length > 0 && Array.isArray(listas[0])) {
        return listas[0];
      }
    }
    return [];
  }

  async obtenerOrden(id) {
    const response = await axios.get(`${BASE_URL}/ordenes/${id}`);
    return response.data;
  }
}

export default new OrdenService();