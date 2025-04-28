// src/services/doctorService.js
import api from './api';

export default {
  async getAllDoctors() {
    return api.get('/doctor/getalldoctors');
  },

  async getDoctorApplications() {
    return api.get('/doctor/getnotdoctors');
  },

  async applyForDoctor(doctorData) {
    return api.post('/doctor/applyfordoctor', doctorData);
  },

  async acceptDoctor(id) {
    return api.put('/doctor/acceptdoctor', { id });
  },

  async rejectDoctor(id) {
    return api.put('/doctor/rejectdoctor', { id });
  },

  async deleteDoctor(userId) {
    return api.put('/doctor/deletedoctor', { userId });
  }
};