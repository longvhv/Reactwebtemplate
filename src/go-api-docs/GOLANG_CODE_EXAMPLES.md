# Golang Code Examples

## Main Application Entry Point

### cmd/api/main.go

```go
package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/vhvplatform/go-shared/config"
    "github.com/vhvplatform/go-shared/logger"
    "github.com/vhvplatform/go-shared/mongodb"

    "github.com/vhvplatform/react-framework-api/internal/auth"
    "github.com/vhvplatform/react-framework-api/internal/user"
    "github.com/vhvplatform/react-framework-api/internal/platform"
    "github.com/vhvplatform/react-framework-api/internal/middleware"
)

func main() {
    // Load configuration
    cfg, err := config.Load()
    if err != nil {
        log.Fatalf("Failed to load config: %v", err)
    }

    // Initialize logger
    logger := logger.New(cfg.LogLevel, cfg.LogFormat)
    logger.Info("Starting VHV Platform API", "version", "1.0.0")

    // Connect to MongoDB
    ctx := context.Background()
    mongoClient, err := mongodb.Connect(ctx, cfg.MongoDBURI)
    if err != nil {
        logger.Fatal("Failed to connect to MongoDB", "error", err)
    }
    defer mongodb.Disconnect(ctx, mongoClient)

    db := mongoClient.Database(cfg.MongoDBDatabase)
    logger.Info("Connected to MongoDB", "database", cfg.MongoDBDatabase)

    // Initialize repositories
    authRepo := auth.NewRepository(db)
    userRepo := user.NewRepository(db)
    platformRepo := platform.NewRepository(db)

    // Initialize services
    authService := auth.NewService(authRepo, cfg)
    userService := user.NewService(userRepo)
    platformService := platform.NewService(platformRepo)

    // Initialize handlers
    authHandler := auth.NewHandler(authService)
    userHandler := user.NewHandler(userService)
    platformHandler := platform.NewHandler(platformService)

    // Setup Gin router
    if cfg.AppEnv == "production" {
        gin.SetMode(gin.ReleaseMode)
    }

    router := gin.New()
    router.Use(gin.Recovery())
    router.Use(middleware.Logger(logger))
    router.Use(middleware.CORS(cfg.CORSOrigins))
    router.Use(middleware.ErrorHandler())

    // Health check
    router.GET("/health", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "success": true,
            "data": gin.H{
                "status":    "healthy",
                "timestamp": time.Now(),
                "version":   "1.0.0",
            },
        })
    })

    // API v1 routes
    v1 := router.Group("/api/v1")
    {
        // Public routes
        authRoutes := v1.Group("/auth")
        {
            authRoutes.POST("/register", authHandler.Register)
            authRoutes.POST("/login", authHandler.Login)
            authRoutes.POST("/refresh", authHandler.RefreshToken)
            authRoutes.POST("/forgot-password", authHandler.ForgotPassword)
            authRoutes.POST("/reset-password", authHandler.ResetPassword)
        }

        // Protected routes
        protected := v1.Group("")
        protected.Use(middleware.Auth(cfg.JWTSecret))
        {
            // Auth
            protected.POST("/auth/logout", authHandler.Logout)

            // Users
            protected.GET("/users/me", userHandler.GetCurrentUser)
            protected.PUT("/users/me", userHandler.UpdateCurrentUser)
            protected.PUT("/users/me/password", userHandler.ChangePassword)
            
            // Admin only
            adminRoutes := protected.Group("")
            adminRoutes.Use(middleware.RequireRole("admin"))
            {
                adminRoutes.GET("/users", userHandler.ListUsers)
                adminRoutes.GET("/users/:id", userHandler.GetUser)
                adminRoutes.PUT("/users/:id", userHandler.UpdateUser)
                adminRoutes.DELETE("/users/:id", userHandler.DeleteUser)
            }

            // Platform
            protected.GET("/platform/settings", platformHandler.GetSettings)
            protected.GET("/platform/navigation", platformHandler.GetNavigation)
            
            // Platform admin routes
            platformAdmin := protected.Group("/platform")
            platformAdmin.Use(middleware.RequireRole("admin"))
            {
                platformAdmin.PUT("/settings", platformHandler.UpdateSettings)
                platformAdmin.POST("/navigation", platformHandler.CreateNavigation)
                platformAdmin.PUT("/navigation/:id", platformHandler.UpdateNavigation)
                platformAdmin.DELETE("/navigation/:id", platformHandler.DeleteNavigation)
            }
        }
    }

    // Start server
    srv := &http.Server{
        Addr:         fmt.Sprintf(":%s", cfg.AppPort),
        Handler:      router,
        ReadTimeout:  15 * time.Second,
        WriteTimeout: 15 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    // Graceful shutdown
    go func() {
        logger.Info("Server starting", "port", cfg.AppPort, "env", cfg.AppEnv)
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            logger.Fatal("Failed to start server", "error", err)
        }
    }()

    // Wait for interrupt signal
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    logger.Info("Shutting down server...")

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        logger.Fatal("Server forced to shutdown", "error", err)
    }

    logger.Info("Server exited")
}
```

## Authentication Module

### internal/auth/model.go

```go
package auth

import (
    "time"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
    ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
    UserID       string             `json:"userId" bson:"userId"`
    EmailAddress string             `json:"emailAddress" bson:"emailAddress"`
    Password     string             `json:"-" bson:"password"` // Never return in JSON
    FirstName    string             `json:"firstName" bson:"firstName"`
    LastName     string             `json:"lastName" bson:"lastName"`
    Avatar       string             `json:"avatar" bson:"avatar"`
    Role         string             `json:"role" bson:"role"` // user, admin
    Status       string             `json:"status" bson:"status"` // active, inactive, locked
    Preferences  UserPreferences    `json:"preferences" bson:"preferences"`
    CreatedAt    time.Time          `json:"createdAt" bson:"createdAt"`
    UpdatedAt    time.Time          `json:"updatedAt" bson:"updatedAt"`
}

type UserPreferences struct {
    Language      string `json:"language" bson:"language"`
    Theme         string `json:"theme" bson:"theme"`
    Notifications bool   `json:"notifications" bson:"notifications"`
}

type Session struct {
    ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
    SessionID    string             `json:"sessionId" bson:"sessionId"`
    UserID       string             `json:"userId" bson:"userId"`
    RefreshToken string             `json:"refreshToken" bson:"refreshToken"`
    UserAgent    string             `json:"userAgent" bson:"userAgent"`
    IPAddress    string             `json:"ipAddress" bson:"ipAddress"`
    ExpiresAt    time.Time          `json:"expiresAt" bson:"expiresAt"`
    CreatedAt    time.Time          `json:"createdAt" bson:"createdAt"`
}

type RegisterRequest struct {
    EmailAddress string `json:"emailAddress" binding:"required,email"`
    Password     string `json:"password" binding:"required,min=8"`
    FirstName    string `json:"firstName" binding:"required"`
    LastName     string `json:"lastName" binding:"required"`
    AcceptTerms  bool   `json:"acceptTerms" binding:"required"`
}

type LoginRequest struct {
    EmailAddress string `json:"emailAddress" binding:"required,email"`
    Password     string `json:"password" binding:"required"`
}

type LoginResponse struct {
    AccessToken  string `json:"accessToken"`
    RefreshToken string `json:"refreshToken"`
    ExpiresIn    int    `json:"expiresIn"`
    TokenType    string `json:"tokenType"`
    User         *User  `json:"user"`
}
```

### internal/auth/repository.go

```go
package auth

import (
    "context"
    "errors"
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
)

type Repository struct {
    db       *mongo.Database
    users    *mongo.Collection
    sessions *mongo.Collection
}

func NewRepository(db *mongo.Database) *Repository {
    return &Repository{
        db:       db,
        users:    db.Collection("user_accounts"),
        sessions: db.Collection("auth_sessions"),
    }
}

func (r *Repository) CreateUser(ctx context.Context, user *User) error {
    user.ID = primitive.NewObjectID()
    user.CreatedAt = time.Now()
    user.UpdatedAt = time.Now()

    _, err := r.users.InsertOne(ctx, user)
    return err
}

func (r *Repository) FindUserByEmail(ctx context.Context, email string) (*User, error) {
    var user User
    err := r.users.FindOne(ctx, bson.M{"emailAddress": email}).Decode(&user)
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            return nil, nil
        }
        return nil, err
    }
    return &user, nil
}

func (r *Repository) FindUserByID(ctx context.Context, userID string) (*User, error) {
    var user User
    err := r.users.FindOne(ctx, bson.M{"userId": userID}).Decode(&user)
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            return nil, nil
        }
        return nil, err
    }
    return &user, nil
}

func (r *Repository) CreateSession(ctx context.Context, session *Session) error {
    session.ID = primitive.NewObjectID()
    session.CreatedAt = time.Now()

    _, err := r.sessions.InsertOne(ctx, session)
    return err
}

func (r *Repository) FindSessionByRefreshToken(ctx context.Context, refreshToken string) (*Session, error) {
    var session Session
    err := r.sessions.FindOne(ctx, bson.M{
        "refreshToken": refreshToken,
        "expiresAt":    bson.M{"$gt": time.Now()},
    }).Decode(&session)
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            return nil, nil
        }
        return nil, err
    }
    return &session, nil
}

func (r *Repository) DeleteSession(ctx context.Context, sessionID string) error {
    _, err := r.sessions.DeleteOne(ctx, bson.M{"sessionId": sessionID})
    return err
}

func (r *Repository) DeleteUserSessions(ctx context.Context, userID string) error {
    _, err := r.sessions.DeleteMany(ctx, bson.M{"userId": userID})
    return err
}
```

### internal/auth/service.go

```go
package auth

import (
    "context"
    "crypto/rand"
    "encoding/base64"
    "errors"
    "fmt"
    "time"

    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"
    "github.com/vhvplatform/go-shared/config"
)

var (
    ErrUserAlreadyExists = errors.New("user already exists")
    ErrInvalidCredentials = errors.New("invalid credentials")
    ErrInvalidToken = errors.New("invalid token")
)

type Service struct {
    repo   *Repository
    config *config.Config
}

func NewService(repo *Repository, cfg *config.Config) *Service {
    return &Service{
        repo:   repo,
        config: cfg,
    }
}

func (s *Service) Register(ctx context.Context, req *RegisterRequest) (*User, error) {
    // Check if user exists
    existing, err := s.repo.FindUserByEmail(ctx, req.EmailAddress)
    if err != nil {
        return nil, err
    }
    if existing != nil {
        return nil, ErrUserAlreadyExists
    }

    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }

    // Create user
    user := &User{
        UserID:       generateUserID(),
        EmailAddress: req.EmailAddress,
        Password:     string(hashedPassword),
        FirstName:    req.FirstName,
        LastName:     req.LastName,
        Avatar:       fmt.Sprintf("https://api.dicebear.com/7.x/avataaars/svg?seed=%s", req.FirstName),
        Role:         "user",
        Status:       "active",
        Preferences: UserPreferences{
            Language:      "en",
            Theme:         "light",
            Notifications: true,
        },
    }

    if err := s.repo.CreateUser(ctx, user); err != nil {
        return nil, err
    }

    return user, nil
}

func (s *Service) Login(ctx context.Context, req *LoginRequest) (*LoginResponse, error) {
    // Find user
    user, err := s.repo.FindUserByEmail(ctx, req.EmailAddress)
    if err != nil {
        return nil, err
    }
    if user == nil {
        return nil, ErrInvalidCredentials
    }

    // Check password
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
        return nil, ErrInvalidCredentials
    }

    // Check user status
    if user.Status != "active" {
        return nil, errors.New("account is not active")
    }

    // Generate tokens
    accessToken, err := s.generateAccessToken(user)
    if err != nil {
        return nil, err
    }

    refreshToken, err := s.generateRefreshToken()
    if err != nil {
        return nil, err
    }

    // Create session
    session := &Session{
        SessionID:    generateSessionID(),
        UserID:       user.UserID,
        RefreshToken: refreshToken,
        ExpiresAt:    time.Now().Add(7 * 24 * time.Hour), // 7 days
    }

    if err := s.repo.CreateSession(ctx, session); err != nil {
        return nil, err
    }

    return &LoginResponse{
        AccessToken:  accessToken,
        RefreshToken: refreshToken,
        ExpiresIn:    86400, // 24 hours
        TokenType:    "Bearer",
        User:         user,
    }, nil
}

func (s *Service) RefreshToken(ctx context.Context, refreshToken string) (string, error) {
    // Find session
    session, err := s.repo.FindSessionByRefreshToken(ctx, refreshToken)
    if err != nil {
        return "", err
    }
    if session == nil {
        return "", ErrInvalidToken
    }

    // Find user
    user, err := s.repo.FindUserByID(ctx, session.UserID)
    if err != nil {
        return "", err
    }
    if user == nil {
        return "", ErrInvalidToken
    }

    // Generate new access token
    accessToken, err := s.generateAccessToken(user)
    if err != nil {
        return "", err
    }

    return accessToken, nil
}

func (s *Service) Logout(ctx context.Context, userID string) error {
    return s.repo.DeleteUserSessions(ctx, userID)
}

func (s *Service) generateAccessToken(user *User) (string, error) {
    claims := jwt.MapClaims{
        "sub":   user.UserID,
        "email": user.EmailAddress,
        "role":  user.Role,
        "exp":   time.Now().Add(24 * time.Hour).Unix(),
        "iat":   time.Now().Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(s.config.JWTSecret))
}

func (s *Service) generateRefreshToken() (string, error) {
    b := make([]byte, 32)
    if _, err := rand.Read(b); err != nil {
        return "", err
    }
    return base64.URLEncoding.EncodeToString(b), nil
}

func generateUserID() string {
    return fmt.Sprintf("usr_%d", time.Now().UnixNano())
}

func generateSessionID() string {
    return fmt.Sprintf("sess_%d", time.Now().UnixNano())
}
```

### internal/auth/handler.go

```go
package auth

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

type Handler struct {
    service *Service
}

func NewHandler(service *Service) *Handler {
    return &Handler{service: service}
}

func (h *Handler) Register(c *gin.Context) {
    var req RegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error": gin.H{
                "code":    "VALIDATION_ERROR",
                "message": err.Error(),
            },
        })
        return
    }

    user, err := h.service.Register(c.Request.Context(), &req)
    if err != nil {
        if err == ErrUserAlreadyExists {
            c.JSON(http.StatusConflict, gin.H{
                "success": false,
                "error": gin.H{
                    "code":    "EMAIL_ALREADY_EXISTS",
                    "message": "Email already registered",
                },
            })
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error": gin.H{
                "code":    "INTERNAL_ERROR",
                "message": "Failed to register user",
            },
        })
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "success": true,
        "data":    user,
        "message": "Registration successful",
    })
}

func (h *Handler) Login(c *gin.Context) {
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error": gin.H{
                "code":    "VALIDATION_ERROR",
                "message": err.Error(),
            },
        })
        return
    }

    response, err := h.service.Login(c.Request.Context(), &req)
    if err != nil {
        if err == ErrInvalidCredentials {
            c.JSON(http.StatusUnauthorized, gin.H{
                "success": false,
                "error": gin.H{
                    "code":    "INVALID_CREDENTIALS",
                    "message": "Invalid email or password",
                },
            })
            return
        }
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error": gin.H{
                "code":    "INTERNAL_ERROR",
                "message": "Failed to login",
            },
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "data":    response,
    })
}

func (h *Handler) RefreshToken(c *gin.Context) {
    var req struct {
        RefreshToken string `json:"refreshToken" binding:"required"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "error": gin.H{
                "code":    "VALIDATION_ERROR",
                "message": err.Error(),
            },
        })
        return
    }

    accessToken, err := h.service.RefreshToken(c.Request.Context(), req.RefreshToken)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{
            "success": false,
            "error": gin.H{
                "code":    "INVALID_REFRESH_TOKEN",
                "message": "Invalid or expired refresh token",
            },
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "data": gin.H{
            "accessToken": accessToken,
            "expiresIn":   86400,
            "tokenType":   "Bearer",
        },
    })
}

func (h *Handler) Logout(c *gin.Context) {
    userID := c.GetString("userId") // Set by auth middleware

    if err := h.service.Logout(c.Request.Context(), userID); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "success": false,
            "error": gin.H{
                "code":    "INTERNAL_ERROR",
                "message": "Failed to logout",
            },
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Logout successful",
    })
}

func (h *Handler) ForgotPassword(c *gin.Context) {
    // TODO: Implement password reset logic
    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Password reset email sent",
    })
}

func (h *Handler) ResetPassword(c *gin.Context) {
    // TODO: Implement password reset logic
    c.JSON(http.StatusOK, gin.H{
        "success": true,
        "message": "Password reset successful",
    })
}
```

## Middleware

### internal/middleware/auth.go

```go
package middleware

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

func Auth(jwtSecret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{
                "success": false,
                "error": gin.H{
                    "code":    "UNAUTHORIZED",
                    "message": "Authorization header required",
                },
            })
            c.Abort()
            return
        }

        bearerToken := strings.Split(authHeader, " ")
        if len(bearerToken) != 2 || bearerToken[0] != "Bearer" {
            c.JSON(http.StatusUnauthorized, gin.H{
                "success": false,
                "error": gin.H{
                    "code":    "INVALID_TOKEN",
                    "message": "Invalid authorization format",
                },
            })
            c.Abort()
            return
        }

        token, err := jwt.Parse(bearerToken[1], func(token *jwt.Token) (interface{}, error) {
            return []byte(jwtSecret), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{
                "success": false,
                "error": gin.H{
                    "code":    "INVALID_TOKEN",
                    "message": "Invalid or expired token",
                },
            })
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            c.JSON(http.StatusUnauthorized, gin.H{
                "success": false,
                "error": gin.H{
                    "code":    "INVALID_TOKEN",
                    "message": "Invalid token claims",
                },
            })
            c.Abort()
            return
        }

        c.Set("userId", claims["sub"])
        c.Set("userEmail", claims["email"])
        c.Set("userRole", claims["role"])

        c.Next()
    }
}

func RequireRole(role string) gin.HandlerFunc {
    return func(c *gin.Context) {
        userRole := c.GetString("userRole")
        if userRole != role {
            c.JSON(http.StatusForbidden, gin.H{
                "success": false,
                "error": gin.H{
                    "code":    "FORBIDDEN",
                    "message": "Insufficient permissions",
                },
            })
            c.Abort()
            return
        }
        c.Next()
    }
}
```

### internal/middleware/cors.go

```go
package middleware

import (
    "github.com/gin-gonic/gin"
)

func CORS(allowedOrigins []string) gin.HandlerFunc {
    return func(c *gin.Context) {
        origin := c.Request.Header.Get("Origin")
        
        // Check if origin is allowed
        allowed := false
        for _, allowedOrigin := range allowedOrigins {
            if origin == allowedOrigin {
                allowed = true
                break
            }
        }

        if allowed {
            c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
        }

        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
```

## Configuration Files

### .env.example

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

### Dockerfile

```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o bin/api cmd/api/main.go

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/bin/api .
COPY --from=builder /app/.env .

EXPOSE 8080

CMD ["./api"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - APP_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017
    depends_on:
      - mongodb
    volumes:
      - .:/app
    networks:
      - vhv-network

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - vhv-network

volumes:
  mongodb_data:

networks:
  vhv-network:
    driver: bridge
```

### Makefile

```makefile
.PHONY: run build test clean docker-up docker-down

run:
	go run cmd/api/main.go

build:
	go build -o bin/api cmd/api/main.go

test:
	go test -v ./...

test-cover:
	go test -cover ./...

clean:
	rm -rf bin/

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-build:
	docker-compose up --build

migrate:
	@echo "Running migrations..."
	# Add migration command here

lint:
	golangci-lint run

format:
	go fmt ./...
```
