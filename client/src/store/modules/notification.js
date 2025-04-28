// src/store/modules/notification.js
import notificationService from '@/services/notificationService';

export default {
  namespaced: true,
  
  state: {
    notifications: [],
    loading: false,
    error: null
  },
  
  getters: {
    getAllNotifications: (state) => state.notifications,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  },
  
  mutations: {
    SET_NOTIFICATIONS(state, notifications) {
      state.notifications = notifications;
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
    async fetchAllNotifications({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await notificationService.getAllNotifications();
        
        commit('SET_NOTIFICATIONS', response.data.data.notifications);
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка получения уведомлений');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};