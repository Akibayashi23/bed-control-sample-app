import Vue from 'vue';
import Vuex from 'vuex';
import { RootState } from '@/types';
import bedModule from './modules/bed';
import settingsModule from './modules/settings';
import authModule from './modules/auth';
import sleepModule from './modules/sleep';

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  modules: {
    bed: bedModule,
    settings: settingsModule,
    auth: authModule,
    sleep: sleepModule
  }
});