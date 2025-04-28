// src/services/authService.js
import api from './api';

export default {
  async register(userData) {
    return api.post('/auth/register', userData);
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    
    // Сохраняем токен в localStorage
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      // Удаляем токен из localStorage
      localStorage.removeItem('token');
    }
  },

  async getCurrentUser() {
    return api.get('/auth/me');
  },

  async changePassword(passwordData) {
    return api.put('/auth/change-password', passwordData);
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};