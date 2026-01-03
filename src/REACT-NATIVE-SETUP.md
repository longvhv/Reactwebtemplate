# React Native Setup Guide

This application is now 100% React Native Ready with a complete cross-platform abstraction layer.

## Architecture Overview

The application uses a **platform abstraction layer** located in `/platform` that provides:

- ✅ **UI Primitives**: View, Text, Image, ScrollView, TextInput, Touchable components
- ✅ **Navigation**: Router abstraction (react-router-dom for web, react-navigation for native)
- ✅ **Storage**: AsyncStorage API (localStorage for web, @react-native-async-storage for native)
- ✅ **Performance**: Performance monitoring (Performance API for web, custom for native)
- ✅ **Platform Utils**: Platform detection, Dimensions, StyleSheet helpers
- ✅ **Hooks**: usePlatformDimensions, useBreakpoint, useOrientation, usePlatformBackHandler

## Folder Structure

```
/platform
├── primitives/          # Cross-platform UI components
│   ├── View.tsx         # Web: div, Native: View
│   ├── Text.tsx         # Web: span, Native: Text
│   ├── Image.tsx        # Web: img, Native: Image
│   ├── ScrollView.tsx   # Scrollable container
│   ├── TextInput.tsx    # Input component
│   ├── Touchable.tsx    # TouchableOpacity & Pressable
│   └── index.ts         # Exports
├── navigation/          # Navigation abstraction
│   └── Router.tsx       # Web: react-router, Native: react-navigation
├── storage/             # Storage abstraction
│   └── index.ts         # Web: localStorage, Native: AsyncStorage
├── performance/         # Performance monitoring
│   └── index.ts         # Cross-platform performance API
├── hooks/               # Platform hooks
│   ├── usePlatformDimensions.ts
│   ├── usePlatformBackHandler.ts
│   └── index.ts
├── utils/               # Platform utilities
│   └── platform.ts      # Platform, Dimensions, StyleSheet
└── index.ts             # Main exports
```

## Setting Up React Native

### 1. Install React Native CLI

```bash
npm install -g react-native-cli
# or
yarn global add react-native-cli
```

### 2. Create React Native Project

```bash
# Create new React Native project
npx react-native init YourAppName

# Or use Expo (recommended for faster setup)
npx create-expo-app YourAppName
```

### 3. Install Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

# Storage
npm install @react-native-async-storage/async-storage

# Vector Icons
npm install react-native-vector-icons

# SVG Support
npm install react-native-svg

# For Expo projects, install expo equivalents:
npx expo install @react-navigation/native react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
```

### 4. Copy Platform Layer

Copy the entire `/platform` folder to your React Native project:

```bash
cp -r /platform /path/to/your-react-native-app/src/platform
```

### 5. Create Native Implementations

Create `.native.tsx` versions for native-specific implementations:

**`/platform/primitives/View.native.tsx`**
```tsx
import { View as RNView } from 'react-native';
import type { ViewProps as RNViewProps } from 'react-native';

export interface ViewProps extends RNViewProps {
  className?: string; // Ignored on native
}

export const View: React.FC<ViewProps> = ({ className, ...props }) => {
  return <RNView {...props} />;
};
```

**`/platform/primitives/Text.native.tsx`**
```tsx
import { Text as RNText } from 'react-native';
import type { TextProps as RNTextProps } from 'react-native';

export interface TextProps extends RNTextProps {}

export const Text: React.FC<TextProps> = (props) => {
  return <RNText {...props} />;
};
```

**`/platform/storage/index.native.ts`**
```tsx
import AsyncStorageNative from '@react-native-async-storage/async-storage';

export const AsyncStorage = AsyncStorageNative;
export default AsyncStorage;
```

**`/platform/navigation/Router.native.tsx`**
```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const Router = NavigationContainer;
export const Routes = Stack.Navigator;
export const Route = Stack.Screen;

// Export navigation hooks
export { useNavigation, useRoute } from '@react-navigation/native';
```

### 6. Update Platform Detection

**`/platform/utils/platform.native.ts`**
```tsx
import { Platform as RNPlatform, Dimensions as RNDimensions, StyleSheet as RNStyleSheet, PixelRatio as RNPixelRatio } from 'react-native';

export const Platform = RNPlatform;
export const Dimensions = RNDimensions;
export const StyleSheet = RNStyleSheet;
export const PixelRatio = RNPixelRatio;
```

### 7. Configure Metro Bundler

Update `metro.config.js` to support platform-specific extensions:

```javascript
module.exports = {
  resolver: {
    sourceExts: ['tsx', 'ts', 'jsx', 'js', 'json'],
    platforms: ['ios', 'android', 'native', 'web'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
```

## Using the Platform Layer

### Import Components

Instead of using HTML elements or React Native components directly, import from `/platform`:

```tsx
// ❌ Don't do this
import { View, Text } from 'react-native'; // Only works on native
const MyComponent = () => <div>Content</div>; // Only works on web

// ✅ Do this
import { View, Text } from '@/platform';

const MyComponent = () => (
  <View className="container">
    <Text>This works on both web and native!</Text>
  </View>
);
```

### Navigation

```tsx
import { Router, Routes, Route, useNavigate } from '@/platform';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <TouchableOpacity onPress={() => navigate('/profile')}>
      <Text>Go to Profile</Text>
    </TouchableOpacity>
  );
}
```

### Storage

```tsx
import { AsyncStorage, StorageHelpers } from '@/platform';

// Save data
await AsyncStorage.setItem('user', JSON.stringify(userData));

// Or use helper
await StorageHelpers.setJSON('user', userData);

// Get data
const user = await StorageHelpers.getJSON('user');
```

### Platform Detection

```tsx
import { Platform } from '@/platform';

if (Platform.isWeb()) {
  // Web-specific code
}

if (Platform.isNative()) {
  // Native-specific code
}

const styles = Platform.select({
  web: { padding: 20 },
  native: { padding: 10 },
  default: { padding: 15 },
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
      {isMobile && <Text>Mobile View</Text>}
      {isTablet && <Text>Tablet View</Text>}
      {isDesktop && <Text>Desktop View</Text>}
      <Text>Width: {width}px</Text>
    </View>
  );
}
```

## Styling Strategy

### Option 1: Tailwind CSS (Web) + StyleSheet (Native)

Use className on web, and StyleSheet on native:

```tsx
import { View, Text, StyleSheet } from '@/platform';

const MyComponent = () => (
  <View className="bg-white p-4" style={styles.container}>
    <Text className="text-lg font-bold" style={styles.title}>
      Hello World
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### Option 2: NativeWind (Tailwind for React Native)

Install NativeWind for consistent Tailwind experience:

```bash
npm install nativewind
npm install --save-dev tailwindcss
```

## File Naming Convention

- `.tsx` - Shared code (works on both platforms)
- `.web.tsx` - Web-specific implementation
- `.native.tsx` - React Native-specific implementation
- `.ios.tsx` - iOS-specific implementation
- `.android.tsx` - Android-specific implementation

Metro bundler and webpack will automatically pick the right file based on platform.

## Migration Checklist

- [x] Create `/platform` abstraction layer
- [x] Implement UI primitives (View, Text, Image, etc.)
- [x] Implement navigation abstraction
- [x] Implement storage abstraction
- [x] Implement performance monitoring
- [x] Create platform utilities
- [x] Create responsive hooks
- [ ] Create native implementations (`.native.tsx` files)
- [ ] Set up React Native project
- [ ] Install dependencies
- [ ] Configure Metro bundler
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Set up CI/CD for native builds

## Testing

### Web Testing
```bash
npm run dev  # or yarn dev
```

### Native Testing
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android

# Expo
npx expo start
```

## Common Pitfalls

1. **Don't use HTML elements directly** - Always use platform primitives
2. **Don't use browser APIs** - Use platform abstraction (localStorage → AsyncStorage)
3. **Don't hardcode dimensions** - Use responsive hooks
4. **Don't assume web-only libraries** - Check if library has native support
5. **Test on both platforms** - What works on web might not work on native

## Benefits

✅ **Single Codebase**: Write once, run on web, iOS, and Android
✅ **Type Safety**: Full TypeScript support
✅ **Performance**: Optimized for both platforms
✅ **Maintainability**: Changes propagate to all platforms
✅ **Developer Experience**: Consistent API across platforms
✅ **Future-Proof**: Easy to add new platforms

## Next Steps

1. Set up React Native project
2. Copy platform layer
3. Create native implementations
4. Test components on both platforms
5. Build and deploy

For questions or issues, refer to:
- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [Expo Docs](https://docs.expo.dev)
