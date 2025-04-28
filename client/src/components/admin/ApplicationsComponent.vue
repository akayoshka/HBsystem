<!-- src/components/admin/ApplicationsComponent.vue -->
<template>
    <section class="user-section">
      <h3 class="home-sub-heading">All Applications</h3>
      <div v-if="!loading">
        <div class="user-container" v-if="applications.length > 0">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Pic</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Mobile No.</th>
                <th>Experience</th>
                <th>Specialization</th>
                <th>Fees</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(application, index) in applications" :key="application.id">
                <td>{{ index + 1 }}</td>
                <td>
                  <img
                    class="user-table-pic"
                    :src="application.user?.pic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'"
                    :alt="application.user?.firstname"
                  />
                </td>
                <td>{{ application.user?.firstname }}</td>
                <td>{{ application.user?.lastname }}</td>
                <td>{{ application.user?.email }}</td>
                <td>{{ application.user?.mobile || 'N/A' }}</td>
                <td>{{ application.experience }}</td>
                <td>{{ application.specialization }}</td>
                <td>${{ application.fees }}</td>
                <td class="select">
                  <button
                    class="btn user-btn accept-btn"
                    @click="acceptApplication(application.userId)"
                    :disabled="processing === application.userId"
                  >
                    {{ processing === application.userId ? 'Processing...' : 'Accept' }}
                  </button>
                  <button
                    class="btn user-btn"
                    @click="rejectApplication(application.userId)"
                    :disabled="processing === application.userId"
                  >
                    {{ processing === application.userId ? 'Processing...' : 'Reject' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <empty-component v-else />
      </div>
      <loading-component v-else />
    </section>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { showSuccess, showError } from '@/utils/notification';
  import LoadingComponent from '@/components/common/LoadingComponent.vue';
  import EmptyComponent from '@/components/common/EmptyComponent.vue';
  
  export default {
    name: 'ApplicationsComponent',
    components: {
      LoadingComponent,
      EmptyComponent
    },
    setup() {
      const store = useStore();
      const loading = computed(() => store.getters['doctor/getLoading']);
      const applications = computed(() => store.getters['doctor/getApplications'] || []);
      const processing = ref(null);
      
      onMounted(async () => {
        await store.dispatch('doctor/fetchApplications');
      });
      
      const acceptApplication = async (userId) => {
        if (confirm('Are you sure you want to accept this application?')) {
          processing.value = userId;
          try {
            const success = await store.dispatch('doctor/acceptDoctorApplication', userId);
            if (success) {
              showSuccess('Application accepted successfully');
              await store.dispatch('doctor/fetchApplications');
            }
          } catch (error) {
            showError(error.message || 'Failed to accept application');
          } finally {
            processing.value = null;
          }
        }
      };
      
      const rejectApplication = async (userId) => {
        if (confirm('Are you sure you want to reject this application?')) {
          processing.value = userId;
          try {
            const success = await store.dispatch('doctor/rejectDoctorApplication', userId);
            if (success) {
              showSuccess('Application rejected successfully');
              await store.dispatch('doctor/fetchApplications');
            }
          } catch (error) {
            showError(error.message || 'Failed to reject application');
          } finally {
            processing.value = null;
          }
        }
      };
      
      return {
        loading,
        applications,
        processing,
        acceptApplication,
        rejectApplication
      };
    }
  }
  </script>
  
  <style scoped>
  .user-section {
    width: 80vw;
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .user-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 1.5rem;
    overflow-x: auto;
  }
  
  h3 {
    font-size: 2rem;
    text-align: center;
  }
  
  table {
    width: 100%;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    border-collapse: collapse;
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
  
  .user-table-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid rgb(165, 165, 165);
    object-fit: cover;
  }
  
  .select {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
    justify-content: center;
  }
  
  .user-btn {
    background-color: rgb(233, 83, 113);
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }
  
  .user-btn:hover {
    background-color: crimson;
  }
  
  @media (max-width: 1126px) {
    .user-section {
      width: 70vw;
    }
  }
  
  @media (max-width: 875px) {
    .user-section {
      width: 65vw;
    }
  }
  
  @media (max-width: 700px) {
    .user-section {
      width: 60vw;
    }
  }
  
  @media (max-width: 537px) {
    .user-section {
      width: 55vw;
    }
  }
  
  @media (max-width: 426px) {
    .user-section {
      width: 50vw;
    }
  }
  .accept-btn {
    background-color: rgba(0, 128, 0, 0.528);
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }
  
  .accept-btn:hover {
    background-color: green;
  }
  </style>