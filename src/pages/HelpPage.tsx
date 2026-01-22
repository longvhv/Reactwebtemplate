/**
 * Help Page - Re-export
 * 
 * Location: /pages/HelpPage.tsx
 * Purpose: Re-export từ /app/ cho Vite routing
 * 
 * CONVENTION:
 * - Code chính ở /app/(dashboard)/help/page.tsx
 * - File này CHỈ re-export, KHÔNG có logic
 */

export { default as HelpPage } from '@/app/(dashboard)/help/page';