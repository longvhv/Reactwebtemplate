# 🚀 Data Source - Quick Reference

**1-Minute Guide** to understand and use the data source architecture.

---

## 🎯 TL;DR

```env
# .env file
VITE_DATA_SOURCE=golang-api        # ← Change this to switch data sources
VITE_API_URL=http://localhost:8080/api
```

```typescript
// In your code - always use services
import { userService } from '@/services/userService';

const users = await userService.getUsers();  // ← Auto uses configured source
```

**That's it!** No code changes needed to switch between Golang API, Supabase, or Mock data.

---

## 📊 Available Data Sources

| Source | Config Value | Use For |
|--------|-------------|---------|
| 🚀 **Golang API** | `golang-api` | **Production** (Recommended) |
| ☁️ Supabase | `supabase` | Not implemented yet |
| 🎭 Mock Data | `mock` | Development/Testing |

---

## 🔧 Quick Setup

### Production (Golang API)

```env
VITE_DATA_SOURCE=golang-api
VITE_API_URL=http://localhost:8080/api
```

### Development (Mock Data)

```env
VITE_DATA_SOURCE=mock
```

---

## 📝 Usage in Components

### ✅ CORRECT Way

```typescript
// Use service layer
import { userService } from '@/services/userService';
import { profileService } from '@/services/profileService';

// Automatically uses configured data source
const users = await userService.getUsers();
const profile = await profileService.getProfile();
```

### ❌ WRONG Way

```typescript
// Don't call API directly!
const response = await fetch('/api/users');  // ❌ NO!
const users = await apiClient.get('/users'); // ❌ NO!
```

---

## 🏗️ Architecture Overview

```
Component → Service → Repository Factory → Adapter → Data Source
                                              ↓
                                    (Golang API / Supabase / Mock)
```

---

## 📁 Key Files

```
/config/dataSource.ts              # Configuration
/services/userService.ts           # User operations
/services/profileService.ts        # Profile operations
/services/RepositoryFactory.ts     # Auto-select adapter
/services/adapters/                # Adapter implementations
```

---

## 🎓 Available Services

### User Service

```typescript
import { userService } from '@/services/userService';

// Get users
await userService.getUsers({ page: 1, limit: 10 });

// Get user by ID
await userService.getUserById('123');

// Create user
await userService.createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  department: 'Engineering',
  password: 'secure123',
});

// Update user
await userService.updateUser('123', { name: 'Jane Doe' });

// Delete user
await userService.deleteUser('123');

// Bulk delete
await userService.bulkDeleteUsers(['1', '2', '3']);

// Get stats
await userService.getUserStats();
```

### Profile Service

```typescript
import { profileService } from '@/services/profileService';

// Get profile
await profileService.getProfile();

// Update profile
await profileService.updateProfile({
  name: 'John Doe',
  bio: 'Software Engineer',
  phone: '+1234567890',
});

// Change password
await profileService.changePassword({
  currentPassword: 'old123',
  newPassword: 'new456',
});

// Get activities
await profileService.getActivities(10);

// Get notification settings
await profileService.getNotificationSettings();

// Update notification settings
await profileService.updateNotificationSettings({
  email: true,
  push: false,
  sms: false,
  marketing: false,
});

// Upload avatar
await profileService.uploadAvatar(file);
```

---

## 🔄 Switching Data Sources

### Runtime Switch (Development)

```bash
# Edit .env
VITE_DATA_SOURCE=mock    # Change to mock

# Restart server
npm run dev
```

### Build-time Switch

```bash
# Production build
VITE_DATA_SOURCE=golang-api npm run build

# Development build with mock
VITE_DATA_SOURCE=mock npm run build
```

---

## 🧪 Testing

```typescript
// Force mock data for tests
beforeEach(() => {
  process.env.VITE_DATA_SOURCE = 'mock';
});

test('should fetch users', async () => {
  const users = await userService.getUsers();
  expect(users.data).toHaveLength(2);
});
```

---

## 🐛 Debugging

### Check Current Data Source

```javascript
// Browser console
__repositoryFactory.getDataSourceInfo()

// Output:
{
  type: 'golang-api',
  userRepository: 'GolangUserRepository',
  profileRepository: 'GolangProfileRepository'
}
```

---

## ✅ Best Practices

1. **Always use services** - Never call API directly
2. **Use TypeScript** - Get type safety and autocomplete
3. **Test with mock first** - Verify logic before hitting real API
4. **Handle errors** - Services throw errors, catch them
5. **Use async/await** - All service methods are async

---

## 📖 Full Documentation

For detailed guide, see: [DATA_SOURCE_MIGRATION.md](/docs/migration/DATA_SOURCE_MIGRATION.md)

---

## 🎯 Common Use Cases

### Fetch and Display Users

```typescript
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getUsers()
      .then(result => setUsers(result.data))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  
  return <UserList users={users} />;
}
```

### Create User

```typescript
async function handleCreateUser(data) {
  try {
    const user = await userService.createUser(data);
    toast.success('User created successfully');
    return user;
  } catch (error) {
    toast.error(error.message);
  }
}
```

### Update Profile

```typescript
async function handleUpdateProfile(data) {
  try {
    const profile = await profileService.updateProfile(data);
    toast.success('Profile updated');
    return profile;
  } catch (error) {
    toast.error('Failed to update profile');
  }
}
```

---

**Remember:**
- ✅ Use `userService` and `profileService`
- ✅ Set `VITE_DATA_SOURCE` in `.env`
- ✅ No code changes needed to switch sources

**That's all you need to know!** 🎉
