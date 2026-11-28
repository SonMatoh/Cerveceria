import axios from 'axios';

const BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://localhost:8080/api';

class UbicacionService {
  async listarRegiones() {
    const response = await axios.get(`${BASE_URL}/regiones`);
    return Array.isArray(response.data) ? response.data : [];
  }

  async listarComunas(regionId) {
    const params = regionId ? { region: regionId } : {};
    const response = await axios.get(`${BASE_URL}/comunas`, { params });
    return Array.isArray(response.data) ? response.data : [];
  }
}

export default new UbicacionService();