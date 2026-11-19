import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class BlogService {
  async listarBlog() {
    const response = await axios.get(`${BASE_URL}/blog`);
    return response.data._embedded?.blogList ?? response.data;
  }

  async obtenerBlog(id) {
    const response = await axios.get(`${BASE_URL}/blog/${id}`);
    return response.data;
  }
}

export default new BlogService();
