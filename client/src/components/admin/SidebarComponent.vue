<!-- src/components/admin/SidebarComponent.vue -->
<template>
    <section class="sidebar-section flex-center">
      <div class="sidebar-container">
        <ul>
          <li v-for="(item, index) in sidebarItems" :key="index">
            <font-awesome-icon :icon="item.icon" />
            <router-link :to="item.path">{{ item.name }}</router-link>
          </li>
        </ul>
        <div class="logout-container">
          <font-awesome-icon icon="sign-out-alt" />
          <p @click="logout">Logout</p>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { showSuccess, showError } from '@/utils/notification';
  
  export default {
    name: 'SidebarComponent',
    setup() {
      const store = useStore();
      const router = useRouter();
      
      const sidebarItems = ref([
        {
          name: 'Home',
          path: '/',
          icon: 'home'
        },
        {
          name: 'Users',
          path: '/dashboard/users',
          icon: 'users'
        },
        {
          name: 'Doctors',
          path: '/dashboard/doctors',
          icon: 'user-md'
        },
        {
          name: 'Appointments',
          path: '/dashboard/appointments',
          icon: 'list'
        },
        {
          name: 'Applications',
          path: '/dashboard/applications',
          icon: 'envelope'
        },
        {
          name: 'Profile',
          path: '/profile',
          icon: 'user'
        }
      ]);
      
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
        sidebarItems,
        logout
      };
    }
  }
  </script>
  
  <style scoped>
  .sidebar-section {
    background: linear-gradient(
      0deg,
      rgba(0, 119, 255, 1) 0%,
      rgba(64, 164, 255, 1) 100%
    );
    width: 18vw;
    height: 100vh;
    box-shadow: 0 0 10px 0 var(--darker-blue);
    position: sticky;
    top: 0%;
  }
  
  .sidebar-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
  }
  
  .sidebar-container > ul {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .sidebar-container ul > li,
  .logout-container {
    font-size: 1.2rem;
    color: var(--white);
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 0 1.5rem;
  }
  
  .sidebar-container a,
  .logout-container p {
    color: var(--white);
    cursor: pointer;
  }
  
  .sidebar-container a:hover,
  .logout-container p:hover {
    color: var(--light-text-color);
    cursor: pointer;
  }
  
  @media (max-width: 1126px) {
    .sidebar-section {
      width: 22vw;
    }
  }
  
  @media (max-width: 875px) {
    .sidebar-section {
      width: 25vw;
    }
  }
  
  @media (max-width: 700px) {
    .sidebar-section {
      width: 30vw;
    }
  }
  
  @media (max-width: 537px) {
    .sidebar-section {
      width: 40vw;
    }
  }
  
  @media (max-width: 426px) {
    .sidebar-section {
      width: 45vw;
    }
  }
  </style>