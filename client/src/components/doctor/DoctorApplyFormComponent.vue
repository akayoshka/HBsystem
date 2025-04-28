<!-- src/components/doctor/DoctorApplyFormComponent.vue -->
<template>
    <section class="register-section flex-center apply-doctor">
      <div class="register-container flex-center contact">
        <h2 class="form-heading">Apply for Doctor</h2>
        <form class="register-form">
          <input
            type="text"
            name="specialization"
            class="form-input"
            placeholder="Enter your specialization"
            v-model="formDetails.specialization"
          />
          <input
            type="number"
            name="experience"
            class="form-input"
            placeholder="Enter your experience (in years)"
            v-model="formDetails.experience"
          />
          <input
            type="number"
            name="fees"
            class="form-input"
            placeholder="Enter your fees (in dollars)"
            v-model="formDetails.fees"
          />
          <button
            type="submit"
            class="btn form-btn"
            @click.prevent="submitForm"
            :disabled="loading"
          >
            {{ loading ? 'Applying...' : 'Apply' }}
          </button>
        </form>
      </div>
    </section>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { showSuccess, showError } from '@/utils/notification';
  
  export default {
    name: 'DoctorApplyFormComponent',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const formDetails = ref({
        specialization: '',
        experience: '',
        fees: ''
      });
      
      const loading = ref(false);
      
      const submitForm = async () => {
        // Validate form
        if (!formDetails.value.specialization || !formDetails.value.experience || !formDetails.value.fees) {
          showError('Please fill all the fields');
          return;
        }
        
        loading.value = true;
        
        try {
          const success = await store.dispatch('doctor/applyForDoctor', {
            specialization: formDetails.value.specialization,
            experience: Number(formDetails.value.experience),
            fees: Number(formDetails.value.fees)
          });
          
          if (success) {
            showSuccess('Application submitted successfully');
            router.push('/');
          }
        } catch (error) {
          showError(error.message || 'Failed to submit application');
        } finally {
          loading.value = false;
        }
      };
      
      return {
        formDetails,
        loading,
        submitForm
      };
    }
  }
  </script>
  
  <style scoped>
  .apply-doctor {
    height: 90vh;
  }
  
  .register-container {
    flex-direction: column;
    gap: 2rem;
    width: 30%;
  }
  
  .form-heading {
    font-size: 2rem;
  }
  
  .register-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-input {
    font-size: 1rem;
    background-color: rgb(234, 234, 234);
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 5px;
    font-family: var(--font-family);
    width: 100%;
  }
  
  .form-input:focus {
    outline: none;
  }
  
  @media (max-width: 1184px) {
    .register-container {
      width: 30%;
    }
  }
  
  @media (max-width: 1120px) {
    .register-container {
      width: 35%;
    }
  }
  
  @media (max-width: 746px) {
    .register-container {
      width: 40%;
    }
  }
  
  @media (max-width: 600px) {
    .register-container {
      width: 60%;
    }
  }
  
  @media (max-width: 408px) {
    .register-container {
      width: 70%;
    }
  }
  </style>