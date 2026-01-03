import { useState, useEffect, useMemo, memo } from "react";
import { Routes, Route, NavLink, useLocation } from "../../platform/navigation/Router"; // ✅ Use platform abstraction (fixed path)
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  HelpCircle, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Pin,
  Clock,
  Star,
  TrendingUp
} from "lucide-react";
import { ModuleRegistry } from "../../core/ModuleRegistry";
import { useTheme } from "../../providers/ThemeProvider";
import { useTranslation } from "../../providers/LanguageProvider";
import { Button } from "../ui/button";
import { Header } from "./Header";
import { Input } from "../ui/input";
import { Tooltip } from "../ui/Tooltip";
import { NestedMenuItem } from "./NestedMenuItem";
import { MenuBreadcrumb } from "./MenuBreadcrumb";
import { LanguageTest } from "../LanguageTest";

// Memoized Navigation Item with enhanced states
const NavigationItem = memo(({ route, icon, name, onClose, isPinned, onTogglePin }: {
  route: any;
  icon?: React.ReactNode;
  name: string;
  onClose: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
}) => {
  const location = useLocation();
  const isActive = location.pathname === route.path;

  return (
    <div className="group relative">
      <NavLink
        to={route.path}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/20"
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        }`}
      >
        {/* Active indicator */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-in fade-in-0 slide-in-from-left-2 duration-300" />
        )}

        {/* Icon */}
        {icon && (
          <span className={`flex-shrink-0 relative z-10 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`}>
            {icon}
          </span>
        )}

        {/* Label */}
        <span className="font-medium flex-1 relative z-10 truncate">
          {route.title || name}
        </span>

        {/* Pin indicator */}
        {isPinned && !isActive && (
          <Pin className="w-3 h-3 opacity-50" />
        )}
      </NavLink>

      {/* Pin button on hover */}
      {onTogglePin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onTogglePin();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-sidebar-accent/30 transition-all duration-150 z-20"
          aria-label={isPinned ? "Unpin" : "Pin"}
        >
          <Pin className={`w-3 h-3 ${isPinned ? 'text-primary' : 'text-muted-foreground'}`} />
        </button>
      )}
    </div>
  );
});

NavigationItem.displayName = "NavigationItem";

/**
 * Enterprise App Layout - V2.0
 * 
 * NEW SIDEBAR FEATURES:
 * - 🔍 Search modules within sidebar
 * - 📌 Pin favorite routes
 * - ↔️ Collapsible sidebar (compact mode)
 * - 📊 Quick stats in sidebar footer
 * - ⭐ Recently viewed routes
 * - 🎨 Enhanced hover states
 * - 💫 Smooth expand/collapse animations
 * - 🏷️ Category grouping
 * 
 * EXISTING FEATURES:
 * - Professional header
 * - Glassmorphism design
 * - Responsive layout
 * - Performance optimized
 */
export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedRoutes, setPinnedRoutes] = useState<string[]>([]);
  const [recentRoutes, setRecentRoutes] = useState<string[]>([]);

  const { theme, setTheme, actualTheme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation(); // Add this line to get location from hook
  const registry = ModuleRegistry.getInstance();
  
  // Memoize modules and routes
  const modules = useMemo(() => registry.getEnabledModules(), []);
  const routes = useMemo(() => registry.getAllRoutes(), []);

  const cycleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  // Toggle pin route
  const togglePin = (path: string) => {
    setPinnedRoutes(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  // Filter modules based on search
  const filteredModules = useMemo(() => {
    if (!searchQuery) return modules;
    
    return modules.filter(module => {
      const nameMatch = module.name.toLowerCase().includes(searchQuery.toLowerCase());
      const routeMatch = module.routes.some(route => 
        (route.title || module.name).toLowerCase().includes(searchQuery.toLowerCase())
      );
      return nameMatch || routeMatch;
    });
  }, [modules, searchQuery]);

  // Get pinned routes data
  const pinnedRoutesData = useMemo(() => {
    return routes.filter(route => pinnedRoutes.includes(route.path));
  }, [routes, pinnedRoutes]);

  // Track recent routes
  useEffect(() => {
    const currentPath = location.pathname; // Use location from useLocation hook instead of window.location
    if (currentPath && currentPath !== "/" && !recentRoutes.includes(currentPath)) {
      setRecentRoutes(prev => [currentPath, ...prev.slice(0, 4)]);
    }
  }, [location.pathname, recentRoutes]); // Add dependencies

  const sidebarWidth = sidebarCollapsed ? "w-20" : "w-64";

  return (
    <>
      {/* Ambient gradient background */}
      <div className="ambient-gradient" />
      
      <div className="min-h-screen bg-background transition-colors relative">
        {/* Professional Header */}
        <Header
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          theme={theme}
          actualTheme={actualTheme}
          onCycleTheme={cycleTheme}
          onSetTheme={setTheme}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Sidebar Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-in fade-in-0 duration-300"
            onClick={closeSidebar}
          />
        )}

        {/* Enhanced Glassmorphism Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 h-full ${sidebarWidth} z-50
            glass border-r border-sidebar-border
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
              <NavLink to="/" className={`flex items-center gap-3 group cursor-pointer transition-all duration-300 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                <Tooltip content="VHV Platform" disabled={!sidebarCollapsed}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </Tooltip>
                {!sidebarCollapsed && (
                  <div className="animate-in fade-in-0 slide-in-from-left-2 duration-300">
                    <h1 className="text-base font-semibold tracking-tight">
                      VHV Platform
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      React Framework
                    </p>
                  </div>
                )}
              </NavLink>

              {/* Collapse Toggle (Desktop) */}
              <Tooltip content={sidebarCollapsed ? "Mở rộng" : "Thu gọn"}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebarCollapse}
                  className="hidden lg:flex hover:scale-105 active:scale-95 transition-transform duration-150 h-8 w-8"
                  aria-label="Toggle sidebar collapse"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </Button>
              </Tooltip>
            </div>

            {/* Search (when expanded) */}
            {/* REMOVED - Search functionality */}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {/* Multi-level Menu */}
              {filteredModules
                .filter(module => module.showInSidebar !== false) // Filter out modules with showInSidebar: false
                .map((module) => (
                  <div key={module.id} className="space-y-1">
                    {/* Module Header - REMOVED */}

                    {/* Menu Items */}
                    {module.menuItems ? (
                      // Use nested menu structure
                      module.menuItems.map((item) => (
                        <NestedMenuItem
                          key={item.id}
                          item={item}
                          level={0}
                          collapsed={sidebarCollapsed}
                          onClose={closeSidebar}
                          searchQuery={searchQuery}
                        />
                      ))
                    ) : (
                      // Fallback to routes if no menuItems defined
                      module.routes.map((route) => (
                        <NavigationItem
                          key={route.path}
                          route={route}
                          icon={module.icon}
                          name={module.name}
                          onClose={closeSidebar}
                          isPinned={pinnedRoutes.includes(route.path)}
                          onTogglePin={() => togglePin(route.path)}
                        />
                      ))
                    )}
                  </div>
                ))}

              {/* Empty state when searching */}
              {searchQuery && filteredModules.filter(m => m.showInSidebar !== false).length === 0 && !sidebarCollapsed && (
                <div className="text-center py-8 px-4 animate-in fade-in-0 duration-300">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-muted/50 flex items-center justify-center">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Không tìm thấy module nào
                  </p>
                </div>
              )}
            </nav>

            {/* Footer Stats */}
            <div className="p-4 border-t border-sidebar-border">
              {!sidebarCollapsed ? (
                <div className="space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                  {/* Version Info */}
                  <div className="text-xs text-muted-foreground text-center">
                    <p>Version 2.0.0</p>
                    <p className="mt-0.5">© 2025 VHV Platform</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 animate-in fade-in-0 duration-300">
                  <div className="text-xs text-muted-foreground">v2.0</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`min-h-screen pt-16 lg:pt-[6rem] transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Routes>
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <div className="text-center py-20 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <span className="text-4xl">404</span>
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">
                      {t.errors.notFound}
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      {t.errors.somethingWentWrong}
                    </p>
                    <Button asChild>
                      <a href="/">{t.common.back}</a>
                    </Button>
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </>
  );
}