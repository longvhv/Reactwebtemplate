# 🔄 Data Source Migration Guide

**Version:** 2.0.0  
**Date:** January 19, 2026  
**Status:** Production Ready

---

## 📋 Overview

This guide explains how to switch between different data sources:
- **Golang API** - Backend API (Default & Recommended)
- **Supabase** - Supabase backend (Template only)
- **Mock** - Mock data for development/testing

---

## 🏗️ Architecture

### Repository Pattern

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│    (Components, Hooks, Pages)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Service Layer                   │
│   (userService, profileService)         │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Repository Factory                 │
│   (Auto-select based on config)         │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┬─────────────┐
       │               │             │
┌──────▼──────┐ ┌─────▼─────┐ ┌────▼────┐
│   Golang    │ │ Supabase  │ │  Mock   │
│   Adapter   │ │  Adapter  │ │ Adapter │
└─────────────┘ └───────────┘ └─────────┘
```

### Benefits

1. **Separation of Concerns** - Business logic separated from data access
2. **Easy Testing** - Switch to mock data for tests
3. **Flexibility** - Change data source with zero code changes
4. **Type Safety** - TypeScript interfaces ensure consistency

---

## 🚀 Quick Start

### 1. Set Data Source (Environment Variable)

Create or update `.env` file:

```env
# Default: Golang API (Recommended)
VITE_DATA_SOURCE=golang-api
VITE_API_URL=http://localhost:8080/api

# OR: Supabase (Not implemented yet)
# VITE_DATA_SOURCE=supabase
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key

# OR: Mock data (Development only)
# VITE_DATA_SOURCE=mock
```

### 2. Use Services in Your Code

```typescript
// In any component or hook
import { userService } from '@/services/userService';
import { profileService } from '@/services/profileService';

// Get users (automatically uses configured data source)
const users = await userService.getUsers({ page: 1, limit: 10 });

// Get profile
const profile = await profileService.getProfile();
```

**That's it!** No need to change code when switching data sources.

---

## 📁 File Structure

```
/config/
└── dataSource.ts              # Data source configuration

/services/
├── repositories/              # Repository interfaces
│   ├── IUserRepository.ts
│   └── IProfileRepository.ts
│
├── adapters/                  # Adapter implementations
│   ├── GolangApiAdapter.ts   # Golang API implementation
│   ├── SupabaseAdapter.ts    # Supabase implementation
│   └── MockAdapter.ts        # Mock data implementation
│
├── RepositoryFactory.ts      # Factory pattern
├── userService.ts            # User service (business logic)
└── profileService.ts         # Profile service (business logic)
```

---

## 🔧 Configuration Details

### `/config/dataSource.ts`

```typescript
export type DataSourceType = 'golang-api' | 'supabase' | 'mock';

export const dataSourceConfig = {
  type: 'golang-api',          // Current data source
  endpoints: {
    golangApi: 'http://localhost:8080/api',
    supabase: { ... }          // Optional
  }
};

// Helper functions
export const isGolangApi = () => dataSourceConfig.type === 'golang-api';
export const isSupabase = () => dataSourceConfig.type === 'supabase';
export const isMock = () => dataSourceConfig.type === 'mock';
```

---

## 📝 Implementation Guide

### Step 1: Define Repository Interface

```typescript
// /services/repositories/IUserRepository.ts
export interface IUserRepository {
  getUsers(filters?: UserFilters): Promise<UserListResponse>;
  getUserById(id: string): Promise<User>;
  createUser(data: CreateUserInput): Promise<User>;
  // ... other methods
}
```

### Step 2: Implement Adapters

```typescript
// /services/adapters/GolangApiAdapter.ts
export class GolangUserRepository implements IUserRepository {
  async getUsers(filters?: UserFilters): Promise<UserListResponse> {
    // Call Golang API
    return apiClient.get('/users', { params: filters });
  }
  // ... other methods
}
```

### Step 3: Create Service Layer

```typescript
// /services/userService.ts
class UserService {
  async getUsers(filters?: UserFilters) {
    const repository = getUserRepository(); // Auto-selected!
    return repository.getUsers(filters);
  }
}

export const userService = new UserService();
```

### Step 4: Use in Components

```typescript
// In component
import { userService } from '@/services/userService';

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService.getUsers().then(setUsers);
  }, []);

  return <UserList users={users} />;
}
```

---

## 🔄 Switching Data Sources

### Switch to Golang API (Recommended)

```env
VITE_DATA_SOURCE=golang-api
VITE_API_URL=http://localhost:8080/api
```

Restart dev server:
```bash
npm run dev
```

### Switch to Mock Data (Development)

```env
VITE_DATA_SOURCE=mock
```

Benefits:
- ✅ No backend needed
- ✅ Fast development
- ✅ Predictable data
- ✅ Easy testing

### Switch to Supabase (Future)

```env
VITE_DATA_SOURCE=supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

**Note:** Supabase adapters are templates. Implementation needed.

---

## 🧪 Testing with Different Data Sources

### Unit Tests

```typescript
import { repositoryFactory } from '@/services/RepositoryFactory';

beforeEach(() => {
  // Force mock data for tests
  process.env.VITE_DATA_SOURCE = 'mock';
  repositoryFactory.reset();
});

test('should fetch users', async () => {
  const users = await userService.getUsers();
  expect(users).toBeDefined();
});
```

### Integration Tests

```typescript
// Test with Golang API
process.env.VITE_DATA_SOURCE = 'golang-api';
process.env.VITE_API_URL = 'http://localhost:8080/api';

test('should create user via API', async () => {
  const user = await userService.createUser({
    name: 'Test User',
    email: 'test@example.com',
    // ...
  });
  
  expect(user.id).toBeDefined();
});
```

---

## 📊 Comparison: Data Sources

| Feature | Golang API | Supabase | Mock |
|---------|-----------|----------|------|
| Production Ready | ✅ | ⚠️ Template | ❌ |
| Backend Required | ✅ Yes | ✅ Yes | ❌ No |
| Real Data | ✅ | ✅ | ❌ |
| Fast Development | ⚠️ | ⚠️ | ✅ |
| Authentication | ✅ | ✅ | ❌ |
| File Upload | ✅ | ✅ | ⚠️ Mock |
| Real-time | ⚠️ WebSocket | ✅ Built-in | ❌ |
| Cost | Free (Self-hosted) | 💰 Paid | Free |
| Recommended For | Production | MVP/Prototype | Development |

---

## 🛠️ Implementing New Repositories

### 1. Define Interface

```typescript
// /services/repositories/IProductRepository.ts
export interface IProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  // ...
}
```

### 2. Implement Adapters

```typescript
// /services/adapters/GolangApiAdapter.ts
export class GolangProductRepository implements IProductRepository {
  async getProducts(): Promise<Product[]> {
    return apiClient.get('/products');
  }
  // ...
}
```

### 3. Add to Factory

```typescript
// /services/RepositoryFactory.ts
class RepositoryFactory {
  getProductRepository(): IProductRepository {
    const dataSource = getCurrentDataSource();
    
    switch (dataSource) {
      case 'golang-api':
        return new GolangProductRepository();
      case 'supabase':
        return new SupabaseProductRepository();
      case 'mock':
        return new MockProductRepository();
    }
  }
}
```

### 4. Create Service

```typescript
// /services/productService.ts
class ProductService {
  async getProducts() {
    const repository = repositoryFactory.getProductRepository();
    return repository.getProducts();
  }
}

export const productService = new ProductService();
```

---

## 🚨 Common Pitfalls

### ❌ DON'T: Call API directly in components

```typescript
// ❌ BAD
function MyComponent() {
  useEffect(() => {
    fetch('/api/users').then(...); // Don't do this!
  }, []);
}
```

### ✅ DO: Use service layer

```typescript
// ✅ GOOD
function MyComponent() {
  useEffect(() => {
    userService.getUsers().then(...); // Always use service!
  }, []);
}
```

### ❌ DON'T: Import adapters directly

```typescript
// ❌ BAD
import { GolangUserRepository } from '@/services/adapters/GolangApiAdapter';

const repo = new GolangUserRepository(); // Don't do this!
```

### ✅ DO: Use factory

```typescript
// ✅ GOOD
import { getUserRepository } from '@/services/RepositoryFactory';

const repo = getUserRepository(); // Auto-selected!
```

---

## 🔍 Debugging

### Check Current Data Source

Open browser console:

```javascript
// Get current configuration
__repositoryFactory.getDataSourceInfo()

// Output:
{
  type: 'golang-api',
  userRepository: 'GolangUserRepository',
  profileRepository: 'GolangProfileRepository'
}
```

### Force Switch Data Source (Runtime)

```javascript
// In browser console (development only)
localStorage.setItem('FORCE_DATA_SOURCE', 'mock');
location.reload();
```

### Enable Debug Logging

```typescript
// /config/dataSource.ts
if (import.meta.env.DEV) {
  console.log('Data Source:', dataSourceConfig);
}
```

---

## 📈 Migration Checklist

### From Direct API Calls to Service Layer

- [ ] Identify all direct API calls
- [ ] Create service methods for each operation
- [ ] Update components to use services
- [ ] Test with mock data
- [ ] Test with Golang API
- [ ] Remove old API calls

### From Supabase to Golang API

- [ ] Set `VITE_DATA_SOURCE=golang-api`
- [ ] Update API endpoints
- [ ] Test all features
- [ ] Update authentication flow
- [ ] Migrate data (if needed)
- [ ] Deploy backend

---

## 🎯 Best Practices

### 1. Always Use Services

```typescript
✅ userService.getUsers()
❌ apiClient.get('/users')
```

### 2. Keep Adapters Simple

Adapters should only handle data fetching, no business logic.

### 3. Business Logic in Services

```typescript
class UserService {
  async createUser(data: CreateUserInput) {
    // ✅ Validation logic here
    this.validateEmail(data.email);
    
    // ✅ Then call repository
    return getUserRepository().createUser(data);
  }
}
```

### 4. Use TypeScript Interfaces

All repositories must implement interfaces for type safety.

### 5. Test with Mock Data

Always test with mock data first before hitting real APIs.

---

## 📚 Related Documentation

- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [Golang API Documentation](/golang-backend/docs/)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)

---

## 🆘 Troubleshooting

### "Repository not found"

**Solution:** Check data source configuration in `.env`

### "API call failed"

**Solution:** Switch to mock data to verify logic:
```env
VITE_DATA_SOURCE=mock
```

### "Type errors"

**Solution:** Ensure all adapters implement repository interfaces

### "Data not refreshing"

**Solution:** Reset repository factory:
```javascript
repositoryFactory.reset();
```

---

## 🚀 Future Enhancements

- [ ] Add caching layer
- [ ] Add offline support
- [ ] Add request batching
- [ ] Add retry logic
- [ ] Add request cancellation
- [ ] Complete Supabase implementation
- [ ] Add GraphQL adapter
- [ ] Add WebSocket support

---

**Current Status:**
- ✅ Golang API Adapter - **PRODUCTION READY**
- ⚠️ Supabase Adapter - **TEMPLATE ONLY**
- ✅ Mock Adapter - **DEVELOPMENT READY**

**Recommended:** Use **Golang API** for production.
