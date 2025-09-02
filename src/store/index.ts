import Vue from 'vue';
import Vuex from 'vuex';
import { RootState, BedPosition, PresetType, LoginCredentials, CustomPreset } from '@/types';

Vue.use(Vuex);

const PRESET_POSITIONS: Record<PresetType, BedPosition> = {
  sleep: { back: 0, leg: 0, height: 30 },
  reading: { back: 45, leg: 15, height: 50 },
  eating: { back: 60, leg: 30, height: 70 }
};

export default new Vuex.Store<RootState>({
  state: {
    bed: {
      position: { back: 0, leg: 0, height: 30 },
      isLocked: false,
      batteryLevel: 85,
      customPresets: []
    },
    settings: {
      fontSize: 'standard'
    },
    auth: {
      isAuthenticated: false,
      errorMessage: null
    }
  },
  mutations: {
    SET_BED_POSITION(state, position: BedPosition) {
      state.bed.position = { ...position };
    },
    SET_BACK_POSITION(state, back: number) {
      state.bed.position.back = Math.max(0, Math.min(90, back));
    },
    SET_LEG_POSITION(state, leg: number) {
      state.bed.position.leg = Math.max(0, Math.min(45, leg));
    },
    SET_HEIGHT_POSITION(state, height: number) {
      state.bed.position.height = Math.max(20, Math.min(80, height));
    },
    TOGGLE_LOCK(state) {
      state.bed.isLocked = !state.bed.isLocked;
    },
    SET_BATTERY_LEVEL(state, level: number) {
      state.bed.batteryLevel = Math.max(0, Math.min(100, level));
    },
    SET_FONT_SIZE(state, fontSize: 'standard' | 'large') {
      state.settings.fontSize = fontSize;
      localStorage.setItem('fontSize', fontSize);
    },
    SET_AUTH_SUCCESS(state) {
      state.auth.isAuthenticated = true;
      state.auth.errorMessage = null;
    },
    SET_AUTH_ERROR(state, errorMessage: string) {
      state.auth.isAuthenticated = false;
      state.auth.errorMessage = errorMessage;
    },
    SET_LOGOUT(state) {
      state.auth.isAuthenticated = false;
      state.auth.errorMessage = null;
    },
    ADD_CUSTOM_PRESET(state, preset: CustomPreset) {
      state.bed.customPresets.push(preset);
    }
  },
  actions: {
    applyPreset({ commit, state }, preset: PresetType) {
      if (state.bed.isLocked) return;
      
      const position = PRESET_POSITIONS[preset];
      commit('SET_BED_POSITION', position);
    },
    adjustBack({ commit, state }, delta: number) {
      if (state.bed.isLocked) return;
      
      const newBack = state.bed.position.back + delta;
      commit('SET_BACK_POSITION', newBack);
    },
    adjustLeg({ commit, state }, delta: number) {
      if (state.bed.isLocked) return;
      
      const newLeg = state.bed.position.leg + delta;
      commit('SET_LEG_POSITION', newLeg);
    },
    adjustHeight({ commit, state }, delta: number) {
      if (state.bed.isLocked) return;
      
      const newHeight = state.bed.position.height + delta;
      commit('SET_HEIGHT_POSITION', newHeight);
    },
    initializeSettings({ commit }) {
      const savedFontSize = localStorage.getItem('fontSize') as 'standard' | 'large' | null;
      if (savedFontSize) {
        commit('SET_FONT_SIZE', savedFontSize);
      }
    },
    async login({ commit }, credentials: LoginCredentials) {
      try {
        // 固定の認証情報をチェック
        if (credentials.email === 'demo@example.com' && credentials.password === 'demo1234') {
          commit('SET_AUTH_SUCCESS');
          return true;
        } else {
          commit('SET_AUTH_ERROR', 'メールアドレスまたはパスワードが正しくありません');
          return false;
        }
      } catch (error) {
        commit('SET_AUTH_ERROR', 'ログインエラーが発生しました');
        return false;
      }
    },
    logout({ commit }) {
      commit('SET_LOGOUT');
    },
    addCustomPreset({ commit }, { name, position }: { name: string; position: BedPosition }) {
      const preset: CustomPreset = {
        id: `custom-${Symbol().toString()}`,
        name,
        position: { ...position }
      };
      commit('ADD_CUSTOM_PRESET', preset);
    },
    applyCustomPreset({ commit, state }, presetId: string) {
      if (state.bed.isLocked) return;
      
      const preset = state.bed.customPresets.find(p => p.id === presetId);
      if (preset) {
        commit('SET_BED_POSITION', preset.position);
      }
    }
  },
  getters: {
    bedPosition: state => state.bed.position,
    isLocked: state => state.bed.isLocked,
    batteryLevel: state => state.bed.batteryLevel,
    fontSize: state => state.settings.fontSize,
    isAuthenticated: state => state.auth.isAuthenticated,
    authError: state => state.auth.errorMessage,
    customPresets: state => state.bed.customPresets
  }
});