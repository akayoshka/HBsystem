<!-- src/views/HomeView.vue -->
<template>
  <div>
    <navbar-component />
    <hero-component />
    <about-component />
    <home-circles-component />
    <contact-component />
    <footer-component />
  </div>
</template>

<script>
import NavbarComponent from '@/components/layout/NavbarComponent.vue';
import FooterComponent from '@/components/layout/FooterComponent.vue';
import HeroComponent from '@/components/home/HeroComponent.vue';
import AboutComponent from '@/components/home/AboutComponent.vue';
import HomeCirclesComponent from '@/components/home/HomeCirclesComponent.vue';
import ContactComponent from '@/components/home/ContactComponent.vue';

export default {
  name: 'HomeView',
  components: {
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    HomeCirclesComponent,
    ContactComponent
  }
}
</script>