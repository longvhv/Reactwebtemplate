# 🚀 Quick Start - Creating New Pages

**1 Minute Guide** để tạo page mới đúng convention.

---

## 📋 3 Bước Duy Nhất

### 1️⃣ Tạo Code Chính Trong `/app/`

```bash
mkdir -p /app/(dashboard)/my-feature
```

```typescript
// /app/(dashboard)/my-feature/page.tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function MyFeaturePage() {
  const { t } = useLanguage();
  const [data, setData] = useState([]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {t('myFeature.title')}
      </h1>
      {/* Your UI here */}
    </div>
  );
}
```

### 2️⃣ Tạo Shim Trong `/pages/`

```typescript
// /pages/MyFeaturePage.tsx
/**
 * My Feature Page - Re-export
 * Code chính ở /app/(dashboard)/my-feature/page.tsx
 */
export { default as MyFeaturePage } from '@/app/(dashboard)/my-feature/page';
```

### 3️⃣ Add Route Trong `App.tsx`

```typescript
// /App.tsx

// Import
import MyFeaturePage from './app/(dashboard)/my-feature/page';

// Add route
<Route path="/my-feature" element={<MyFeaturePage />} />
```

---

## ✅ Checklist

Trước khi commit:

- [ ] ✅ Code ở `/app/(dashboard)/[page]/page.tsx`
- [ ] ✅ File có `'use client'`
- [ ] ✅ Export `default function`
- [ ] ✅ Shim ở `/pages/[Page].tsx` (1 dòng re-export)
- [ ] ✅ App.tsx import từ `/app/`
- [ ] ✅ `npm run build` thành công
- [ ] ✅ Page hiển thị đúng

---

## 🎯 Template Copy-Paste

### Simple Page

```typescript
// /app/(dashboard)/analytics/page.tsx
'use client';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">Analytics</h1>
    </div>
  );
}
```

```typescript
// /pages/AnalyticsPage.tsx
export { default as AnalyticsPage } from '@/app/(dashboard)/analytics/page';
```

### Page With Data

```typescript
// /app/(dashboard)/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function ReportsPage() {
  const { t } = useLanguage();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      // API call here
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {t('reports.title')}
      </h1>
      <div>Total: {reports.length}</div>
    </div>
  );
}
```

```typescript
// /pages/ReportsPage.tsx
export { default as ReportsPage } from '@/app/(dashboard)/reports/page';
```

### Dynamic Route

```typescript
// /app/(dashboard)/products/[id]/page.tsx
'use client';

import { useParams } from 'react-router';
import { useLanguage } from '@/providers/LanguageProvider';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">
        {t('product.title')}: {id}
      </h1>
    </div>
  );
}
```

```typescript
// /pages/ProductDetailPage.tsx
export { default as ProductDetailPage } from '@/app/(dashboard)/products/[id]/page';
```

---

## ❌ Common Mistakes

### ❌ WRONG: Logic trong `/pages/`

```typescript
// ❌ KHÔNG làm thế này!
// /pages/BadPage.tsx
export function BadPage() {
  const [data, setData] = useState(); // ❌ NO!
  return <div>Bad</div>;
}
```

### ❌ WRONG: Import từ `/pages/`

```typescript
// ❌ KHÔNG làm thế này!
// /App.tsx
import { BadPage } from './pages/BadPage'; // ❌ NO!
```

### ✅ CORRECT: Luôn làm như này

```typescript
// ✅ Code trong /app/
// /app/(dashboard)/feature/page.tsx
export default function FeaturePage() { ... }

// ✅ Shim trong /pages/
// /pages/FeaturePage.tsx
export { default as FeaturePage } from '@/app/(dashboard)/feature/page';

// ✅ Import từ /app/
// /App.tsx
import FeaturePage from './app/(dashboard)/feature/page';
```

---

## 🎓 Chi Tiết Đầy Đủ

Xem documents sau để hiểu sâu hơn:

1. **[PAGES_CONVENTION.md](./PAGES_CONVENTION.md)** - Full convention guide
2. **[CONVENTION_ENFORCEMENT.md](./CONVENTION_ENFORCEMENT.md)** - Rules & compliance
3. **[APP_PAGES_REFACTOR_PLAN.md](./APP_PAGES_REFACTOR_PLAN.md)** - Context & examples

---

## 💡 Why This Pattern?

**1 câu trả lời:**

> Khi migrate sang Next.js App Router, chỉ cần xóa `/pages/` folder. ZERO code changes trong `/app/`! 🚀

---

## 🆘 Cần Giúp?

1. Copy template từ page hiện có trong `/app/`
2. Xem `/pages/` để học pattern re-export
3. Đọc [PAGES_CONVENTION.md](./PAGES_CONVENTION.md)
4. Hỏi team lead

---

**Remember:**

```
✅ /app/     → Code here
✅ /pages/   → Re-export only
✅ App.tsx   → Import from /app/
```

**That's it! 🎉**
