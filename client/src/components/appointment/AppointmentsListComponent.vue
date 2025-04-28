<!-- src/components/appointment/AppointmentsListComponent.vue -->
<template>
    <section class="container notif-section" v-if="!loading">
      <h2 class="page-heading">Your Appointments</h2>
  
      <div class="appointments" v-if="appointments.length > 0">
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
              <th v-if="isDoctor">Action</th>
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
              <td v-if="isDoctor && isCurrentDoctorAppointment(appointment)">
                <button
                  class="btn user-btn accept-btn"
                  :class="{ 'disable-btn': appointment.status === 'Completed' }"
                  :disabled="appointment.status === 'Completed'"
                  @click="completeAppointment(appointment)"
                >
                  Complete
                </button>
              </td>
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
  import { formatDate } from '@/utils/dateUtils';
  import { showSuccess, showError } from '@/utils/notification';
  import LoadingComponent from '@/components/common/LoadingComponent.vue';
  import EmptyComponent from '@/components/common/EmptyComponent.vue';
  
  export default {
    name: 'AppointmentsListComponent',
    components: {
      LoadingComponent,
      EmptyComponent
    },
    setup() {
      const store = useStore();
      const loading = computed(() => store.getters['appointment/getLoading']);
      const appointments = computed(() => store.getters['appointment/getAllAppointments']);
      const currentUser = computed(() => store.getters['user/getCurrentUser']);
      const isDoctor = computed(() => currentUser.value && currentUser.value.isDoctor);
      
      onMounted(async () => {
        await store.dispatch('appointment/fetchAllAppointments', currentUser.value.id);
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
      
      const isCurrentDoctorAppointment = (appointment) => {
        return appointment.doctorId === currentUser.value.id;
      };
      
      const completeAppointment = async (appointment) => {
        try {
          const success = await store.dispatch('appointment/completeAppointment', {
            appointid: appointment.id,
            doctorId: appointment.doctorId,
            doctorname: getDoctorName(appointment)
          });
          
          if (success) {
            showSuccess('Appointment completed successfully');
          }
        } catch (error) {
          showError(error.message || 'Failed to complete appointment');
        }
      };
      
      return {
        loading,
        appointments,
        isDoctor,
        formatDate,
        getDoctorName,
        getPatientName,
        isCurrentDoctorAppointment,
        completeAppointment
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