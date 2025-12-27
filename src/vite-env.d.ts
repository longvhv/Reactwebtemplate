/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_GATEWAY_URL: string;
  readonly VITE_SERVICE_NAME: string;
  readonly VITE_SERVICE_VERSION: string;
  readonly VITE_ENV: string;
  readonly VITE_ENABLE_SERVICE_DISCOVERY: string;
  readonly VITE_ENABLE_MONITORING: string;
  readonly VITE_ENABLE_LOGGING: string;
  readonly VITE_AUTH_SERVICE_URL?: string;
  readonly VITE_USER_SERVICE_URL?: string;
  readonly VITE_PROFILE_SERVICE_URL?: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_LOG_LEVEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
