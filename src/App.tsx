import { useEffect, memo, lazy, Suspense } from "react";
import { Router } from "./platform/navigation/Router";
import { ThemeProvider } from "./providers/ThemeProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import { ModuleRegistry } from "./core/ModuleRegistry";
import { AppLayout } from "./components/layout/AppLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { preloadCriticalResources, setupIntelligentPrefetch } from "./utils/preload";
import { initPerformanceMonitoring } from "./utils/performanceMonitoring";
import { logger } from "./utils/logger";
import { DashboardModule } from "./modules/dashboard";
import { AuthModule } from "./modules/auth";
import { SettingsModule } from "./modules/settings";
import { UserModule } from "./modules/user";

// Lazy load dev-only component for better performance
const PerformanceMonitor = lazy(() => 
  import("./components/PerformanceMonitor").then(m => ({ default: m.PerformanceMonitor }))
);

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
logger.log("Registering modules...");
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

logger.success(`Registered ${registry.getAllModules().length} modules`);

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
const AppContent = memo(function AppContent() {
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
      {/* Performance Monitor - Development only with lazy loading */}
      {process.env.NODE_ENV === "development" && (
        <Suspense fallback={null}>
          <PerformanceMonitor />
        </Suspense>
      )}
    </>
  );
});

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
