<!-- src/views/admin/DashboardView.vue -->
<template>
    <section class="layout-section">
      <div class="layout-container">
        <sidebar-component />
        <router-view />
      </div>
    </section>
  </template>
  
  <script>
  import SidebarComponent from '@/components/admin/SidebarComponent.vue';
  
  export default {
    name: 'DashboardView',
    components: {
      SidebarComponent
    }
  }
  </script>
  
  <style scoped>
  .layout-section {
    width: 100%;
    min-height: 100vh;
  }
  
  .layout-container {
    display: flex;
    height: 100%;
  }
  </style>