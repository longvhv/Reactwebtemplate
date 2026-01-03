# Golang API Mock Structure - Setup Guide

## 📦 Đã tạo các files:

### 1. Documentation Files
- `/go-api-docs/README.md` - Tổng quan về Golang API structure
- `/go-api-docs/API_SPEC.md` - Chi tiết API endpoints và responses
- `/go-api-docs/GOLANG_CODE_EXAMPLES.md` - Code examples Golang đầy đủ

### 2. TypeScript Integration Files
- `/types/api.ts` - TypeScript types tương ứng với Go structs
- `/lib/api-client.ts` - Production API client cho Golang backend
- `/lib/mock-api/index.ts` - Mock API implementation cho development
- `/hooks/useAPI.ts` - React hooks để sử dụng API

## 🎯 Cách sử dụng trong Figma Make:

### Option 1: Development với Mock API

```typescript
// Set trong .env
VITE_USE_MOCK_API=true

// Sử dụng hooks
import { useLogin, useCurrentUser, useNavigation } from './hooks/useAPI';

function LoginPage() {
  const { login, loading, error } = useLogin();

  const handleSubmit = async (credentials) => {
    try {
      const user = await login(credentials);
      console.log('Logged in:', user);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    // Your JSX
  );
}
```

### Option 2: Connect đến Golang API thật

```typescript
// Set trong .env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:8080/api/v1

// Code không đổi, hooks tự động dùng real API
const { data, loading, error } = useCurrentUser();
```

## 📋 Database Collections (MongoDB):

### Collections (snake_case):
- `user_accounts` - User data
- `auth_sessions` - Authentication sessions
- `platform_settings` - Platform configuration
- `navigation_items` - Navigation menu items
- `system_logs` - System logs

### Field Naming (camelCase):
```javascript
{
  "_id": ObjectId,
  "userId": "usr_1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@example.com",
  "createdAt": ISODate("2026-01-03T10:30:00Z"),
  "updatedAt": ISODate("2026-01-03T10:30:00Z")
}
```

## 🚀 Setup Local Golang Development:

### 1. Clone và setup project:
```bash
# Tạo thư mục backend
mkdir backend
cd backend

# Initialize Go module
go mod init github.com/vhvplatform/react-framework-api

# Install dependencies
go get github.com/gin-gonic/gin
go get github.com/vhvplatform/go-shared/config
go get github.com/vhvplatform/go-shared/logger
go get github.com/vhvplatform/go-shared/mongodb
go get go.mongodb.org/mongo-driver/mongo
go get github.com/golang-jwt/jwt/v5
go get golang.org/x/crypto/bcrypt
```

### 2. Copy code structure từ `/go-api-docs/GOLANG_CODE_EXAMPLES.md`

### 3. Create internal structure:
```bash
mkdir -p internal/{auth,user,platform,middleware,common}
mkdir -p cmd/api
mkdir -p pkg/utils
```

### 4. Setup MongoDB:
```bash
# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Hoặc docker-compose (xem docker-compose.yml trong docs)
docker-compose up -d
```

### 5. Configure environment:
```bash
# Copy .env.example từ docs
cp .env.example .env

# Edit configuration
nano .env
```

### 6. Run application:
```bash
# Development
go run cmd/api/main.go

# Production build
go build -o bin/api cmd/api/main.go
./bin/api
```

## 🔗 API Endpoints Available:

### Authentication:
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### User Management:
- `GET /api/v1/users/me` - Current user
- `PUT /api/v1/users/me` - Update profile
- `GET /api/v1/users` - List users (Admin)

### Platform:
- `GET /api/v1/platform/settings` - Get settings
- `PUT /api/v1/platform/settings` - Update settings (Admin)
- `GET /api/v1/platform/navigation` - Get navigation
- `POST /api/v1/platform/navigation` - Create nav item (Admin)

## 📚 Shared Libraries từ vhvplatform/go-shared:

### 1. Config (`github.com/vhvplatform/go-shared/config`)
```go
import "github.com/vhvplatform/go-shared/config"

cfg, err := config.Load()
// Loads from environment variables và .env file
```

### 2. Logger (`github.com/vhvplatform/go-shared/logger`)
```go
import "github.com/vhvplatform/go-shared/logger"

logger := logger.New(cfg.LogLevel, cfg.LogFormat)
logger.Info("Message", "key", "value")
logger.Error("Error", "error", err)
```

### 3. MongoDB (`github.com/vhvplatform/go-shared/mongodb`)
```go
import "github.com/vhvplatform/go-shared/mongodb"

client, err := mongodb.Connect(ctx, cfg.MongoDBURI)
db := client.Database(cfg.MongoDBDatabase)
```

## 🎨 Frontend Integration Examples:

### Login Component:
```typescript
import { useLogin } from './hooks/useAPI';

function LoginForm() {
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await login({
        emailAddress: formData.get('email'),
        password: formData.get('password'),
      });
      // Redirect to dashboard
    } catch (err) {
      // Show error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div>{error}</div>}
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### User Profile:
```typescript
import { useCurrentUser } from './hooks/useAPI';

function UserProfile() {
  const { data: user, loading, error } = useCurrentUser();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.emailAddress}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

## 🧪 Testing Mock API:

Mock API tự động delay để simulate network latency:
- Register/Login: 800ms
- Fetch data: 500ms
- Updates: 800ms

Test credentials (Mock API):
- Email: `admin@vhvplatform.com`
- Password: `password123`

## 📝 Next Steps:

1. **Review documentation** trong `/go-api-docs/`
2. **Setup local Golang environment** theo hướng dẫn trên
3. **Copy code examples** từ GOLANG_CODE_EXAMPLES.md
4. **Test với Mock API** trong Figma Make trước
5. **Implement real API** khi ready
6. **Switch từ Mock sang Real API** bằng cách đổi env variable

## 🔐 Security Notes:

- JWT_SECRET phải thay đổi trong production
- Password được hash với bcrypt
- Session tokens được store trong MongoDB
- CORS được configure cho các origins allowed
- Rate limiting nên implement trong production

## 🐳 Docker Deployment:

```bash
# Build image
docker build -t vhv-platform-api:latest .

# Run với docker-compose
docker-compose up -d

# Check logs
docker-compose logs -f api
```

## 📖 Additional Resources:

- API Spec: `/go-api-docs/API_SPEC.md`
- Code Examples: `/go-api-docs/GOLANG_CODE_EXAMPLES.md`
- TypeScript Types: `/types/api.ts`
- API Hooks: `/hooks/useAPI.ts`
