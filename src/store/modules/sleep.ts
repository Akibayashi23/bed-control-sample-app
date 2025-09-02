import { Module } from 'vuex';
import { SleepData, RootState } from '@/types';
import { SleepService } from '@/services/sleep';

export interface SleepModuleState {
  dailyData: SleepData[];
  weeklyData: SleepData[];
  isLoading: boolean;
  error: string | null;
  selectedPeriod: 'daily' | 'weekly';
}

const sleepModule: Module<SleepModuleState, RootState> = {
  namespaced: true,
  
  state: () => ({
    dailyData: [],
    weeklyData: [],
    isLoading: false,
    error: null,
    selectedPeriod: 'daily' as 'daily' | 'weekly'
  }),

  mutations: {
    SET_SLEEP_LOADING(state, loading: boolean) {
      state.isLoading = loading;
      state.error = null;
    },
    SET_SLEEP_ERROR(state, error: string) {
      state.isLoading = false;
      state.error = error;
    },
    SET_DAILY_SLEEP_DATA(state, data: SleepData[]) {
      state.dailyData = data;
      state.isLoading = false;
      state.error = null;
    },
    SET_WEEKLY_SLEEP_DATA(state, data: SleepData[]) {
      state.weeklyData = data;
      state.isLoading = false;
      state.error = null;
    },
    SET_SLEEP_PERIOD(state, period: 'daily' | 'weekly') {
      state.selectedPeriod = period;
    }
  },

  actions: {
    async fetchDailySleepData({ commit }) {
      try {
        commit('SET_SLEEP_LOADING', true);
        const data = await SleepService.fetchDailyData();
        commit('SET_DAILY_SLEEP_DATA', data);
      } catch (error) {
        commit('SET_SLEEP_ERROR', error instanceof Error ? error.message : '睡眠データの取得に失敗しました');
      }
    },
    async fetchWeeklySleepData({ commit }) {
      try {
        commit('SET_SLEEP_LOADING', true);
        const data = await SleepService.fetchWeeklyData();
        commit('SET_WEEKLY_SLEEP_DATA', data);
      } catch (error) {
        commit('SET_SLEEP_ERROR', error instanceof Error ? error.message : '週間データの取得に失敗しました');
      }
    },
    setSleepPeriod({ commit, dispatch }, period: 'daily' | 'weekly') {
      commit('SET_SLEEP_PERIOD', period);
      // Fetch appropriate data when period changes
      if (period === 'daily') {
        dispatch('fetchDailySleepData');
      } else {
        dispatch('fetchWeeklySleepData');
      }
    }
  },

  getters: {
    sleepData: state => state.selectedPeriod === 'daily' ? state.dailyData : state.weeklyData,
    sleepLoading: state => state.isLoading,
    sleepError: state => state.error,
    sleepPeriod: state => state.selectedPeriod
  }
};

export default sleepModule;