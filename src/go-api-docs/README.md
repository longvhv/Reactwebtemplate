# Golang API Structure for VHV Platform

## Overview
Backend API sử dụng Golang với MongoDB, được thiết kế theo Clean Architecture pattern.

## Tech Stack
- **Language**: Go 1.21+
- **Database**: MongoDB
- **Framework**: Gin/Echo (recommend)
- **Shared Libraries**: 
  - `github.com/vhvplatform/go-shared/config`
  - `github.com/vhvplatform/go-shared/logger`
  - `github.com/vhvplatform/go-shared/mongodb`

## Project Structure

```
backend/
├── cmd/
│   └── api/
│       └── main.go                 # Application entrypoint
├── internal/
│   ├── auth/                       # Authentication module
│   │   ├── handler.go              # HTTP handlers
│   │   ├── service.go              # Business logic
│   │   ├── repository.go           # Database operations
│   │   └── model.go                # Domain models
│   ├── user/                       # User management module
│   │   ├── handler.go
│   │   ├── service.go
│   │   ├── repository.go
│   │   └── model.go
│   ├── platform/                   # Platform features module
│   │   ├── navigation/
│   │   │   ├── handler.go
│   │   │   ├── service.go
│   │   │   ├── repository.go
│   │   │   └── model.go
│   │   └── settings/
│   │       ├── handler.go
│   │       ├── service.go
│   │       ├── repository.go
│   │       └── model.go
│   ├── middleware/                 # HTTP middlewares
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── logger.go
│   │   └── error.go
│   ├── common/                     # Common utilities
│   │   ├── response.go             # Standard API responses
│   │   ├── errors.go               # Custom error types
│   │   └── validator.go            # Input validation
│   └── config/                     # Configuration
│       └── config.go
├── pkg/                            # Public packages
│   └── utils/
│       ├── jwt.go
│       ├── hash.go
│       └── pagination.go
├── api/                            # API documentation
│   ├── openapi.yaml
│   └── postman.json
├── migrations/                     # Database migrations
│   └── mongodb/
│       ├── 001_create_users.js
│       └── 002_create_platform_settings.js
├── scripts/                        # Utility scripts
│   ├── setup.sh
│   └── migrate.sh
├── .env.example
├── .gitignore
├── go.mod
├── go.sum
├── Dockerfile
├── docker-compose.yml
└── Makefile
```

## Naming Conventions

### MongoDB Collections (snake_case)
- `user_accounts`
- `platform_settings`
- `navigation_items`
- `auth_sessions`
- `system_logs`

### MongoDB Fields (camelCase)
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "emailAddress": "string",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### Go Structs (PascalCase with camelCase JSON tags)
```go
type User struct {
    ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
    UserID       string             `json:"userId" bson:"userId"`
    FirstName    string             `json:"firstName" bson:"firstName"`
    LastName     string             `json:"lastName" bson:"lastName"`
    EmailAddress string             `json:"emailAddress" bson:"emailAddress"`
    CreatedAt    time.Time          `json:"createdAt" bson:"createdAt"`
    UpdatedAt    time.Time          `json:"updatedAt" bson:"updatedAt"`
}
```

## Quick Start (Local Development)

### 1. Prerequisites
```bash
# Install Go 1.21+
go version

# Install MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Clone go-shared libraries
git clone https://github.com/vhvplatform/go-shared.git
```

### 2. Setup Project
```bash
# Create project directory
mkdir -p backend
cd backend

# Initialize Go module
go mod init github.com/vhvplatform/react-framework-api

# Install dependencies
go get github.com/gin-gonic/gin
go get github.com/vhvplatform/go-shared/config
go get github.com/vhvplatform/go-shared/logger
go get github.com/vhvplatform/go-shared/mongodb
go get go.mongodb.org/mongo-driver/mongo
```

### 3. Configuration
```bash
# Copy environment file
cp .env.example .env

# Edit configuration
nano .env
```

### 4. Run Application
```bash
# Development mode
go run cmd/api/main.go

# Build and run
go build -o bin/api cmd/api/main.go
./bin/api

# Using Docker
docker-compose up --build
```

## Environment Variables

```env
# Application
APP_NAME=vhv-platform-api
APP_ENV=development
APP_PORT=8080

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=vhv_platform
MONGODB_TIMEOUT=10s

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=168h

# Logging
LOG_LEVEL=debug
LOG_FORMAT=json

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
CORS_CREDENTIALS=true
```

## API Endpoints

See [API_SPEC.md](./API_SPEC.md) for detailed endpoint documentation.

### Base URL
- Development: `http://localhost:8080/api/v1`
- Production: `https://api.vhvplatform.com/api/v1`

### Main Routes
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `GET /users/me` - Get current user
- `GET /platform/settings` - Get platform settings
- `GET /platform/navigation` - Get navigation items

## Development Workflow

1. **Create new module in `/internal/{module}/`**
2. **Define models** in `model.go`
3. **Implement repository** in `repository.go` (MongoDB operations)
4. **Implement service** in `service.go` (Business logic)
5. **Implement handler** in `handler.go` (HTTP handlers)
6. **Register routes** in `cmd/api/main.go`
7. **Write tests** in `*_test.go`

## Testing

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Run specific package
go test ./internal/auth/...

# Benchmark
go test -bench=. ./...
```

## Deployment

```bash
# Build for production
CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/api cmd/api/main.go

# Docker build
docker build -t vhv-platform-api:latest .

# Docker push
docker push vhv-platform-api:latest
```

## Next Steps

1. Review [API_SPEC.md](./API_SPEC.md) for endpoint details
2. Check [GOLANG_CODE_EXAMPLES.md](./GOLANG_CODE_EXAMPLES.md) for code samples
3. Review TypeScript types in `/types/api.ts` for frontend integration
4. Use mock API in `/lib/mock-api/` for Figma Make development
