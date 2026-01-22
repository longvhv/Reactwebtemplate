/**
 * Environment Variables Shim
 * 
 * Current: Vite (import.meta.env.VITE_*)
 * Future: Next.js (process.env.NEXT_PUBLIC_*)
 * 
 * Purpose: Abstract env vars for easy migration
 */

// ============================================================================
// CURRENT IMPLEMENTATION: Vite
// ============================================================================

export const env = {
  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'VHV Platform',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_SENTRY: import.meta.env.VITE_ENABLE_SENTRY === 'true',

  // External Services
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',

  // Storage
  STORAGE_PREFIX: import.meta.env.VITE_STORAGE_PREFIX || 'vhv_',

  // Development
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

// Type-safe environment variables
export type Env = typeof env;

// Helper to check if running on server (always false in Vite)
export const isServer = false;
export const isClient = true;

// ============================================================================
// FUTURE: Next.js Implementation (Commented out)
// ============================================================================

/*
export const env = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  API_TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,

  // App Configuration
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'VHV Platform',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',

  // Feature Flags
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
  ENABLE_SENTRY: process.env.NEXT_PUBLIC_ENABLE_SENTRY === 'true',

  // External Services
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',

  // Storage
  STORAGE_PREFIX: process.env.NEXT_PUBLIC_STORAGE_PREFIX || 'vhv_',

  // Development
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  mode: process.env.NODE_ENV || 'development',
} as const;

export type Env = typeof env;

// Helper to check if running on server
export const isServer = typeof window === 'undefined';
export const isClient = typeof window !== 'undefined';
*/

// ============================================================================
// MIGRATION NOTES
// ============================================================================

/**
 * To migrate to Next.js:
 * 
 * 1. Rename environment files:
 *    .env.local (Vite) → .env.local (Next.js) ✅ Same!
 * 
 * 2. Update variable names in .env.local:
 *    ```bash
 *    # Before (Vite)
 *    VITE_API_URL=http://localhost:8080
 *    VITE_APP_NAME=VHV Platform
 *    
 *    # After (Next.js)
 *    NEXT_PUBLIC_API_URL=http://localhost:8080
 *    NEXT_PUBLIC_APP_NAME=VHV Platform
 *    ```
 * 
 * 3. Uncomment Next.js implementation above
 * 4. Comment out Vite implementation
 * 
 * 5. Usage in components (NO CHANGE NEEDED):
 *    ```typescript
 *    import { env } from '@/shims/env';
 *    
 *    console.log(env.API_URL);
 *    console.log(env.APP_NAME);
 *    ```
 * 
 * Server-only variables (Next.js):
 * - Don't need NEXT_PUBLIC_ prefix
 * - Only accessible in server components/API routes
 * - Example: DATABASE_URL, SECRET_KEY
 * 
 * Client-accessible variables:
 * - Must have NEXT_PUBLIC_ prefix (Vite: VITE_ prefix)
 * - Available in browser
 * - Example: API_URL, SENTRY_DSN
 */

export default env;
