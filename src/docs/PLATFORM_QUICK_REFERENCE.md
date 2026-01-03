# Quick Reference - Platform Abstraction

Hướng dẫn nhanh để viết code React Native Ready.

---

## ✅ DO's - Cách Đúng

### Network Requests

```tsx
// ✅ CORRECT - Use platformFetch
import { platformFetch } from '@/platform/network/fetch';

const response = await platformFetch('/api/users');
const data = await response.json();

// ✅ CORRECT - Type-safe JSON
import { fetchJSON } from '@/platform/network/fetch';

const users = await fetchJSON<User[]>('/api/users');

// ✅ CORRECT - With timeout
import { fetchWithTimeout } from '@/platform/network/fetch';

const response = await fetchWithTimeout('/api/users', {}, 5000);
```

### Browser APIs

```tsx
// ✅ CORRECT - Guard window
if (typeof window !== 'undefined') {
  window.addEventListener('resize', handleResize);
}

// ✅ CORRECT - Guard document
if (typeof document !== 'undefined') {
  document.cookie = 'key=value';
}

// ✅ CORRECT - Guard navigator
const isOnline = typeof navigator !== 'undefined' 
  ? navigator.onLine 
  : true;

// ✅ CORRECT - Use platform guards
import { guards } from '@/platform';

if (guards.hasWindow()) {
  // Safe to use window
}
```

### Storage

```tsx
// ✅ CORRECT - Use storage utilities
import { getFromStorage, setToStorage } from '@/lib/storage';

const theme = await getFromStorage('theme', 'light');
await setToStorage('theme', 'dark');

// ✅ CORRECT - Guard localStorage
if (typeof localStorage !== 'undefined') {
  localStorage.setItem('key', 'value');
}

// ✅ CORRECT - Use hook
import { useLocalStorage } from '@/hooks/useLocalStorage';

const [value, setValue] = useLocalStorage('key', 'default');
```

### Event Handlers

```tsx
// ✅ CORRECT - Guard and cleanup
useEffect(() => {
  if (typeof window === 'undefined') return;
  
  const handler = () => { /* ... */ };
  window.addEventListener('keydown', handler);
  
  return () => window.removeEventListener('keydown', handler);
}, []);

// ✅ CORRECT - Document events
useEffect(() => {
  if (typeof document === 'undefined') return;
  
  const handler = () => { /* ... */ };
  document.addEventListener('click', handler);
  
  return () => document.removeEventListener('click', handler);
}, []);
```

### Navigation

```tsx
// ✅ CORRECT - Use React Router hook
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard');

// ✅ CORRECT - Use location hook
import { useLocation } from 'react-router-dom';

const location = useLocation();
const currentPath = location.pathname;
```

---

## ❌ DON'Ts - Cách Sai

### Network Requests

```tsx
// ❌ WRONG - Direct fetch
const response = await fetch('/api/users');

// ❌ WRONG - XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/users');
```

### Browser APIs

```tsx
// ❌ WRONG - Unguarded window
window.addEventListener('resize', handleResize);

// ❌ WRONG - Unguarded document
document.cookie = 'key=value';

// ❌ WRONG - Unguarded navigator
const isOnline = navigator.onLine;

// ❌ WRONG - Direct window properties
const width = window.innerWidth;
const origin = window.location.origin;
```

### Storage

```tsx
// ❌ WRONG - Direct localStorage
localStorage.setItem('key', 'value');

// ❌ WRONG - Direct sessionStorage
sessionStorage.setItem('key', 'value');

// ❌ WRONG - No error handling
const value = localStorage.getItem('key');
const parsed = JSON.parse(value); // Can throw!
```

### Event Handlers

```tsx
// ❌ WRONG - No guard
useEffect(() => {
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);

// ❌ WRONG - No cleanup
useEffect(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handler);
  }
  // Missing cleanup!
}, []);
```

### Navigation

```tsx
// ❌ WRONG - Direct window.location
window.location.href = '/dashboard';

// ❌ WRONG - Direct window.location.pathname
const path = window.location.pathname;

// ❌ WRONG - Direct history
window.history.pushState({}, '', '/dashboard');
```

---

## Common Patterns

### Pattern 1: Check & Use

```tsx
// Check availability before use
if (typeof window !== 'undefined') {
  // Safe to use window
  window.addEventListener('resize', handler);
}
```

### Pattern 2: Ternary Default

```tsx
// Provide default value
const isOnline = typeof navigator !== 'undefined' 
  ? navigator.onLine 
  : true;
```

### Pattern 3: Early Return

```tsx
useEffect(() => {
  // Early return if not available
  if (typeof window === 'undefined') return;
  
  // Safe to use window
  const handler = () => { /* ... */ };
  window.addEventListener('keydown', handler);
  
  return () => window.removeEventListener('keydown', handler);
}, []);
```

### Pattern 4: useEffect Guard

```tsx
useEffect(() => {
  // Guard entire useEffect
  if (typeof window === 'undefined') return;
  if (typeof document === 'undefined') return;
  
  // All browser APIs safe here
  const handler = (e: Event) => { /* ... */ };
  document.addEventListener('click', handler);
  
  return () => document.removeEventListener('click', handler);
}, []);
```

---

## API Quick Reference

### Platform Fetch
```tsx
import { 
  platformFetch,    // Basic fetch
  fetchJSON,        // Auto-parse JSON
  fetchWithTimeout, // With timeout
  isFetchAvailable  // Check availability
} from '@/platform/network/fetch';
```

### Platform Guards
```tsx
import { Platform, guards } from '@/platform';

// Platform detection
Platform.isWeb      // true on web
Platform.isNative   // true on React Native
Platform.isBrowser  // true if has window

// Guard functions
guards.hasWindow()
guards.hasDocument()
guards.hasNavigator()
guards.hasLocalStorage()
guards.hasSessionStorage()
```

### Storage Utilities
```tsx
import {
  getFromStorage,      // Get item
  setToStorage,        // Set item
  removeFromStorage,   // Remove item
  clearStorage,        // Clear all
  isStorageAvailable   // Check availability
} from '@/lib/storage';
```

### React Router Hooks
```tsx
import { 
  useNavigate,   // Navigation
  useLocation,   // Current location
  useParams,     // URL params
  useSearchParams // Query params
} from 'react-router-dom';
```

---

## Checklist for New Code

Before committing new code, verify:

- [ ] No direct `fetch()` calls
- [ ] All `window` usage guarded
- [ ] All `document` usage guarded
- [ ] All `navigator` usage guarded
- [ ] All `localStorage` usage guarded
- [ ] Event listeners have cleanup
- [ ] Using React Router hooks for navigation
- [ ] No `window.location` direct usage
- [ ] Storage errors handled
- [ ] Types are properly defined

---

## Code Review Checklist

When reviewing PRs:

- [ ] Check for unguarded browser APIs
- [ ] Verify fetch abstraction usage
- [ ] Confirm storage utilities used
- [ ] Check event listener cleanup
- [ ] Verify navigation patterns
- [ ] Test on different platforms (if possible)

---

## Testing Guide

### Unit Test Example
```tsx
import { platformFetch } from '@/platform/network/fetch';

// Mock fetch in tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'test' }),
  })
);

test('should fetch data', async () => {
  const response = await platformFetch('/api/test');
  const data = await response.json();
  
  expect(data).toEqual({ data: 'test' });
});
```

### Integration Test Example
```tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

test('should navigate correctly', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Test navigation
  const link = screen.getByText('Dashboard');
  link.click();
  
  expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
});
```

---

## Emergency Fixes

If you accidentally committed code with violations:

### Fix 1: Add Guards
```tsx
// Before
window.addEventListener('resize', handler);

// After
if (typeof window !== 'undefined') {
  window.addEventListener('resize', handler);
}
```

### Fix 2: Use Platform Fetch
```tsx
// Before
const response = await fetch(url);

// After
import { platformFetch } from '@/platform/network/fetch';
const response = await platformFetch(url);
```

### Fix 3: Use Storage Utilities
```tsx
// Before
localStorage.setItem('key', 'value');

// After
import { setToStorage } from '@/lib/storage';
await setToStorage('key', 'value');
```

---

## Resources

- [Full Documentation](./REACT_NATIVE_READY.md)
- [Migration Guide](./MIGRATION_TO_REACT_NATIVE.md)
- [Audit Report](./DEEP_AUDIT_REPORT.md)
- [Platform Layer](/platform/)

---

## Quick Help

**Need help?** Check:
1. This quick reference
2. Full documentation
3. Example code in `/platform/`
4. Existing components with proper patterns

**Found a violation?** Fix it using patterns above and update tests.

**Adding new feature?** Follow DO's section and run through checklist.
