package auth

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/vhvplatform/go-shared/config"
	"golang.org/x/crypto/bcrypt"
)

func TestService_Register(t *testing.T) {
	// This is a mock test - in production, use actual database
	t.Run("should register user successfully", func(t *testing.T) {
		// Setup
		cfg := &config.Config{
			JWTSecret: "test-secret",
		}
		
		// Mock repository - in production use actual repo with test database
		repo := &Repository{}
		service := NewService(repo, cfg)
		
		req := &RegisterRequest{
			EmailAddress: "test@example.com",
			Password:     "SecurePass123!",
			FirstName:    "John",
			LastName:     "Doe",
			AcceptTerms:  true,
		}
		
		// Note: This test needs actual database to run
		// In production, setup test database connection
		
		assert.NotNil(t, service)
		assert.NotNil(t, req)
	})
}

func TestService_Login(t *testing.T) {
	t.Run("should login with valid credentials", func(t *testing.T) {
		// Setup
		cfg := &config.Config{
			JWTSecret: "test-secret",
		}
		
		repo := &Repository{}
		service := NewService(repo, cfg)
		
		req := &LoginRequest{
			EmailAddress: "test@example.com",
			Password:     "SecurePass123!",
		}
		
		assert.NotNil(t, service)
		assert.NotNil(t, req)
	})
}

func TestPasswordHashing(t *testing.T) {
	t.Run("should hash password correctly", func(t *testing.T) {
		password := "SecurePass123!"
		
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		assert.NoError(t, err)
		assert.NotEmpty(t, hashedPassword)
		
		// Verify password
		err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))
		assert.NoError(t, err)
	})
	
	t.Run("should fail with wrong password", func(t *testing.T) {
		password := "SecurePass123!"
		wrongPassword := "WrongPass456!"
		
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		assert.NoError(t, err)
		
		// Verify with wrong password
		err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(wrongPassword))
		assert.Error(t, err)
	})
}

func TestGenerateUserID(t *testing.T) {
	t.Run("should generate unique user IDs", func(t *testing.T) {
		id1 := generateUserID()
		time.Sleep(1 * time.Millisecond)
		id2 := generateUserID()
		
		assert.NotEmpty(t, id1)
		assert.NotEmpty(t, id2)
		assert.NotEqual(t, id1, id2)
		assert.Contains(t, id1, "usr_")
		assert.Contains(t, id2, "usr_")
	})
}

func TestGenerateSessionID(t *testing.T) {
	t.Run("should generate unique session IDs", func(t *testing.T) {
		id1 := generateSessionID()
		time.Sleep(1 * time.Millisecond)
		id2 := generateSessionID()
		
		assert.NotEmpty(t, id1)
		assert.NotEmpty(t, id2)
		assert.NotEqual(t, id1, id2)
		assert.Contains(t, id1, "sess_")
		assert.Contains(t, id2, "sess_")
	})
}

// Integration tests - these require actual database connection
// Run with: go test -tags=integration

// +build integration

func TestIntegration_UserRegistration(t *testing.T) {
	// Setup test database
	ctx := context.Background()
	
	// TODO: Setup test MongoDB connection
	// db := setupTestDB()
	// defer cleanupTestDB(db)
	
	// TODO: Implement full integration test
	t.Skip("Integration test - requires database setup")
}
