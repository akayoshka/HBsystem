<!-- src/views/appointment/AppointmentsView.vue -->
<template>
    <div>
      <navbar-component />
      <appointments-list-component />
      <footer-component />
    </div>
  </template>
  
  <script>
  import NavbarComponent from '@/components/layout/NavbarComponent.vue';
  import FooterComponent from '@/components/layout/FooterComponent.vue';
  import AppointmentsListComponent from '@/components/appointment/AppointmentsListComponent.vue';
  
  export default {
    name: 'AppointmentsView',
    components: {
      NavbarComponent,
      FooterComponent,
      AppointmentsListComponent
    }
  }
  </script>