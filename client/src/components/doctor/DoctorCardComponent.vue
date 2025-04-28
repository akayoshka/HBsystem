<!-- src/components/doctor/DoctorCardComponent.vue -->
<template>
    <div class="card">
      <div class="card-img flex-center">
        <img
          :src="doctor?.user?.pic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'"
          alt="profile"
        />
      </div>
      <h3 class="card-name">
        Dr. {{ doctor?.user?.firstname + " " + doctor?.user?.lastname }}
      </h3>
      <p class="specialization">
        <strong>Specialization: </strong>
        {{ doctor?.specialization }}
      </p>
      <p class="experience">
        <strong>Experience: </strong>
        {{ doctor?.experience }}yrs
      </p>
      <p class="fees">
        <strong>Fees per consultation: </strong>$ {{ doctor?.fees }}
      </p>
      <p class="phone">
        <strong>Phone: </strong>
        {{ doctor?.user?.mobile || 'Not available' }}
      </p>
      <button
        class="btn appointment-btn"
        @click="handleBookAppointment"
      >
        Book Appointment
      </button>
      
      <!-- Modal for booking appointment -->
      <div v-if="modalOpen" class="modal flex-center">
        <div class="modal__content">
          <h2 class="page-heading">Book Appointment</h2>
          <font-awesome-icon
            icon="times"
            @click="modalOpen = false"
            class="close-btn"
          />
          <div class="register-container flex-center book">
            <form class="register-form">
              <input
                type="date"
                name="date"
                class="form-input"
                v-model="appointmentDetails.date"
              />
              <input
                type="time"
                name="time"
                class="form-input"
                v-model="appointmentDetails.time"
              />
              <button
                type="submit"
                class="btn form-btn"
                @click.prevent="bookAppointment"
                :disabled="loading"
              >
                {{ loading ? 'Booking...' : 'Book' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { showSuccess, showError } from '@/utils/notification';
  
  export default {
    name: 'DoctorCardComponent',
    props: {
      doctor: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const store = useStore();
      const router = useRouter();
      
      const modalOpen = ref(false);
      const loading = ref(false);
      const appointmentDetails = ref({
        date: '',
        time: ''
      });
      
      const handleBookAppointment = () => {
        if (!store.getters['user/isAuthenticated']) {
          showError('You must log in first');
          router.push('/login');
          return;
        }
        modalOpen.value = true;
      };
      
      const bookAppointment = async () => {
        // Validate form
        if (!appointmentDetails.value.date || !appointmentDetails.value.time) {
          showError('Please select date and time');
          return;
        }
        
        loading.value = true;
        
        try {
          const success = await store.dispatch('appointment/bookAppointment', {
            doctorId: props.doctor.userId,
            date: appointmentDetails.value.date,
            time: appointmentDetails.value.time,
            doctorname: `${props.doctor.user.firstname} ${props.doctor.user.lastname}`
          });
          
          if (success) {
            showSuccess('Appointment booked successfully');
            modalOpen.value = false;
            appointmentDetails.value = { date: '', time: '' };
          }
        } catch (error) {
          showError(error.message || 'Failed to book appointment');
        } finally {
          loading.value = false;
        }
      };
      
      return {
        modalOpen,
        loading,
        appointmentDetails,
        handleBookAppointment,
        bookAppointment
      };
    }
  }
  </script>
  
  <style scoped>
  .card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 10px;
    padding: 1.5rem 2rem;
    box-shadow: 0 0 10px 0 rgb(188, 188, 188);
  }
  
  .card-img {
    margin: 0 auto;
  }
  
  .card-img img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .card-name {
    margin: 0 auto;
    font-size: 1.2rem;
  }
  
  .appointment-btn {
    font-size: 0.8rem;
    padding: 1rem;
    margin: 1rem auto;
  }
  
  .card p {
    width: 100%;
  }
  
  /* Modal styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
  
  .modal__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 30%;
    padding: 2rem;
    border: 1px solid var(--light-blue);
    border-radius: 10px;
    color: var(--light-blue);
    background-color: rgb(30, 55, 90);
    position: relative;
  }
  
  .modal__content h2 {
    color: var(--light-blue);
  }
  
  .modal__content .btn {
    font-size: 0.9rem;
  }
  
  .close-btn {
    position: absolute;
    top: 2%;
    right: 2%;
    font-size: 1.5rem;
    color: var(--light-blue);
    cursor: pointer;
  }
  
  .book {
    width: 80%;
  }
  </style>