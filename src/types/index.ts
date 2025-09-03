export interface BedPosition {
  back: number;
  leg: number;
  height: number;
}

export interface CustomPreset {
  id: string;
  name: string;
  position: BedPosition;
}

export interface BedState {
  position: BedPosition;
  isLocked: boolean;
  batteryLevel: number;
  customPresets: CustomPreset[];
  activePresetType: PresetType | null;
  activeCustomPresetId: string | null;
}

export interface AppSettings {
  fontSize: 'standard' | 'large';
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  errorMessage: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type Role = 'admin' | 'caregiver' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
}

export interface SleepData {
  date: string;
  deepSleep: number;    // 深い眠り (分)
  lightSleep: number;   // 浅い眠り (分)
  awake: number;        // 覚醒 (分)
  totalSleep: number;   // 総睡眠時間 (分)
}

export interface SleepState {
  dailyData: SleepData[];
  weeklyData: SleepData[];
  isLoading: boolean;
  error: string | null;
  selectedPeriod: 'daily' | 'weekly';
}

export interface RootState {
  bed: BedState;
  settings: AppSettings;
  auth: AuthState;
  sleep: SleepState;
}

export type PresetType = 'sleep' | 'reading' | 'eating';