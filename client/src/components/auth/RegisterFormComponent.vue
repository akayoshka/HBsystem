<!-- src/components/auth/RegisterFormComponent.vue -->
<template>
    <section class="register-section flex-center">
      <div class="register-container flex-center">
        <h2 class="form-heading">Sign Up</h2>
        <form
          @submit.prevent="submitForm"
          class="register-form"
        >
          <input
            type="text"
            name="firstname"
            class="form-input"
            placeholder="Enter your first name"
            v-model="formDetails.firstname"
          />
          <input
            type="text"
            name="lastname"
            class="form-input"
            placeholder="Enter your last name"
            v-model="formDetails.lastname"
          />
          <input
            type="email"
            name="email"
            class="form-input"
            placeholder="Enter your email"
            v-model="formDetails.email"
          />
          <input
            type="file"
            @change="onFileSelected"
            name="profile-pic"
            id="profile-pic"
            class="form-input"
          />
          <input
            type="password"
            name="password"
            class="form-input"
            placeholder="Enter your password"
            v-model="formDetails.password"
          />
          <input
            type="password"
            name="confpassword"
            class="form-input"
            placeholder="Confirm your password"
            v-model="formDetails.confpassword"
          />
          <button
            type="submit"
            class="btn form-btn"
            :disabled="loading"
          >
            {{ loading ? 'Signing up...' : 'Sign up' }}
          </button>
        </form>
        <p>
          Already a user?
          <router-link
            class="login-link"
            to="/login"
          >
            Log in
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
    name: 'RegisterFormComponent',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const formDetails = ref({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confpassword: '',
        pic: ''
      });
      
      const selectedFile = ref(null);
      const loading = ref(false);
      
      const onFileSelected = (event) => {
        selectedFile.value = event.target.files[0];
      };
      
      const uploadImage = async () => {
        if (!selectedFile.value) return '';
        
        const formData = new FormData();
        formData.append('profileImage', selectedFile.value);
        
        try {
          // In a real app, you would upload the image to your API
          // For now, we'll just simulate a success
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Return a placeholder URL
          return 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';
        } catch (error) {
          throw new Error('Failed to upload image');
        }
      };
      
      const submitForm = async () => {
        // Validate form
        if (!formDetails.value.firstname || !formDetails.value.lastname || !formDetails.value.email || 
            !formDetails.value.password || !formDetails.value.confpassword) {
          showError('Please fill all the fields');
          return;
        }
        
        if (formDetails.value.firstname.length < 3) {
          showError('First name must be at least 3 characters long');
          return;
        }
        
        if (formDetails.value.lastname.length < 3) {
          showError('Last name must be at least 3 characters long');
          return;
        }
        
        if (formDetails.value.password.length < 5) {
          showError('Password must be at least 5 characters long');
          return;
        }
        
        if (formDetails.value.password !== formDetails.value.confpassword) {
          showError('Passwords do not match');
          return;
        }
        
        loading.value = true;
        
        try {
          // Upload image if selected
          let imageUrl = '';
          if (selectedFile.value) {
            imageUrl = await uploadImage();
          }
          
          const success = await store.dispatch('user/register', {
            firstname: formDetails.value.firstname,
            lastname: formDetails.value.lastname,
            email: formDetails.value.email,
            password: formDetails.value.password,
            pic: imageUrl
          });
          
          if (success) {
            showSuccess('Registered successfully');
            router.push('/login');
          }
        } catch (error) {
          showError(error.message || 'Failed to register');
        } finally {
          loading.value = false;
        }
      };
      
      return {
        formDetails,
        loading,
        onFileSelected,
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