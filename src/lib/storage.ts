/**
 * Local Storage Utilities
 * Type-safe localStorage wrapper with error handling
 * 
 * NOTE: This is a synchronous web-only utility for backward compatibility.
 * For cross-platform support, use AsyncStorage from '/platform/storage'
 */

import { STORAGE_KEYS } from '../constants/app';

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/**
 * Get item from localStorage with type safety
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser) return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Set item in localStorage with error handling
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (!isBrowser) return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  if (!isBrowser) return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Clear all app-related items from localStorage
 */
export function clearAppStorage(): boolean {
  if (!isBrowser) return false;
  
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing app storage:', error);
    return false;
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  if (!isBrowser) return false;
  
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}