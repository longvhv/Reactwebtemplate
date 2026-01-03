/**
 * Cross-platform Performance Monitoring
 * 
 * Web: Uses native Performance API
 * Native: Uses custom performance tracking
 */

export interface PerformanceMark {
  name: string;
  startTime: number;
  duration?: number;
}

export interface PerformanceMeasure {
  name: string;
  startMark: string;
  endMark: string;
  duration: number;
}

/**
 * Cross-platform Performance API
 */
class PlatformPerformance {
  private marks: Map<string, number> = new Map();
  private measures: PerformanceMeasure[] = [];
  private useNativeAPI: boolean;

  constructor() {
    this.useNativeAPI = typeof performance !== 'undefined' && !!performance.mark;
  }

  /**
   * Create a performance mark
   */
  mark(name: string): void {
    const timestamp = Date.now();
    
    if (this.useNativeAPI) {
      try {
        performance.mark(name);
      } catch (error) {
        console.warn('Performance.mark failed:', error);
      }
    }
    
    this.marks.set(name, timestamp);
  }

  /**
   * Create a performance measure
   */
  measure(name: string, startMark: string, endMark: string): PerformanceMeasure | null {
    const startTime = this.marks.get(startMark);
    const endTime = this.marks.get(endMark);

    if (!startTime || !endTime) {
      console.warn(`Cannot measure: marks "${startMark}" or "${endMark}" not found`);
      return null;
    }

    const duration = endTime - startTime;
    const measure: PerformanceMeasure = {
      name,
      startMark,
      endMark,
      duration,
    };

    this.measures.push(measure);

    if (this.useNativeAPI) {
      try {
        performance.measure(name, startMark, endMark);
      } catch (error) {
        console.warn('Performance.measure failed:', error);
      }
    }

    return measure;
  }

  /**
   * Get all measures
   */
  getMeasures(name?: string): PerformanceMeasure[] {
    if (name) {
      return this.measures.filter(m => m.name === name);
    }
    return [...this.measures];
  }

  /**
   * Clear marks and measures
   */
  clearMarks(name?: string): void {
    if (name) {
      this.marks.delete(name);
      if (this.useNativeAPI) {
        try {
          performance.clearMarks(name);
        } catch (error) {
          console.warn('Performance.clearMarks failed:', error);
        }
      }
    } else {
      this.marks.clear();
      if (this.useNativeAPI) {
        try {
          performance.clearMarks();
        } catch (error) {
          console.warn('Performance.clearMarks failed:', error);
        }
      }
    }
  }

  clearMeasures(name?: string): void {
    if (name) {
      this.measures = this.measures.filter(m => m.name !== name);
      if (this.useNativeAPI) {
        try {
          performance.clearMeasures(name);
        } catch (error) {
          console.warn('Performance.clearMeasures failed:', error);
        }
      }
    } else {
      this.measures = [];
      if (this.useNativeAPI) {
        try {
          performance.clearMeasures();
        } catch (error) {
          console.warn('Performance.clearMeasures failed:', error);
        }
      }
    }
  }

  /**
   * Get current timestamp
   */
  now(): number {
    if (this.useNativeAPI) {
      return performance.now();
    }
    return Date.now();
  }

  /**
   * Time a function execution
   */
  async timeAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startMark = `${name}-start`;
    const endMark = `${name}-end`;

    this.mark(startMark);
    
    try {
      const result = await fn();
      this.mark(endMark);
      const measure = this.measure(name, startMark, endMark);
      
      if (measure) {
        console.log(`⏱️  ${name}: ${measure.duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      this.mark(endMark);
      throw error;
    }
  }

  /**
   * Time a synchronous function
   */
  timeSync<T>(name: string, fn: () => T): T {
    const startMark = `${name}-start`;
    const endMark = `${name}-end`;

    this.mark(startMark);
    
    try {
      const result = fn();
      this.mark(endMark);
      const measure = this.measure(name, startMark, endMark);
      
      if (measure) {
        console.log(`⏱️  ${name}: ${measure.duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      this.mark(endMark);
      throw error;
    }
  }
}

// Export singleton instance
export const platformPerformance = new PlatformPerformance();

// Export convenience functions
export const { mark, measure, clearMarks, clearMeasures, now, timeAsync, timeSync } = platformPerformance;

/**
 * Performance monitoring hook
 */
export function usePerformanceMark(name: string, dependencies: any[] = []) {
  React.useEffect(() => {
    mark(`${name}-start`);
    
    return () => {
      mark(`${name}-end`);
      measure(name, `${name}-start`, `${name}-end`);
    };
  }, dependencies);
}

// Import React for hooks
import React from 'react';
