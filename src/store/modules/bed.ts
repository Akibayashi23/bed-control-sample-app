import { Module } from 'vuex';
import { BedPosition, PresetType, CustomPreset, RootState } from '@/types';
import { StorageService } from '@/services/storage';

const PRESET_POSITIONS: Record<PresetType, BedPosition> = {
  sleep: { back: 0, leg: 0, height: 30 },
  reading: { back: 45, leg: 15, height: 50 },
  eating: { back: 60, leg: 30, height: 70 }
};

const initializeCustomPresets = (): CustomPreset[] => {
  const savedPresets = StorageService.get<CustomPreset[]>('CUSTOM_PRESETS');
  return savedPresets || [];
};

export interface BedModuleState {
  position: BedPosition;
  isLocked: boolean;
  batteryLevel: number;
  customPresets: CustomPreset[];
  activePresetType: PresetType | null;
  activeCustomPresetId: string | null;
}

const bedModule: Module<BedModuleState, RootState> = {
  namespaced: true,
  
  state: () => ({
    position: { back: 0, leg: 0, height: 30 },
    isLocked: false,
    batteryLevel: 85,
    customPresets: initializeCustomPresets(),
    activePresetType: null,
    activeCustomPresetId: null
  }),

  mutations: {
    SET_BED_POSITION(state, position: BedPosition) {
      state.position = { ...position };
    },
    SET_BACK_POSITION(state, back: number) {
      state.position.back = Math.max(0, Math.min(90, back));
    },
    SET_LEG_POSITION(state, leg: number) {
      state.position.leg = Math.max(0, Math.min(45, leg));
    },
    SET_HEIGHT_POSITION(state, height: number) {
      state.position.height = Math.max(20, Math.min(80, height));
    },
    TOGGLE_LOCK(state) {
      state.isLocked = !state.isLocked;
    },
    SET_BATTERY_LEVEL(state, level: number) {
      state.batteryLevel = Math.max(0, Math.min(100, level));
    },
    ADD_CUSTOM_PRESET(state, preset: CustomPreset) {
      state.customPresets.push(preset);
      StorageService.set('CUSTOM_PRESETS', state.customPresets);
    },
    REMOVE_CUSTOM_PRESET(state, presetId: string) {
      state.customPresets = state.customPresets.filter(preset => preset.id !== presetId);
      // Clear active preset if it's being deleted
      if (state.activeCustomPresetId === presetId) {
        state.activeCustomPresetId = null;
      }
      StorageService.set('CUSTOM_PRESETS', state.customPresets);
    },
    SET_ACTIVE_PRESET(state, { type, customId }: { type: PresetType | null; customId: string | null }) {
      state.activePresetType = type;
      state.activeCustomPresetId = customId;
    },
    CLEAR_ACTIVE_PRESET(state) {
      state.activePresetType = null;
      state.activeCustomPresetId = null;
    }
  },

  actions: {
    applyPreset({ commit, state }, preset: PresetType) {
      if (state.isLocked) return;
      
      const position = PRESET_POSITIONS[preset];
      commit('SET_BED_POSITION', position);
      commit('SET_ACTIVE_PRESET', { type: preset, customId: null });
    },
    adjustBack({ commit, state }, delta: number) {
      if (state.isLocked) return;
      
      const newBack = state.position.back + delta;
      commit('SET_BACK_POSITION', newBack);
      commit('CLEAR_ACTIVE_PRESET');
    },
    adjustLeg({ commit, state }, delta: number) {
      if (state.isLocked) return;
      
      const newLeg = state.position.leg + delta;
      commit('SET_LEG_POSITION', newLeg);
      commit('CLEAR_ACTIVE_PRESET');
    },
    adjustHeight({ commit, state }, delta: number) {
      if (state.isLocked) return;
      
      const newHeight = state.position.height + delta;
      commit('SET_HEIGHT_POSITION', newHeight);
      commit('CLEAR_ACTIVE_PRESET');
    },
    addCustomPreset({ commit }, { name, position }: { name: string; position: BedPosition }) {
      const preset: CustomPreset = {
        id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        name,
        position: { ...position }
      };
      commit('ADD_CUSTOM_PRESET', preset);
    },
    applyCustomPreset({ commit, state }, presetId: string) {
      if (state.isLocked) return;
      
      const preset = state.customPresets.find(p => p.id === presetId);
      if (preset) {
        commit('SET_BED_POSITION', preset.position);
        commit('SET_ACTIVE_PRESET', { type: null, customId: presetId });
      }
    },
    removeCustomPreset({ commit }, presetId: string) {
      commit('REMOVE_CUSTOM_PRESET', presetId);
    }
  },

  getters: {
    bedPosition: state => state.position,
    isLocked: state => state.isLocked,
    batteryLevel: state => state.batteryLevel,
    customPresets: state => state.customPresets,
    activePresetType: state => state.activePresetType,
    activeCustomPresetId: state => state.activeCustomPresetId
  }
};

export default bedModule;