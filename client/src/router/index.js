// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

// Общие компоненты
const HomeView = () => import('@/views/HomeView.vue');
const ErrorView = () => import('@/views/ErrorView.vue');

// Аутентификация
const LoginView = () => import('@/views/auth/LoginView.vue');
const RegisterView = () => import('@/views/auth/RegisterView.vue');

// Пользователи
const ProfileView = () => import('@/views/user/ProfileView.vue');
const NotificationsView = () => import('@/views/user/NotificationsView.vue');

// Врачи
const DoctorsView = () => import('@/views/doctor/DoctorsView.vue');
const ApplyDoctorView = () => import('@/views/doctor/ApplyDoctorView.vue');

// Записи на прием
const AppointmentsView = () => import('@/views/appointment/AppointmentsView.vue');

// Панель администратора
const DashboardView = () => import('@/views/admin/DashboardView.vue');
const UsersView = () => import('@/views/admin/UsersView.vue');
const AdminDoctorsView = () => import('@/views/admin/AdminDoctorsView.vue');
const ApplicationsView = () => import('@/views/admin/ApplicationsView.vue');
const AdminAppointmentsView = () => import('@/views/admin/AdminAppointmentsView.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guest: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/doctors',
    name: 'doctors',
    component: DoctorsView
  },
  {
    path: '/applyfordoctor',
    name: 'applyfordoctor',
    component: ApplyDoctorView,
    meta: { requiresAuth: true }
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: AppointmentsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: { name: 'dashboard-users' }
      },
      {
        path: 'users',
        name: 'dashboard-users',
        component: UsersView,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'doctors',
        name: 'dashboard-doctors',
        component: AdminDoctorsView,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'applications',
        name: 'dashboard-applications',
        component: ApplicationsView,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'appointments',
        name: 'dashboard-appointments',
        component: AdminAppointmentsView,
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error',
    component: ErrorView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Защита маршрутов
router.beforeEach(async (to, from, next) => {
  // Проверяем, требуется ли аутентификация для маршрута
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isGuestRoute = to.matched.some(record => record.meta.guest);
  
  // Проверяем аутентификацию пользователя, если ещё не проверили
  if (!store.getters['user/getCurrentUser'] && localStorage.getItem('token')) {
    await store.dispatch('user/fetchCurrentUser');
  }
  
  const isAuthenticated = store.getters['user/isAuthenticated'];
  const isAdmin = store.getters['user/isAdmin'];
  
  // Редирект на логин, если требуется аутентификация, но пользователь не авторизован
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
  } 
  // Редирект на домашнюю страницу, если требуются права администратора, но у пользователя их нет
  else if (requiresAdmin && !isAdmin) {
    next({ name: 'home' });
  }
  // Редирект на домашнюю страницу, если это гостевой маршрут, но пользователь уже авторизован
  else if (isGuestRoute && isAuthenticated) {
    next({ name: 'home' });
  }
  // В противном случае продолжаем переход
  else {
    next();
  }
});

export default router;