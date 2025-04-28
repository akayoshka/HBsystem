<!-- src/views/auth/RegisterView.vue -->
<template>
    <register-form-component />
  </template>
  
  <script>
  import RegisterFormComponent from '@/components/auth/RegisterFormComponent.vue';
  
  export default {
    name: 'RegisterView',
    components: {
      RegisterFormComponent
    }
  }
  </script>