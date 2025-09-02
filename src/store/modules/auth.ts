import { Module } from 'vuex';
import { LoginCredentials, RootState } from '@/types';
import { StorageService } from '@/services/storage';

const initializeAuthState = () => {
  const savedAuth = StorageService.get<{ isAuthenticated: boolean }>('AUTH_STATE');
  return {
    isAuthenticated: savedAuth?.isAuthenticated || false,
    errorMessage: null as string | null
  };
};

export interface AuthModuleState {
  isAuthenticated: boolean;
  errorMessage: string | null;
}

const authModule: Module<AuthModuleState, RootState> = {
  namespaced: true,
  
  state: () => initializeAuthState(),

  mutations: {
    SET_AUTH_SUCCESS(state) {
      state.isAuthenticated = true;
      state.errorMessage = null;
      StorageService.set('AUTH_STATE', { isAuthenticated: true });
    },
    SET_AUTH_ERROR(state, errorMessage: string) {
      state.isAuthenticated = false;
      state.errorMessage = errorMessage;
      StorageService.remove('AUTH_STATE');
    },
    SET_LOGOUT(state) {
      state.isAuthenticated = false;
      state.errorMessage = null;
      StorageService.remove('AUTH_STATE');
    }
  },

  actions: {
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
    }
  },

  getters: {
    isAuthenticated: state => state.isAuthenticated,
    authError: state => state.errorMessage
  }
};

export default authModule;