/**
 * Data Source Configuration
 * 
 * Centralized configuration for switching between data sources:
 * - 'golang-api': Use Golang backend API
 * - 'supabase': Use Supabase
 * - 'mock': Use mock data for development
 */

export type DataSourceType = 'golang-api' | 'supabase' | 'mock';

interface DataSourceConfig {
  type: DataSourceType;
  endpoints: {
    golangApi: string;
    supabase?: {
      url: string;
      anonKey: string;
    };
  };
}

// Environment-based configuration
const getDataSourceType = (): DataSourceType => {
  const envType = import.meta.env.VITE_DATA_SOURCE as DataSourceType;
  
  // Default to golang-api if not specified
  return envType || 'golang-api';
};

export const dataSourceConfig: DataSourceConfig = {
  type: getDataSourceType(),
  endpoints: {
    // Golang API endpoint
    golangApi: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    
    // Supabase configuration (optional)
    supabase: import.meta.env.VITE_SUPABASE_URL ? {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    } : undefined,
  },
};

/**
 * Check if current data source is Golang API
 */
export const isGolangApi = () => dataSourceConfig.type === 'golang-api';

/**
 * Check if current data source is Supabase
 */
export const isSupabase = () => dataSourceConfig.type === 'supabase';

/**
 * Check if current data source is Mock
 */
export const isMock = () => dataSourceConfig.type === 'mock';

/**
 * Get API base URL based on data source
 */
export const getApiBaseUrl = (): string => {
  if (isGolangApi()) {
    return dataSourceConfig.endpoints.golangApi;
  }
  
  if (isSupabase() && dataSourceConfig.endpoints.supabase) {
    return dataSourceConfig.endpoints.supabase.url;
  }
  
  // Fallback to Golang API
  return dataSourceConfig.endpoints.golangApi;
};

/**
 * Get current data source type
 */
export const getCurrentDataSource = (): DataSourceType => {
  return dataSourceConfig.type;
};

// Export for debugging
if (import.meta.env.DEV) {
  console.log('Data Source Configuration:', {
    type: dataSourceConfig.type,
    apiUrl: getApiBaseUrl(),
  });
}
