# VHV Platform - Cross-Platform Abstraction Layer

A complete abstraction layer that enables your React application to run on both **Web** and **React Native** with minimal code changes.

## 🎯 Overview

The platform layer provides a unified API that works identically across web and native platforms. Instead of writing separate code for web (HTML elements) and native (React Native components), you write once using our platform primitives.

## 📦 What's Included

### UI Primitives
- **View** - Replaces `<div>` (web) and `<View>` (native)
- **Text** - Replaces `<span>` (web) and `<Text>` (native)
- **Image** - Replaces `<img>` (web) and `<Image>` (native)
- **ScrollView** - Scrollable container for both platforms
- **TextInput** - Input component for both platforms
- **TouchableOpacity** - Touchable with opacity feedback
- **Pressable** - Advanced touchable with state

### Navigation
- **Router** - react-router-dom (web) / react-navigation (native)
- **Routes** - Route container
- **Route** - Individual route definition
- **Link** - Navigation link
- **NavLink** - Navigation link with active state
- **useNavigate** - Programmatic navigation hook
- **useLocation** - Current location hook
- **useParams** - Route params hook

### Storage
- **AsyncStorage** - localStorage (web) / AsyncStorage (native)
- **SessionStorage** - sessionStorage (web only)
- **StorageHelpers** - JSON helpers and utilities

### Performance
- **mark** - Create performance marks
- **measure** - Measure performance
- **timeAsync** - Time async functions
- **timeSync** - Time sync functions

### Platform Utilities
- **Platform** - Platform detection and selection
- **Dimensions** - Screen/window dimensions
- **StyleSheet** - Style creation helper
- **PixelRatio** - Pixel ratio utilities

### Hooks
- **usePlatformDimensions** - Get window dimensions
- **useBreakpoint** - Responsive breakpoints (mobile/tablet/desktop)
- **useOrientation** - Portrait/landscape detection
- **usePlatformBackHandler** - Handle back button/gesture

## 🚀 Quick Start

### Installation

The platform layer is already included in this project at `/platform`.

### Basic Usage

```tsx
import { View, Text, TouchableOpacity, Platform } from '@/platform';

function MyComponent() {
  return (
    <View className="container p-4">
      <Text className="text-lg font-bold">
        Hello from {Platform.OS}!
      </Text>
      <TouchableOpacity onPress={() => console.log('Pressed')}>
        <Text>Click me</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Navigation

```tsx
import { Router, Routes, Route, useNavigate, Link } from '@/platform';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

function Home() {
  const navigate = useNavigate();
  
  return (
    <View>
      <Link to="/about">
        <Text>Go to About</Text>
      </Link>
      <TouchableOpacity onPress={() => navigate('/about')}>
        <Text>Navigate to About</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Storage

```tsx
import { AsyncStorage, StorageHelpers } from '@/platform';

async function saveUser(user) {
  // Method 1: Direct
  await AsyncStorage.setItem('user', JSON.stringify(user));
  
  // Method 2: Using helper (recommended)
  await StorageHelpers.setJSON('user', user);
}

async function loadUser() {
  // Method 1: Direct
  const json = await AsyncStorage.getItem('user');
  return json ? JSON.parse(json) : null;
  
  // Method 2: Using helper (recommended)
  return await StorageHelpers.getJSON('user');
}
```

### Platform Detection

```tsx
import { Platform } from '@/platform';

// Check platform
if (Platform.isWeb()) {
  console.log('Running on web');
}

if (Platform.isNative()) {
  console.log('Running on native');
}

if (Platform.isIOS()) {
  console.log('Running on iOS');
}

// Platform-specific values
const padding = Platform.select({
  web: 20,
  ios: 15,
  android: 12,
  default: 16,
});

const styles = Platform.select({
  web: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  native: { elevation: 2 },
});
```

### Responsive Design

```tsx
import { useBreakpoint, usePlatformDimensions } from '@/platform';

function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const { width, height } = usePlatformDimensions();
  
  return (
    <View>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
      
      <Text>Screen: {width}x{height}</Text>
    </View>
  );
}
```

### Performance Monitoring

```tsx
import { mark, measure, timeAsync, Performance } from '@/platform';

// Mark points in time
Performance.mark('data-fetch-start');
const data = await fetchData();
Performance.mark('data-fetch-end');

// Measure duration
const timing = Performance.measure('data-fetch', 'data-fetch-start', 'data-fetch-end');
console.log(`Fetch took ${timing.duration}ms`);

// Or use timeAsync helper
const result = await Performance.timeAsync('data-fetch', async () => {
  return await fetchData();
});
// Automatically logs: ⏱️  data-fetch: 123.45ms
```

## 🎨 Styling Strategy

### Web: Tailwind CSS

On web, you can use Tailwind classes via `className`:

```tsx
<View className="bg-white p-4 rounded-lg shadow-md">
  <Text className="text-xl font-bold text-gray-900">Title</Text>
</View>
```

### Native: StyleSheet

On native, use the StyleSheet API:

```tsx
import { StyleSheet } from '@/platform';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
});

<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>
```

### Both: Hybrid Approach

You can use both together. On web, className takes precedence; on native, style is used:

```tsx
<View className="bg-white p-4" style={styles.container}>
  <Text className="text-xl" style={styles.title}>Title</Text>
</View>
```

### NativeWind (Recommended for Native)

For a consistent Tailwind experience on native, use NativeWind:

```bash
npm install nativewind
```

Then Tailwind classes work on both platforms!

## 📱 React Native Integration

### 1. Create Native Implementations

For each primitive, create a `.native.tsx` version:

**`View.native.tsx`**
```tsx
import { View as RNView } from 'react-native';
export const View = RNView;
```

**`Text.native.tsx`**
```tsx
import { Text as RNText } from 'react-native';
export const Text = RNText;
```

### 2. Install Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack

# Storage
npm install @react-native-async-storage/async-storage

# Icons
npm install react-native-vector-icons
```

### 3. Update Platform Utils

**`platform.native.ts`**
```tsx
import { 
  Platform, 
  Dimensions, 
  StyleSheet, 
  PixelRatio 
} from 'react-native';

export { Platform, Dimensions, StyleSheet, PixelRatio };
```

## 🔧 Advanced Usage

### Custom Platform-Specific Components

Create different implementations for different platforms:

**`MyComponent.tsx`** (shared interface)
```tsx
export interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps>;
```

**`MyComponent.web.tsx`** (web implementation)
```tsx
export const MyComponent = ({ title }) => (
  <div className="web-specific">{title}</div>
);
```

**`MyComponent.native.tsx`** (native implementation)
```tsx
export const MyComponent = ({ title }) => (
  <View style={styles.native}>
    <Text>{title}</Text>
  </View>
);
```

### Conditional Imports

```tsx
// This will automatically import the right version
import { MyComponent } from './MyComponent';

// Platform-specific imports
const WebOnlyComponent = Platform.isWeb() 
  ? require('./WebOnly').default 
  : null;
```

## 📝 API Reference

### View

```tsx
interface ViewProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  testID?: string;
}
```

### Text

```tsx
interface TextProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  testID?: string;
}
```

### TouchableOpacity

```tsx
interface TouchableOpacityProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onPress?: () => void;
  disabled?: boolean;
  activeOpacity?: number;
  testID?: string;
}
```

### AsyncStorage

```tsx
interface Storage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
  multiGet(keys: string[]): Promise<[string, string | null][]>;
  multiSet(keyValuePairs: [string, string][]): Promise<void>;
  multiRemove(keys: string[]): Promise<void>;
}
```

## 🧪 Testing

### Test on Web

```bash
npm run dev
```

### Test on Native

```bash
# iOS
npx react-native run-ios

# Android  
npx react-native run-android
```

## 🎯 Best Practices

1. **Always use platform primitives** - Never use `<div>` or `<View>` directly
2. **Prefer platform-agnostic code** - Use Platform.select() for differences
3. **Test on both platforms** - What works on web may not work on native
4. **Use TypeScript** - Get full type safety across platforms
5. **Keep platform-specific code minimal** - Abstract differences when possible

## 🐛 Troubleshooting

### Import Errors

If you get import errors, check:
- File extensions are correct (`.tsx`, `.web.tsx`, `.native.tsx`)
- Metro bundler is configured for platform-specific extensions
- Paths are correct (`@/platform` or relative paths)

### Styling Issues

- On web, use `className` for Tailwind
- On native, use `style` prop with StyleSheet
- Consider using NativeWind for consistent Tailwind experience

### Navigation Issues

- Ensure Router is at the root level
- Check that routes are defined correctly
- Use `useNavigate()` hook for programmatic navigation

## 📚 Resources

- [React Native Documentation](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [NativeWind](https://www.nativewind.dev)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## 🤝 Contributing

To add new platform primitives:

1. Create the web version (`.tsx`)
2. Create the native version (`.native.tsx`)
3. Export from `index.ts`
4. Add documentation
5. Add tests

## 📄 License

Same as the main project.
