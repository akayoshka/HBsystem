// src/services/appointmentService.js
import api from './api';

export default {
  async getAllAppointments(search = '') {
    return api.get(`/appointment/getallappointments${search ? `?search=${search}` : ''}`);
  },

  async bookAppointment(appointmentData) {
    return api.post('/appointment/bookappointment', appointmentData);
  },

  async completeAppointment(appointmentData) {
    return api.put('/appointment/completed', appointmentData);
  }
};