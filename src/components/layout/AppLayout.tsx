'use client';

import { useState, useEffect, useMemo, memo, ReactNode } from "react";
import { useLocation, useNavigation } from "@/shims/router";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  HelpCircle, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Pin,
  TrendingUp,
  UserCircle,
  BookOpen
} from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { Tooltip } from "@/components/ui/Tooltip";

// Navigation routes - Translation keys mapped
const navigationRoutes = [
  {
    path: '/dashboard',
    nameKey: 'navigation.dashboard',
    icon: LayoutDashboard,
    group: 'main'
  },
  {
    path: '/users',
    nameKey: 'navigation.users',
    icon: Users,
    group: 'main'
  },
  {
    path: '/dev-docs',
    nameKey: 'navigation.devDocs',
    icon: BookOpen,
    group: 'main'
  },
  {
    path: '/settings',
    nameKey: 'navigation.settings',
    icon: Settings,
    group: 'main'
  },
  {
    path: '/profile',
    nameKey: 'navigation.profile',
    icon: UserCircle,
    group: 'main'
  },
  {
    path: '/help',
    nameKey: 'navigation.help',
    icon: HelpCircle,
    group: 'support'
  },
];

// Memoized Navigation Item
const NavigationItem = memo(({ route, icon, name, isPinned, onTogglePin }: {
  route: any;
  icon?: React.ReactNode;
  name: string;
  isPinned?: boolean;
  onTogglePin?: () => void;
}) => {
  const location = useLocation();
  const navigation = useNavigation();
  const isActive = location.pathname === route.path;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use navigate for client-side navigation
    navigation.push(route.path);
  };

  return (
    <div className="group relative">
      <div className="relative flex items-center">
        {/* Navigation Button */}
        <button
          onClick={handleClick}
          className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden ${
            isActive
              ? "bg-gradient-to-r from-[#6366f1] to-[#6366f1]/90 text-white shadow-lg shadow-[#6366f1]/20"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {/* Active indicator */}
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
          )}
          
          {/* Icon */}
          {icon && (
            <div className={`flex items-center justify-center transition-transform duration-200 ${
              isActive ? "scale-110" : "group-hover:scale-105"
            }`}>
              {icon}
            </div>
          )}
          
          {/* Name */}
          <span className="flex-1 font-medium text-left">
            {name}
          </span>

          {/* Trending indicator for active routes */}
          {isActive && (
            <div className="flex items-center gap-1 text-xs opacity-70">
              <TrendingUp className="h-3 w-3" />
            </div>
          )}
        </button>

        {/* Pin button - OUTSIDE navigation button */}
        {onTogglePin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTogglePin();
            }}
            className={`absolute right-2 p-1 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
              isPinned ? "text-yellow-500" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Pin className={`h-4 w-4 ${isPinned ? "fill-current" : ""}`} />
          </button>
        )}
      </div>
    </div>
  );
});

NavigationItem.displayName = 'NavigationItem';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const location = useLocation();
  const navigation = useNavigation();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pinnedRoutes, setPinnedRoutes] = useState<string[]>([]);

  // Load saved preferences
  useEffect(() => {
    const savedPinned = localStorage.getItem('pinnedRoutes');
    const savedSidebarState = localStorage.getItem('sidebarOpen');

    if (savedPinned) {
      setPinnedRoutes(JSON.parse(savedPinned));
    }
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  // Toggle pin route
  const togglePinRoute = (path: string) => {
    setPinnedRoutes((prev) => {
      const newPinned = prev.includes(path)
        ? prev.filter((p) => p !== path)
        : [...prev, path];
      localStorage.setItem('pinnedRoutes', JSON.stringify(newPinned));
      return newPinned;
    });
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const newState = !prev;
      localStorage.setItem('sidebarOpen', JSON.stringify(newState));
      return newState;
    });
  };

  // Get pinned route objects
  const pinnedRouteObjects = useMemo(() => {
    return navigationRoutes.filter((route) => pinnedRoutes.includes(route.path));
  }, [pinnedRoutes]);

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg">BasicSoft</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className={`${!sidebarOpen ? "mx-auto" : ""}`}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Pinned Routes */}
          {sidebarOpen && pinnedRouteObjects.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Pin className="h-3 w-3" />
                <span>Pinned</span>
              </div>
              {pinnedRouteObjects.map((route: any) => (
                <NavigationItem
                  key={route.path}
                  route={route}
                  icon={<route.icon className="h-5 w-5" />}
                  name={route.name}
                  isPinned={true}
                  onTogglePin={() => togglePinRoute(route.path)}
                />
              ))}
            </div>
          )}

          {/* Main Navigation */}
          <div className="space-y-2">
            {navigationRoutes.map((route) => (
              <Tooltip key={route.path} content={t(route.nameKey)} side="right" disabled={sidebarOpen}>
                <div>
                  <NavigationItem
                    route={route}
                    icon={<route.icon className="h-5 w-5" />}
                    name={sidebarOpen ? t(route.nameKey) : ""}
                    isPinned={pinnedRoutes.includes(route.path)}
                    onTogglePin={sidebarOpen ? () => togglePinRoute(route.path) : undefined}
                  />
                </div>
              </Tooltip>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}