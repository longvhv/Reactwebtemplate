/**
 * Environment Configuration
 * Centralized access to environment variables
 */

interface EnvironmentConfig {
  // Service Configuration
  apiGatewayUrl: string;
  serviceName: string;
  serviceVersion: string;
  env: 'development' | 'staging' | 'production';

  // Feature Flags
  enableServiceDiscovery: boolean;
  enableMonitoring: boolean;
  enableLogging: boolean;

  // API Endpoints
  authServiceUrl?: string;
  userServiceUrl?: string;
  profileServiceUrl?: string;

  // Configuration
  apiTimeout: number;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue;
};

const getBoolEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const env: EnvironmentConfig = {
  // Service Configuration
  apiGatewayUrl: getEnvVar('VITE_API_GATEWAY_URL', '/api'),
  serviceName: getEnvVar('VITE_SERVICE_NAME', 'react-frontend'),
  serviceVersion: getEnvVar('VITE_SERVICE_VERSION', '1.0.0'),
  env: getEnvVar('VITE_ENV', 'development') as EnvironmentConfig['env'],

  // Feature Flags
  enableServiceDiscovery: getBoolEnvVar('VITE_ENABLE_SERVICE_DISCOVERY', false),
  enableMonitoring: getBoolEnvVar('VITE_ENABLE_MONITORING', true),
  enableLogging: getBoolEnvVar('VITE_ENABLE_LOGGING', true),

  // API Endpoints
  authServiceUrl: getEnvVar('VITE_AUTH_SERVICE_URL'),
  userServiceUrl: getEnvVar('VITE_USER_SERVICE_URL'),
  profileServiceUrl: getEnvVar('VITE_PROFILE_SERVICE_URL'),

  // Configuration
  apiTimeout: getNumberEnvVar('VITE_API_TIMEOUT', 30000),
  logLevel: getEnvVar('VITE_LOG_LEVEL', 'info') as EnvironmentConfig['logLevel'],
};

// Readonly export to prevent modifications
export default Object.freeze(env);
