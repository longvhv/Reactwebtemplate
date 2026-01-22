/**
 * Profile Page - Re-export
 * 
 * Location: /pages/ProfilePage.tsx
 * Purpose: Re-export từ /app/ cho Vite routing
 * 
 * CONVENTION:
 * - Code chính ở /app/(dashboard)/profile/page.tsx
 * - File này CHỈ re-export, KHÔNG có logic
 */

export { default as ProfilePage } from '@/app/(dashboard)/profile/page';