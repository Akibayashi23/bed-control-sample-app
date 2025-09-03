import { Module } from 'vuex';
import { LoginCredentials, RootState, User, Role } from '@/types';
import { StorageService } from '@/services/storage';

// デモユーザーデータ
const DEMO_USERS: Record<string, User> = {
  'demo@example.com': {
    id: 'user-admin-001',
    email: 'demo@example.com',
    name: '管理者 太郎',
    role: 'admin',
    isActive: true
  },
  'caregiver@example.com': {
    id: 'user-caregiver-001',
    email: 'caregiver@example.com',
    name: '介護士 花子',
    role: 'caregiver',
    isActive: true
  },
  'viewer@example.com': {
    id: 'user-viewer-001',
    email: 'viewer@example.com',
    name: '閲覧者 次郎',
    role: 'viewer',
    isActive: true
  }
};

const initializeAuthState = () => {
  const savedAuth = StorageService.get<{ isAuthenticated: boolean; currentUser: User | null }>('AUTH_STATE');
  return {
    isAuthenticated: savedAuth?.isAuthenticated || false,
    currentUser: savedAuth?.currentUser || null,
    errorMessage: null as string | null
  };
};

export interface AuthModuleState {
  isAuthenticated: boolean;
  currentUser: User | null;
  errorMessage: string | null;
}

const authModule: Module<AuthModuleState, RootState> = {
  namespaced: true,
  
  state: () => initializeAuthState(),

  mutations: {
    SET_AUTH_SUCCESS(state, user: User) {
      state.isAuthenticated = true;
      state.currentUser = user;
      state.errorMessage = null;
      StorageService.set('AUTH_STATE', { 
        isAuthenticated: true, 
        currentUser: user 
      });
    },
    SET_AUTH_ERROR(state, errorMessage: string) {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.errorMessage = errorMessage;
      StorageService.remove('AUTH_STATE');
    },
    SET_LOGOUT(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.errorMessage = null;
      StorageService.remove('AUTH_STATE');
    }
  },

  actions: {
    async login({ commit }, credentials: LoginCredentials) {
      try {
        // デモユーザーの認証チェック
        const user = DEMO_USERS[credentials.email];
        
        if (user && user.isActive && credentials.password === 'demo1234') {
          commit('SET_AUTH_SUCCESS', user);
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
    currentUser: state => state.currentUser,
    userRole: state => state.currentUser?.role || null,
    userName: state => state.currentUser?.name || '',
    authError: state => state.errorMessage
  }
};

export default authModule;