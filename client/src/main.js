// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import './styles/app.scss';
import VueDatepicker from 'vue-datepicker-next';
import 'vue-datepicker-next/index.css';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBars, faTimes, faUser, faHome, faList, faUserMd, faUsers, faEnvelope, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

// Add icons to the library
library.add(
  faBars, faTimes, faUser, faHome, faList, faUserMd, faUsers, faEnvelope, faSignOutAlt,
  faFacebookF, faYoutube, faInstagram
);

// Опции для Toast
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
};

// Создаем приложение
const app = createApp(App);

app.use(VueDatepicker);

// Регистрируем плагины и компоненты
app.component('font-awesome-icon', FontAwesomeIcon);
app.use(router);
app.use(store);
app.use(Toast, toastOptions);

// Монтируем приложение
app.mount('#app');