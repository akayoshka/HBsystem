<!-- src/components/home/HeroComponent.vue -->
<template>
    <section class="hero">
      <div class="hero-content">
        <h1>
          Your Health, <br />
          Our Responsibility
        </h1>
        <p>
          We provide top-quality healthcare services to help you maintain your health and wellbeing. 
          Our experienced doctors are ready to assist you with any health concerns.
        </p>
      </div>
      <div class="hero-img">
        <img
          src="@/assets/heroimg.jpg"
          alt="hero"
        />
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'HeroComponent'
  }
  </script>
  
  <style scoped>
  .hero {
    display: flex;
    height: 90vh;
    width: 80%;
    margin: 0 auto;
    align-items: center;
    gap: 2rem;
    justify-content: space-between;
  }
  
  .hero-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex: 1;
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-img {
    flex: 1;
  }
  
  .hero-img img {
    width: 100%;
  }
  
  @media screen and (max-width: 770px) {
    .hero {
      height: auto;
      flex-direction: column;
    }
    .hero-content {
      margin-top: 2rem;
      align-items: center;
    }
    .hero-content h1 {
      text-align: center;
    }
  }
  </style>