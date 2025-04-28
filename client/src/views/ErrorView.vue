<!-- src/views/ErrorView.vue -->
<template>
  <div class="error container">
    <h2>Error! Page Not Found</h2>
    <router-link
      to="/"
      class="btn"
    >
      Go to home
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'ErrorView'
}
</script>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  height: 90vh;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.error h2 {
  font-size: 3rem;
}
</style>