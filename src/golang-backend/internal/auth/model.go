package auth

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User represents a user account in the system
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

// UserPreferences represents user preferences
type UserPreferences struct {
	Language      string `json:"language" bson:"language"`
	Theme         string `json:"theme" bson:"theme"`
	Notifications bool   `json:"notifications" bson:"notifications"`
}

// Session represents an authentication session
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

// RegisterRequest represents registration request
type RegisterRequest struct {
	EmailAddress string `json:"emailAddress" binding:"required,email"`
	Password     string `json:"password" binding:"required,min=8"`
	FirstName    string `json:"firstName" binding:"required"`
	LastName     string `json:"lastName" binding:"required"`
	AcceptTerms  bool   `json:"acceptTerms" binding:"required"`
}

// LoginRequest represents login request
type LoginRequest struct {
	EmailAddress string `json:"emailAddress" binding:"required,email"`
	Password     string `json:"password" binding:"required"`
}

// LoginResponse represents login response
type LoginResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	ExpiresIn    int    `json:"expiresIn"`
	TokenType    string `json:"tokenType"`
	User         *User  `json:"user"`
}

// RefreshTokenRequest represents refresh token request
type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

// ForgotPasswordRequest represents forgot password request
type ForgotPasswordRequest struct {
	EmailAddress string `json:"emailAddress" binding:"required,email"`
}

// ResetPasswordRequest represents reset password request
type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required,min=8"`
}
