# Platform Abstraction Layer - Usage Guide

**Quick reference cho developers khi code cross-platform**

---

## 🚀 Quick Start

### Rule #1: NEVER import directly from platform-specific libraries

```typescript
// ❌ WRONG
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { View, Text } from 'react-native';

// ✅ CORRECT
import { PlatformRouter, useNavigate } from './platform/navigation/Router';
```

---

## 📱 Navigation

### Router Setup (App.tsx)
```typescript
import { PlatformRouter, Routes, Route } from './platform/navigation/Router';

function App() {
  return (
    <PlatformRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </PlatformRouter>
  );
}
```

### Navigation Hooks
```typescript
import { useNavigate, useLocation, useParams } from './platform/navigation/Router';

function MyComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const handleClick = () => {
    navigate('/dashboard');
  };
}
```

### Links
```typescript
import { Link, NavLink } from './platform/navigation/Router';

// Regular link
<Link to="/about">About</Link>

// Link with active state
<NavLink 
  to="/dashboard" 
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Dashboard
</NavLink>
```

---

## 💾 Storage

### AsyncStorage (Recommended - Cross-platform)
```typescript
import { AsyncStorage, StorageHelpers } from './platform/storage';

// Basic operations (async)
await AsyncStorage.setItem('key', 'value');
const value = await AsyncStorage.getItem('key');
await AsyncStorage.removeItem('key');

// JSON helpers
await StorageHelpers.setJSON('user', { name: 'John' });
const user = await StorageHelpers.getJSON('user');

// Check if key exists
const exists = await StorageHelpers.hasKey('key');
```

### Legacy Storage (Web-only - For backward compatibility)
```typescript
import { getStorageItem, setStorageItem } from './lib/storage';

// Synchronous (web only, returns default on native)
const theme = getStorageItem('theme', 'light');
setStorageItem('theme', 'dark');
```

**Note**: Prefer AsyncStorage for new code. Legacy storage has guards but is web-only.

---

## 🔧 Platform Utilities

### Platform Detection
```typescript
import { Platform } from './platform/utils/platform';

// Check platform
if (Platform.isWeb()) {
  // Web-specific code
}

if (Platform.isNative()) {
  // Native-specific code (iOS + Android)
}

if (Platform.isIOS()) {
  // iOS-specific code
}

// Platform-specific values
const padding = Platform.select({
  web: 20,
  native: 16,
  ios: 18,
  android: 16,
  default: 16
});
```

### Dimensions
```typescript
import { Dimensions } from './platform/utils/platform';

// Get dimensions
const { width, height } = Dimensions.get('window');

// Listen to changes
const subscription = Dimensions.addEventListener('change', ({ window }) => {
  console.log('New dimensions:', window.width, window.height);
});

// Cleanup
subscription.remove();
```

### Platform Hooks
```typescript
import { usePlatformDimensions } from './platform/hooks/usePlatformDimensions';
import { usePlatformBackHandler } from './platform/hooks/usePlatformBackHandler';

// Dimensions hook
function MyComponent() {
  const { width, height } = usePlatformDimensions();
  
  return <div style={{ width, height }}>Responsive</div>;
}

// Back handler
function MyModal({ onClose }) {
  usePlatformBackHandler(() => {
    onClose();
    return true; // Prevent default
  }, true);
}
```

---

## 🎨 Styling

### StyleSheet
```typescript
import { StyleSheet } from './platform/utils/platform';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 16,
    color: '#333'
  }
});

// Use with className (web) or style (native)
<div className="container" style={styles.container}>
  <span style={styles.text}>Hello</span>
</div>
```

### Pixel Ratio
```typescript
import { PixelRatio } from './platform/utils/platform';

const dpr = PixelRatio.get();
const fontSize = PixelRatio.getPixelSizeForLayoutSize(16);
const rounded = PixelRatio.roundToNearestPixel(15.7);
```

---

## 🛡️ Web API Guards

### When you MUST use web APIs

Always add guards:

```typescript
// ❌ WRONG
const element = document.getElementById('root');

// ✅ CORRECT
if (typeof document !== 'undefined') {
  const element = document.getElementById('root');
}

// ❌ WRONG  
window.scrollTo(0, 0);

// ✅ CORRECT
if (typeof window !== 'undefined') {
  window.scrollTo(0, 0);
}

// ❌ WRONG
localStorage.setItem('key', 'value');

// ✅ CORRECT
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
if (isBrowser) {
  localStorage.setItem('key', 'value');
}

// ✅ BETTER - Use platform abstraction
import { AsyncStorage } from './platform/storage';
await AsyncStorage.setItem('key', 'value');
```

---

## ✅ Common Patterns

### 1. Conditional Rendering
```typescript
import { Platform } from './platform/utils/platform';

function MyComponent() {
  return (
    <>
      {Platform.isWeb() && <WebOnlyFeature />}
      {Platform.isNative() && <NativeOnlyFeature />}
    </>
  );
}
```

### 2. Platform-Specific Imports
```typescript
import { Platform } from './platform/utils/platform';

const Icon = Platform.select({
  web: () => import('./icons/WebIcon'),
  native: () => import('./icons/NativeIcon'),
});
```

### 3. Responsive Design
```typescript
import { usePlatformDimensions } from './platform/hooks/usePlatformDimensions';

function ResponsiveComponent() {
  const { width } = usePlatformDimensions();
  const isMobile = width < 768;
  
  return (
    <div className={isMobile ? 'mobile' : 'desktop'}>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

### 4. Safe Web API Access
```typescript
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}
```

---

## 🚫 Common Mistakes

### ❌ Don't Do This

```typescript
// Direct import from react-router-dom
import { useNavigate } from 'react-router-dom';

// Direct localStorage without guard
localStorage.setItem('key', 'value');

// Direct window access without guard
const width = window.innerWidth;

// Direct document access without guard
document.title = 'New Title';

// Assuming browser environment
const userAgent = navigator.userAgent;
```

### ✅ Do This Instead

```typescript
// Use platform abstraction
import { useNavigate } from './platform/navigation/Router';

// Use AsyncStorage
import { AsyncStorage } from './platform/storage';
await AsyncStorage.setItem('key', 'value');

// Use platform dimensions
import { Dimensions } from './platform/utils/platform';
const { width } = Dimensions.get('window');

// Add guards for web APIs
if (typeof document !== 'undefined') {
  document.title = 'New Title';
}

// Check environment first
if (typeof navigator !== 'undefined') {
  const userAgent = navigator.userAgent;
}
```

---

## 📝 Checklist for New Code

Before committing, check:

- [ ] No direct imports from `react-router-dom`
- [ ] No direct imports from `react-native` (when available)
- [ ] All navigation uses `/platform/navigation/Router`
- [ ] All storage uses `/platform/storage` or has guards
- [ ] All `window`/`document` access has `typeof` checks
- [ ] All `localStorage` access has guards or uses AsyncStorage
- [ ] Platform-specific code uses `Platform.select()` or `Platform.is*()`
- [ ] No hardcoded platform assumptions

---

## 🆘 Need Help?

### Quick Reference Files
- [REACT-NATIVE-READY-FINAL-AUDIT.md](./REACT-NATIVE-READY-FINAL-AUDIT.md) - Full audit report
- [PLATFORM-QUICK-REFERENCE.md](./PLATFORM-QUICK-REFERENCE.md) - Detailed API reference
- [FIXES-REACT-NATIVE-READY.md](./FIXES-REACT-NATIVE-READY.md) - Example fixes

### Testing Your Code
```bash
# Check for react-router-dom imports (should be 0)
grep -r "from 'react-router-dom'" --include="*.tsx" --exclude-dir=platform --exclude-dir=node_modules

# Check for unguarded localStorage (review results)
grep -r "localStorage\." --include="*.tsx" --include="*.ts" | grep -v platform | grep -v lib

# Check for unguarded window access (review results)
grep -r "window\." --include="*.tsx" --include="*.ts" | grep -v "typeof window" | grep -v platform
```

---

## 🎯 Remember

1. **Always use platform abstraction layer**
2. **Guard all web APIs with typeof checks**
3. **Prefer AsyncStorage over localStorage**
4. **Use Platform.select() for platform-specific code**
5. **Test on multiple platforms when possible**

**Your code should work on web NOW and be ready for iOS/Android LATER!** 🚀
