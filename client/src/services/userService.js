// src/services/userService.js
import api from './api';

export default {
  async getProfile() {
    return api.get('/user/profile');
  },

  async getUserById(id) {
    return api.get(`/user/getuser/${id}`);
  },

  async getAllUsers() {
    return api.get('/user/getallusers');
  },

  async updateProfile(userData) {
    return api.put('/user/updateprofile', userData);
  },

  async deleteUser(userId) {
    return api.delete('/user/deleteuser', { data: { userId } });
  },

  async uploadProfileImage(formData) {
    return api.post('/user/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  async searchUsers(query) {
    return api.get(`/user/search?query=${query}`);
  },

  async getUserStats() {
    return api.get('/user/stats');
  }
};