/**
 * Logger Utility
 * 
 * Centralized logging system that automatically disables in production
 * for better performance and security
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Log general information (only in development)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log errors (always enabled for debugging)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * Log with emoji prefix for better visibility
   */
  success: (...args: any[]) => {
    if (isDevelopment) {
      console.log("✅", ...args);
    }
  },

  /**
   * Log module registration
   */
  module: (message: string) => {
    if (isDevelopment) {
      console.log(`✓ ${message}`);
    }
  },

  /**
   * Log navigation/routing
   */
  route: (message: string) => {
    if (isDevelopment) {
      console.log(`🔍 ${message}`);
    }
  },

  /**
   * Log i18n/language changes
   */
  i18n: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`🌍 ${message}`, ...args);
    }
  },

  /**
   * Group logs together
   */
  group: (label: string, callback: () => void) => {
    if (isDevelopment) {
      console.group(label);
      callback();
      console.groupEnd();
    }
  },

  /**
   * Performance timing
   */
  time: (label: string) => {
    if (isDevelopment) {
      console.time(label);
    }
  },

  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(label);
    }
  },
};

/**
 * Assert utility for development checks
 */
export const assert = (condition: boolean, message: string) => {
  if (isDevelopment && !condition) {
    console.error(`❌ Assertion failed: ${message}`);
    throw new Error(message);
  }
};

/**
 * Debug utility for verbose logging
 */
export const debug = (...args: any[]) => {
  if (isDevelopment && window.localStorage.getItem("debug") === "true") {
    console.log("🐛", ...args);
  }
};
