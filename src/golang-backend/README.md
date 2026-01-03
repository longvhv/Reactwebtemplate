# VHV Platform API - Golang Backend

Backend API cho VHV Platform, được xây dựng bằng Golang với MongoDB.

## 🚀 Tech Stack

- **Language**: Go 1.21+
- **Web Framework**: Gin
- **Database**: MongoDB
- **Authentication**: JWT
- **Shared Libraries**:
  - `github.com/vhvplatform/go-shared/config`
  - `github.com/vhvplatform/go-shared/logger`
  - `github.com/vhvplatform/go-shared/mongodb`

## 📁 Project Structure

```
golang-backend/
├── cmd/
│   └── api/
│       └── main.go                 # Application entry point
├── internal/
│   ├── auth/                       # Authentication module
│   │   ├── model.go
│   │   ├── repository.go
│   │   ├── service.go
│   │   └── handler.go
│   ├── user/                       # User management module
│   │   ├── model.go
│   │   ├── repository.go
│   │   ├── service.go
│   │   └── handler.go
│   ├── platform/                   # Platform module
│   │   ├── model.go
│   │   ├── repository.go
│   │   ├── service.go
│   │   └── handler.go
│   └── middleware/                 # HTTP middlewares
│       ├── auth.go
│       ├── cors.go
│       ├── logger.go
│       └── error.go
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── Makefile
└── README.md
```

## 🗄️ Database Collections (MongoDB)

### Naming Convention
- **Collections**: snake_case
- **Fields**: camelCase

### Collections:
- `user_accounts` - User accounts
- `auth_sessions` - Authentication sessions
- `platform_settings` - Platform configuration
- `navigation_items` - Navigation menu items

### Example Document:
```json
{
  "_id": ObjectId("..."),
  "userId": "usr_1234567890",
  "firstName": "John",
  "lastName": "Doe",
  "emailAddress": "john@example.com",
  "password": "$2a$10$...",
  "createdAt": ISODate("2026-01-03T10:30:00Z"),
  "updatedAt": ISODate("2026-01-03T10:30:00Z")
}
```

## 🛠️ Quick Start

### Prerequisites
- Go 1.21 or higher
- Docker & Docker Compose
- MongoDB 7.0+ (hoặc sử dụng Docker)

### 1. Clone Repository
```bash
# Giả sử code đã được copy từ Figma Make
cd golang-backend
```

### 2. Setup Environment
```bash
# Copy environment file
cp .env.example .env

# Edit configuration
nano .env
```

### 3. Install Dependencies
```bash
# Download Go modules
go mod download

# Tidy dependencies
go mod tidy
```

### 4. Run with Docker (Recommended)
```bash
# Start all services (API + MongoDB + Mongo Express)
make docker-up

# hoặc
docker-compose up -d

# View logs
make docker-logs
```

### 5. Run Locally
```bash
# Start MongoDB (if not using Docker)
# Hoặc connect tới MongoDB cloud

# Run application
make run

# hoặc
go run cmd/api/main.go
```

### 6. Build for Production
```bash
# Build binary
make build

# Run binary
./bin/api
```

## 📡 API Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### Users
- `GET /users/me` - Get current user (Protected)
- `PUT /users/me` - Update current user (Protected)
- `PUT /users/me/password` - Change password (Protected)
- `GET /users` - List users (Admin only)
- `GET /users/:id` - Get user by ID (Admin only)
- `PUT /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

### Platform
- `GET /platform/settings` - Get platform settings (Protected)
- `PUT /platform/settings` - Update settings (Admin only)
- `GET /platform/navigation` - Get navigation items (Protected)
- `POST /platform/navigation` - Create navigation (Admin only)
- `PUT /platform/navigation/:id` - Update navigation (Admin only)
- `DELETE /platform/navigation/:id` - Delete navigation (Admin only)

### System
- `GET /health` - Health check (Public)
- `GET /version` - API version (Public)

## 🔐 Authentication

API sử dụng JWT (JSON Web Tokens) cho authentication.

### Login Request:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailAddress": "admin@vhvplatform.com",
    "password": "password123"
  }'
```

### Login Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "tokenType": "Bearer",
    "user": { ... }
  }
}
```

### Protected Request:
```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer {accessToken}"
```

## 🧪 Testing

```bash
# Run all tests
make test

# Run with coverage
make test-cover

# Run specific package
go test ./internal/auth/...
```

## 📝 Development

### Make Commands
```bash
make help          # Show all commands
make run           # Run application
make build         # Build binary
make test          # Run tests
make docker-up     # Start Docker
make docker-down   # Stop Docker
make lint          # Run linter
make format        # Format code
```

### Hot Reload (Development)
```bash
# Install air
make install-air

# Run with hot reload
make dev
```

## 🐳 Docker Services

### Start Services
```bash
docker-compose up -d
```

### Access Services
- **API**: http://localhost:8080
- **MongoDB**: localhost:27017
- **Mongo Express**: http://localhost:8081 (admin/admin123)

### View Logs
```bash
docker-compose logs -f api
```

### Stop Services
```bash
docker-compose down
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Application
APP_NAME=vhv-platform-api
APP_ENV=development
APP_PORT=8080

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=vhv_platform

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=24h

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🚀 Deployment

### Docker Build
```bash
# Build image
docker build -t vhv-platform-api:latest .

# Run container
docker run -p 8080:8080 --env-file .env vhv-platform-api:latest
```

### Production Build
```bash
# Build for Linux
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/api cmd/api/main.go

# Run
./bin/api
```

## 📚 Additional Documentation

- API Specification: `/go-api-docs/API_SPEC.md`
- Code Examples: `/go-api-docs/GOLANG_CODE_EXAMPLES.md`
- Setup Guide: `/go-api-docs/SETUP_GUIDE.md`

## 🔗 Frontend Integration

### TypeScript Types
Tất cả TypeScript types đã được define trong `/types/api.ts`

### API Client
Production API client: `/lib/api-client.ts`

### React Hooks
Custom hooks: `/hooks/useAPI.ts`

### Usage Example
```typescript
import { useLogin } from './hooks/useAPI';

function LoginPage() {
  const { login, loading, error } = useLogin();

  const handleSubmit = async (credentials) => {
    await login(credentials);
  };
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

VHV Platform Team

## 🆘 Support

For issues and questions:
- GitHub Issues: https://github.com/vhvplatform/react-framework/issues
- Email: support@vhvplatform.com
