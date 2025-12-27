/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and sends to monitoring service
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';
import { env } from '../config/env';
import { logger } from './logger';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  timestamp: number;
}

/**
 * Send metric to monitoring backend
 */
const sendToMonitoring = (metric: WebVitalsMetric): void => {
  if (!env.enableMonitoring) return;

  // Log locally
  logger.info('Web Vitals Metric', metric);

  // Send to monitoring service (e.g., API Gateway)
  if (env.apiGatewayUrl) {
    const endpoint = `${env.apiGatewayUrl}/metrics`;
    
    // Use sendBeacon for better reliability
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(metric)], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      // Fallback to fetch
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
        keepalive: true,
      }).catch((error) => {
        logger.error('Failed to send metrics', error);
      });
    }
  }
};

/**
 * Handle Web Vitals metric
 */
const handleMetric = (metric: Metric): void => {
  const webVitalsMetric: WebVitalsMetric = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating as WebVitalsMetric['rating'],
    delta: metric.delta,
    id: metric.id,
    timestamp: Date.now(),
  };

  sendToMonitoring(webVitalsMetric);
};

/**
 * Initialize Web Vitals monitoring
 */
export const initMonitoring = (): void => {
  if (!env.enableMonitoring) {
    logger.info('Monitoring is disabled');
    return;
  }

  logger.info('Initializing Web Vitals monitoring', {
    service: env.serviceName,
    version: env.serviceVersion,
    environment: env.env,
  });

  // Register Web Vitals callbacks
  onCLS(handleMetric);
  onFID(handleMetric);
  onFCP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);
};

/**
 * Custom performance mark
 */
export const markPerformance = (name: string): void => {
  if (!env.enableMonitoring) return;

  try {
    performance.mark(name);
    logger.debug('Performance mark', { name });
  } catch (error) {
    logger.error('Failed to mark performance', error);
  }
};

/**
 * Measure performance between two marks
 */
export const measurePerformance = (
  name: string,
  startMark: string,
  endMark: string
): void => {
  if (!env.enableMonitoring) return;

  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    
    if (measure) {
      logger.info('Performance measure', {
        name,
        duration: measure.duration,
        startTime: measure.startTime,
      });

      // Send to monitoring
      sendToMonitoring({
        name: `custom.${name}`,
        value: measure.duration,
        rating: 'good',
        delta: measure.duration,
        id: `${name}-${Date.now()}`,
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    logger.error('Failed to measure performance', error);
  }
};

/**
 * Track custom metric
 */
export const trackMetric = (
  name: string,
  value: number,
  metadata?: Record<string, any>
): void => {
  if (!env.enableMonitoring) return;

  const metric: WebVitalsMetric = {
    name: `custom.${name}`,
    value,
    rating: 'good',
    delta: value,
    id: `${name}-${Date.now()}`,
    timestamp: Date.now(),
  };

  logger.info('Custom metric', { ...metric, ...metadata });
  sendToMonitoring(metric);
};

export default {
  initMonitoring,
  markPerformance,
  measurePerformance,
  trackMetric,
};
