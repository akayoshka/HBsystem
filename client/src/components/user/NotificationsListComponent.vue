<!-- src/components/user/NotificationsListComponent.vue -->
<template>
    <section class="container notif-section" v-if="!loading">
      <h2 class="page-heading">Your Notifications</h2>
  
      <div class="notifications" v-if="notifications.length > 0">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Content</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(notification, index) in notifications" :key="notification.id">
              <td>{{ index + 1 }}</td>
              <td>{{ notification.content }}</td>
              <td>{{ formatDate(notification.createdAt) }}</td>
              <td>{{ formatTime(notification.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <empty-component v-else />
    </section>
    <loading-component v-else />
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { formatDate, formatTime } from '@/utils/dateUtils';
  import LoadingComponent from '@/components/common/LoadingComponent.vue';
  import EmptyComponent from '@/components/common/EmptyComponent.vue';
  
  export default {
    name: 'NotificationsListComponent',
    components: {
      LoadingComponent,
      EmptyComponent
    },
    setup() {
      const store = useStore();
      const loading = computed(() => store.getters['notification/getLoading']);
      const notifications = computed(() => store.getters['notification/getAllNotifications']);
      
      onMounted(async () => {
        await store.dispatch('notification/fetchAllNotifications');
      });
      
      return {
        loading,
        notifications,
        formatDate,
        formatTime
      };
    }
  }
  </script>
  
  <style scoped>
  .notif-section {
    height: 70vh;
    justify-content: flex-start;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th {
    text-align: center;
    font-weight: 700;
    padding: 0.3rem 1rem;
    background-color: rgb(219, 223, 246);
    color: var(--bold-text-color);
  }
  
  tr {
    padding-bottom: 10px;
  }
  
  tr:nth-child(2n + 1) {
    background-color: rgb(234, 234, 234);
  }
  
  tr:nth-child(2n + 2) {
    background-color: rgb(226, 237, 255);
  }
  
  td {
    padding: 10px;
    color: var(--light-text-color);
    text-align: center !important;
  }
  </style>