import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '@/components/HomeView.vue';
import ControlView from '@/components/ControlView.vue';
import SettingsView from '@/components/SettingsView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/control',
    name: 'Control',
    component: ControlView
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView
  }
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.NODE_ENV === 'production' ? '/bed-control-sample-app/' : '/',
  routes
});

export default router;