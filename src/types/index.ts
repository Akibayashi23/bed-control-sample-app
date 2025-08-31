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

export interface RootState {
  bed: BedState;
  settings: AppSettings;
}

export type PresetType = 'sleep' | 'reading' | 'eating';