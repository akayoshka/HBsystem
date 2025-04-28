<!-- src/components/user/ProfileFormComponent.vue -->
<template>
    <section class="register-section flex-center" v-if="!loading">
      <div class="profile-container flex-center">
        <h2 class="form-heading">Profile</h2>
        <img
          :src="profileData.pic || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'"
          alt="profile"
          class="profile-pic"
        />
        <form
          @submit.prevent="updateProfile"
          class="register-form"
        >
          <div class="form-same-row">
            <input
              type="text"
              name="firstname"
              class="form-input"
              placeholder="Enter your first name"
              v-model="profileData.firstname"
            />
            <input
              type="text"
              name="lastname"
              class="form-input"
              placeholder="Enter your last name"
              v-model="profileData.lastname"
            />
          </div>
          <div class="form-same-row">
            <input
              type="email"
              name="email"
              class="form-input"
              placeholder="Enter your email"
              v-model="profileData.email"
            />
            <select
              name="gender"
              v-model="profileData.gender"
              class="form-input"
              id="gender"
            >
              <option value="neither">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div class="form-same-row">
            <input
              type="text"
              name="age"
              class="form-input"
              placeholder="Enter your age"
              v-model="profileData.age"
            />
            <input
              type="text"
              name="mobile"
              class="form-input"
              placeholder="Enter your mobile number"
              v-model="profileData.mobile"
            />
          </div>
          <textarea
            type="text"
            name="address"
            class="form-input"
            placeholder="Enter your address"
            v-model="profileData.address"
            rows="2"
          ></textarea>
          <div class="form-same-row">
            <input
              type="password"
              name="password"
              class="form-input"
              placeholder="Enter your password"
              v-model="profileData.password"
            />
            <input
              type="password"
              name="confpassword"
              class="form-input"
              placeholder="Confirm your password"
              v-model="profileData.confpassword"
            />
          </div>
          <div class="form-same-row">
            <input
              type="file"
              @change="onFileSelected"
              class="form-input"
            />
            <button 
              type="button" 
              class="btn form-btn"
              @click="uploadProfileImage"
              :disabled="!selectedFile || uploading"
            >
              {{ uploading ? 'Uploading...' : 'Upload Image' }}
            </button>
          </div>
          <button
            type="submit"
            class="btn form-btn"
            :disabled="saving"
          >
            {{ saving ? 'Updating...' : 'Update' }}
          </button>
        </form>
      </div>
    </section>
    <loading-component v-else />
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { showSuccess, showError } from '@/utils/notification';
  import LoadingComponent from '@/components/common/LoadingComponent.vue';
  
  export default {
    name: 'ProfileFormComponent',
    components: { LoadingComponent },
    setup() {
      const store = useStore();
      const loading = computed(() => store.getters['user/getLoading']);
      const currentUser = computed(() => store.getters['user/getCurrentUser']);
      
      const profileData = ref({
        firstname: '',
        lastname: '',
        email: '',
        age: '',
        gender: 'neither',
        mobile: '',
        address: '',
        password: '',
        confpassword: '',
        pic: ''
      });
      
      const selectedFile = ref(null);
      const uploading = ref(false);
      const saving = ref(false);
      
      onMounted(() => {
        // Load user data
        if (currentUser.value) {
          profileData.value = {
            firstname: currentUser.value.firstname,
            lastname: currentUser.value.lastname,
            email: currentUser.value.email,
            age: currentUser.value.age || '',
            gender: currentUser.value.gender || 'neither',
            mobile: currentUser.value.mobile || '',
            address: currentUser.value.address || '',
            password: '',
            confpassword: '',
            pic: currentUser.value.pic || ''
          };
        }
      });
      
      const onFileSelected = (event) => {
        selectedFile.value = event.target.files[0];
      };
      
      const uploadProfileImage = async () => {
        if (!selectedFile.value) {
          showError('Please select an image');
          return;
        }
        
        uploading.value = true;
        
        try {
          const formData = new FormData();
          formData.append('profileImage', selectedFile.value);
          
          const success = await store.dispatch('user/uploadProfileImage', formData);
          
          if (success) {
            showSuccess('Profile image uploaded successfully');
            // Update local pic
            profileData.value.pic = currentUser.value.pic;
          }
        } catch (error) {
          showError(error.message || 'Failed to upload image');
        } finally {
          uploading.value = false;
          selectedFile.value = null;
        }
      };
      
      const updateProfile = async () => {
        // Validate form
        if (profileData.value.firstname.length < 3) {
          showError('First name must be at least 3 characters long');
          return;
        }
        
        if (profileData.value.lastname.length < 3) {
          showError('Last name must be at least 3 characters long');
          return;
        }
        
        if (profileData.value.password && profileData.value.password.length < 5) {
          showError('Password must be at least 5 characters long');
          return;
        }
        
        if (profileData.value.password !== profileData.value.confpassword) {
          showError('Passwords do not match');
          return;
        }
        
        saving.value = true;
        
        try {
          // Create update data (exclude confpassword)
          const updateData = { ...profileData.value };
          delete updateData.confpassword;
          
          const success = await store.dispatch('user/updateProfile', updateData);
          
          if (success) {
            showSuccess('Profile updated successfully');
            // Reset password fields
            profileData.value.password = '';
            profileData.value.confpassword = '';
          }
        } catch (error) {
          showError(error.message || 'Failed to update profile');
        } finally {
          saving.value = false;
        }
      };
      
      return {
        profileData,
        loading,
        selectedFile,
        uploading,
        saving,
        onFileSelected,
        uploadProfileImage,
        updateProfile
      };
    }
  }
  </script>
  
  <style scoped>
  .profile-container {
    width: 40%;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-same-row {
    display: flex;
    gap: 1rem;
  }
  
  .profile-container .form-input {
    width: 100%;
  }
  
  .profile-pic {
    border-radius: 50%;
    width: 70px;
    height: 70px;
    object-fit: cover;
  }
  
  @media (max-width: 1230px) {
    .profile-container {
      width: 50%;
    }
  }
  
  @media (max-width: 828px) {
    .profile-container {
      width: 60%;
    }
  }
  
  @media (max-width: 655px) {
    .profile-container {
      width: 70%;
    }
    .profile-pic {
      border-radius: 50%;
      width: 60px;
      height: 60px;
    }
  }
  
  @media (max-width: 493px) {
    .profile-container {
      width: 70%;
    }
  
    .form-same-row {
      flex-direction: column;
    }
  }
  </style>