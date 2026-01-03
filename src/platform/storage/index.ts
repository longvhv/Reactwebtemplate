/**
 * Cross-platform Storage Abstraction
 * 
 * Web: Uses localStorage/sessionStorage
 * Native: Uses AsyncStorage from @react-native-async-storage/async-storage
 */

export interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
  multiGet(keys: string[]): Promise<[string, string | null][]>;
  multiSet(keyValuePairs: [string, string][]): Promise<void>;
  multiRemove(keys: string[]): Promise<void>;
}

/**
 * Web implementation using localStorage
 */
class WebStorage implements Storage {
  private storage: globalThis.Storage;

  constructor(storage: globalThis.Storage = localStorage) {
    this.storage = storage;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    try {
      return keys.map(key => [key, this.storage.getItem(key)]);
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return [];
    }
  }

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    try {
      keyValuePairs.forEach(([key, value]) => {
        this.storage.setItem(key, value);
      });
    } catch (error) {
      console.error('Storage multiSet error:', error);
      throw error;
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      keys.forEach(key => {
        this.storage.removeItem(key);
      });
    } catch (error) {
      console.error('Storage multiRemove error:', error);
      throw error;
    }
  }
}

// Create storage instances
export const AsyncStorage: Storage = new WebStorage(
  typeof window !== 'undefined' ? window.localStorage : undefined as any
);

export const SessionStorage: Storage = new WebStorage(
  typeof window !== 'undefined' ? window.sessionStorage : undefined as any
);

// Default export
export default AsyncStorage;

/**
 * Helper functions for common storage operations
 */
export const StorageHelpers = {
  /**
   * Get parsed JSON from storage
   */
  async getJSON<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Failed to parse JSON from storage:', error);
      return null;
    }
  },

  /**
   * Set JSON to storage
   */
  async setJSON<T>(key: string, value: T): Promise<void> {
    try {
      const jsonString = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonString);
    } catch (error) {
      console.error('Failed to stringify and save JSON to storage:', error);
      throw error;
    }
  },

  /**
   * Check if key exists
   */
  async hasKey(key: string): Promise<boolean> {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  },

  /**
   * Get multiple JSON values
   */
  async getMultipleJSON<T>(keys: string[]): Promise<Record<string, T | null>> {
    const items = await AsyncStorage.multiGet(keys);
    const result: Record<string, T | null> = {};

    items.forEach(([key, value]) => {
      if (value) {
        try {
          result[key] = JSON.parse(value) as T;
        } catch {
          result[key] = null;
        }
      } else {
        result[key] = null;
      }
    });

    return result;
  },
};
