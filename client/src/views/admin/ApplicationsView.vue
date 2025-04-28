<!-- src/views/admin/ApplicationsView.vue -->
<template>
    <applications-component />
  </template>
  
  <script>
  import ApplicationsComponent from '@/components/admin/ApplicationsComponent.vue';
  
  export default {
    name: 'ApplicationsView',
    components: {
      ApplicationsComponent
    }
  }
  </script>