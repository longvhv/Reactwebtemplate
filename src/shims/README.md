# Shims - Framework Migration Layer 🔄

Lớp trung gian giúp migrate từ **Vite + React Router** sang **Next.js** một cách dễ dàng.

---

## 📋 Tổng Quan

Shims cung cấp một API thống nhất cho các tính năng framework-specific:

| Tính năng | Hiện tại (Vite) | Tương lai (Next.js) | Shim |
|-----------|----------------|---------------------|------|
| Routing | React Router v7 | Next.js App Router | ✅ |
| Images | `<img>` tag | `next/image` | ✅ |
| Metadata | react-helmet | Metadata API | ✅ |
| Env Vars | `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` | ✅ |
| API Calls | fetch/axios | Server Actions | ✅ |

---

## 🚀 Quick Start

### 1. Router Shim

```typescript
import { Link, useNavigation, useLocation } from '@/shims/router';

function MyComponent() {
  const navigation = useNavigation();
  const location = useLocation();

  return (
    <div>
      <Link href="/dashboard">Go to Dashboard</Link>
      <p>Current path: {location.pathname}</p>
      <button onClick={() => navigation.push('/profile')}>
        Profile
      </button>
    </div>
  );
}
```

**Lợi ích:**
- ✅ Code giống nhau cho cả Vite và Next.js
- ✅ Chỉ cần thay đổi implementation trong shim files
- ✅ Components không cần refactor

---

### 2. Image Shim

```typescript
import { Image } from '@/shims/components';

function ProductCard() {
  return (
    <Image 
      src="/product.jpg"
      alt="Product"
      width={600}
      height={400}
      priority
      quality={90}
    />
  );
}
```

**Lợi ích:**
- ✅ Automatic optimization khi chuyển sang Next.js
- ✅ Fallback support trong cả hai frameworks
- ✅ Responsive images ready

---

### 3. Head/Metadata Shim

```typescript
import { Head } from '@/shims/components';

function ProductPage() {
  return (
    <>
      <Head 
        title="Product Details"
        description="Amazing product description"
        ogImage="/product-og.jpg"
      />
      <div>Product content...</div>
    </>
  );
}
```

**Migration:**
- Vite: Dùng react-helmet-async
- Next.js: Chuyển sang Metadata API

---

### 4. Environment Variables Shim

```typescript
import { env } from '@/shims/env';

console.log(env.API_URL);
console.log(env.APP_NAME);
console.log(env.isDevelopment);
```

**Migration:**
```bash
# .env.local (Vite)
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=VHV Platform

# .env.local (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=VHV Platform
```

Chỉ cần đổi tên biến môi trường, code không đổi!

---

### 5. API Client Shim

```typescript
import { apiClient } from '@/shims/api';

// GET request
const { data } = await apiClient.get('/users');

// POST request
const { data } = await apiClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// With params
const { data } = await apiClient.get('/users', {
  params: { page: 1, limit: 10 },
});
```

**Next.js Migration:** Có thể chuyển sang Server Actions

---

## 📁 Cấu Trúc

```
/shims/
├── router/
│   ├── Link.tsx                 # Link component shim
│   ├── useNavigation.ts         # Navigation hook shim
│   ├── useLocation.ts           # Location hook shim
│   ├── useSearchParams.ts       # Search params hook shim
│   └── index.ts
├── components/
│   ├── Image.tsx                # Image component shim
│   ├── Head.tsx                 # Head/Metadata shim
│   └── index.ts
├── env/
│   ├── index.ts                 # Environment variables shim
│   └── config.ts                # Runtime config
├── api/
│   ├── client.ts                # API client shim
│   └── index.ts
├── client-component.ts          # Client component markers
├── index.ts                     # Central export
└── README.md                    # This file
```

---

## 🔄 Migration Guide - Vite → Next.js

### Phase 1: Preparation (Đã hoàn thành ✅)

- [x] Tạo shim layer
- [x] Document migration strategy
- [x] Setup TypeScript types

### Phase 2: Adoption (Đang thực hiện)

1. **Update imports trong components:**

```typescript
// ❌ Before
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

// ✅ After
import { Link, useNavigation, useLocation } from '@/shims/router';
```

2. **Update Image components:**

```typescript
// ❌ Before
<img src="/hero.jpg" alt="Hero" />

// ✅ After
import { Image } from '@/shims/components';
<Image src="/hero.jpg" alt="Hero" width={800} height={600} />
```

3. **Update env vars:**

```typescript
// ❌ Before
const apiUrl = import.meta.env.VITE_API_URL;

// ✅ After
import { env } from '@/shims/env';
const apiUrl = env.API_URL;
```

### Phase 3: Migration to Next.js

1. **Install Next.js:**
```bash
npm install next@latest react@latest react-dom@latest
```

2. **Update shims (uncomment Next.js implementations):**
   - `/shims/router/Link.tsx`
   - `/shims/router/useNavigation.ts`
   - `/shims/components/Image.tsx`
   - `/shims/env/index.ts`

3. **Rename env variables:**
```bash
# Rename in .env.local
VITE_* → NEXT_PUBLIC_*
```

4. **Add 'use client' to components:**
```bash
# Find components needing 'use client'
grep -r "useState\|useEffect" src/ --include="*.tsx"
```

5. **Update routing structure:**
```
pages/               →  app/
  Dashboard.tsx     →    dashboard/page.tsx
  Profile.tsx       →    profile/page.tsx
```

---

## 🎯 Best Practices

### DO ✅

- Always import from `@/shims` instead of framework-specific packages
- Use type-safe APIs (TypeScript)
- Keep shims simple and focused
- Document migration paths
- Test in both frameworks if possible

### DON'T ❌

- Don't mix shim imports with framework imports
- Don't add complex logic to shims
- Don't skip TypeScript types
- Don't forget to update env vars when migrating

---

## 📊 Migration Checklist

### Before Migration
- [ ] All components use shims (not direct framework imports)
- [ ] All env vars use `env` object
- [ ] All images use `<Image>` component
- [ ] All API calls use `apiClient`
- [ ] TypeScript has no errors

### During Migration
- [ ] Install Next.js
- [ ] Update shim implementations
- [ ] Rename env variables
- [ ] Add 'use client' directives
- [ ] Update file structure to App Router

### After Migration
- [ ] Test all routes
- [ ] Test all API calls
- [ ] Test image loading
- [ ] Test env vars
- [ ] Performance testing
- [ ] Deploy to production

---

## 🔍 Debugging

### Common Issues

**1. Import errors after migration:**
```typescript
// Solution: Check shim paths
import { Link } from '@/shims/router'; // ✅
import { Link } from '@/shims';        // ✅
```

**2. Env vars undefined:**
```bash
# Solution: Check .env.local naming
NEXT_PUBLIC_API_URL=... # Must have NEXT_PUBLIC_ prefix for client
```

**3. Images not optimizing:**
```javascript
// Solution: Configure next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
  },
};
```

---

## 📚 Related Documentation

- [Next.js Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [React Router to Next.js](https://nextjs.org/docs/app/building-your-application/routing)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## 💡 Tips

1. **Start small:** Migrate one component at a time
2. **Test frequently:** Don't wait until everything is migrated
3. **Use TypeScript:** Catch errors early
4. **Document changes:** Help your team understand
5. **Keep shims updated:** As frameworks evolve

---

## 🤝 Contributing

Khi thêm tính năng mới:

1. Check if shim exists
2. If not, create new shim following patterns
3. Document migration path
4. Update this README
5. Add TypeScript types

---

## 📝 Notes

- Shims add **zero runtime overhead** (just wrapper functions)
- All shims are **tree-shakeable**
- TypeScript provides **full type safety**
- Migration can be **gradual** (component by component)

---

**Last Updated:** January 19, 2026
**Status:** ✅ Production Ready
**Next Step:** Adopt shims trong components