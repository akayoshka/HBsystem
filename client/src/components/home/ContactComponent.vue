<!-- src/components/home/ContactComponent.vue -->
<template>
    <section
      class="register-section flex-center"
      id="contact"
    >
      <div class="contact-container flex-center contact">
        <h2 class="form-heading">Contact Us</h2>
        <form
          @submit.prevent="submitForm"
          class="register-form"
        >
          <input
            type="text"
            name="name"
            class="form-input"
            placeholder="Enter your name"
            v-model="formDetails.name"
          />
          <input
            type="email"
            name="email"
            class="form-input"
            placeholder="Enter your email"
            v-model="formDetails.email"
          />
          <textarea
            type="text"
            name="message"
            class="form-input"
            placeholder="Enter your message"
            v-model="formDetails.message"
            rows="8"
            cols="12"
          ></textarea>
  
          <button
            type="submit"
            class="btn form-btn"
            :disabled="loading"
          >
            {{ loading ? 'Sending...' : 'Send' }}
          </button>
        </form>
      </div>
    </section>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { showSuccess, showError } from '@/utils/notification';
  
  export default {
    name: 'ContactComponent',
    setup() {
      const formDetails = ref({
        name: '',
        email: '',
        message: ''
      });
      const loading = ref(false);
      
      const submitForm = async () => {
        // Validate form
        if (!formDetails.value.name || !formDetails.value.email || !formDetails.value.message) {
          showError('Please fill all the fields');
          return;
        }
        
        loading.value = true;
        
        try {
          // In a real app, you would send this to your API
          // For now, we'll just simulate a success
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          showSuccess('Message sent successfully');
          // Reset form
          formDetails.value = {
            name: '',
            email: '',
            message: ''
          };
        } catch (error) {
          showError('Failed to send message');
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
  .contact-container {
    flex-direction: column;
    gap: 2rem;
    width: 40%;
  }
  
  @media (max-width: 1000px) {
    .contact-container {
      width: 50%;
    }
  }
  
  @media (max-width: 600px) {
    .contact-container {
      width: 60%;
    }
  }
  
  @media (max-width: 420px) {
    .contact-container {
      width: 70%;
    }
  }
  
  .form-input,
  textarea {
    font-size: 1rem;
    background-color: rgb(234, 234, 234);
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 5px;
    font-family: var(--font-family);
    width: 100%;
  }
  
  .form-input:focus,
  textarea:focus {
    outline: none;
  }
  
  .form-btn {
    margin: 0 auto;
    display: block;
  }
  </style>