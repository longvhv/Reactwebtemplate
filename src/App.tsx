import { useState, useEffect, Suspense } from "react";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ModuleRegistry } from "./core/ModuleRegistry";
import { AppLayout } from "./components/layout/AppLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingFallback } from "./components/LoadingFallback";
import { PerformanceMonitor } from "./components/PerformanceMonitor";
import { BundleAnalyzer } from "./components/BundleAnalyzer";
import { preloadCriticalResources, setupIntelligentPrefetch } from "./utils/preload";
import { initPerformanceMonitoring } from "./utils/performanceMonitoring";
import { DashboardModule } from "./modules/dashboard";
import { AuthModule } from "./modules/auth";
import { SettingsModule } from "./modules/settings";
import { UserModule } from "./modules/user";

/**
 * Register modules immediately (before render)
 * This ensures modules are available when AppLayout mounts
 */
const registry = ModuleRegistry.getInstance();

// Reset registry to prevent duplicates on HMR
if (import.meta.hot) {
  registry.reset();
}

// Performance mark
if (typeof performance !== "undefined") {
  performance.mark("modules-registration-start");
}

// Register modules synchronously
console.log("Registering modules...");
registry.register(DashboardModule);
registry.register(AuthModule);
registry.register(SettingsModule);
registry.register(UserModule);

if (typeof performance !== "undefined") {
  performance.mark("modules-registration-end");
  try {
    performance.measure(
      "modules-registration",
      "modules-registration-start",
      "modules-registration-end"
    );
  } catch (e) {
    // Ignore if measure fails
  }
}

console.log(`✅ Registered ${registry.getAllModules().length} modules`);

/**
 * VHV Platform React Framework
 * 
 * Khung ứng dụng modular với:
 * - Tự động đăng ký module
 * - Theme dark/light
 * - Routing động
 * - Hot Module Replacement ready
 * - Error boundaries
 * - Performance optimizations
 * - Intelligent prefetching
 * - Real-time performance monitoring
 */
function AppContent() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Preload critical resources (fonts, CDN, etc.)
    preloadCriticalResources();
    
    // Setup intelligent prefetching cho navigation links
    const cleanup = setupIntelligentPrefetch();
    
    return cleanup;
  }, []);

  return (
    <>
      <AppLayout />
      {/* Performance Monitor - Development only */}
      {process.env.NODE_ENV === "development" && <PerformanceMonitor />}
      {/* Bundle Analyzer - Development only */}
      {process.env.NODE_ENV === "development" && <BundleAnalyzer />}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}