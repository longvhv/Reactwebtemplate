# Migration Guide: Web-Only to React Native Ready

This guide will help you migrate existing web-only components to use the cross-platform abstraction layer.

## 🎯 Migration Strategy

### Phase 1: Replace HTML Elements with Platform Primitives
### Phase 2: Replace Browser APIs with Platform APIs
### Phase 3: Update Styling Approach
### Phase 4: Test on Both Platforms

---

## Phase 1: Replace HTML Elements

### Step 1: Update Imports

**Before (Web-only):**
```tsx
import React from 'react';
```

**After (Platform-ready):**
```tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from '@/platform';
```

### Step 2: Replace Elements

| HTML Element | Replace With | Notes |
|-------------|--------------|-------|
| `<div>` | `<View>` | Block container |
| `<span>` | `<Text>` | Inline text |
| `<p>` | `<Text>` | Paragraph text |
| `<h1>`...`<h6>` | `<Text>` | Use style/className for sizing |
| `<img>` | `<Image>` | Requires `source` prop |
| `<input>` | `<TextInput>` | Different API |
| `<button>` | `<TouchableOpacity>` | Touch-friendly |
| `<a>` | `<TouchableOpacity>` + `Link` | For navigation |

### Examples

#### Example 1: Simple Container

**Before:**
```tsx
<div className="container p-4">
  <h1 className="text-2xl font-bold">Title</h1>
  <p className="text-gray-600">Description</p>
</div>
```

**After:**
```tsx
<View className="container p-4">
  <Text className="text-2xl font-bold">Title</Text>
  <Text className="text-gray-600">Description</Text>
</View>
```

#### Example 2: Button

**Before:**
```tsx
<button 
  className="bg-blue-600 px-4 py-2 rounded"
  onClick={() => console.log('clicked')}
>
  Click me
</button>
```

**After:**
```tsx
<TouchableOpacity
  className="bg-blue-600 px-4 py-2 rounded"
  onPress={() => console.log('clicked')}
>
  <Text className="text-white">Click me</Text>
</TouchableOpacity>
```

#### Example 3: Image

**Before:**
```tsx
<img 
  src="/avatar.jpg" 
  alt="Avatar"
  className="w-20 h-20 rounded-full"
/>
```

**After:**
```tsx
<Image
  source={{ uri: '/avatar.jpg' }}
  alt="Avatar"
  className="w-20 h-20 rounded-full"
  style={{ width: 80, height: 80 }}
/>
```

#### Example 4: Input

**Before:**
```tsx
<input
  type="text"
  value={text}
  onChange={(e) => setText(e.target.value)}
  placeholder="Enter text"
  className="border px-3 py-2 rounded"
/>
```

**After:**
```tsx
<TextInput
  value={text}
  onChangeText={setText}
  placeholder="Enter text"
  className="border px-3 py-2 rounded"
/>
```

---

## Phase 2: Replace Browser APIs

### localStorage → AsyncStorage

**Before:**
```tsx
// Save
localStorage.setItem('user', JSON.stringify(userData));

// Load
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Remove
localStorage.removeItem('user');
```

**After:**
```tsx
import { AsyncStorage, StorageHelpers } from '@/platform';

// Save (using helper - recommended)
await StorageHelpers.setJSON('user', userData);

// Load (using helper - recommended)
const user = await StorageHelpers.getJSON('user');

// Remove
await AsyncStorage.removeItem('user');
```

### window.location → useNavigate

**Before:**
```tsx
window.location.href = '/dashboard';
```

**After:**
```tsx
import { useNavigate } from '@/platform';

const navigate = useNavigate();
navigate('/dashboard');
```

### window.innerWidth → usePlatformDimensions

**Before:**
```tsx
const [width, setWidth] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

**After:**
```tsx
import { usePlatformDimensions } from '@/platform';

const { width } = usePlatformDimensions();
```

### Media Queries → useBreakpoint

**Before:**
```tsx
const [isMobile, setIsMobile] = useState(
  window.matchMedia('(max-width: 768px)').matches
);

useEffect(() => {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  const handler = (e) => setIsMobile(e.matches);
  mediaQuery.addListener(handler);
  return () => mediaQuery.removeListener(handler);
}, []);
```

**After:**
```tsx
import { useBreakpoint } from '@/platform';

const { isMobile } = useBreakpoint();
```

---

## Phase 3: Update Styling

### Hybrid Approach (Recommended)

Use both Tailwind classes (web) and StyleSheet (native):

```tsx
import { View, Text, StyleSheet } from '@/platform';

function MyComponent() {
  return (
    <View className="bg-white p-4" style={styles.container}>
      <Text className="text-xl font-bold" style={styles.title}>
        Hello World
      </Text>
    </View>
  );
}

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

### Platform-Specific Styles

```tsx
import { Platform } from '@/platform';

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      native: {
        elevation: 4,
      },
    }),
  },
});
```

---

## Phase 4: Component Migration Checklist

For each component, follow this checklist:

- [ ] Replace all HTML elements with platform primitives
- [ ] Replace `onClick` with `onPress`
- [ ] Replace `onChange` with `onChangeText` (for inputs)
- [ ] Update image sources to use `{ uri: '...' }` format
- [ ] Replace `className` text elements with `<Text>`
- [ ] Wrap clickable text in `<TouchableOpacity>`
- [ ] Replace localStorage with AsyncStorage
- [ ] Replace window APIs with platform hooks
- [ ] Add StyleSheet styles alongside className
- [ ] Test component in browser
- [ ] (Optional) Test component in React Native

---

## Complete Migration Example

### Before (Web-only)

```tsx
import React, { useState, useEffect } from 'react';

export function UserProfile() {
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    // Load user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Setup media query
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, []);

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(user));
    alert('Saved!');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
```

### After (Platform-ready)

```tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useBreakpoint,
  useNavigate,
  AsyncStorage,
  StorageHelpers,
} from '@/platform';

export function UserProfile() {
  const [user, setUser] = useState(null);
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const savedUser = await StorageHelpers.getJSON('user');
    if (savedUser) {
      setUser(savedUser);
    }
  };

  const handleSave = async () => {
    await StorageHelpers.setJSON('user', user);
    alert('Saved!');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      <View className="max-w-2xl mx-auto p-4" style={styles.container}>
        <View className="bg-white rounded-lg shadow p-6" style={styles.card}>
          <View
            className="flex items-center gap-4 mb-4"
            style={styles.header}
          >
            <Image
              source={{ uri: user.avatar }}
              alt={user.name}
              className="w-20 h-20 rounded-full"
              style={styles.avatar}
            />
            <View>
              <Text className="text-2xl font-bold" style={styles.name}>
                {user.name}
              </Text>
              <Text className="text-gray-600" style={styles.email}>
                {user.email}
              </Text>
            </View>
          </View>

          <View className="flex gap-2" style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleSave}
              className="flex-1 bg-blue-600 px-4 py-2 rounded"
              style={[styles.button, styles.saveButton]}
            >
              <Text className="text-white text-center" style={styles.buttonText}>
                Save
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-1 bg-red-600 px-4 py-2 rounded"
              style={[styles.button, styles.logoutButton]}
            >
              <Text className="text-white text-center" style={styles.buttonText}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    maxWidth: 672, // 2xl
    marginHorizontal: 'auto',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
```

---

## Common Patterns

### Pattern 1: Conditional Rendering

```tsx
{isMobile ? (
  <View style={styles.mobileLayout}>
    <MobileComponent />
  </View>
) : (
  <View style={styles.desktopLayout}>
    <DesktopComponent />
  </View>
)}
```

### Pattern 2: Lists

```tsx
<ScrollView>
  {items.map((item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleSelect(item)}
    >
      <View style={styles.listItem}>
        <Text>{item.title}</Text>
      </View>
    </TouchableOpacity>
  ))}
</ScrollView>
```

### Pattern 3: Forms

```tsx
<View style={styles.form}>
  <TextInput
    value={name}
    onChangeText={setName}
    placeholder="Name"
    style={styles.input}
  />
  <TextInput
    value={email}
    onChangeText={setEmail}
    placeholder="Email"
    keyboardType="email-address"
    style={styles.input}
  />
  <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
    <Text style={styles.submitButtonText}>Submit</Text>
  </TouchableOpacity>
</View>
```

---

## Testing Your Migration

1. **Test in browser first** - Ensure nothing broke
2. **Check console for warnings** - Fix any issues
3. **Test responsive behavior** - Resize browser window
4. **Test all interactions** - Click, scroll, type
5. **Test storage operations** - Save, load, clear
6. **(Optional) Test in React Native** - Run on simulator

---

## Need Help?

- Check `/platform/README.md` for API documentation
- See `/platform/examples/` for complete examples
- Refer to `/REACT-NATIVE-SETUP.md` for native setup

Happy migrating! 🚀
