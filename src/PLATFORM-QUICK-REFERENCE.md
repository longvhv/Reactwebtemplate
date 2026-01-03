# Platform Layer - Quick Reference Guide

**Version**: 2.0.0  
**Last Updated**: January 2, 2026

---

## 🚀 Quick Start

### Import Platform Components

```typescript
// UI Primitives
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, Pressable } from '@/platform';

// Navigation
import { Router, Routes, Route, Link, NavLink, useNavigate, useLocation, useParams } from '@/platform';

// Storage
import { AsyncStorage, StorageHelpers } from '@/platform';

// Hooks
import { usePlatformDimensions, useBreakpoint, useOrientation, usePlatformBackHandler } from '@/platform';

// Utilities
import { Platform, Dimensions, StyleSheet, PixelRatio } from '@/platform';

// Performance
import { Performance, mark, measure, timeAsync } from '@/platform';
```

---

## 📖 Cheat Sheet

### UI Primitives

| HTML Element | Platform Primitive | Example |
|--------------|-------------------|---------|
| `<div>` | `<View>` | `<View className="container">...</View>` |
| `<span>`, `<p>`, `<h1>` | `<Text>` | `<Text className="text-xl">Title</Text>` |
| `<img>` | `<Image>` | `<Image source={{ uri: '...' }} />` |
| `<input>` | `<TextInput>` | `<TextInput value={text} onChangeText={setText} />` |
| `<button>` | `<TouchableOpacity>` | `<TouchableOpacity onPress={handler}>...</TouchableOpacity>` |

### Navigation

```typescript
// Router setup (App.tsx)
import { Router } from '@/platform';

<Router>
  <AppContent />
</Router>

// Routes definition
import { Routes, Route } from '@/platform';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>

// Links
import { Link, NavLink } from '@/platform';

<Link to="/about">About</Link>
<NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>

// Programmatic navigation
import { useNavigate } from '@/platform';

const navigate = useNavigate();
navigate('/about');

// Get current location
import { useLocation } from '@/platform';

const location = useLocation();
console.log(location.pathname);

// Get route params
import { useParams } from '@/platform';

const { id } = useParams();
```

### Storage

```typescript
import { AsyncStorage, StorageHelpers } from '@/platform';

// Basic operations
await AsyncStorage.setItem('key', 'value');
const value = await AsyncStorage.getItem('key');
await AsyncStorage.removeItem('key');
await AsyncStorage.clear();

// JSON helpers (recommended)
await StorageHelpers.setJSON('user', { name: 'John' });
const user = await StorageHelpers.getJSON('user');

// Check if key exists
const exists = await StorageHelpers.hasKey('user');

// Multiple operations
const data = await StorageHelpers.getMultipleJSON(['key1', 'key2']);
```

### Platform Detection

```typescript
import { Platform } from '@/platform';

// Current platform
console.log(Platform.OS); // 'web' | 'ios' | 'android'

// Check platform
if (Platform.isWeb()) {
  // Web-specific code
}

if (Platform.isNative()) {
  // iOS/Android code
}

if (Platform.isIOS()) {
  // iOS only
}

if (Platform.isAndroid()) {
  // Android only
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
  web: {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  native: {
    elevation: 4,
  },
});
```

### Responsive Hooks

```typescript
import { usePlatformDimensions, useBreakpoint, useOrientation } from '@/platform';

// Get dimensions
const { width, height, scale, fontScale } = usePlatformDimensions();

// Breakpoints
const { isMobile, isTablet, isDesktop, isLargeDesktop } = useBreakpoint();

if (isMobile) {
  // Mobile layout
}

// Orientation
const { isPortrait, isLandscape } = useOrientation();
```

### Styling

```typescript
import { StyleSheet } from '@/platform';

// Create styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

// Use styles
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>

// Combine className and style (hybrid approach)
<View className="p-4 bg-white" style={styles.container}>
  <Text className="text-xl font-bold" style={styles.title}>Title</Text>
</View>
```

### Performance

```typescript
import { Performance, mark, measure, timeAsync, timeSync } from '@/platform';

// Marks
Performance.mark('start');
// ... code ...
Performance.mark('end');

// Measure
const timing = Performance.measure('operation', 'start', 'end');
console.log(timing.duration);

// Time async function
const result = await Performance.timeAsync('fetch-data', async () => {
  return await fetchData();
});
// Logs: ⏱️  fetch-data: 123.45ms

// Time sync function
const result = Performance.timeSync('calculation', () => {
  return complexCalculation();
});
```

---

## 🎯 Common Patterns

### Basic Component

```typescript
import { View, Text, TouchableOpacity, StyleSheet } from '@/platform';

export function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <TouchableOpacity onPress={() => console.log('Pressed')} style={styles.button}>
        <Text style={styles.buttonText}>Click Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
```

### Responsive Component

```typescript
import { View, Text, useBreakpoint, StyleSheet } from '@/platform';

export function ResponsiveComponent() {
  const { isMobile, isDesktop } = useBreakpoint();
  
  return (
    <View style={[styles.container, isMobile && styles.mobileContainer]}>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  mobileContainer: {
    padding: 8,
  },
});
```

### Form with Storage

```typescript
import { View, Text, TextInput, TouchableOpacity, StorageHelpers } from '@/platform';
import { useState, useEffect } from 'react';

export function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      const data = await StorageHelpers.getJSON('userForm');
      if (data) {
        setName(data.name || '');
        setEmail(data.email || '');
      }
    };
    loadData();
  }, []);
  
  // Save data
  const handleSave = async () => {
    await StorageHelpers.setJSON('userForm', { name, email });
    console.log('Saved!');
  };
  
  return (
    <View className="p-4">
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        className="border p-2 rounded mb-2"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        className="border p-2 rounded mb-4"
      />
      <TouchableOpacity onPress={handleSave} className="bg-blue-600 p-3 rounded">
        <Text className="text-white text-center">Save</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Navigation Component

```typescript
import { View, Text, Link, useNavigate, useLocation } from '@/platform';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <View className="flex gap-2">
      <Link to="/" className={isActive('/') ? 'font-bold' : ''}>
        Home
      </Link>
      <Link to="/about" className={isActive('/about') ? 'font-bold' : ''}>
        About
      </Link>
      <TouchableOpacity onPress={() => navigate('/settings')}>
        <Text>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Platform-Specific Code

```typescript
import { View, Text, Platform, StyleSheet } from '@/platform';

export function PlatformSpecificComponent() {
  return (
    <View style={styles.container}>
      <Text>Running on: {Platform.OS}</Text>
      
      {Platform.isWeb() && (
        <Text>Web-specific feature</Text>
      )}
      
      {Platform.isNative() && (
        <Text>Mobile-specific feature</Text>
      )}
    </View>
  );
}

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

---

## 🎨 Styling Strategy

### Hybrid Approach (Recommended)

Use both Tailwind classes (web) and StyleSheet (native):

```typescript
<View className="bg-white p-4 rounded-lg" style={styles.container}>
  <Text className="text-xl font-bold" style={styles.title}>Title</Text>
</View>

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
```

**How it works**:
- **Web**: Both `className` and `style` are applied
- **Native**: Only `style` is applied (className ignored)

### Pure StyleSheet (Native-focused)

```typescript
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
```

### Pure Tailwind (Web-focused)

```typescript
<View className="bg-white p-4">
  <Text className="text-xl font-bold">Title</Text>
</View>
```

---

## ⚠️ Common Mistakes

### ❌ Don't Do This

```typescript
// ❌ Direct HTML elements
<div>...</div>
<span>Text</span>
<button>Click</button>

// ❌ Direct browser APIs
localStorage.setItem('key', 'value');

// ❌ Direct web routing
import { useNavigate } from 'react-router-dom';

// ❌ Web-only event handlers
onClick={handler}
```

### ✅ Do This

```typescript
// ✅ Platform primitives
<View>...</View>
<Text>Text</Text>
<TouchableOpacity onPress={handler}>...</TouchableOpacity>

// ✅ Platform storage
import { AsyncStorage } from '@/platform';
await AsyncStorage.setItem('key', 'value');

// ✅ Platform routing
import { useNavigate } from '@/platform';

// ✅ Cross-platform events
onPress={handler}
```

---

## 📚 Complete API Reference

See `/platform/README.md` for complete API documentation.

---

## 🎓 Learning Path

1. **Start**: Read this quick reference (10 min)
2. **Practice**: Migrate a simple component (30 min)
3. **Deep Dive**: Read `PLATFORM-ARCHITECTURE.md` (30 min)
4. **Advanced**: Review examples in `/platform/examples/` (30 min)

---

## 🔗 Related Documentation

- [Platform Architecture](./PLATFORM-ARCHITECTURE.md) - Architecture overview
- [Migration Guide](./MIGRATION-GUIDE.md) - How to migrate existing code
- [React Native Setup](./REACT-NATIVE-SETUP.md) - Setup React Native
- [Platform API Reference](./platform/README.md) - Complete API docs

---

**Version**: 2.0.0  
**Updated**: January 2, 2026  
**Status**: Production Ready
