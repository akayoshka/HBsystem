<!-- src/views/auth/LoginView.vue -->
<template>
    <login-form-component />
  </template>
  
  <script>
  import LoginFormComponent from '@/components/auth/LoginFormComponent.vue';
  
  export default {
    name: 'LoginView',
    components: {
      LoginFormComponent
    }
  }
  </script>