<!-- src/views/admin/AdminDoctorsView.vue -->
<template>
    <admin-doctors-component />
  </template>
  
  <script>
  import AdminDoctorsComponent from '@/components/admin/AdminDoctorsComponent.vue';
  
  export default {
    name: 'AdminDoctorsView',
    components: {
      AdminDoctorsComponent
    }
  }
  </script>