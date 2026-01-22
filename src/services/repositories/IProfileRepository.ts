/**
 * Profile Repository Interface
 * 
 * Abstract interface for profile data operations.
 * Can be implemented by different data sources (Golang API, Supabase, Mock)
 */

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  bio?: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface Activity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

/**
 * Profile Repository Interface
 */
export interface IProfileRepository {
  /**
   * Get current user profile
   */
  getProfile(): Promise<Profile>;

  /**
   * Update profile
   */
  updateProfile(data: UpdateProfileInput): Promise<Profile>;

  /**
   * Change password
   */
  changePassword(data: ChangePasswordInput): Promise<void>;

  /**
   * Get user activities
   */
  getActivities(limit?: number): Promise<Activity[]>;

  /**
   * Get notification settings
   */
  getNotificationSettings(): Promise<NotificationSettings>;

  /**
   * Update notification settings
   */
  updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings>;

  /**
   * Upload avatar
   */
  uploadAvatar(file: File): Promise<string>;
}
