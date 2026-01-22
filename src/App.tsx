import { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ThemeProvider } from "./providers/ThemeProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import { ModuleRegistry } from "./core/ModuleRegistry";
import { AppLayout } from "./components/layout/AppLayout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingFallback } from "./components/LoadingFallback";
import { PerformanceMonitor } from "./components/PerformanceMonitor";
import { preloadCriticalResources, setupIntelligentPrefetch } from "./utils/preload";
import { initPerformanceMonitoring } from "./utils/performanceMonitoring";
import { DashboardModule } from "./modules/dashboard";
import { AuthModule } from "./modules/auth";
import { SettingsModule } from "./modules/settings";
import { UserModule } from "./modules/user";

// Initialize i18n
import './i18n/config';

// Import page components
import DashboardPage from "./app/(dashboard)/dashboard/page";
import UsersPage from "./app/(dashboard)/users/page";
import SettingsPage from "./app/(dashboard)/settings/page";
import ProfilePage from "./app/(dashboard)/profile/page";
import HelpPage from "./app/(dashboard)/help/page";
import DevDocsPage from "./app/(dashboard)/dev-docs/page";
import BusinessFlowDetailPage from "./app/(dashboard)/business-flow/[flowId]/page";

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
    <AppLayout>
      <Routes>
        {/* Default redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/dev-docs" element={<DevDocsPage />} />
        <Route path="/business-flow/:flowId" element={<BusinessFlowDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/help" element={<HelpPage />} />
        
        {/* Catch-all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      
      {/* Performance Monitor - Development only */}
      {process.env.NODE_ENV === "development" && <PerformanceMonitor />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}