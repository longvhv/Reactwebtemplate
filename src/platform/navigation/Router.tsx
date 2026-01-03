/**
 * Cross-platform Navigation Abstraction
 * 
 * Web: Uses react-router-dom
 * Native: Will use react-navigation
 */

import React from 'react';
import {
  BrowserRouter as WebRouter,
  Routes as WebRoutes,
  Route as WebRoute,
  Navigate as WebNavigate,
  Link as WebLink,
  NavLink as WebNavLink,
  useNavigate as webUseNavigate,
  useLocation as webUseLocation,
  useParams as webUseParams,
  useSearchParams as webUseSearchParams,
} from 'react-router-dom';

// Re-export all router components
export const Router = WebRouter;
export const Routes = WebRoutes;
export const Route = WebRoute;
export const Navigate = WebNavigate;
export const Link = WebLink;
export const NavLink = WebNavLink;

// Re-export hooks using function declarations
export function useNavigate() {
  return webUseNavigate();
}

export function useLocation() {
  return webUseLocation();
}

export function useParams<T extends string = string>() {
  return webUseParams<Record<T, string | undefined>>();
}

export function useSearchParams() {
  return webUseSearchParams();
}

// Export types
export type NavigateFunction = ReturnType<typeof webUseNavigate>;
export type Location = ReturnType<typeof webUseLocation>;
export type Params<T extends string = string> = Record<T, string | undefined>;

/**
 * Navigation service for imperative navigation
 * Useful for navigating outside of React components
 */
class NavigationService {
  private navigator: NavigateFunction | null = null;

  setNavigator(nav: NavigateFunction) {
    this.navigator = nav;
  }

  navigate(to: string | number, options?: any) {
    if (!this.navigator) {
      console.warn('Navigator not set. Call setNavigator first.');
      return;
    }

    if (typeof to === 'number') {
      this.navigator(to);
    } else {
      this.navigator(to, options);
    }
  }

  goBack() {
    this.navigate(-1);
  }

  goForward() {
    this.navigate(1);
  }

  replace(to: string, options?: any) {
    this.navigate(to, { ...options, replace: true });
  }
}

export const navigationService = new NavigationService();

/**
 * Hook to initialize navigation service
 * Call this in your root component
 */
export function useNavigationService() {
  const navigate = webUseNavigate();

  React.useEffect(() => {
    navigationService.setNavigator(navigate);
  }, [navigate]);
}
