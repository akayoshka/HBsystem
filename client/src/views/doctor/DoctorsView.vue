<!-- src/views/doctor/DoctorsView.vue -->
<template>
    <div>
      <navbar-component />
      <section class="container doctors" v-if="!loading">
        <h2 class="page-heading">Our Doctors</h2>
        <div class="doctors-card-container" v-if="doctors.length > 0">
          <doctor-card-component
            v-for="doctor in doctors"
            :key="doctor.id"
            :doctor="doctor"
          />
        </div>
        <empty-component v-else />
      </section>
      <loading-component v-if="loading" />
      <footer-component />
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import NavbarComponent from '@/components/layout/NavbarComponent.vue';
  import FooterComponent from '@/components/layout/FooterComponent.vue';
  import DoctorCardComponent from '@/components/doctor/DoctorCardComponent.vue';
  import LoadingComponent from '@/components/common/LoadingComponent.vue';
  import EmptyComponent from '@/components/common/EmptyComponent.vue';
  
  export default {
    name: 'DoctorsView',
    components: {
      NavbarComponent,
      FooterComponent,
      DoctorCardComponent,
      LoadingComponent,
      EmptyComponent
    },
    setup() {
      const store = useStore();
      const loading = computed(() => store.getters['doctor/getLoading']);
      const doctors = computed(() => store.getters['doctor/getAllDoctors']);
      
      onMounted(async () => {
        await store.dispatch('doctor/fetchAllDoctors');
      });
      
      return {
        loading,
        doctors
      };
    }
  }
  </script>
  
  <style scoped>
  .doctors {
    margin-bottom: 5rem;
  }
  
  .doctors-card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    gap: 3rem;
    width: 100%;
  }
  </style>