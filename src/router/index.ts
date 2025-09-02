import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/components/HomeView.vue';
import ControlView from '@/components/ControlView.vue';
import SettingsView from '@/components/SettingsView.vue';
import LoginView from '@/components/LoginView.vue';
import SleepView from '@/components/SleepView.vue';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/control',
    name: 'Control',
    component: ControlView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/sleep',
    name: 'Sleep',
    component: SleepView,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.NODE_ENV === 'production' ? '/bed-control-sample-app/' : '/',
  routes
});

// Navigation guards for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  
  if (to.meta?.requiresAuth && !isAuthenticated) {
    // 認証が必要なページで未認証の場合、ログインページへリダイレクト
    next('/login');
  } else if (to.meta?.requiresGuest && isAuthenticated) {
    // 認証済みユーザーがログインページにアクセスした場合、ホームページへリダイレクト
    next('/home');
  } else {
    next();
  }
});

export default router;