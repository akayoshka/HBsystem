<!-- src/views/doctor/ApplyDoctorView.vue -->
<template>
    <div>
      <navbar-component />
      <doctor-apply-form-component />
      <footer-component />
    </div>
  </template>
  
  <script>
  import NavbarComponent from '@/components/layout/NavbarComponent.vue';
  import FooterComponent from '@/components/layout/FooterComponent.vue';
  import DoctorApplyFormComponent from '@/components/doctor/DoctorApplyFormComponent.vue';
  
  export default {
    name: 'ApplyDoctorView',
    components: {
      NavbarComponent,
      FooterComponent,
      DoctorApplyFormComponent
    }
  }
  </script>