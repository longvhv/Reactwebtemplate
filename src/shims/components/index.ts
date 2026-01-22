/**
 * Components Shim - Central Export
 * 
 * Import UI components from here for easy Next.js migration
 */

export { Image } from './Image';
export type { ImageProps } from './Image';

export { Head } from './Head';
export type { HeadProps } from './Head';

/**
 * Usage in components:
 * 
 * ```typescript
 * import { Image, Head } from '@/shims/components';
 * 
 * function ProductPage() {
 *   return (
 *     <>
 *       <Head 
 *         title="Product Details"
 *         description="Amazing product"
 *         ogImage="/product.jpg"
 *       />
 *       
 *       <Image 
 *         src="/product.jpg"
 *         alt="Product"
 *         width={600}
 *         height={400}
 *         priority
 *       />
 *     </>
 *   );
 * }
 * ```
 */
