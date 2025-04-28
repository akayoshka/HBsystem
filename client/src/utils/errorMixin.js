// src/utils/errorMixin.js
import { showError } from './notification';

export default {
  methods: {
    handleApiError(error, defaultMessage = 'An error occurred') {
      const errorMessage = error.response?.data?.message || error.message || defaultMessage;
      showError(errorMessage);
      console.error(error);
    }
  }
};