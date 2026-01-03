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
	"github.com/vhvplatform/react-framework-api/internal/middleware"
	"github.com/vhvplatform/react-framework-api/internal/platform"
	"github.com/vhvplatform/react-framework-api/internal/user"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize logger
	appLogger := logger.New(cfg.LogLevel, cfg.LogFormat)
	appLogger.Info("Starting VHV Platform API", "version", "1.0.0", "env", cfg.AppEnv)

	// Connect to MongoDB
	ctx := context.Background()
	mongoClient, err := mongodb.Connect(ctx, cfg.MongoDBURI)
	if err != nil {
		appLogger.Fatal("Failed to connect to MongoDB", "error", err)
	}
	defer func() {
		if err := mongodb.Disconnect(ctx, mongoClient); err != nil {
			appLogger.Error("Failed to disconnect MongoDB", "error", err)
		}
	}()

	db := mongoClient.Database(cfg.MongoDBDatabase)
	appLogger.Info("Connected to MongoDB", "database", cfg.MongoDBDatabase)

	// Initialize repositories
	authRepo := auth.NewRepository(db)
	userRepo := user.NewRepository(db)
	platformRepo := platform.NewRepository(db)

	// Initialize services
	authService := auth.NewService(authRepo, cfg)
	userService := user.NewService(userRepo)
	platformService := platform.NewService(platformRepo)

	// Initialize handlers
	authHandler := auth.NewHandler(authService, appLogger)
	userHandler := user.NewHandler(userService, appLogger)
	platformHandler := platform.NewHandler(platformService, appLogger)

	// Setup Gin router
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(middleware.Logger(appLogger))
	router.Use(middleware.CORS(cfg.CORSOrigins))
	router.Use(middleware.ErrorHandler(appLogger))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": gin.H{
				"status":    "healthy",
				"timestamp": time.Now().Format(time.RFC3339),
				"version":   "1.0.0",
				"services": gin.H{
					"database": "healthy",
					"cache":    "healthy",
				},
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
	})

	router.GET("/version", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data": gin.H{
				"version":     "1.0.0",
				"buildDate":   "2026-01-03",
				"environment": cfg.AppEnv,
				"goVersion":   "go1.21.5",
			},
			"timestamp": time.Now().Format(time.RFC3339),
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
		appLogger.Info("Server starting", "port", cfg.AppPort, "env", cfg.AppEnv)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			appLogger.Fatal("Failed to start server", "error", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	appLogger.Info("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		appLogger.Fatal("Server forced to shutdown", "error", err)
	}

	appLogger.Info("Server exited")
}
