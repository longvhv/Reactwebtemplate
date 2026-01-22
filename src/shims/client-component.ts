/**
 * Client Component Marker Utility
 * 
 * Current: Not needed (Vite - all components are client-side)
 * Future: Next.js requires 'use client' directive
 * 
 * Purpose: Mark components that need client-side features
 */

// ============================================================================
// CURRENT IMPLEMENTATION: No-op
// ============================================================================

/**
 * Marker for components that will need 'use client' in Next.js
 * 
 * In Vite, this does nothing. In Next.js, add 'use client' directive.
 */
export const markClientComponent = () => {
  // No-op in Vite
  // All components are client-side by default
};

// ============================================================================
// FUTURE: Next.js Implementation
// ============================================================================

/**
 * Components that use these features MUST have 'use client':
 * 
 * 1. React Hooks:
 *    - useState, useEffect, useContext, etc.
 * 
 * 2. Browser APIs:
 *    - window, document, localStorage, etc.
 * 
 * 3. Event Handlers:
 *    - onClick, onChange, onSubmit, etc.
 * 
 * 4. React Context:
 *    - Context providers and consumers
 * 
 * Example:
 * ```typescript
 * 'use client';  // Add this line at the top
 * 
 * import { useState } from 'react';
 * 
 * export function Counter() {
 *   const [count, setCount] = useState(0);
 *   return <button onClick={() => setCount(count + 1)}>{count}</button>;
 * }
 * ```
 */

// ============================================================================
// MIGRATION CHECKLIST
// ============================================================================

/**
 * Components that will need 'use client' in Next.js:
 * 
 * ✅ All components using useState/useEffect
 * ✅ All components with event handlers
 * ✅ All components using useContext
 * ✅ All components accessing window/document
 * ✅ All components using browser-only libraries
 * ✅ All providers (LanguageProvider, ThemeProvider, etc.)
 * 
 * ❌ Components that DON'T need 'use client':
 * - Pure presentational components
 * - Components only receiving props
 * - Static content components
 * - Layout components without interactivity
 */

// Helper to identify client components in your codebase
export const CLIENT_COMPONENT_PATTERNS = [
  /useState/,
  /useEffect/,
  /useContext/,
  /useReducer/,
  /useCallback/,
  /useMemo/,
  /useRef/,
  /onClick/,
  /onChange/,
  /onSubmit/,
  /window\./,
  /document\./,
  /localStorage/,
  /sessionStorage/,
];

/**
 * To migrate to Next.js:
 * 
 * 1. Find all components using client features:
 *    ```bash
 *    grep -r "useState\|useEffect" src/ --include="*.tsx"
 *    ```
 * 
 * 2. Add 'use client' directive at the top:
 *    ```typescript
 *    'use client';
 *    
 *    import { useState } from 'react';
 *    // ... rest of component
 *    ```
 * 
 * 3. Review and optimize:
 *    - Can any logic be moved to server components?
 *    - Can data fetching be done server-side?
 *    - Can we reduce client bundle size?
 */

export default markClientComponent;
