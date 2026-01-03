/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private static marks: Map<string, number> = new Map();

  static start(label: string): void {
    // ✅ Guard for React Native - performance.now() fallback to Date.now()
    const timestamp = typeof performance !== 'undefined' && performance.now 
      ? performance.now() 
      : Date.now();
    this.marks.set(label, timestamp);
  }

  static end(label: string, log = true): number {
    const start = this.marks.get(label);
    if (!start) {
      console.warn(`No start mark found for "${label}"`);
      return 0;
    }

    // ✅ Guard for React Native - performance.now() fallback to Date.now()
    const now = typeof performance !== 'undefined' && performance.now 
      ? performance.now() 
      : Date.now();
    const duration = now - start;
    this.marks.delete(label);

    if (log) {
      console.log(`⚡ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  static measure(label: string, fn: () => void): number {
    this.start(label);
    fn();
    return this.end(label);
  }

  static async measureAsync(label: string, fn: () => Promise<void>): Promise<number> {
    this.start(label);
    await fn();
    return this.end(label);
  }
}