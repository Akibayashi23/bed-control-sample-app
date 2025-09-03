import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { ToastPlugin } from './services/toast';

Vue.config.productionTip = false;

// トーストプラグインを使用
Vue.use(ToastPlugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');