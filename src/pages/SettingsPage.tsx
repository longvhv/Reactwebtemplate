/**
 * Settings Page - Re-export
 * 
 * Location: /pages/SettingsPage.tsx
 * Purpose: Re-export từ /app/ cho Vite routing
 * 
 * CONVENTION:
 * - Code chính ở /app/(dashboard)/settings/page.tsx
 * - File này CHỈ re-export, KHÔNG có logic
 */

export { default as SettingsPage } from '@/app/(dashboard)/settings/page';