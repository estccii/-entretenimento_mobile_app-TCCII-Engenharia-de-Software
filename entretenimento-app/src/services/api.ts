import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.3.123:3000',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      delete api.defaults.headers.common['Authorization'];

      try {
        localStorage.removeItem('@watchandsave:token');
        localStorage.removeItem('@watchandsave:user');
      } catch {}
    }
    return Promise.reject(error);
  }
);
