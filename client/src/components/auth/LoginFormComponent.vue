<!-- src/components/auth/LoginFormComponent.vue -->
<template>
    <section class="register-section flex-center">
      <div class="register-container flex-center">
        <h2 class="form-heading">Sign In</h2>
        <form
          @submit.prevent="submitForm"
          class="register-form"
        >
          <input
            type="email"
            name="email"
            class="form-input"
            placeholder="Enter your email"
            v-model="formDetails.email"
          />
          <input
            type="password"
            name="password"
            class="form-input"
            placeholder="Enter your password"
            v-model="formDetails.password"
          />
          <button
            type="submit"
            class="btn form-btn"
            :disabled="loading"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
        <p>
          Not a user?
          <router-link
            class="login-link"
            to="/register"
          >
            Register
          </router-link>
        </p>
      </div>
    </section>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { showSuccess, showError } from '@/utils/notification';
  
  export default {
    name: 'LoginFormComponent',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const formDetails = ref({
        email: '',
        password: ''
      });
      
      const loading = ref(false);
      
      const submitForm = async () => {
        // Validate form
        if (!formDetails.value.email || !formDetails.value.password) {
          showError('Please fill all the fields');
          return;
        }
        
        loading.value = true;
        
        try {
          const success = await store.dispatch('user/login', {
            email: formDetails.value.email,
            password: formDetails.value.password
          });
          
          if (success) {
            showSuccess('Logged in successfully');
            router.push('/');
          }
        } catch (error) {
          showError(error.message || 'Failed to login');
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
  .register-section {
    width: 100%;
    height: 100vh;
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
  
  .login-link {
    color: var(--darker-blue);
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