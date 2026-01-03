import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark"; // Theme thực tế đang được áp dụng
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

/**
 * Theme Provider
 * 
 * Quản lý theme (light/dark) cho toàn bộ ứng dụng.
 * Hỗ trợ:
 * - Light mode
 * - Dark mode  
 * - System preference (tự động theo hệ thống)
 * - Lưu preference vào localStorage
 */
export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return defaultTheme;
    }
    const stored = localStorage.getItem("vhv-theme") as Theme;
    return stored || defaultTheme;
  });

  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  // Áp dụng theme
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let applied: "light" | "dark" = "light";

    if (theme === "system") {
      // ✅ Guard: matchMedia not available on React Native
      const systemTheme = (typeof window !== 'undefined' && window.matchMedia)
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : "light"; // Default to light on React Native
      applied = systemTheme;
    } else {
      applied = theme;
    }

    root.classList.add(applied);
    setActualTheme(applied);
  }, [theme]);

  // Lắng nghe thay đổi system preference
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (theme !== "system") return;

    // ✅ Guard: matchMedia not available on React Native
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
      setActualTheme(systemTheme);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  // Lưu theme vào localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    localStorage.setItem("vhv-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook để sử dụng theme
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme phải được sử dụng trong ThemeProvider");
  }
  return context;
}