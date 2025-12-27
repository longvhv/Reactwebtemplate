/**
 * Service Registry
 * Dynamic service discovery for microservice architecture
 */

import { env } from '../config/env';
import { logger } from './logger';

interface ServiceEndpoint {
  name: string;
  url: string;
  version?: string;
  healthy?: boolean;
  lastCheck?: number;
}

interface ServiceRegistry {
  [serviceName: string]: ServiceEndpoint;
}

class ServiceDiscovery {
  private registry: ServiceRegistry = {};
  private apiGatewayUrl: string;
  private healthCheckInterval: number = 60000; // 1 minute
  private healthCheckTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.apiGatewayUrl = env.apiGatewayUrl;
    this.initializeDefaultServices();

    if (env.enableServiceDiscovery) {
      this.startHealthChecks();
    }
  }

  /**
   * Initialize default services from environment
   */
  private initializeDefaultServices(): void {
    const defaultServices: ServiceRegistry = {};

    // Add services from environment variables
    if (env.authServiceUrl) {
      defaultServices['auth'] = {
        name: 'auth',
        url: env.authServiceUrl,
        healthy: true,
      };
    }

    if (env.userServiceUrl) {
      defaultServices['user'] = {
        name: 'user',
        url: env.userServiceUrl,
        healthy: true,
      };
    }

    if (env.profileServiceUrl) {
      defaultServices['profile'] = {
        name: 'profile',
        url: env.profileServiceUrl,
        healthy: true,
      };
    }

    this.registry = defaultServices;
    logger.info('Service registry initialized', { services: Object.keys(defaultServices) });
  }

  /**
   * Register a service
   */
  registerService(service: ServiceEndpoint): void {
    this.registry[service.name] = {
      ...service,
      healthy: true,
      lastCheck: Date.now(),
    };
    logger.info('Service registered', { service: service.name, url: service.url });
  }

  /**
   * Unregister a service
   */
  unregisterService(serviceName: string): void {
    if (this.registry[serviceName]) {
      delete this.registry[serviceName];
      logger.info('Service unregistered', { service: serviceName });
    }
  }

  /**
   * Get service endpoint
   */
  getServiceEndpoint(serviceName: string): string | null {
    const service = this.registry[serviceName];

    if (!service) {
      logger.warn('Service not found in registry', { service: serviceName });
      // Fallback to API Gateway
      return this.apiGatewayUrl;
    }

    if (!service.healthy) {
      logger.warn('Service is unhealthy, using fallback', { service: serviceName });
      // Fallback to API Gateway
      return this.apiGatewayUrl;
    }

    return service.url;
  }

  /**
   * Get all registered services
   */
  getAllServices(): ServiceRegistry {
    return { ...this.registry };
  }

  /**
   * Check if service is available
   */
  isServiceAvailable(serviceName: string): boolean {
    const service = this.registry[serviceName];
    return service ? service.healthy === true : false;
  }

  /**
   * Health check for a service
   */
  private async checkServiceHealth(serviceName: string): Promise<boolean> {
    const service = this.registry[serviceName];
    if (!service) return false;

    try {
      const healthUrl = `${service.url}/health`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const isHealthy = response.ok;
      this.registry[serviceName] = {
        ...service,
        healthy: isHealthy,
        lastCheck: Date.now(),
      };

      if (!isHealthy) {
        logger.warn('Service health check failed', {
          service: serviceName,
          status: response.status,
        });
      }

      return isHealthy;
    } catch (error) {
      logger.error('Service health check error', error, { service: serviceName });
      this.registry[serviceName] = {
        ...service,
        healthy: false,
        lastCheck: Date.now(),
      };
      return false;
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    logger.info('Starting service health checks');

    this.healthCheckTimer = setInterval(() => {
      Object.keys(this.registry).forEach((serviceName) => {
        this.checkServiceHealth(serviceName);
      });
    }, this.healthCheckInterval);
  }

  /**
   * Stop health checks
   */
  stopHealthChecks(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
      logger.info('Service health checks stopped');
    }
  }

  /**
   * Fetch services from API Gateway (if service discovery is enabled)
   */
  async fetchServicesFromGateway(): Promise<void> {
    if (!env.enableServiceDiscovery) return;

    try {
      const response = await fetch(`${this.apiGatewayUrl}/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }

      const services: ServiceEndpoint[] = await response.json();

      services.forEach((service) => {
        this.registerService(service);
      });

      logger.info('Services fetched from gateway', { count: services.length });
    } catch (error) {
      logger.error('Failed to fetch services from gateway', error);
    }
  }

  /**
   * Build service URL with path
   */
  buildServiceUrl(serviceName: string, path: string): string {
    const baseUrl = this.getServiceEndpoint(serviceName);
    
    if (!baseUrl) {
      // Fallback: use API Gateway with service name as prefix
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `${this.apiGatewayUrl}/${serviceName}${cleanPath}`;
    }

    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    return `${base}${cleanPath}`;
  }
}

// Export singleton instance
export const serviceRegistry = new ServiceDiscovery();
export default serviceRegistry;
