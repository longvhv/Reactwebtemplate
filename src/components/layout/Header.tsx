import { memo, useState, useEffect } from "react";
import { Menu, X, Sparkles, Search, Command, Clock, ArrowRight, BarChart, Settings, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { CommandPalette } from "./CommandPalette";
import { Breadcrumb } from "./Breadcrumb";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { QuickActionsDropdown } from "./QuickActionsDropdown";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { LoadingBar } from "./LoadingBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { HeaderProps, LanguageCode } from "../../types";
import { LANGUAGES, MOCK_RECENT_SEARCHES } from "../../constants/navigation";
import { APP_CONFIG, LAYOUT_CONFIG } from "../../constants/app";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";

/**
 * Enterprise Header Component - V2.0
 * 
 * NEW FEATURES:
 * - 🌍 Language Selector with flags
 * - 🔔 Real-time notification badge
 * - ⚡ Quick actions with keyboard shortcuts
 * - 🔍 Enhanced search with recent searches
 * - 💫 Smooth transitions & animations
 * 
 * EXISTING FEATURES:
 * - Glassmorphism with backdrop blur
 * - Command Palette (⌘K)
 * - Breadcrumb navigation
 * - Notifications dropdown
 * - User profile dropdown
 * - Responsive design
 */
export const Header = memo(({ 
  sidebarOpen, 
  onToggleSidebar, 
  theme, 
  actualTheme,
  onCycleTheme,
  onSetTheme,
  sidebarCollapsed
}: HeaderProps) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("vi");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentLanguage = LANGUAGES.find(lang => lang.code === language);
  const recentSearches = MOCK_RECENT_SEARCHES;

  // Keyboard shortcut for search
  useKeyboardShortcut({
    key: 'k',
    modifiers: ['cmd', 'ctrl'],
    callback: () => setCommandPaletteOpen(true),
  });

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setSearchFocused(false);
      }
    };

    if (searchFocused) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [searchFocused]);

  return (
    <>
      {/* Loading Progress Bar */}
      <LoadingBar />

      <header className={`fixed top-0 right-0 left-0 z-30 glass border-b border-border/40 transition-all duration-300 ${sidebarCollapsed ? 'lg:left-20' : 'lg:left-64'}`}>
        {/* Main Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          {/* Left Section */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden hover:scale-105 active:scale-95 transition-transform duration-150 flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Mobile Logo */}
            <div className="flex items-center gap-2 lg:hidden flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-sm md:text-base font-semibold tracking-tight">{APP_CONFIG.name}</h1>
            </div>

            {/* Enhanced Search Bar (Desktop) */}
            <div className="hidden md:block relative search-container">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-muted/70 transition-all duration-200 min-w-[300px] lg:min-w-[360px] group border border-border/40 hover:border-primary/30 hover:shadow-sm">
                <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hoặc nhảy đến..."
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                />
                <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-background/80 text-muted-foreground border border-border/40 group-hover:border-primary/30 transition-colors duration-200">
                  <Command className="w-3 h-3" />
                  <span className="font-medium">K</span>
                </div>
              </div>

              {/* Dropdown - Tìm kiếm gần đây */}
              {searchFocused && (
                <div className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-xl border border-border/40 shadow-xl rounded-b-xl mt-1 max-h-[300px] overflow-y-auto animate-in fade-in-0 slide-in-from-top-2 duration-200 z-50">
                  <div className="p-3">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Tìm kiếm gần đây
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {recentSearches.map(search => {
                        const Icon = search.icon;
                        return (
                          <button
                            key={search.id}
                            className="w-full flex items-center gap-3 py-2 px-3 hover:bg-primary/10 rounded-lg transition-all duration-150 group cursor-pointer text-left"
                            onClick={() => {
                              setSearchQuery(search.text);
                              setSearchFocused(false);
                            }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-150">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm text-foreground flex-1">{search.text}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {/* Search (Mobile) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCommandPaletteOpen(true)}
              className="md:hidden hover:scale-105 active:scale-95 transition-transform duration-150"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all duration-150 group"
                  aria-label="Change language"
                >
                  <span className="text-base group-hover:scale-110 transition-transform duration-200">
                    {currentLanguage?.flag}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as LanguageCode)}
                    className={`flex items-center gap-3 cursor-pointer ${
                      language === lang.code ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="flex-1">{lang.name}</span>
                    {language === lang.code && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* Quick Actions */}
            <QuickActionsDropdown />

            {/* User Menu */}
            <UserProfileDropdown theme={theme} onCycleTheme={onCycleTheme} />
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="hidden lg:block px-6 py-2 border-t border-border/20 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <Breadcrumb />
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)} 
      />
    </>
  );
});

Header.displayName = "Header";