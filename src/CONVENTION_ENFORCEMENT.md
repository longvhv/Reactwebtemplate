# 🔒 Convention Enforcement - Next.js Shim Pattern

**Status:** MANDATORY  
**Effective Date:** January 19, 2026  
**Scope:** ALL new pages from this date forward

---

## 🎯 TL;DR

**QUY TẮC DUY NHẤT:**

```
✅ Code chính ở /app/
✅ /pages/ CHỈ re-export từ /app/
✅ App.tsx import từ /app/
❌ KHÔNG được có logic ở /pages/
```

---

## 📋 Checklist Cho Mọi Page Mới

### ✅ Before Creating New Page

- [ ] Đã đọc [PAGES_CONVENTION.md](./PAGES_CONVENTION.md)
- [ ] Hiểu rõ pattern: `/app/` (code) + `/pages/` (shim)
- [ ] Biết cách tạo file đúng convention

### ✅ During Development

**Step 1: Tạo code chính trong `/app/`**
```typescript
// /app/(dashboard)/[page-name]/page.tsx
'use client';

export default function PageName() {
  // ALL LOGIC HERE
  return <div>...</div>;
}
```

**Step 2: Tạo shim trong `/pages/`**
```typescript
// /pages/PageName.tsx
export { default as PageName } from '@/app/(dashboard)/[page-name]/page';
```

**Step 3: Import trong App.tsx**
```typescript
// /App.tsx
import PageName from './app/(dashboard)/[page-name]/page';
```

### ✅ Before Commit

- [ ] Code chính ở `/app/(dashboard)/[page]/page.tsx`
- [ ] File có `'use client'` directive
- [ ] File export `default function PageName()`
- [ ] `/pages/PageName.tsx` CHỈ có 1 dòng re-export
- [ ] KHÔNG có logic trong `/pages/`
- [ ] App.tsx import từ `/app/` (KHÔNG phải `/pages/`)
- [ ] Build success (`npm run build`)
- [ ] No TypeScript errors
- [ ] Page renders correctly

### ✅ Code Review

- [ ] Check `/app/` file structure correct
- [ ] Check `/pages/` chỉ re-export
- [ ] Check KHÔNG có duplicate code
- [ ] Check naming convention đúng
- [ ] Check imports correct

---

## ❌ Instant Reject Criteria

**PR sẽ bị REJECT ngay lập tức nếu:**

### 1. Logic trong `/pages/`
```typescript
// ❌ REJECT
// /pages/BadPage.tsx
export function BadPage() {
  const [state, setState] = useState(); // ❌ NO LOGIC!
  return <div>...</div>;
}
```

### 2. Import từ `/pages/` trong App.tsx
```typescript
// ❌ REJECT
// /App.tsx
import { BadPage } from './pages/BadPage'; // ❌ WRONG!
```

### 3. Không có file trong `/app/`
```typescript
// ❌ REJECT - Orphan page
// /pages/OrphanPage.tsx without /app/ counterpart
```

### 4. Duplicate code
```typescript
// ❌ REJECT - Same logic in both places
// /app/feature/page.tsx
export default function Feature() { ... }

// /pages/FeaturePage.tsx  
export function FeaturePage() { ... } // ❌ DUPLICATE!
```

---

## ✅ Valid Examples

### Example 1: Simple Page
```typescript
// ✅ CORRECT
// /app/(dashboard)/analytics/page.tsx
'use client';

export default function AnalyticsPage() {
  return <div>Analytics</div>;
}
```

```typescript
// ✅ CORRECT
// /pages/AnalyticsPage.tsx
export { default as AnalyticsPage } from '@/app/(dashboard)/analytics/page';
```

### Example 2: Page with State
```typescript
// ✅ CORRECT
// /app/(dashboard)/users/page.tsx
'use client';

import { useState } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  
  return <div>Users: {users.length}</div>;
}
```

```typescript
// ✅ CORRECT
// /pages/UsersPage.tsx
export { default as UsersPage } from '@/app/(dashboard)/users/page';
```

### Example 3: Dynamic Route
```typescript
// ✅ CORRECT
// /app/(dashboard)/products/[id]/page.tsx
'use client';

import { useParams } from 'react-router';

export default function ProductPage() {
  const { id } = useParams();
  
  return <div>Product {id}</div>;
}
```

```typescript
// ✅ CORRECT
// /pages/ProductPage.tsx
export { default as ProductPage } from '@/app/(dashboard)/products/[id]/page';
```

---

## 🚨 Violations & Penalties

### First Violation
- ⚠️ PR rejected
- 📚 Link to [PAGES_CONVENTION.md](./PAGES_CONVENTION.md)
- 📖 Educational comment

### Second Violation
- ⛔ PR blocked
- 👨‍🏫 Required: Read full convention document
- ✅ Re-submit with correct pattern

### Third Violation
- 🔴 Escalation to team lead
- 📝 Required: Convention training session

---

## 📊 Tracking Compliance

### Metrics to Monitor

| Metric | Target |
|--------|--------|
| New pages following convention | 100% |
| Pages with logic in `/pages/` | 0% |
| Build errors | 0 |
| TypeScript errors | 0 |

### Weekly Review

Every week, check:
- [ ] All new pages follow convention
- [ ] No violations in recent PRs
- [ ] No orphan pages
- [ ] Clean build

---

## 💡 Quick Tips

### DO ✅

1. **Always start in `/app/`**
   - Create `/app/(dashboard)/[page]/page.tsx` first
   - Write all logic there

2. **Use templates**
   - Copy from existing pages
   - Follow exact pattern

3. **Test immediately**
   - `npm run build` after creating
   - Check TypeScript errors

### DON'T ❌

1. **Never write logic in `/pages/`**
   - Not even a single line
   - Pure re-export only

2. **Never import from `/pages/` in App.tsx**
   - Always import from `/app/`
   - This ensures clean migration

3. **Never duplicate code**
   - Single source of truth: `/app/`
   - `/pages/` is just a shim

---

## 🎓 Training Resources

### Required Reading (New Team Members)

1. ✅ [PAGES_CONVENTION.md](./PAGES_CONVENTION.md) - Full convention details
2. ✅ [APP_PAGES_REFACTOR_PLAN.md](./APP_PAGES_REFACTOR_PLAN.md) - Context and progress
3. ✅ [README.md](./README.md) - Project overview

### Quick Reference

```bash
# Template for new page
mkdir -p /app/(dashboard)/[page-name]
touch /app/(dashboard)/[page-name]/page.tsx
touch /pages/[PageName].tsx

# /app/(dashboard)/[page-name]/page.tsx
'use client';
export default function PageName() { return <div>...</div>; }

# /pages/[PageName].tsx
export { default as PageName } from '@/app/(dashboard)/[page-name]/page';

# /App.tsx
import PageName from './app/(dashboard)/[page-name]/page';
<Route path="/page-name" element={<PageName />} />
```

---

## 🔍 Automated Checks (Future)

### Planned Linting Rules

```javascript
// .eslintrc.js (future)
rules: {
  // Reject useState/useEffect in /pages/
  'no-react-hooks-in-pages': 'error',
  
  // Reject JSX implementation in /pages/
  'no-jsx-in-pages': 'error',
  
  // Enforce re-export pattern
  'enforce-pages-reexport': 'error',
}
```

### Planned Pre-commit Hooks

```bash
# Pre-commit check (future)
- Check /pages/ files are pure re-exports
- Check /app/ files exist for all /pages/ files
- Check no orphan pages
- Run TypeScript check
```

---

## 📞 Questions?

### Common Questions

**Q: Tại sao phải làm thế này?**
A: Để sẵn sàng migrate sang Next.js với ZERO code changes.

**Q: Có exception nào không?**
A: KHÔNG. 100% pages phải follow pattern này.

**Q: Nếu tôi quên?**
A: PR sẽ bị reject. Fix và re-submit.

**Q: Pattern này tốn thời gian hơn?**
A: Không. Chỉ thêm 1 file 1-liner. Saves hours khi migrate Next.js.

### Need Help?

1. 📖 Read [PAGES_CONVENTION.md](./PAGES_CONVENTION.md)
2. 👀 Look at existing pages in `/app/` and `/pages/`
3. 💬 Ask team lead
4. 📝 Create documentation issue

---

## 📅 Timeline

| Date | Event |
|------|-------|
| Jan 19, 2026 | Convention established |
| Jan 19, 2026 | All 10 existing pages refactored ✅ |
| Jan 19, 2026 | Convention becomes MANDATORY |
| Future | Automated enforcement via linting |

---

## 🎯 Success Criteria

### Project Level

- ✅ 100% pages follow convention
- ✅ Zero violations in code reviews
- ✅ Clean TypeScript build
- ✅ Ready for Next.js migration anytime

### Team Level

- ✅ All team members understand pattern
- ✅ New pages created correctly first time
- ✅ No PR rejections due to convention

---

## 📝 Sign-off

By working on this project, you agree to:

1. ✅ Follow the Pages Convention 100%
2. ✅ Write code in `/app/` only
3. ✅ Use `/pages/` for re-export only
4. ✅ Import from `/app/` in App.tsx
5. ✅ Accept PR rejection if violation

---

**Effective Date:** January 19, 2026  
**Status:** 🔒 MANDATORY  
**Compliance Required:** 100%

---

**Remember: 1 extra minute now = Hours saved on Next.js migration! 🚀**
