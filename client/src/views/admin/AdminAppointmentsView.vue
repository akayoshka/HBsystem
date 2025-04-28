<!-- src/views/admin/AdminAppointmentsView.vue -->
<template>
    <admin-appointments-component />
  </template>
  
  <script>
  import AdminAppointmentsComponent from '@/components/admin/AdminAppointmentsComponent.vue';
  
  export default {
    name: 'AdminAppointmentsView',
    components: {
      AdminAppointmentsComponent
    }
  }
  </script>