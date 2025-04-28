// src/store/modules/appointment.js
import appointmentService from '@/services/appointmentService';

export default {
  namespaced: true,
  
  state: {
    appointments: [],
    loading: false,
    error: null
  },
  
  getters: {
    getAllAppointments: (state) => state.appointments,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  },
  
  mutations: {
    SET_APPOINTMENTS(state, appointments) {
      state.appointments = appointments;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },
  
  actions: {
    async fetchAllAppointments({ commit }, userId) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const search = userId ? `?search=${userId}` : '';
        const response = await appointmentService.getAllAppointments(search);
        
        commit('SET_APPOINTMENTS', response.data.data.appointments);
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка получения записей на прием');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async bookAppointment({ commit, dispatch }, appointmentData) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        await appointmentService.bookAppointment(appointmentData);
        
        // Обновляем список записей
        await dispatch('fetchAllAppointments');
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка создания записи на прием');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async completeAppointment({ commit, dispatch }, appointmentData) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        await appointmentService.completeAppointment(appointmentData);
        
        // Обновляем список записей
        await dispatch('fetchAllAppointments');
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка завершения приема');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};