import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class OrdenService {
  async crearOrden(datos) {
    const response = await axios.post(`${BASE_URL}/ordenes`, datos);
    return response.data;
  }

  async listarOrdenes(usuarioId) {
    const params = usuarioId ? { usuarioId } : {};
    const response = await axios.get(`${BASE_URL}/ordenes`, { params });
    return response.data._embedded?.ordenList ?? response.data;
  }

  async actualizarEstado(id, estado) {
    const response = await axios.put(`${BASE_URL}/ordenes/${id}/estado`, { estado });
    return response.data;
  }
}

export default new OrdenService();
