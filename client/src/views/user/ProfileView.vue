<!-- src/views/user/ProfileView.vue -->
<template>
    <div>
      <navbar-component />
      <profile-form-component />
      <footer-component />
    </div>
  </template>
  
  <script>
  import NavbarComponent from '@/components/layout/NavbarComponent.vue';
  import FooterComponent from '@/components/layout/FooterComponent.vue';
  import ProfileFormComponent from '@/components/user/ProfileFormComponent.vue';
  
  export default {
    name: 'ProfileView',
    components: {
      NavbarComponent,
      FooterComponent,
      ProfileFormComponent
    }
  }
  </script>