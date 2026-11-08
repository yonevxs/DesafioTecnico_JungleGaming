import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar token de autenticação simulado se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kurio_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta para tratamento de erros padronizado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erros de rede ou expirados
    return Promise.reject(error);
  }
);

export default api;

