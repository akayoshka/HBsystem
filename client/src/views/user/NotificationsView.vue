<!-- src/views/user/NotificationsView.vue -->
<template>
    <div>
      <navbar-component />
      <notifications-list-component />
      <footer-component />
    </div>
  </template>
  
  <script>
  import NavbarComponent from '@/components/layout/NavbarComponent.vue';
  import FooterComponent from '@/components/layout/FooterComponent.vue';
  import NotificationsListComponent from '@/components/user/NotificationsListComponent.vue';
  
  export default {
    name: 'NotificationsView',
    components: {
      NavbarComponent,
      FooterComponent,
      NotificationsListComponent
    }
  }
  </script>