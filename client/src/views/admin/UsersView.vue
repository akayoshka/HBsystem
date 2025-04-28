<!-- src/views/admin/UsersView.vue -->
<template>
    <users-table-component />
  </template>
  
  <script>
  import UsersTableComponent from '@/components/admin/UsersTableComponent.vue';
  
  export default {
    name: 'UsersView',
    components: {
      UsersTableComponent
    }
  }
  </script>