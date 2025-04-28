<!-- src/components/home/AboutComponent.vue -->
<template>
    <section class="container">
      <h2 class="page-heading about-heading">About Us</h2>
      <div class="about">
        <div class="hero-img">
          <img
            src="@/assets/aboutimg.jpg"
            alt="about"
          />
        </div>
        <div class="hero-content">
          <p>
            HealthBooker is a modern healthcare platform that connects patients with qualified doctors. 
            Our mission is to make healthcare accessible to everyone by simplifying the process of finding 
            and booking appointments with healthcare professionals.
          </p>
          <p>
            We believe in providing high-quality healthcare services through our platform, ensuring that 
            patients receive the care they need when they need it. Our network of certified doctors is 
            dedicated to delivering excellent medical services.
          </p>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: 'AboutComponent'
  }
  </script>
  
  <style scoped>
  .about {
    display: flex;
    margin: 0 auto;
    align-items: center;
    gap: 2rem;
    justify-content: space-between;
  }
  
  .about-heading {
    margin-top: 4rem;
  }
  
  @media screen and (max-width: 770px) {
    .about {
      flex-direction: column;
    }
  }
  </style>