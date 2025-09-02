export interface BedPosition {
  back: number;
  leg: number;
  height: number;
}

export interface BedState {
  position: BedPosition;
  isLocked: boolean;
  batteryLevel: number;
}

export interface AppSettings {
  fontSize: 'standard' | 'large';
}

export interface AuthState {
  isAuthenticated: boolean;
  errorMessage: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RootState {
  bed: BedState;
  settings: AppSettings;
  auth: AuthState;
}

export type PresetType = 'sleep' | 'reading' | 'eating';