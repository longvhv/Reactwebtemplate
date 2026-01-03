# Migration Guide: Web to React Native

## Overview

Hướng dẫn chi tiết để migrate ứng dụng hiện tại từ web sang React Native. Nhờ platform abstraction layer, việc migration này sẽ không cần thay đổi business logic.

---

## Phase 1: Project Setup (1-2 days)

### Step 1.1: Initialize React Native Project

```bash
# Create new React Native project
npx react-native@latest init VHVPlatformMobile --template react-native-template-typescript

# Navigate to project
cd VHVPlatformMobile
```

### Step 1.2: Install Essential Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# Storage
npm install @react-native-async-storage/async-storage

# UI Components
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-svg react-native-linear-gradient

# Icons (alternative to lucide-react)
npm install react-native-vector-icons

# i18n (same as web)
npm install i18next react-i18next

# State Management (if needed)
npm install zustand # Already using in web

# HTTP Client
npm install axios # Optional, platformFetch should work
```

### Step 1.3: Copy Shared Code

```bash
# Create shared directory structure
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/utils
mkdir -p src/types
mkdir -p src/constants
mkdir -p src/services
mkdir -p src/i18n
mkdir -p src/platform

# Copy from web project (these are platform-agnostic)
cp -r ../vhv-platform-web/components/common src/components/
cp -r ../vhv-platform-web/hooks src/
cp -r ../vhv-platform-web/lib src/
cp -r ../vhv-platform-web/utils src/
cp -r ../vhv-platform-web/types src/
cp -r ../vhv-platform-web/constants src/
cp -r ../vhv-platform-web/services src/
cp -r ../vhv-platform-web/i18n src/
cp -r ../vhv-platform-web/platform src/
```

---

## Phase 2: Platform-Specific Implementations (2-3 days)

### Step 2.1: Storage Implementation

**File:** `src/platform/storage/index.native.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * React Native Storage Implementation
 */

export async function getFromStorage<T>(
  key: string,
  defaultValue: T
): Promise<T> {
  try {
    const item = await AsyncStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Storage get error:', error);
    return defaultValue;
  }
}

export async function setToStorage<T>(
  key: string,
  value: T
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Storage set error:', error);
    return false;
  }
}

export async function removeFromStorage(key: string): Promise<boolean> {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Storage remove error:', error);
    return false;
  }
}

export async function clearStorage(): Promise<boolean> {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Storage clear error:', error);
    return false;
  }
}

export function isStorageAvailable(): boolean {
  return true; // Always available in RN
}
```

### Step 2.2: Navigation Implementation

**File:** `src/navigation/RootNavigator.tsx`

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1', // indigo-500
        tabBarInactiveTintColor: '#9ca3af', // gray-400
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Step 2.3: Theme Implementation

**File:** `src/platform/theme/index.native.ts`

```typescript
import { useColorScheme } from 'react-native';

/**
 * React Native Theme Detection
 */

export function useSystemTheme(): 'light' | 'dark' {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
}

export const colors = {
  light: {
    primary: '#6366f1',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
  },
  dark: {
    primary: '#818cf8',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    border: '#374151',
  },
};
```

### Step 2.4: Update Providers

**File:** `src/App.tsx`

```typescript
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider } from './providers/ThemeProvider';
import { LanguageProvider } from './providers/LanguageProvider';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <StatusBar barStyle="dark-content" />
            <RootNavigator />
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

---

## Phase 3: UI Components Adaptation (3-5 days)

### Step 3.1: Replace Web Components

| Web Component | React Native Alternative |
|---------------|-------------------------|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` |
| `<input>` | `<TextInput>` |
| `<img>` | `<Image>` |
| CSS classes | StyleSheet |

### Step 3.2: Create Base Components

**File:** `src/components/ui/Button.tsx`

```typescript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#6366f1',
  },
  secondary: {
    backgroundColor: '#e5e7eb',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

**File:** `src/components/ui/Input.tsx`

```typescript
import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
}: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#9ca3af"
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
});
```

### Step 3.3: Create Screen Templates

**File:** `src/screens/DashboardScreen.tsx`

```typescript
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from '../hooks/useTranslation';

export default function DashboardScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t('dashboard.title')}</Text>
          <Text style={styles.subtitle}>{t('dashboard.welcome')}</Text>
        </View>

        <View style={styles.content}>
          {/* Your dashboard content */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    padding: 20,
  },
});
```

---

## Phase 4: Business Logic Migration (2-3 days)

### Step 4.1: Service Layer
✅ **No changes needed** - Services already use `platformFetch`

### Step 4.2: State Management
✅ **No changes needed** - Zustand works on React Native

### Step 4.3: Hooks
✅ **No changes needed** - All hooks are platform-agnostic

### Step 4.4: Utilities
✅ **No changes needed** - All utilities have proper guards

---

## Phase 5: Testing & Optimization (3-5 days)

### Step 5.1: Unit Tests

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native jest

# Run tests
npm test
```

### Step 5.2: Integration Tests

```typescript
// __tests__/navigation.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { RootNavigator } from '../navigation/RootNavigator';

describe('Navigation', () => {
  it('navigates between screens', () => {
    const { getByText } = render(<RootNavigator />);
    
    const profileButton = getByText('Profile');
    fireEvent.press(profileButton);
    
    expect(getByText('Profile Screen')).toBeTruthy();
  });
});
```

### Step 5.3: Performance Optimization

```typescript
// Enable Hermes engine in android/app/build.gradle
project.ext.react = [
    enableHermes: true
]

// Enable new architecture (optional)
newArchEnabled=true
```

---

## Phase 6: Platform-Specific Features

### iOS Specific

**File:** `ios/Podfile`
```ruby
platform :ios, '13.0'
use_frameworks!

# Add required pods
pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
```

**File:** `Info.plist`
```xml
<!-- Add fonts -->
<key>UIAppFonts</key>
<array>
  <string>Inter-Regular.ttf</string>
  <string>Inter-Bold.ttf</string>
</array>
```

### Android Specific

**File:** `android/app/build.gradle`
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

android {
    defaultConfig {
        applicationId "com.vhvplatform"
        minSdkVersion 21
        targetSdkVersion 33
    }
}
```

---

## Timeline Summary

| Phase | Duration | Tasks |
|-------|----------|-------|
| 1. Project Setup | 1-2 days | Initialize RN, install deps |
| 2. Platform Implementation | 2-3 days | Storage, navigation, theme |
| 3. UI Adaptation | 3-5 days | Convert components to RN |
| 4. Business Logic | 2-3 days | Migrate services (minimal) |
| 5. Testing | 3-5 days | Unit, integration, E2E tests |
| 6. Platform Features | 2-3 days | iOS/Android specific |
| **Total** | **13-21 days** | **~3-4 weeks** |

---

## Migration Checklist

### Pre-Migration
- [ ] Audit complete (verified 100% RN ready)
- [ ] Platform abstraction layer verified
- [ ] All browser APIs guarded
- [ ] Storage utilities tested

### During Migration
- [ ] RN project initialized
- [ ] Dependencies installed
- [ ] Platform implementations created
- [ ] Navigation setup complete
- [ ] UI components converted
- [ ] Business logic migrated
- [ ] i18n configured
- [ ] Theme system working

### Post-Migration
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Performance optimized
- [ ] iOS build successful
- [ ] Android build successful
- [ ] App submitted to stores

---

## Common Issues & Solutions

### Issue 1: Metro Bundler Errors
```bash
# Clear cache
npx react-native start --reset-cache
```

### Issue 2: iOS Build Fails
```bash
cd ios
pod deinstall
pod install
cd ..
npx react-native run-ios
```

### Issue 3: Android Build Fails
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Issue 4: Font Not Loading
```typescript
// Use react-native-vector-icons or custom fonts
import Icon from 'react-native-vector-icons/Feather';

<Icon name="home" size={24} color="#6366f1" />
```

---

## Resources

- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Platform Abstraction Best Practices](./REACT_NATIVE_READY.md)

---

## Support

For questions or issues during migration:
1. Check existing documentation
2. Review platform abstraction layer
3. Test on both iOS and Android
4. Consult React Native community

**Next:** Follow timeline and checklist để complete migration trong 3-4 weeks.
