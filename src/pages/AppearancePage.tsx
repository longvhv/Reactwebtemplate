/**
 * Appearance Page - Re-export
 * 
 * Location: /pages/AppearancePage.tsx
 * Purpose: Re-export từ /app/ cho Vite routing
 * 
 * CONVENTION:
 * - Code chính ở /app/(dashboard)/appearance/page.tsx
 * - File này CHỈ re-export, KHÔNG có logic
 */

export { default as AppearancePage } from '@/app/(dashboard)/appearance/page';
