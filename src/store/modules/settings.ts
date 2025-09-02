import { Module } from 'vuex';
import { RootState } from '@/types';
import { StorageService } from '@/services/storage';

const initializeFontSize = (): 'standard' | 'large' => {
  const savedFontSize = StorageService.get<'standard' | 'large'>('FONT_SIZE');
  return savedFontSize || 'standard';
};

export interface SettingsModuleState {
  fontSize: 'standard' | 'large';
}

const settingsModule: Module<SettingsModuleState, RootState> = {
  state: () => ({
    fontSize: initializeFontSize()
  }),

  mutations: {
    SET_FONT_SIZE(state, fontSize: 'standard' | 'large') {
      state.fontSize = fontSize;
      StorageService.set('FONT_SIZE', fontSize);
    }
  },

  getters: {
    fontSize: state => state.fontSize
  }
};

export default settingsModule;