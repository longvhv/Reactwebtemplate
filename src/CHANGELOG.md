# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [2.0.0] - 2026-01-19

### 🎯 MAJOR: Next.js Convention Refactor

#### Added

- **Pages Convention System** - Mandatory shim pattern for all pages
  - Created `/app/` as primary code location (Next.js ready)
  - `/pages/` now serves as re-export shim layer for Vite routing
  - Full documentation in [PAGES_CONVENTION.md](./PAGES_CONVENTION.md)

- **Documentation**
  - `/PAGES_CONVENTION.md` - Complete convention guide with templates and examples
  - `/APP_PAGES_REFACTOR_PLAN.md` - Detailed refactor plan and progress tracking
  - `/REFACTOR_COMPLETED.md` - Summary of completed refactor
  - `/CONVENTION_ENFORCEMENT.md` - Enforcement rules and compliance tracking
  - Updated `/README.md` with new convention references

- **File Structure**
  ```
  /app/(dashboard)/          ← NEW: Primary code location
    ├── dashboard/page.tsx
    ├── users/page.tsx
    ├── settings/page.tsx
    ├── profile/page.tsx
    ├── help/page.tsx
    ├── dev-docs/page.tsx
    ├── api-docs/page.tsx
    ├── database-docs/page.tsx
    ├── appearance/page.tsx
    └── business-flow/[flowId]/page.tsx
  
  /pages/                    ← CHANGED: Now re-export only
    ├── SettingsPage.tsx     (re-export from /app/)
    ├── ProfilePage.tsx      (re-export from /app/)
    ├── HelpPage.tsx         (re-export from /app/)
    └── ... (8 shim files)
  ```

#### Changed

- **ALL Pages Refactored** (10/10 pages completed)
  - Moved primary code from `/pages/` to `/app/(dashboard)/`
  - Converted `/pages/` files to pure re-exports
  - Updated `/App.tsx` to import from `/app/` directory

- **API Documentation Page**
  - Moved from `/pages/ApiDocsPage.tsx` to `/app/(dashboard)/api-docs/page.tsx`
  - `/pages/ApiDocsPage.tsx` now re-exports from `/app/`

- **Appearance Page**
  - Moved from `/pages/AppearancePage.tsx` to `/app/(dashboard)/appearance/page.tsx`
  - `/pages/AppearancePage.tsx` now re-exports from `/app/`

- **Database Documentation Page**
  - Moved from `/pages/DatabaseDocsPage.tsx` to `/app/(dashboard)/database-docs/page.tsx`
  - `/pages/DatabaseDocsPage.tsx` now re-exports from `/app/`

- **Development Documentation Page**
  - Moved to `/app/(dashboard)/dev-docs/page.tsx`
  - `/pages/DevDocsPage.tsx` now re-exports from `/app/`

- **Business Flow Detail Page**
  - Moved to `/app/(dashboard)/business-flow/[flowId]/page.tsx`
  - `/pages/BusinessFlowDetailPage.tsx` now re-exports from `/app/`

#### Migration Path

**From:**
```typescript
// /pages/FeaturePage.tsx (OLD)
export function FeaturePage() {
  // All logic here
  return <div>...</div>;
}
```

**To:**
```typescript
// /app/(dashboard)/feature/page.tsx (NEW)
'use client';

export default function FeaturePage() {
  // All logic here
  return <div>...</div>;
}

// /pages/FeaturePage.tsx (SHIM)
export { default as FeaturePage } from '@/app/(dashboard)/feature/page';
```

#### Benefits

1. **Next.js Ready** - Zero code changes needed when migrating to Next.js App Router
2. **Single Source of Truth** - All code in `/app/`, no duplication
3. **Clean Architecture** - Clear separation between production code and routing adapter
4. **Type Safe** - No circular dependencies, clean imports
5. **Maintainable** - Easy to find and update code

#### Breaking Changes

⚠️ **MANDATORY for all new pages:**
- ALL new pages MUST be created in `/app/(dashboard)/`
- `/pages/` MUST only contain re-exports
- Direct imports from `/pages/` are NO LONGER ALLOWED

---

## [1.0.0] - Previous Release

### Features from Previous Versions

- Modular architecture with module registry
- TypeScript support
- Tailwind CSS v4 with dark mode
- Shadcn/ui components
- Service layer pattern
- Custom hooks
- Performance monitoring
- i18n support (6 languages)
- Golang backend API (48+ files)
- Error boundaries
- Loading fallbacks
- Responsive design

---

## Migration Guide (v1 → v2)

### For Existing Code

No changes needed. All existing pages have been refactored.

### For New Pages

**Old Way (v1.x):**
```typescript
// /pages/NewPage.tsx
export function NewPage() {
  return <div>New Page</div>;
}
```

**New Way (v2.x - REQUIRED):**
```typescript
// Step 1: Create in /app/
// /app/(dashboard)/new-page/page.tsx
'use client';
export default function NewPage() {
  return <div>New Page</div>;
}

// Step 2: Create shim in /pages/
// /pages/NewPage.tsx
export { default as NewPage } from '@/app/(dashboard)/new-page/page';

// Step 3: Import from /app/ in App.tsx
import NewPage from './app/(dashboard)/new-page/page';
```

### Verification

After migration, verify:
- ✅ All code in `/app/(dashboard)/`
- ✅ All `/pages/` files are pure re-exports
- ✅ App.tsx imports from `/app/`
- ✅ Build succeeds
- ✅ All pages render correctly

---

## Convention Compliance

### Status: 🔒 MANDATORY

**Progress: 10/10 pages (100%)** ✅

| Page | Status | Location |
|------|--------|----------|
| Dashboard | ✅ | `/app/(dashboard)/dashboard/page.tsx` |
| Users | ✅ | `/app/(dashboard)/users/page.tsx` |
| Settings | ✅ | `/app/(dashboard)/settings/page.tsx` |
| Profile | ✅ | `/app/(dashboard)/profile/page.tsx` |
| Help | ✅ | `/app/(dashboard)/help/page.tsx` |
| DevDocs | ✅ | `/app/(dashboard)/dev-docs/page.tsx` |
| BusinessFlow | ✅ | `/app/(dashboard)/business-flow/[flowId]/page.tsx` |
| ApiDocs | ✅ | `/app/(dashboard)/api-docs/page.tsx` |
| Appearance | ✅ | `/app/(dashboard)/appearance/page.tsx` |
| DatabaseDocs | ✅ | `/app/(dashboard)/database-docs/page.tsx` |

---

## Next Steps

### Immediate (Completed ✅)
- [x] Refactor all 10 pages
- [x] Create convention documentation
- [x] Update README
- [x] Test all pages

### Future
- [ ] Add automated linting rules
- [ ] Add pre-commit hooks
- [ ] Create VS Code snippets
- [ ] Add migration to Next.js App Router
- [ ] Remove `/pages/` directory (after Next.js migration)

---

## Links

- [Pages Convention](./PAGES_CONVENTION.md)
- [Refactor Plan](./APP_PAGES_REFACTOR_PLAN.md)
- [Enforcement Rules](./CONVENTION_ENFORCEMENT.md)
- [README](./README.md)

---

**Last Updated:** January 19, 2026  
**Version:** 2.0.0  
**Status:** ✅ COMPLETED
