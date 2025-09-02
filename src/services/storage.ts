/**
 * localStorage wrapper service
 * Provides type-safe localStorage operations with error handling
 */

const STORAGE_KEYS = {
  AUTH_STATE: 'bed-control-auth',
  CUSTOM_PRESETS: 'bed-control-custom-presets',
  FONT_SIZE: 'bed-control-font-size'
} as const;

export class StorageService {
  /**
   * Get value from localStorage
   */
  static get<T>(key: keyof typeof STORAGE_KEYS): T | null {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key]);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Failed to get ${key} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Set value in localStorage
   */
  static set<T>(key: keyof typeof STORAGE_KEYS, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to set ${key} in localStorage:`, error);
    }
  }

  /**
   * Remove value from localStorage
   */
  static remove(key: keyof typeof STORAGE_KEYS): void {
    try {
      localStorage.removeItem(STORAGE_KEYS[key]);
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error);
    }
  }

  /**
   * Clear all app-related data from localStorage
   */
  static clear(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove ${key} from localStorage:`, error);
      }
    });
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

}

// Export storage keys for use in store
export { STORAGE_KEYS };