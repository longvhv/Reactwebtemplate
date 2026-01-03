/**
 * API Types - TypeScript interfaces corresponding to Golang structs
 * These types match the API responses from the Golang backend
 */

// ============================================================
// Common Types
// ============================================================

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  message?: string;
  timestamp: string;
}

export interface APIPaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  timestamp: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================
// Authentication Types (matches internal/auth/model.go)
// ============================================================

export interface User {
  id: string;
  userId: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'locked';

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
}

export interface Session {
  id: string;
  sessionId: string;
  userId: string;
  refreshToken: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: string;
  createdAt: string;
}

// ============================================================
// Authentication Request/Response Types
// ============================================================

export interface RegisterRequest {
  emailAddress: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface RegisterResponse {
  userId: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface LoginRequest {
  emailAddress: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ForgotPasswordRequest {
  emailAddress: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ============================================================
// User Management Types (matches internal/user/model.go)
// ============================================================

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

export interface ListUsersParams extends PaginationParams {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

// ============================================================
// Platform Types (matches internal/platform/model.go)
// ============================================================

export interface PlatformSettings {
  settingsId: string;
  platformName: string;
  platformLogo: string;
  supportedLanguages: string[];
  defaultLanguage: string;
  theme: PlatformTheme;
  features: PlatformFeatures;
  updatedAt: string;
}

export interface PlatformTheme {
  primaryColor: string;
  backgroundColor: string;
  fontFamily: string;
}

export interface PlatformFeatures {
  authentication: boolean;
  userManagement: boolean;
  i18n: boolean;
  darkMode: boolean;
}

export interface UpdatePlatformSettingsRequest {
  platformName?: string;
  platformLogo?: string;
  defaultLanguage?: string;
  theme?: Partial<PlatformTheme>;
  features?: Partial<PlatformFeatures>;
}

// ============================================================
// Navigation Types (matches internal/platform/navigation/model.go)
// ============================================================

export interface NavigationItem {
  navigationId: string;
  title: string;
  path: string;
  icon: string;
  order: number;
  isActive: boolean;
  permission?: string;
  parentId?: string;
  children?: NavigationItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNavigationRequest {
  title: string;
  path: string;
  icon: string;
  order: number;
  isActive: boolean;
  permission?: string;
  parentId?: string;
}

export interface UpdateNavigationRequest {
  title?: string;
  path?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  permission?: string;
}

// ============================================================
// System Types
// ============================================================

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: 'healthy' | 'unhealthy';
    cache: 'healthy' | 'unhealthy';
  };
}

export interface VersionInfo {
  version: string;
  buildDate: string;
  environment: string;
  goVersion: string;
}

// ============================================================
// Error Codes
// ============================================================

export enum APIErrorCode {
  SUCCESS = 'SUCCESS',
  CREATED = 'CREATED',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_NOT_VERIFIED = 'ACCOUNT_NOT_VERIFIED',
  INVALID_CURRENT_PASSWORD = 'INVALID_CURRENT_PASSWORD',
}

// ============================================================
// MongoDB Collection Names (snake_case)
// ============================================================

export enum MongoCollection {
  USER_ACCOUNTS = 'user_accounts',
  AUTH_SESSIONS = 'auth_sessions',
  PLATFORM_SETTINGS = 'platform_settings',
  NAVIGATION_ITEMS = 'navigation_items',
  SYSTEM_LOGS = 'system_logs',
}

// ============================================================
// Type Guards
// ============================================================

export function isAPIError(response: unknown): response is APIResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    (response as APIResponse).success === false &&
    'error' in response
  );
}

export function isAPISuccess<T>(response: unknown): response is APIResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    (response as APIResponse).success === true &&
    'data' in response
  );
}

export function isPaginatedResponse<T>(
  response: unknown
): response is APIPaginatedResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    'data' in response &&
    'pagination' in response &&
    Array.isArray((response as APIPaginatedResponse).data)
  );
}
