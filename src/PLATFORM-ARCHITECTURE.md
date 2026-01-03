# Platform Architecture

## Overview

The VHV Platform abstraction layer enables **Write Once, Run Anywhere** for React applications. Code written using our platform primitives runs identically on:

- ✅ Web (React + Vite + Tailwind)
- ✅ iOS (React Native)
- ✅ Android (React Native)
- ✅ Desktop (Electron - future)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Code                          │
│   (Components, Pages, Business Logic - Platform Agnostic)   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├─ import { View, Text } from '@/platform'
                     ├─ import { AsyncStorage } from '@/platform'
                     ├─ import { useNavigate } from '@/platform'
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 Platform Abstraction Layer                   │
│                      (/platform)                             │
├──────────────────────────────────────────────────────────────┤
│  Primitives  │  Navigation  │  Storage  │  Performance      │
│  - View      │  - Router    │  - Async  │  - mark()         │
│  - Text      │  - Routes    │    Storage│  - measure()      │
│  - Image     │  - Link      │  - Helpers│  - timeAsync()    │
│  - Touchable │  - useNav()  │           │                   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────┐         ┌────────▼────────┐
│   Web Layer  │         │  Native Layer   │
│              │         │                 │
│  • HTML/CSS  │         │  • React Native │
│  • DOM API   │         │  • Native APIs  │
│  • Browser   │         │  • iOS/Android  │
└──────────────┘         └─────────────────┘
```

## Layered Architecture

### Layer 1: Application Layer
- **Location**: `/components`, `/pages`, `/modules`
- **Purpose**: Business logic and UI components
- **Dependencies**: Only imports from Platform Layer
- **Platform-aware**: No
- **Example**: `UserProfile.tsx`, `DashboardPage.tsx`

### Layer 2: Platform Abstraction Layer
- **Location**: `/platform`
- **Purpose**: Provide unified API across platforms
- **Dependencies**: Platform-specific implementations
- **Platform-aware**: Yes (uses `.web.tsx` and `.native.tsx`)
- **Example**: `View.tsx`, `AsyncStorage.ts`

### Layer 3: Platform Implementation Layer
- **Location**: `/platform/**/*.{web,native}.tsx`
- **Purpose**: Platform-specific implementations
- **Dependencies**: Platform SDKs (React DOM, React Native)
- **Platform-aware**: Yes
- **Example**: `View.web.tsx`, `View.native.tsx`

## File Naming Convention

The platform layer uses file extensions to determine which implementation to use:

| Extension | Description | When Used |
|-----------|-------------|-----------|
| `.tsx` | Shared implementation | Works on all platforms |
| `.web.tsx` | Web-specific | Only on web |
| `.native.tsx` | Native-specific | Only on iOS/Android |
| `.ios.tsx` | iOS-specific | Only on iOS |
| `.android.tsx` | Android-specific | Only on Android |

**Resolution Order** (Metro Bundler):
1. `.ios.tsx` (iOS only)
2. `.android.tsx` (Android only)
3. `.native.tsx` (iOS & Android)
4. `.web.tsx` (Web only)
5. `.tsx` (All platforms)

**Example**:
```
platform/
  primitives/
    View.tsx          ← Shared interface/web implementation
    View.native.tsx   ← React Native implementation
    Text.tsx          ← Shared interface/web implementation
    Text.native.tsx   ← React Native implementation
```

## Platform Primitives

### View Component

**Purpose**: Container element (replaces `<div>`)

**Web Implementation** (`View.tsx`):
```tsx
export const View = ({ children, className, style, ...props }) => (
  <div className={className} style={style} {...props}>
    {children}
  </div>
);
```

**Native Implementation** (`View.native.tsx`):
```tsx
import { View as RNView } from 'react-native';

export const View = ({ className, ...props }) => (
  <RNView {...props} />
);
```

**Usage** (Platform-agnostic):
```tsx
import { View } from '@/platform';

<View className="bg-white p-4">
  {/* Content */}
</View>
```

### Text Component

**Purpose**: Text element (replaces `<span>`, `<p>`, `<h1>`, etc.)

**Key Features**:
- Number of lines truncation
- Ellipsis mode
- Selectable text control
- Consistent styling API

### TouchableOpacity Component

**Purpose**: Pressable element with opacity feedback

**Web**: Uses `<button>` with opacity transitions
**Native**: Uses React Native's `TouchableOpacity`

## Navigation Abstraction

### Web Implementation
Uses `react-router-dom`:
```tsx
export const Router = BrowserRouter;
export const Routes = WebRoutes;
export const useNavigate = useWebNavigate;
```

### Native Implementation
Uses `@react-navigation/native`:
```tsx
export const Router = NavigationContainer;
export const Routes = Stack.Navigator;
export const useNavigate = useNavigation;
```

### Usage
```tsx
import { Router, Routes, Route, useNavigate } from '@/platform';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

function MyComponent() {
  const navigate = useNavigate();
  return <Button onPress={() => navigate('/home')} />;
}
```

## Storage Abstraction

### Web Implementation
Uses `localStorage`:
```tsx
class WebStorage {
  async getItem(key) {
    return localStorage.getItem(key);
  }
  async setItem(key, value) {
    localStorage.setItem(key, value);
  }
}
```

### Native Implementation
Uses `@react-native-async-storage/async-storage`:
```tsx
import AsyncStorageNative from '@react-native-async-storage/async-storage';

export const AsyncStorage = AsyncStorageNative;
```

### Usage
```tsx
import { AsyncStorage, StorageHelpers } from '@/platform';

// Save
await StorageHelpers.setJSON('user', userData);

// Load
const user = await StorageHelpers.getJSON('user');
```

## Performance Monitoring

### Web Implementation
Uses native Performance API:
```tsx
class PlatformPerformance {
  mark(name) {
    performance.mark(name);
  }
  measure(name, start, end) {
    return performance.measure(name, start, end);
  }
}
```

### Native Implementation
Custom implementation with timestamps:
```tsx
class PlatformPerformance {
  private marks = new Map();
  
  mark(name) {
    this.marks.set(name, Date.now());
  }
  measure(name, start, end) {
    const duration = this.marks.get(end) - this.marks.get(start);
    return { name, duration };
  }
}
```

## Platform Detection

### Platform Utilities

```tsx
export const Platform = {
  OS: 'web' | 'ios' | 'android',
  
  select: (specifics) => {
    // Returns platform-specific value
  },
  
  isWeb: () => Platform.OS === 'web',
  isNative: () => Platform.OS === 'ios' || Platform.OS === 'android',
  isIOS: () => Platform.OS === 'ios',
  isAndroid: () => Platform.OS === 'android',
};
```

### Usage

```tsx
import { Platform } from '@/platform';

// Conditional code
if (Platform.isWeb()) {
  // Web-specific code
}

// Platform-specific values
const padding = Platform.select({
  web: 20,
  ios: 15,
  android: 12,
  default: 16,
});

// Platform-specific styles
const styles = Platform.select({
  web: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  native: { elevation: 4 },
});
```

## Responsive Hooks

### usePlatformDimensions

Get screen/window dimensions:
```tsx
const { width, height, scale, fontScale } = usePlatformDimensions();
```

### useBreakpoint

Responsive breakpoints:
```tsx
const { isMobile, isTablet, isDesktop } = useBreakpoint();

// Breakpoints:
// isMobile: < 768px
// isTablet: 768px - 1024px
// isDesktop: > 1024px
```

### useOrientation

Portrait/landscape detection:
```tsx
const { isPortrait, isLandscape } = useOrientation();
```

## Styling Strategy

### Hybrid Approach (Recommended)

Use both Tailwind (web) and StyleSheet (native):

```tsx
import { View, Text, StyleSheet } from '@/platform';

<View className="bg-white p-4" style={styles.container}>
  <Text className="text-xl" style={styles.title}>Hello</Text>
</View>

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
  },
});
```

**How it works**:
- On **web**: Both className and style are applied
- On **native**: Only style is applied (className is ignored)

### Platform-Specific Styles

```tsx
const styles = StyleSheet.create({
  container: {
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      native: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
});
```

## Data Flow

### 1. User Interaction
```
User Click → TouchableOpacity → onPress handler
```

### 2. Navigation
```
onPress → navigate('/page') → Platform Router → Route Change
```

### 3. Data Persistence
```
Save Data → AsyncStorage → Platform Storage → localStorage/AsyncStorage
```

### 4. State Management
```
Component State → React State → Re-render → Platform Primitives → DOM/Native Views
```

## Build Process

### Web Build
```
Source Code
  → TypeScript Compiler
  → Vite Bundler
  → Optimized Web Bundle
  → Deploy to CDN
```

### Native Build
```
Source Code
  → TypeScript Compiler
  → Metro Bundler
  → React Native Compiler
  → Native App Bundle (iOS/Android)
  → App Store/Play Store
```

## Performance Optimizations

### Code Splitting (Web)
- Lazy loading routes
- Dynamic imports
- Tree shaking

### Bundle Size Optimization (Native)
- Platform-specific bundles
- Remove unused code
- Hermes engine (Android)

### Runtime Performance
- Memoization (React.memo, useMemo)
- Virtual lists for long scrolls
- Image lazy loading
- Debouncing/throttling

## Type Safety

All platform APIs are fully typed:

```tsx
import type { ViewProps, TextProps, TouchableOpacityProps } from '@/platform';

// Full TypeScript autocomplete and type checking
const MyComponent: React.FC<ViewProps> = (props) => {
  return <View {...props} />;
};
```

## Testing Strategy

### Unit Tests
Test components using platform primitives:
```tsx
import { render } from '@testing-library/react';
import { View, Text } from '@/platform';

test('renders correctly', () => {
  const { getByText } = render(
    <View>
      <Text>Hello</Text>
    </View>
  );
  expect(getByText('Hello')).toBeInTheDocument();
});
```

### Platform-Specific Tests
- **Web**: Jest + React Testing Library
- **Native**: Jest + React Native Testing Library

## Migration Path

### Phase 1: Add Platform Layer
1. Copy `/platform` to your project
2. Install dependencies

### Phase 2: Migrate Components
1. Replace HTML elements with primitives
2. Replace browser APIs with platform APIs
3. Update styling approach

### Phase 3: Test
1. Test on web
2. Create native project
3. Copy platform layer
4. Create native implementations
5. Test on iOS/Android

## Best Practices

### ✅ Do's
- Use platform primitives for all UI elements
- Use AsyncStorage for all data persistence
- Use platform hooks for dimensions/breakpoints
- Test on all target platforms
- Keep platform-specific code minimal

### ❌ Don'ts
- Don't use HTML elements directly
- Don't use browser APIs (localStorage, fetch, etc.)
- Don't hardcode dimensions or breakpoints
- Don't assume web-only libraries will work on native
- Don't write platform-specific code in application layer

## Future Enhancements

### Planned Features
- [ ] Electron support (desktop apps)
- [ ] Better animation API (unified Motion/Animated)
- [ ] Form library (cross-platform forms)
- [ ] Advanced gesture handling
- [ ] Accessibility improvements
- [ ] Developer tools integration

## Resources

- [Platform Layer README](/platform/README.md)
- [React Native Setup Guide](/REACT-NATIVE-SETUP.md)
- [Migration Guide](/MIGRATION-GUIDE.md)
- [Examples](/platform/examples/)

## Support

For questions or issues:
- Check documentation first
- Review examples
- Search existing issues
- Create new issue with reproduction

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintainer**: VHV Platform Team
