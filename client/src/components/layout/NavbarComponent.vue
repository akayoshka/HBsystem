<!-- src/components/layout/NavbarComponent.vue -->
<template>
    <header>
      <nav :class="{ 'nav-active': isMenuOpen }">
        <h2 class="nav-logo">
          <router-link to="/">HealthBooker</router-link>
        </h2>
        <ul class="nav-links">
          <li>
            <router-link to="/">Home</router-link>
          </li>
          <li>
            <router-link to="/doctors">Doctors</router-link>
          </li>
          <template v-if="isAuthenticated">
            <template v-if="isAdmin">
              <li>
                <router-link to="/dashboard/users">Dashboard</router-link>
              </li>
            </template>
            <template v-else>
              <li>
                <router-link to="/appointments">Appointments</router-link>
              </li>
              <li>
                <router-link to="/notifications">Notifications</router-link>
              </li>
              <li>
                <router-link to="/applyfordoctor">Apply for doctor</router-link>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
              <li>
                <router-link to="/profile">Profile</router-link>
              </li>
            </template>
            <li>
              <a href="#" class="btn" @click.prevent="logout">Logout</a>
            </li>
          </template>
          <template v-else>
            <li>
              <router-link class="btn" to="/login">Login</router-link>
            </li>
            <li>
              <router-link class="btn" to="/register">Register</router-link>
            </li>
          </template>
        </ul>
      </nav>
      <div class="menu-icons">
        <font-awesome-icon
          v-if="!isMenuOpen"
          icon="bars"
          class="menu-open"
          @click="toggleMenu"
        />
        <font-awesome-icon
          v-else
          icon="times"
          class="menu-close"
          @click="toggleMenu"
        />
      </div>
    </header>
  </template>
  
  <script>
  import { computed, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { showSuccess, showError } from '@/utils/notification';
  
  export default {
    name: 'NavbarComponent',
    
    setup() {
      const store = useStore();
      const router = useRouter();
      const isMenuOpen = ref(false);
      
      const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);
      const isAdmin = computed(() => store.getters['user/isAdmin']);
      const currentUser = computed(() => store.getters['user/getCurrentUser']);
      
      const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
      };
      
      const logout = async () => {
        try {
          await store.dispatch('user/logout');
          showSuccess('Logged out successfully');
          router.push('/login');
        } catch (error) {
          showError('Failed to logout');
        }
      };
      
      return {
        isMenuOpen,
        isAuthenticated,
        isAdmin,
        currentUser,
        toggleMenu,
        logout
      };
    }
  }
  </script>
  
  <style scoped>
  header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;
    position: sticky;
    top: 0%;
    left: 0%;
    background-color: var(--light-blue);
    z-index: 2;
    box-shadow: 0 0 20px 0 rgba(144, 174, 205, 0.339);
    transition: all 0.2 linear;
  }
  
  nav {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
    align-items: center;
  }
  
  .nav-logo a,
  .nav-links a {
    color: var(--bold-text-color);
  }
  
  .nav-links {
    display: flex;
    gap: 2rem;
  }
  
  .nav-links .btn {
    color: var(--white);
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  
  .menu-icons {
    display: none;
    z-index: 100;
    font-size: 1.5rem;
    position: relative;
  }
  
  .menu-open,
  .menu-close {
    position: absolute;
    color: var(--black);
    cursor: pointer;
  }
  
  @media (max-width: 1300px) {
    nav {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  
  @media (max-width: 950px) {
    .nav-links {
      position: fixed;
      top: 0%;
      left: 0%;
      width: 100vw;
      height: 100vh;
      background-color: var(--light-blue);
      flex-direction: column;
      transform: translateX(100%);
      justify-content: center;
      align-items: center;
      visibility: hidden;
      z-index: 20;
      gap: 3rem;
      transition: all 0.3s linear;
    }
    .nav-active .nav-links {
      transform: translateX(0%);
      visibility: visible;
    }
    .menu-icons {
      display: block;
      position: absolute;
      top: 33%;
      right: 7%;
    }
  }
  </style>