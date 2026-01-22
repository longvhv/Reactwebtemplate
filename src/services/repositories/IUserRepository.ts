/**
 * User Repository Interface
 * 
 * Abstract interface for user data operations.
 * Can be implemented by different data sources (Golang API, Supabase, Mock)
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateUserInput {
  name: string;
  email: string;
  role: string;
  department: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  status?: 'active' | 'inactive' | 'pending';
}

/**
 * User Repository Interface
 */
export interface IUserRepository {
  /**
   * Get paginated list of users with filters
   */
  getUsers(filters?: UserFilters): Promise<UserListResponse>;

  /**
   * Get user by ID
   */
  getUserById(id: string): Promise<User>;

  /**
   * Create new user
   */
  createUser(data: CreateUserInput): Promise<User>;

  /**
   * Update user
   */
  updateUser(id: string, data: UpdateUserInput): Promise<User>;

  /**
   * Delete user
   */
  deleteUser(id: string): Promise<void>;

  /**
   * Bulk delete users
   */
  bulkDeleteUsers(ids: string[]): Promise<void>;

  /**
   * Get user statistics
   */
  getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
  }>;
}
