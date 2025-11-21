import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; // ← Verifica que esta URL sea correcta

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// AUTH
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  registro: (data) => api.post('/auth/registro', data),
  recuperarPassword: (data) => api.post('/auth/recuperar-password', data),
  perfil: () => api.get('/auth/perfil'),
  actualizarPerfil: (data) => api.put('/auth/perfil', data),
  cambiarPassword: (data) => api.put('/auth/cambiar-password', data),
};

// EVENTOS
export const eventosAPI = {
  obtenerTodos: (params) => api.get('/eventos', { params }),
  obtenerPorId: (id) => api.get(`/eventos/${id}`),
  crear: (data) => api.post('/eventos', data),
  actualizar: (id, data) => api.put(`/eventos/${id}`, data),
  eliminar: (id) => api.delete(`/eventos/${id}`),
  estadisticas: (id) => api.get(`/eventos/${id}/estadisticas`),
};

// INSCRIPCIONES
export const inscripcionesAPI = {
  misInscripciones: () => api.get('/inscripciones/mis-inscripciones'),
  crear: (data) => api.post('/inscripciones', data),
  cancelar: (id) => api.put(`/inscripciones/${id}/cancelar`),
  obtenerTodas: (params) => api.get('/inscripciones', { params }),
};

// PAGOS
export const pagosAPI = {
  crear: (data) => api.post('/pagos', data),
  obtenerPorId: (id) => api.get(`/pagos/${id}`),
  obtenerTodos: (params) => api.get('/pagos', { params }),
};

// USUARIOS
export const usuariosAPI = {
  obtenerTodos: (params) => api.get('/usuarios', { params }),
  obtenerPorId: (id) => api.get(`/usuarios/${id}`),
  crear: (data) => api.post('/usuarios', data),
  actualizar: (id, data) => api.put(`/usuarios/${id}`, data),
  eliminar: (id) => api.delete(`/usuarios/${id}`),
};

export default api;