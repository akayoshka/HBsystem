<!-- src/components/home/HomeCirclesComponent.vue -->
<template>
    <section class="container circles">
      <div class="circle">
        <div class="counter">
          <span ref="counter1">{{ count1 }}</span>+
        </div>
        <span class="circle-name">
          Satisfied
          <br />
          Patients
        </span>
      </div>
      <div class="circle">
        <div class="counter">
          <span ref="counter2">{{ count2 }}</span>+
        </div>
        <span class="circle-name">
          Verified
          <br />
          Doctors
        </span>
      </div>
      <div class="circle">
        <div class="counter">
          <span ref="counter3">{{ count3 }}</span>+
        </div>
        <span class="circle-name">
          Specialist
          <br />
          Doctors
        </span>
      </div>
    </section>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'HomeCirclesComponent',
    setup() {
      const count1 = ref(0);
      const count2 = ref(0);
      const count3 = ref(0);
      const counter1 = ref(null);
      const counter2 = ref(null);
      const counter3 = ref(null);
      
      const animateCount = (startValue, endValue, duration, element) => {
        let startTime = null;
        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          element.value = Math.floor(progress * (endValue - startValue) + startValue);
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      };
      
      onMounted(() => {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            animateCount(0, 1000, 2000, count1);
            animateCount(0, 250, 2000, count2);
            animateCount(0, 75, 2000, count3);
            observer.disconnect();
          }
        });
        
        observer.observe(counter1.value);
      });
      
      return {
        count1,
        count2,
        count3,
        counter1,
        counter2,
        counter3
      };
    }
  }
  </script>
  
  <style scoped>
  .circles {
    flex-direction: row;
    margin-top: 10rem;
    justify-content: space-evenly;
    align-items: center;
  }
  
  .circle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    background-color: var(--white);
    width: 250px;
    height: 250px;
    border-radius: 50%;
    align-items: center;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
  }
  
  .counter {
    font-size: 3rem;
    font-weight: 600;
    color: var(--darker-blue);
  }
  
  .circle-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--light-text-color);
    text-align: center;
  }
  
  @media screen and (max-width: 1000px) {
    .circle {
      width: 200px;
      height: 200px;
    }
    .counter {
      font-size: 2.5rem;
    }
  }
  
  @media screen and (max-width: 770px) {
    .circle {
      width: 150px;
      height: 150px;
    }
    .counter {
      font-size: 2rem;
    }
    .circle-name {
      font-size: 1rem;
    }
  }
  
  @media screen and (max-width: 630px) {
    .circle {
      width: 130px;
      height: 130px;
    }
    .counter {
      font-size: 1.5rem;
    }
    .circle-name {
      font-size: 0.9rem;
    }
  }
  
  @media screen and (max-width: 550px) {
    .circle {
      width: 100px;
      height: 100px;
    }
    .counter {
      font-size: 1.4rem;
    }
  }
  
  @media screen and (max-width: 460px) {
    .circle {
      width: 80px;
      height: 80px;
    }
    .counter {
      font-size: 1.3rem;
    }
  }
  </style>