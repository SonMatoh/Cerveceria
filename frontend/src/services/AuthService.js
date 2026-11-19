import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class AuthService {
  async login(credenciales) {
    const response = await axios.post(`${BASE_URL}/auth/login`, credenciales);
    return response.data;
  }

  async registro(datos) {
    const response = await axios.post(`${BASE_URL}/auth/registro`, datos);
    return response.data;
  }

  async sesion() {
    const response = await axios.get(`${BASE_URL}/auth/sesion`);
    return response.data;
  }

  async logout() {
    const response = await axios.post(`${BASE_URL}/auth/logout`);
    return response.data;
  }

  async esAdmin() {
    const response = await axios.get(`${BASE_URL}/auth/es-admin`);
    return response.data;
  }
}

export default new AuthService();
