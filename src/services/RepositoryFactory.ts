/**
 * Repository Factory
 * 
 * Factory pattern to create repository instances based on data source configuration.
 * Provides centralized access to repositories with automatic adapter selection.
 */

import { getCurrentDataSource } from '@/config/dataSource';
import type { IUserRepository } from './repositories/IUserRepository';
import type { IProfileRepository } from './repositories/IProfileRepository';

// Adapters
import { GolangUserRepository, GolangProfileRepository } from './adapters/GolangApiAdapter';
import { SupabaseUserRepository, SupabaseProfileRepository } from './adapters/SupabaseAdapter';
import { MockUserRepository, MockProfileRepository } from './adapters/MockAdapter';

/**
 * Repository Factory Class
 */
class RepositoryFactory {
  private static instance: RepositoryFactory;
  
  private userRepository: IUserRepository | null = null;
  private profileRepository: IProfileRepository | null = null;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get singleton instance
   */
  static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  /**
   * Get User Repository based on current data source
   */
  getUserRepository(): IUserRepository {
    if (!this.userRepository) {
      const dataSource = getCurrentDataSource();
      
      switch (dataSource) {
        case 'golang-api':
          this.userRepository = new GolangUserRepository();
          break;
        
        case 'supabase':
          this.userRepository = new SupabaseUserRepository();
          break;
        
        case 'mock':
          this.userRepository = new MockUserRepository();
          break;
        
        default:
          // Default to Golang API
          this.userRepository = new GolangUserRepository();
      }
    }
    
    return this.userRepository;
  }

  /**
   * Get Profile Repository based on current data source
   */
  getProfileRepository(): IProfileRepository {
    if (!this.profileRepository) {
      const dataSource = getCurrentDataSource();
      
      switch (dataSource) {
        case 'golang-api':
          this.profileRepository = new GolangProfileRepository();
          break;
        
        case 'supabase':
          this.profileRepository = new SupabaseProfileRepository();
          break;
        
        case 'mock':
          this.profileRepository = new MockProfileRepository();
          break;
        
        default:
          // Default to Golang API
          this.profileRepository = new GolangProfileRepository();
      }
    }
    
    return this.profileRepository;
  }

  /**
   * Reset repositories (useful for testing or switching data sources at runtime)
   */
  reset(): void {
    this.userRepository = null;
    this.profileRepository = null;
  }

  /**
   * Get current data source info
   */
  getDataSourceInfo(): {
    type: string;
    userRepository: string;
    profileRepository: string;
  } {
    const dataSource = getCurrentDataSource();
    
    return {
      type: dataSource,
      userRepository: this.userRepository?.constructor.name || 'Not initialized',
      profileRepository: this.profileRepository?.constructor.name || 'Not initialized',
    };
  }
}

// Export singleton instance
export const repositoryFactory = RepositoryFactory.getInstance();

// Convenience exports
export const getUserRepository = () => repositoryFactory.getUserRepository();
export const getProfileRepository = () => repositoryFactory.getProfileRepository();

// Debug helper
if (import.meta.env.DEV) {
  (window as any).__repositoryFactory = repositoryFactory;
  console.log('Repository Factory initialized:', repositoryFactory.getDataSourceInfo());
}
