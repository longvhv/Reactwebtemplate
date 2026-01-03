package auth

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/vhvplatform/go-shared/config"
	"golang.org/x/crypto/bcrypt"
)

var (
	// ErrUserAlreadyExists is returned when a user with the email already exists
	ErrUserAlreadyExists = errors.New("user already exists")
	// ErrInvalidCredentials is returned when login credentials are invalid
	ErrInvalidCredentials = errors.New("invalid credentials")
	// ErrInvalidToken is returned when token is invalid or expired
	ErrInvalidToken = errors.New("invalid token")
	// ErrAccountNotActive is returned when account is not active
	ErrAccountNotActive = errors.New("account is not active")
)

// Service handles authentication business logic
type Service struct {
	repo   *Repository
	config *config.Config
}

// NewService creates a new auth service
func NewService(repo *Repository, cfg *config.Config) *Service {
	return &Service{
		repo:   repo,
		config: cfg,
	}
}

// Register registers a new user
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

// Login authenticates a user and returns tokens
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
		return nil, ErrAccountNotActive
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

// RefreshToken refreshes an access token
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

	// Check user status
	if user.Status != "active" {
		return "", ErrAccountNotActive
	}

	// Generate new access token
	accessToken, err := s.generateAccessToken(user)
	if err != nil {
		return "", err
	}

	return accessToken, nil
}

// Logout logs out a user by deleting their sessions
func (s *Service) Logout(ctx context.Context, userID string) error {
	return s.repo.DeleteUserSessions(ctx, userID)
}

// ValidateToken validates a JWT token and returns the user ID
func (s *Service) ValidateToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.config.JWTSecret), nil
	})

	if err != nil {
		return "", err
	}

	if !token.Valid {
		return "", ErrInvalidToken
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", ErrInvalidToken
	}

	userID, ok := claims["sub"].(string)
	if !ok {
		return "", ErrInvalidToken
	}

	return userID, nil
}

// generateAccessToken generates a JWT access token
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

// generateRefreshToken generates a random refresh token
func (s *Service) generateRefreshToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

// generateUserID generates a unique user ID
func generateUserID() string {
	return fmt.Sprintf("usr_%d", time.Now().UnixNano())
}

// generateSessionID generates a unique session ID
func generateSessionID() string {
	return fmt.Sprintf("sess_%d", time.Now().UnixNano())
}
