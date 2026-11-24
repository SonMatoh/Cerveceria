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

class OrdenService {
  async crearOrden(datos) {
    const response = await axios.post(`${BASE_URL}/ordenes`, datos);
    return response.data;
  }

  async listarOrdenes(usuarioId) {
    const params = usuarioId ? { usuarioId } : {};
    const response = await axios.get(`${BASE_URL}/ordenes`, { params });
    return extraerLista(response.data, 'ordenList');
  }

  async actualizarEstado(id, estado) {
    const response = await axios.put(`${BASE_URL}/ordenes/${id}/estado`, { estado });
    return response.data;
  }
}

export default new OrdenService();