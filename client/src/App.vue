<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  
  async created() {
    // Проверяем аутентификацию пользователя при загрузке приложения
    if (localStorage.getItem('token')) {
      await this.$store.dispatch('user/fetchCurrentUser');
    }
  }
};
</script>

<style>
/* Импортируем основные стили */
@import './styles/app.scss';
</style>