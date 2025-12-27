/**
 * Centralized Logging Utility
 * Provides structured logging for microservice integration
 */

import { env } from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  service: string;
  version: string;
  environment: string;
  data?: any;
  error?: {
    message: string;
    stack?: string;
    name?: string;
  };
}

class Logger {
  private serviceName: string;
  private serviceVersion: string;
  private environment: string;
  private logLevel: LogLevel;
  private isEnabled: boolean;

  constructor() {
    this.serviceName = env.serviceName;
    this.serviceVersion = env.serviceVersion;
    this.environment = env.env;
    this.logLevel = env.logLevel;
    this.isEnabled = env.enableLogging;
  }

  /**
   * Check if log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.isEnabled) return false;

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Create structured log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      version: this.serviceVersion,
      environment: this.environment,
    };

    if (data !== undefined) {
      entry.data = data;
    }

    if (error) {
      entry.error = {
        message: error.message,
        name: error.name,
        stack: error.stack,
      };
    }

    return entry;
  }

  /**
   * Output log entry
   */
  private output(entry: LogEntry): void {
    const jsonLog = JSON.stringify(entry);

    // Output based on level
    switch (entry.level) {
      case 'debug':
        console.debug(jsonLog);
        break;
      case 'info':
        console.info(jsonLog);
        break;
      case 'warn':
        console.warn(jsonLog);
        break;
      case 'error':
        console.error(jsonLog);
        break;
    }

    // Send to logging service if available
    this.sendToLoggingService(entry);
  }

  /**
   * Send log to remote logging service
   */
  private sendToLoggingService(entry: LogEntry): void {
    // Only send errors and warnings to remote service to reduce noise
    if (entry.level !== 'error' && entry.level !== 'warn') return;

    if (env.apiGatewayUrl) {
      const endpoint = `${env.apiGatewayUrl}/logs`;
      
      // Use sendBeacon for reliability (non-blocking)
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(entry)], { type: 'application/json' });
        navigator.sendBeacon(endpoint, blob);
      } else {
        // Fallback to fetch
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
          keepalive: true,
        }).catch(() => {
          // Silently fail to avoid recursive errors
        });
      }
    }
  }

  /**
   * Debug log
   */
  debug(message: string, data?: any): void {
    if (!this.shouldLog('debug')) return;
    const entry = this.createLogEntry('debug', message, data);
    this.output(entry);
  }

  /**
   * Info log
   */
  info(message: string, data?: any): void {
    if (!this.shouldLog('info')) return;
    const entry = this.createLogEntry('info', message, data);
    this.output(entry);
  }

  /**
   * Warning log
   */
  warn(message: string, data?: any): void {
    if (!this.shouldLog('warn')) return;
    const entry = this.createLogEntry('warn', message, data);
    this.output(entry);
  }

  /**
   * Error log
   */
  error(message: string, error?: Error | any, data?: any): void {
    if (!this.shouldLog('error')) return;
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const entry = this.createLogEntry('error', message, data, errorObj);
    this.output(entry);
  }

  /**
   * Log API request
   */
  logRequest(method: string, url: string, data?: any): void {
    this.debug('API Request', { method, url, data });
  }

  /**
   * Log API response
   */
  logResponse(method: string, url: string, status: number, data?: any): void {
    this.debug('API Response', { method, url, status, data });
  }

  /**
   * Log API error
   */
  logApiError(method: string, url: string, error: Error | any): void {
    this.error('API Error', error, { method, url });
  }
}

// Export singleton instance
export const logger = new Logger();
export default logger;
