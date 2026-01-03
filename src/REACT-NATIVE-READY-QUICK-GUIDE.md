# React Native Ready - Quick Reference Guide

🎯 **Status**: ✅ 100% CERTIFIED  
📅 **Updated**: 2026-01-02

---

## Quick Checklist

✅ All browser APIs properly guarded  
✅ Platform abstraction layer complete  
✅ No hardcoded web-only code  
✅ Storage layer abstracted  
✅ Navigation layer abstracted  
✅ Network layer abstracted  
✅ Ready for React Native migration  

---

## Common Patterns

### ✅ CORRECT Patterns

#### 1. Guarding document API
```typescript
useEffect(() => {
  if (typeof document === 'undefined') return; // ✅
  
  document.addEventListener('click', handler);
  return () => document.removeEventListener('click', handler);
}, []);
```

#### 2. Guarding window API
```typescript
useEffect(() => {
  if (typeof window === 'undefined') return; // ✅
  
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

#### 3. Guarding localStorage
```typescript
const saveData = (key: string, value: any) => {
  if (typeof localStorage === 'undefined') return; // ✅
  localStorage.setItem(key, JSON.stringify(value));
};
```

#### 4. Using Platform Abstraction
```typescript
// ✅ CORRECT
import { platformStorage } from '../platform/storage';
const data = await platformStorage.getItem('key');

// ✅ CORRECT
import { useNavigate } from '../platform/navigation';
const navigate = useNavigate();
```

#### 5. Conditional Rendering for Web-Only Features
```typescript
const MyComponent = () => {
  if (typeof window === 'undefined') return null; // ✅
  
  return <WebOnlyFeature />;
};
```

#### 6. Early Return in Utility Functions
```typescript
export function isInViewport(element: Element): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false; // ✅ Safe fallback
  }
  
  // Web implementation
  const rect = element.getBoundingClientRect();
  return /* ... */;
}
```

---

### ❌ WRONG Patterns

#### 1. No Guard
```typescript
// ❌ WRONG - Will crash in React Native
useEffect(() => {
  document.addEventListener('click', handler); // ❌
}, []);
```

#### 2. Nested Hooks
```typescript
// ❌ WRONG - Violates Rules of Hooks
useEffect(() => {
  useEffect(() => { // ❌ NESTED!
    // ...
  }, []);
}, []);
```

#### 3. Direct Browser API
```typescript
// ❌ WRONG - Should use platform abstraction
const data = localStorage.getItem('key'); // ❌
```

#### 4. Hardcoded Web Navigation
```typescript
// ❌ WRONG - Not cross-platform
window.location.href = '/path'; // ❌
```

---

## Safe APIs (No Guards Needed)

These work identically in web and React Native:

```typescript
// ✅ All safe to use without guards
setTimeout(() => {}, 1000);
clearTimeout(timer);
setInterval(() => {}, 1000);
clearInterval(timer);

console.log('message');
console.error('error');
console.warn('warning');

JSON.parse('{}');
JSON.stringify({});

new Date();
Math.random();
Math.floor(1.5);

Promise.resolve();
async/await

Array.map();
String.split();
Object.keys();
```

---

## APIs Requiring Guards

Always guard these:

```typescript
// ⚠️ MUST GUARD
window.*
document.*
localStorage
sessionStorage
navigator.*
location.*
history.*

// DOM methods
querySelector()
getElementById()
createElement()
```

---

## Platform Abstraction Quick Reference

### Storage
```typescript
import { platformStorage } from '../platform/storage';

// Save
await platformStorage.setItem('key', 'value');

// Load
const value = await platformStorage.getItem('key');

// Remove
await platformStorage.removeItem('key');

// Clear all
await platformStorage.clear();
```

### Navigation
```typescript
import { useNavigate, useLocation } from '../platform/navigation';

const MyComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleClick = () => {
    navigate('/path');
  };
  
  return <button onClick={handleClick}>Go</button>;
};
```

### Network
```typescript
import { platformFetch } from '../platform/network';

const data = await platformFetch('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' }),
});
```

---

## Guard Patterns by Use Case

### 1. Event Listeners
```typescript
useEffect(() => {
  if (typeof window === 'undefined') return; // ✅
  
  const handler = (e: Event) => { /* ... */ };
  window.addEventListener('event', handler);
  
  return () => window.removeEventListener('event', handler);
}, []);
```

### 2. DOM Queries
```typescript
useEffect(() => {
  if (typeof document === 'undefined') return; // ✅
  
  const element = document.querySelector('.class');
  if (element) {
    // Do something
  }
}, []);
```

### 3. Media Queries
```typescript
useEffect(() => {
  if (typeof window === 'undefined') return; // ✅
  
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  const handler = () => setIsMobile(mediaQuery.matches);
  
  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}, []);
```

### 4. Keyboard Shortcuts
```typescript
useEffect(() => {
  if (typeof window === 'undefined') return; // ✅
  
  const handler = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      // Handle shortcut
    }
  };
  
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);
```

### 5. Click Outside Detection
```typescript
useEffect(() => {
  if (typeof document === 'undefined') return; // ✅
  
  const handler = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      // Clicked outside
    }
  };
  
  document.addEventListener('mousedown', handler);
  return () => document.removeEventListener('mousedown', handler);
}, []);
```

---

## Testing Your Guards

### 1. Simulate React Native Environment
```typescript
// In your test file
Object.defineProperty(global, 'window', {
  value: undefined,
  writable: true
});

// Your component should not crash ✅
```

### 2. Check for Errors
```bash
# Search for unguarded usage
grep -r "window\." --include="*.tsx" --include="*.ts" | grep -v "typeof window"
grep -r "document\." --include="*.tsx" --include="*.ts" | grep -v "typeof document"
grep -r "localStorage\." --include="*.tsx" --include="*.ts" | grep -v "typeof localStorage"
```

### 3. Manual Testing
- Open DevTools Console
- Paste: `window = undefined; document = undefined;`
- Reload your component
- Should not crash ✅

---

## Migration Workflow

### When Adding New Feature:

1. **Write code normally** for web
2. **Add guards** for browser APIs
3. **Use platform abstraction** where available
4. **Test** in web environment
5. **Verify guards** are in place
6. **Document** any web-only features

### Example Flow:
```typescript
// Step 1: Write feature
const MyFeature = () => {
  const handleClick = () => {
    window.alert('Hello'); // Initial code
  };
  
  return <button onClick={handleClick}>Click</button>;
};

// Step 2: Add guards
const MyFeature = () => {
  const handleClick = () => {
    if (typeof window === 'undefined') return; // ✅ Added guard
    window.alert('Hello');
  };
  
  return <button onClick={handleClick}>Click</button>;
};

// Step 3: Better - use platform abstraction
import { platformAlert } from '../platform/alert';

const MyFeature = () => {
  const handleClick = () => {
    platformAlert('Hello'); // ✅ Cross-platform
  };
  
  return <button onClick={handleClick}>Click</button>;
};
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Forgetting Guard in useEffect
```typescript
// ❌ WRONG
useEffect(() => {
  window.addEventListener('resize', handler); // Missing guard!
}, []);

// ✅ CORRECT
useEffect(() => {
  if (typeof window === 'undefined') return;
  window.addEventListener('resize', handler);
}, []);
```

### ❌ Mistake 2: Guard Inside Event Handler
```typescript
// ❌ WRONG - Guard too late
const handler = (e: Event) => {
  if (typeof window === 'undefined') return; // Too late!
  window.doSomething();
};
window.addEventListener('click', handler); // Already crashed!

// ✅ CORRECT - Guard before addEventListener
if (typeof window !== 'undefined') {
  const handler = (e: Event) => {
    window.doSomething();
  };
  window.addEventListener('click', handler);
}
```

### ❌ Mistake 3: Partial Guard
```typescript
// ❌ WRONG - Only guarded one API
if (typeof window !== 'undefined') {
  window.addEventListener('click', handler);
}
// Missing guard for cleanup!
return () => window.removeEventListener('click', handler); // ❌

// ✅ CORRECT - Guard both
useEffect(() => {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
}, []);
```

---

## Deployment Checklist

### Before Production:

- [ ] All browser APIs have guards
- [ ] Platform abstractions used where available
- [ ] No console errors in browser
- [ ] Build succeeds without warnings
- [ ] All tests pass
- [ ] No hardcoded web-only features
- [ ] Documentation updated

### Verification Commands:
```bash
# Check for unguarded APIs
npm run audit:guards

# Build verification
npm run build

# Test suite
npm test

# Type checking
npm run type-check
```

---

## Quick Reference Card

| API | Guard Needed? | Alternative |
|-----|---------------|-------------|
| `window.*` | ✅ Yes | Platform abstraction |
| `document.*` | ✅ Yes | Platform abstraction |
| `localStorage` | ✅ Yes | `platformStorage` |
| `sessionStorage` | ✅ Yes | `platformStorage` |
| `navigator.*` | ✅ Yes | Platform abstraction |
| `setTimeout` | ❌ No | Safe to use |
| `setInterval` | ❌ No | Safe to use |
| `console.*` | ❌ No | Safe to use |
| `fetch` | ⚠️ Maybe | Use `platformFetch` |
| `JSON.*` | ❌ No | Safe to use |
| `Date` | ❌ No | Safe to use |
| `Math.*` | ❌ No | Safe to use |

---

## Support & Resources

- 📖 Full Audit: `/REACT-NATIVE-READY-FINAL-AUDIT.md`
- 🔧 Fix History: `/DEEP-AUDIT-V3-FIXES-COMPLETE.md`
- 🏗️ Platform Layer: `/platform/`
- 📚 Documentation: `/docs/REACT_NATIVE_READY.md`

---

**Last Updated**: 2026-01-02  
**Certification**: ✅ 100% React Native Ready  
**Status**: Production Ready
