// src/store/index.js
import { createStore } from 'vuex';
import user from './modules/user';
import doctor from './modules/doctor';
import appointment from './modules/appointment';
import notification from './modules/notification';

export default createStore({
  state: {
    loading: false,
    appError: null
  },
  
  getters: {
    getGlobalLoading: (state) => state.loading,
    getAppError: (state) => state.appError
  },
  
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_APP_ERROR(state, error) {
      state.appError = error;
    },
    CLEAR_APP_ERROR(state) {
      state.appError = null;
    }
  },
  
  actions: {
    setGlobalLoading({ commit }, loading) {
      commit('SET_LOADING', loading);
    },
    setAppError({ commit }, error) {
      commit('SET_APP_ERROR', error);
    },
    clearAppError({ commit }) {
      commit('CLEAR_APP_ERROR');
    }
  },
  
  modules: {
    user,
    doctor,
    appointment,
    notification
  }
});