/**
 * Business Flow Detail Page - Re-export
 * 
 * Location: /pages/BusinessFlowDetailPage.tsx
 * Purpose: Re-export từ /app/ cho Vite routing
 * 
 * CONVENTION:
 * - Code chính ở /app/(dashboard)/business-flow/[flowId]/page.tsx
 * - File này CHỈ re-export, KHÔNG có logic
 */

export { default as BusinessFlowDetailPage } from '@/app/(dashboard)/business-flow/[flowId]/page';
