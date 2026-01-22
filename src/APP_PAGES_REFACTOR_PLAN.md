# 📂 App/Pages Refactor Plan - Next.js Convention

**Date:** January 19, 2026  
**Status:** ✅ COMPLETED  
**Priority:** HIGH

---

## 🎯 Mục Tiêu

Refactor codebase theo **Next.js App Router convention**:
- **`/app/`** - Code chính (Next.js ready)
- **`/pages/`** - CHỈ re-export từ `/app/` (cho Vite routing hiện tại)

---

## ✅ Completed (10/10 pages) 🎉

### 1. Dashboard
- ✅ `/app/(dashboard)/dashboard/page.tsx` - Code chính
- ✅ App.tsx import trực tiếp từ /app/

### 2. Users
- ✅ `/app/(dashboard)/users/page.tsx` - Code chính
- ✅ App.tsx import trực tiếp từ /app/

### 3. Settings
- ✅ `/app/(dashboard)/settings/page.tsx` - Code chính
- ✅ `/pages/SettingsPage.tsx` - Re-export only
- ✅ App.tsx import trực tiếp từ /app/

### 4. Profile
- ✅ `/app/(dashboard)/profile/page.tsx` - Code chính
- ✅ `/pages/ProfilePage.tsx` - Re-export only
- ✅ App.tsx import trực tiếp từ /app/

### 5. Help
- ✅ `/app/(dashboard)/help/page.tsx` - Code chính
- ✅ `/pages/HelpPage.tsx` - Re-export only
- ✅ App.tsx import trực tiếp từ /app/

### 6. DevDocs ✨
- ✅ `/app/(dashboard)/dev-docs/page.tsx` - Code chính (moved from /pages/)
- ✅ `/pages/DevDocsPage.tsx` - Re-export only
- ✅ App.tsx import trực tiếp từ /app/

### 7. BusinessFlow ✨
- ✅ `/app/(dashboard)/business-flow/[flowId]/page.tsx` - Code chính (moved from /pages/)
- ✅ `/pages/BusinessFlowDetailPage.tsx` - Re-export only
- ✅ App.tsx import trực tiếp từ /app/

### 8. ApiDocs ✨
- ✅ `/app/(dashboard)/api-docs/page.tsx` - Code chính (moved from /pages/)
- ✅ `/pages/ApiDocsPage.tsx` - Re-export only

### 9. Appearance ✨
- ✅ `/app/(dashboard)/appearance/page.tsx` - Code chính (moved from /pages/)
- ✅ `/pages/AppearancePage.tsx` - Re-export only

### 10. DatabaseDocs ✨
- ✅ `/app/(dashboard)/database-docs/page.tsx` - Code chính (moved from /pages/)
- ✅ `/pages/DatabaseDocsPage.tsx` - Re-export only

---

## 📁 Final File Structure

```
/app/
├── (auth)/
│   └── login/
│       └── page.tsx                    ✅ Code chính
└── (dashboard)/
    ├── dashboard/
    │   └── page.tsx                    ✅ Code chính
    ├── users/
    │   └── page.tsx                    ✅ Code chính
    ├── settings/
    │   └── page.tsx                    ✅ Code chính
    ├── profile/
    │   └── page.tsx                    ✅ Code chính
    ├── help/
    │   └── page.tsx                    ✅ Code chính
    ├── dev-docs/
    │   └── page.tsx                    ✅ Code chính
    ├── api-docs/
    │   └── page.tsx                    ✅ Code chính
    ├── database-docs/
    │   └── page.tsx                    ✅ Code chính
    ├── appearance/
    │   └── page.tsx                    ✅ Code chính
    ├── business-flow/
    │   └── [flowId]/
    │       └── page.tsx                ✅ Code chính
    └── layout.tsx                      ✅ Layout

/pages/
├── ApiDocsPage.tsx                     ✅ Re-export only
├── AppearancePage.tsx                  ✅ Re-export only
├── BusinessFlowDetailPage.tsx          ✅ Re-export only
├── DatabaseDocsPage.tsx                ✅ Re-export only
├── DevDocsPage.tsx                     ✅ Re-export only
├── HelpPage.tsx                        ✅ Re-export only
├── ProfilePage.tsx                     ✅ Re-export only
└── SettingsPage.tsx                    ✅ Re-export only
```

---

## 🎨 Convention Rules

### ✅ DO (ĐÚNG)

1. **Code chính trong `/app/`:**
```typescript
// /app/(dashboard)/profile/page.tsx
'use client';

export default function ProfilePage() {
  // Toàn bộ logic ở đây
  return <div>Profile</div>;
}
```

2. **`/pages/` CHỈ re-export:**
```typescript
// /pages/ProfilePage.tsx
export { default as ProfilePage } from '@/app/(dashboard)/profile/page';
```

3. **App.tsx import từ `/app/`:**
```typescript
// /App.tsx
import ProfilePage from './app/(dashboard)/profile/page';
```

---

### ❌ DON'T (SAI)

1. ❌ Code chính trong `/pages/` - KHÔNG được phép
2. ❌ `/pages/` có business logic - SAI
3. ❌ App.tsx import từ `/pages/` - SAI

---

## 📊 Final Progress

| Page | `/app/` Created | `/pages/` Re-export | App.tsx Updated | Status |
|------|----------------|--------------------|--------------------|---------|
| Dashboard | ✅ | N/A | ✅ | ✅ Complete |
| Users | ✅ | N/A | ✅ | ✅ Complete |
| Settings | ✅ | ✅ | ✅ | ✅ Complete |
| Profile | ✅ | ✅ | ✅ | ✅ Complete |
| Help | ✅ | ✅ | ✅ | ✅ Complete |
| DevDocs | ✅ | ✅ | ✅ | ✅ Complete |
| BusinessFlow | ✅ | ✅ | ✅ | ✅ Complete |
| ApiDocs | ✅ | ✅ | ✅ | ✅ Complete |
| Appearance | ✅ | ✅ | ✅ | ✅ Complete |
| DatabaseDocs | ✅ | ✅ | ✅ | ✅ Complete |

**Overall Progress: 10/10 (100%)** 🎉

---

## 🎯 Benefits Achieved

### 1. **Next.js Ready**
- ✅ File structure theo App Router convention
- ✅ Dễ migrate sang Next.js sau này
- ✅ ZERO code changes khi migrate

### 2. **Clear Separation**
- ✅ `/app/` = Production code
- ✅ `/pages/` = Vite routing adapter only

### 3. **Maintainability**
- ✅ Single source of truth
- ✅ No duplicate code
- ✅ Easy to find and update

### 4. **Type Safety**
- ✅ Clean TypeScript imports
- ✅ No circular dependencies
- ✅ Clear module boundaries

---

## 📝 Summary

### What was done:
1. ✅ Created 10 pages in `/app/(dashboard)/`
2. ✅ Updated 8 pages in `/pages/` to re-export only
3. ✅ Updated `/App.tsx` to import from `/app/`
4. ✅ Maintained 100% backward compatibility

### Migration Path to Next.js:
When ready to migrate to Next.js App Router:
1. Update routing from Vite to Next.js
2. Delete `/pages/` directory
3. **ZERO changes needed in `/app/`!** 🎯

---

**Last Updated:** January 19, 2026  
**Status:** COMPLETED ✅  
**Next Steps:** Ready for Next.js migration anytime!
