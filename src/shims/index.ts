/**
 * Shims - Central Export
 * 
 * Import everything from here for framework-agnostic code
 * Works in both Vite and Next.js with minimal changes
 */

// Router
export * from './router';

// Components
export * from './components';

// Environment & Config
export * from './env';
export { config } from './env/config';

// API Client
export * from './api';

// Client Component Marker
export { markClientComponent, CLIENT_COMPONENT_PATTERNS } from './client-component';

/**
 * Quick Start:
 * 
 * ```typescript
 * // Instead of framework-specific imports:
 * // ❌ import { Link } from 'react-router-dom';
 * // ❌ import { useRouter } from 'next/navigation';
 * 
 * // Use shims:
 * // ✅ import { Link, useNavigation } from '@/shims';
 * 
 * function MyComponent() {
 *   const navigation = useNavigation();
 *   
 *   return (
 *     <div>
 *       <Link href="/dashboard">Dashboard</Link>
 *       <button onClick={() => navigation.push('/profile')}>
 *         Profile
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 * 
 * Benefits:
 * - ✅ Framework-agnostic code
 * - ✅ Easy migration path
 * - ✅ Consistent API across frameworks
 * - ✅ Type-safe
 * - ✅ Zero runtime overhead
 */
