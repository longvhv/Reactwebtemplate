/**
 * Profile Service
 * 
 * High-level service layer for profile operations.
 * Uses Repository Pattern to abstract data source (Golang API, Supabase, Mock)
 */

import { getProfileRepository } from './RepositoryFactory';
import type {
  Profile,
  UpdateProfileInput,
  ChangePasswordInput,
  Activity,
  NotificationSettings,
} from './repositories/IProfileRepository';

/**
 * Profile Service
 * Provides business logic layer on top of repository
 */
class ProfileService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<Profile> {
    const repository = getProfileRepository();
    return repository.getProfile();
  }

  /**
   * Update profile
   */
  async updateProfile(data: UpdateProfileInput): Promise<Profile> {
    // Add business logic validation here if needed
    if (data.email) {
      this.validateEmail(data.email);
    }

    if (data.phone) {
      this.validatePhone(data.phone);
    }

    const repository = getProfileRepository();
    return repository.updateProfile(data);
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordInput): Promise<void> {
    // Validate password
    this.validatePassword(data.newPassword);

    // Check if new password is different from current
    if (data.currentPassword === data.newPassword) {
      throw new Error('New password must be different from current password');
    }

    const repository = getProfileRepository();
    return repository.changePassword(data);
  }

  /**
   * Get user activities
   */
  async getActivities(limit: number = 10): Promise<Activity[]> {
    const repository = getProfileRepository();
    return repository.getActivities(limit);
  }

  /**
   * Get notification settings
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    const repository = getProfileRepository();
    return repository.getNotificationSettings();
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(
    settings: NotificationSettings
  ): Promise<NotificationSettings> {
    const repository = getProfileRepository();
    return repository.updateNotificationSettings(settings);
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(file: File): Promise<string> {
    // Validate file
    this.validateAvatarFile(file);

    const repository = getProfileRepository();
    return repository.uploadAvatar(file);
  }

  // Private validation methods
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validatePhone(phone: string): void {
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phone)) {
      throw new Error('Invalid phone number format');
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Additional password strength checks
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      throw new Error(
        'Password must contain uppercase, lowercase, and numbers'
      );
    }
  }

  private validateAvatarFile(file: File): void {
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService();
