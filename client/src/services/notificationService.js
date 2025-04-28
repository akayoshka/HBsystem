// src/services/notificationService.js
import api from './api';

export default {
  async getAllNotifications() {
    return api.get('/notification/getallnotifs');
  }
};