# 📐 Pages Convention - Next.js Shim Pattern

**Status:** 🔒 MANDATORY  
**Áp dụng:** TẤT CẢ pages mới từ ngày 19/01/2026  
**Mục đích:** Sẵn sàng migrate sang Next.js App Router

---

## 🎯 QUY TẮC BẮT BUỘC

### ✅ PHẢI LÀM (MANDATORY)

**1. Code chính LUÔN ở `/app/`**
```typescript
// ✅ ĐÚNG: /app/(dashboard)/new-page/page.tsx
'use client';

export default function NewPage() {
  // Toàn bộ logic, state, hooks, components ở đây
  const [data, setData] = useState();
  
  return (
    <div>
      {/* UI implementation */}
    </div>
  );
}
```

**2. `/pages/` CHỈ re-export (Shim Layer)**
```typescript
// ✅ ĐÚNG: /pages/NewPage.tsx
/**
 * New Page - Re-export
 * 
 * Location: /pages/NewPage.tsx
 * Purpose: Re-export từ /app/ cho Vite routing
 * 
 * CONVENTION:
 * - Code chính ở /app/(dashboard)/new-page/page.tsx
 * - File này CHỈ re-export, KHÔNG có logic
 */

export { default as NewPage } from '@/app/(dashboard)/new-page/page';
```

**3. KHÔNG được có logic ở `/pages/`**
```typescript
// ❌ SAI: KHÔNG BAO GIỜ làm thế này
// /pages/NewPage.tsx
export function NewPage() {
  const [data, setData] = useState(); // ❌ SAI - Logic ở đây
  
  return <div>...</div>; // ❌ SAI - Implementation ở đây
}
```

---

## 📂 File Structure Template

### Khi tạo page mới, LUÔN tạo theo structure:

```
/app/
└── (dashboard)/
    └── new-page/              ← Tên page (kebab-case)
        └── page.tsx           ← Code chính ở đây

/pages/
└── NewPage.tsx                ← Shim re-export (PascalCase)
```

---

## 📝 Template Cho Page Mới

### Template 1: `/app/(dashboard)/[page-name]/page.tsx`

```typescript
'use client';

/**
 * [Page Name] - Main Implementation
 * 
 * Location: /app/(dashboard)/[page-name]/page.tsx
 * Purpose: Next.js App Router ready - Code chính ở đây
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * - i18n support
 */

import { useState } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function PageName() {
  const { t } = useLanguage();
  const [state, setState] = useState();

  // Toàn bộ logic ở đây

  return (
    <div className="container mx-auto">
      {/* UI implementation */}
      <h1>{t('page.title')}</h1>
    </div>
  );
}
```

### Template 2: `/pages/PageName.tsx`

```typescript
/**
 * [Page Name] - Re-export
 * 
 * Location: /pages/PageName.tsx
 * Purpose: Re-export từ /app/ cho Vite routing
 * 
 * CONVENTION:
 * - Code chính ở /app/(dashboard)/[page-name]/page.tsx
 * - File này CHỈ re-export, KHÔNG có logic
 */

export { default as PageName } from '@/app/(dashboard)/[page-name]/page';
```

---

## 🔄 Workflow Tạo Page Mới

### Step 1: Tạo page trong `/app/`
```bash
# Tạo folder và file
mkdir -p /app/(dashboard)/new-feature
touch /app/(dashboard)/new-feature/page.tsx
```

```typescript
// /app/(dashboard)/new-feature/page.tsx
'use client';

export default function NewFeaturePage() {
  // Implementation ở đây
  return <div>New Feature</div>;
}
```

### Step 2: Tạo shim trong `/pages/`
```bash
touch /pages/NewFeaturePage.tsx
```

```typescript
// /pages/NewFeaturePage.tsx
export { default as NewFeaturePage } from '@/app/(dashboard)/new-feature/page';
```

### Step 3: Add route trong App.tsx
```typescript
// /App.tsx
import NewFeaturePage from './app/(dashboard)/new-feature/page';

// Trong <Routes>:
<Route path="/new-feature" element={<NewFeaturePage />} />
```

### Step 4: Test
- ✅ Build successful
- ✅ Page renders
- ✅ No TypeScript errors
- ✅ Routing works

---

## ❌ ANTI-PATTERNS (Tuyệt đối KHÔNG làm)

### 1. ❌ Logic trong `/pages/`
```typescript
// ❌ WRONG
// /pages/BadPage.tsx
export function BadPage() {
  const [data, setData] = useState(); // ❌ NO LOGIC HERE!
  
  useEffect(() => { ... }); // ❌ NO HOOKS HERE!
  
  return <div>...</div>; // ❌ NO IMPLEMENTATION HERE!
}
```

### 2. ❌ Import từ `/pages/` trong App.tsx
```typescript
// ❌ WRONG
import { BadPage } from './pages/BadPage'; // ❌ SAI
```

### 3. ❌ Duplicate code giữa `/app/` và `/pages/`
```typescript
// ❌ WRONG - Code duplicate
// /app/(dashboard)/feature/page.tsx
export default function Feature() { ... }

// /pages/FeaturePage.tsx
export function FeaturePage() { ... } // ❌ DUPLICATE!
```

### 4. ❌ Không có file tương ứng trong `/app/`
```typescript
// ❌ WRONG - Chỉ có trong /pages/
// /pages/OrphanPage.tsx
export function OrphanPage() { ... } // ❌ Phải có trong /app/ trước!
```

---

## 🎯 Naming Convention

### File Names

| Location | Convention | Example |
|----------|------------|---------|
| `/app/(dashboard)/` | kebab-case | `user-settings/page.tsx` |
| `/pages/` | PascalCase | `UserSettingsPage.tsx` |

### Export Names

```typescript
// ✅ ĐÚNG
// /app/(dashboard)/user-settings/page.tsx
export default function UserSettingsPage() { ... }

// /pages/UserSettingsPage.tsx
export { default as UserSettingsPage } from '@/app/(dashboard)/user-settings/page';
```

---

## 📊 Verification Checklist

Trước khi commit page mới, check:

- [ ] ✅ Code chính ở `/app/(dashboard)/[page-name]/page.tsx`
- [ ] ✅ File export `default function PageName()`
- [ ] ✅ File có `'use client'` directive (nếu dùng hooks)
- [ ] ✅ `/pages/PageName.tsx` CHỈ re-export, KHÔNG có logic
- [ ] ✅ App.tsx import từ `/app/` (KHÔNG phải `/pages/`)
- [ ] ✅ Build successful, no errors
- [ ] ✅ TypeScript types correct
- [ ] ✅ Page renders correctly
- [ ] ✅ Routing works

---

## 🚀 Benefits of This Pattern

### 1. **Next.js Migration Ready**
```
Khi migrate sang Next.js:
1. Delete /pages/ folder
2. Update routing trong App.tsx
3. DONE! Zero changes trong /app/
```

### 2. **Single Source of Truth**
- Code chính: `/app/` only
- Routing adapter: `/pages/` (minimal)
- No duplication, easy maintenance

### 3. **Clear Separation**
```
/app/     → Business logic (Next.js ready)
/pages/   → Vite routing shim (temporary)
```

### 4. **Type Safety**
- Clean imports
- No circular dependencies
- IDE autocomplete works perfectly

---

## 📖 Examples

### Example 1: Simple Page

```typescript
// /app/(dashboard)/analytics/page.tsx
'use client';

export default function AnalyticsPage() {
  return <div>Analytics Dashboard</div>;
}
```

```typescript
// /pages/AnalyticsPage.tsx
export { default as AnalyticsPage } from '@/app/(dashboard)/analytics/page';
```

### Example 2: Page with State & Hooks

```typescript
// /app/(dashboard)/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function ReportsPage() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Fetch data
  }, []);
  
  return <div>Reports: {data.length}</div>;
}
```

```typescript
// /pages/ReportsPage.tsx
export { default as ReportsPage } from '@/app/(dashboard)/reports/page';
```

### Example 3: Page with Dynamic Route

```typescript
// /app/(dashboard)/products/[id]/page.tsx
'use client';

import { useParams } from 'react-router';

export default function ProductDetailPage() {
  const { id } = useParams();
  
  return <div>Product: {id}</div>;
}
```

```typescript
// /pages/ProductDetailPage.tsx
export { default as ProductDetailPage } from '@/app/(dashboard)/products/[id]/page';
```

---

## 🔒 Enforcement

### Code Review Checklist

Khi review PR có page mới:

1. ✅ Check `/app/(dashboard)/[page]/page.tsx` exists
2. ✅ Check `/pages/[Page].tsx` chỉ có re-export
3. ✅ Check App.tsx import từ `/app/`
4. ✅ Check KHÔNG có logic trong `/pages/`
5. ✅ Check naming convention đúng

### Reject PR nếu:

- ❌ Logic trong `/pages/`
- ❌ Import từ `/pages/` trong App.tsx
- ❌ Không có file tương ứng trong `/app/`
- ❌ Duplicate code
- ❌ Sai naming convention

---

## 📚 Related Documents

- **`/APP_PAGES_REFACTOR_PLAN.md`** - Chi tiết về refactor plan
- **`/REFACTOR_COMPLETED.md`** - Summary về kết quả refactor
- **`/README.md`** - Project overview

---

## 🎓 Training Examples

### ✅ CORRECT Example

```typescript
// /app/(dashboard)/notifications/page.tsx
'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  
  return (
    <div className="container">
      <h1><Bell /> Notifications ({notifications.length})</h1>
    </div>
  );
}
```

```typescript
// /pages/NotificationsPage.tsx
export { default as NotificationsPage } from '@/app/(dashboard)/notifications/page';
```

```typescript
// /App.tsx
import NotificationsPage from './app/(dashboard)/notifications/page';
// ...
<Route path="/notifications" element={<NotificationsPage />} />
```

### ❌ WRONG Example

```typescript
// /pages/NotificationsPage.tsx
import { useState } from 'react'; // ❌ WRONG

export function NotificationsPage() { // ❌ WRONG - Logic here!
  const [notifications, setNotifications] = useState([]); // ❌ NO!
  
  return <div>...</div>; // ❌ WRONG - Implementation here!
}
```

---

## 💡 Quick Reference

```bash
# Tạo page mới:
1. mkdir -p /app/(dashboard)/[page-name]
2. touch /app/(dashboard)/[page-name]/page.tsx  # Code chính
3. touch /pages/[PageName].tsx                   # Re-export only
4. Update /App.tsx                               # Import từ /app/
```

```typescript
// Template nhanh:
// /app/(dashboard)/[page]/page.tsx
'use client';
export default function PageName() { return <div>...</div>; }

// /pages/PageName.tsx
export { default as PageName } from '@/app/(dashboard)/[page]/page';
```

---

**Last Updated:** January 19, 2026  
**Status:** 🔒 MANDATORY for all new pages  
**Compliance:** 100% required
