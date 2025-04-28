// src/store/modules/user.js
import authService from '@/services/authService';
import userService from '@/services/userService';

export default {
  namespaced: true,
  
  state: {
    currentUser: null,
    loading: false,
    error: null,
    users:[]
  },
  
  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    isAdmin: (state) => state.currentUser && state.currentUser.isAdmin,
    isDoctor: (state) => state.currentUser && state.currentUser.isDoctor,
    getCurrentUser: (state) => state.currentUser,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
    getAllUsers: (state) => state.users,
  },
  
  mutations: {
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
    SET_USERS(state, users) {
      state.users = users;
    }
  },
  
  actions: {
    async register({ commit }, userData) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        await authService.register(userData);
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка регистрации');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async login({ commit, dispatch }, credentials) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        await authService.login(credentials);
        
        // Получаем данные пользователя
        await dispatch('fetchCurrentUser');
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка входа');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async logout({ commit }) {
      try {
        commit('SET_LOADING', true);
        
        await authService.logout();
        
        commit('SET_CURRENT_USER', null);
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка выхода');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchCurrentUser({ commit }) {
      try {
        commit('SET_LOADING', true);
        
        // Проверяем наличие токена
        if (!authService.isAuthenticated()) {
          commit('SET_CURRENT_USER', null);
          return false;
        }
        
        const response = await authService.getCurrentUser();
        commit('SET_CURRENT_USER', response.data.data.user);
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка получения данных пользователя');
        commit('SET_CURRENT_USER', null);
        localStorage.removeItem('token');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async updateProfile({ commit }, userData) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await userService.updateProfile(userData);
        
        // Обновляем данные пользователя в хранилище
        commit('SET_CURRENT_USER', response.data.data.user);
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка обновления профиля');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchAllUsers({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await userService.getAllUsers();
        commit('SET_USERS', response.data.data.users);
        
        return response.data.data.users;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка получения пользователей');
        return [];
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async deleteUser({ commit }, userId) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        await userService.deleteUser(userId);
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка удаления пользователя');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async uploadProfileImage({ commit, dispatch }, formData) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        await userService.uploadProfileImage(formData);
        
        // Обновляем данные пользователя в хранилище
        await dispatch('fetchCurrentUser');
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка загрузки изображения');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};