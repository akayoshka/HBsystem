<template>
  <div class="loading">
    <div class="loader">Loading...</div>
  </div>
</template>

<script>
export default {
  name: 'LoadingComponent'
}
</script>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 90vh;
}

.loader,
.loader:after {
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
}

.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1em solid rgba(0, 47, 97, 0.2);
  border-right: 1em solid rgba(0, 47, 97, 0.2);
  border-bottom: 1em solid rgba(0, 47, 97, 0.2);
  border-left: 1em solid #002f61;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}

@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>