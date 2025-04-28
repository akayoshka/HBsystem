// src/store/modules/doctor.js
import doctorService from '@/services/doctorService';

export default {
  namespaced: true,
  
  state: {
    doctors: [],
    applications: [],
    loading: false,
    error: null
  },
  
  getters: {
    getAllDoctors: (state) => state.doctors,
    getApplications: (state) => state.applications,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  },
  
  mutations: {
    SET_DOCTORS(state, doctors) {
      state.doctors = doctors;
    },
    SET_APPLICATIONS(state, applications) {
      state.applications = applications;
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
    async fetchAllDoctors({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await doctorService.getAllDoctors();
        commit('SET_DOCTORS', response.data.data.doctors);
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка получения списка врачей');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async fetchApplications({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        const response = await doctorService.getDoctorApplications();
        commit('SET_APPLICATIONS', response.data.data.applications);
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка получения заявок на роль врача');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async applyForDoctor({ commit }, doctorData) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        await doctorService.applyForDoctor(doctorData);
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка подачи заявки на роль врача');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async acceptDoctorApplication({ commit, dispatch }, id) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        await doctorService.acceptDoctor(id);
        
        // Обновляем список заявок
        await dispatch('fetchApplications');
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка принятия заявки');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async rejectDoctorApplication({ commit, dispatch }, id) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        await doctorService.rejectDoctor(id);
        
        // Обновляем список заявок
        await dispatch('fetchApplications');
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка отклонения заявки');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    
    async deleteDoctor({ commit, dispatch }, userId) {
      try {
        commit('SET_LOADING', true);
        commit('CLEAR_ERROR');
        
        await doctorService.deleteDoctor(userId);
        
        // Обновляем список врачей
        await dispatch('fetchAllDoctors');
        
        return true;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Ошибка удаления врача');
        return false;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};