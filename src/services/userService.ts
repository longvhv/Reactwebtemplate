/**
 * User Service
 * 
 * High-level service layer for user operations.
 * Uses Repository Pattern to abstract data source (Golang API, Supabase, Mock)
 */

import { getUserRepository } from './RepositoryFactory';
import type {
  User,
  UserFilters,
  UserListResponse,
  CreateUserInput,
  UpdateUserInput,
} from './repositories/IUserRepository';

/**
 * User Service
 * Provides business logic layer on top of repository
 */
class UserService {
  /**
   * Get paginated list of users with filters
   */
  async getUsers(filters?: UserFilters): Promise<UserListResponse> {
    const repository = getUserRepository();
    return repository.getUsers(filters);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const repository = getUserRepository();
    return repository.getUserById(id);
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserInput): Promise<User> {
    // Add business logic validation here if needed
    this.validateEmail(data.email);
    this.validatePassword(data.password);

    const repository = getUserRepository();
    return repository.createUser(data);
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    // Add business logic validation here if needed
    if (data.email) {
      this.validateEmail(data.email);
    }

    const repository = getUserRepository();
    return repository.updateUser(id, data);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    const repository = getUserRepository();
    return repository.deleteUser(id);
  }

  /**
   * Bulk delete users
   */
  async bulkDeleteUsers(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      throw new Error('No users selected for deletion');
    }

    const repository = getUserRepository();
    return repository.bulkDeleteUsers(ids);
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    const repository = getUserRepository();
    return repository.getUserStats();
  }

  /**
   * Search users by query
   */
  async searchUsers(query: string, limit: number = 10): Promise<User[]> {
    const repository = getUserRepository();
    const result = await repository.getUsers({ search: query, limit });
    return result.data;
  }

  // Private validation methods
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  }
}

// Export singleton instance
export const userService = new UserService();
