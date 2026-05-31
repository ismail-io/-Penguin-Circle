import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
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

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (credential) => api.post('/auth/google', { credential }),
  googleComplete: (data) => api.post('/auth/google/complete', data),
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get('/api/events', { params }),
  create: (data) => api.post('/api/events', data),
  update: (id, data) => api.put(`/api/events/${id}`, data),
  delete: (id) => api.delete(`/api/events/${id}`),
  join: (id) => api.post(`/api/events/${id}/join`),
  leave: (id) => api.post(`/api/events/${id}/leave`),
};

// Resources API
export const resourcesAPI = {
  getAll: (params) => api.get('/api/resources', { params }),
  create: (data) => api.post('/api/resources', data),
  update: (id, data) => api.put(`/api/resources/${id}`, data),
  delete: (id) => api.delete(`/api/resources/${id}`),
};

// Requests API
export const requestsAPI = {
  getAll: (params) => api.get('/api/requests', { params }),
  create: (data) => api.post('/api/requests', data),
  approve: (id) => api.post(`/api/requests/${id}/approve`),
  reject: (id, data) => api.post(`/api/requests/${id}/reject`, data),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/api/users', { params }),
  getById: (id) => api.get(`/api/users/${id}`),
  updateProfile: (data) => api.put('/api/users/profile/update', data),
  getAllUsers: () => api.get('/api/users/all'),
};

export default api;
