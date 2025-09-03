import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/components/HomeView.vue';
import ControlView from '@/components/ControlView.vue';
import SettingsView from '@/components/SettingsView.vue';
import LoginView from '@/components/LoginView.vue';
import SleepView from '@/components/SleepView.vue';
import ForbiddenView from '@/components/ForbiddenView.vue';
import store from '@/store';
import { hasRoleOrHigher } from '@/utils/permissions';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: ForbiddenView
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true, requiresRole: 'viewer' }
  },
  {
    path: '/control',
    name: 'Control',
    component: ControlView,
    meta: { requiresAuth: true, requiresRole: 'caregiver' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { requiresAuth: true, requiresRole: 'viewer' }
  },
  {
    path: '/sleep',
    name: 'Sleep',
    component: SleepView,
    meta: { requiresAuth: true, requiresRole: 'viewer' }
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.NODE_ENV === 'production' ? '/bed-control-sample-app/' : '/',
  routes
});

// Navigation guards for authentication and authorization
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const currentUser = store.getters['auth/currentUser'];
  
  if (to.meta?.requiresAuth && !isAuthenticated) {
    // 認証が必要なページで未認証の場合、ログインページへリダイレクト
    next('/login');
  } else if (to.meta?.requiresGuest && isAuthenticated) {
    // 認証済みユーザーがログインページにアクセスした場合、ホームページへリダイレクト
    next('/home');
  } else if (to.meta?.requiresRole && isAuthenticated) {
    // ロール権限チェック
    if (hasRoleOrHigher(currentUser, to.meta.requiresRole)) {
      next();
    } else {
      // 権限が不足している場合、403ページへリダイレクト
      next({ 
        path: '/403',
        query: { requiredRole: to.meta.requiresRole }
      });
    }
  } else {
    next();
  }
});

export default router;