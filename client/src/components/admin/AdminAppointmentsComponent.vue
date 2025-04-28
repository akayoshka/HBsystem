<!-- src/components/admin/AdminAppointmentsComponent.vue -->
<template>
    <section class="user-section">
      <h3 class="home-sub-heading">All Appointments</h3>
      <div v-if="!loading">
        <div class="user-container" v-if="appointments.length > 0">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Doctor</th>
                <th>Patient</th>
                <th>Appointment Date</th>
                <th>Appointment Time</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(appointment, index) in appointments" :key="appointment.id">
                <td>{{ index + 1 }}</td>
                <td>
                  {{ getDoctorName(appointment) }}
                </td>
                <td>
                  {{ getPatientName(appointment) }}
                </td>
                <td>{{ appointment.date }}</td>
                <td>{{ appointment.time }}</td>
                <td>{{ formatDate(appointment.createdAt) }}</td>
                <td>{{ appointment.status }}</td>
                <td>
                  <button
                    class="btn user-btn accept-btn"
                    :class="{ 'disable-btn': appointment.status === 'Completed' }"
                    :disabled="appointment.status === 'Completed' || completing === appointment.id"
                    @click="completeAppointment(appointment)"
                  >
                    {{ completing === appointment.id ? 'Processing...' : 'Complete' }}
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
  import { formatDate } from '@/utils/dateUtils';
  import { showSuccess, showError } from '@/utils/notification';
  import LoadingComponent from '@/components/common/LoadingComponent.vue';
  import EmptyComponent from '@/components/common/EmptyComponent.vue';
  
  export default {
    name: 'AdminAppointmentsComponent',
    components: {
      LoadingComponent,
      EmptyComponent
    },
    setup() {
      const store = useStore();
      const loading = computed(() => store.getters['appointment/getLoading']);
      const appointments = computed(() => store.getters['appointment/getAllAppointments'] || []);
      const completing = ref(null);
      
      onMounted(async () => {
        await store.dispatch('appointment/fetchAllAppointments');
      });
      
      const getDoctorName = (appointment) => {
        return appointment.doctor ? 
          `${appointment.doctor.firstname} ${appointment.doctor.lastname}` : 
          'Unknown Doctor';
      };
      
      const getPatientName = (appointment) => {
        return appointment.patient ? 
          `${appointment.patient.firstname} ${appointment.patient.lastname}` : 
          'Unknown Patient';
      };
      
      const completeAppointment = async (appointment) => {
        if (appointment.status === 'Completed') return;
        
        if (confirm('Are you sure you want to mark this appointment as completed?')) {
          completing.value = appointment.id;
          try {
            const success = await store.dispatch('appointment/completeAppointment', {
              appointid: appointment.id,
              doctorId: appointment.doctorId,
              doctorname: getDoctorName(appointment)
            });
            
            if (success) {
              showSuccess('Appointment marked as completed');
              await store.dispatch('appointment/fetchAllAppointments');
            }
          } catch (error) {
            showError(error.message || 'Failed to complete appointment');
          } finally {
            completing.value = null;
          }
        }
      };
      
      return {
        loading,
        appointments,
        completing,
        formatDate,
        getDoctorName,
        getPatientName,
        completeAppointment
      };
    }
  }
  </script>
  
  <style scoped>
  /* Reuse same styles as UsersTableComponent with additional styles */
  .accept-btn {
    background-color: rgba(0, 128, 0, 0.528);
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
  }
  
  .accept-btn:hover {
    background-color: green;
  }
  
  .disable-btn {
    cursor: no-drop;
  }
  
  .disable-btn:hover {
    background-color: rgba(0, 128, 0, 0.528) !important;
  }
  </style>