/**
 * Runtime Configuration
 * 
 * Centralized configuration that works in both Vite and Next.js
 */

import { env } from './index';

export const config = {
  // API Configuration
  api: {
    baseUrl: env.API_URL,
    timeout: env.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },

  // App Configuration
  app: {
    name: env.APP_NAME,
    version: env.APP_VERSION,
    environment: env.APP_ENV,
  },

  // Feature Flags
  features: {
    analytics: env.ENABLE_ANALYTICS,
    debug: env.ENABLE_DEBUG,
    sentry: env.ENABLE_SENTRY,
  },

  // External Services
  services: {
    sentry: {
      dsn: env.SENTRY_DSN,
      enabled: env.ENABLE_SENTRY,
      environment: env.APP_ENV,
    },
    analytics: {
      googleId: env.GOOGLE_ANALYTICS_ID,
      enabled: env.ENABLE_ANALYTICS,
    },
  },

  // Storage Configuration
  storage: {
    prefix: env.STORAGE_PREFIX,
    version: 'v1',
  },

  // Pagination Defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // Date/Time Configuration
  datetime: {
    timezone: 'Asia/Ho_Chi_Minh',
    locale: 'vi-VN',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm:ss',
    datetimeFormat: 'DD/MM/YYYY HH:mm:ss',
  },

  // Validation
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecialChar: true,
    },
    username: {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_-]+$/,
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },

  // UI Configuration
  ui: {
    defaultLanguage: 'vi',
    supportedLanguages: ['vi', 'en', 'es', 'zh', 'ja', 'ko'],
    defaultTheme: 'light',
    themes: ['light', 'dark', 'system'],
  },
} as const;

export type Config = typeof config;

export default config;
