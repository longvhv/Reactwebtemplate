package testutil

import (
	"time"

	"github.com/vhvplatform/react-framework-api/internal/auth"
	"github.com/vhvplatform/react-framework-api/internal/platform"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Test data fixtures

// NewTestUser creates a test user
func NewTestUser() *auth.User {
	return &auth.User{
		ID:           primitive.NewObjectID(),
		UserID:       "usr_test123",
		FirstName:    "John",
		LastName:     "Doe",
		EmailAddress: "john.doe@example.com",
		Password:     "$2a$10$abcdefghijklmnopqrstuvwxyz1234567890",
		Role:         "user",
		Status:       "active",
		Preferences: auth.UserPreferences{
			Language: "en",
			Theme:    "light",
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

// NewTestAdmin creates a test admin user
func NewTestAdmin() *auth.User {
	user := NewTestUser()
	user.UserID = "usr_admin123"
	user.EmailAddress = "admin@example.com"
	user.Role = "admin"
	return user
}

// NewTestSession creates a test session
func NewTestSession() *auth.Session {
	return &auth.Session{
		ID:           primitive.NewObjectID(),
		SessionID:    "sess_test123",
		UserID:       "usr_test123",
		RefreshToken: "refresh_token_test",
		ExpiresAt:    time.Now().Add(24 * time.Hour),
		IPAddress:    "127.0.0.1",
		UserAgent:    "Mozilla/5.0",
		CreatedAt:    time.Now(),
	}
}

// NewTestPlatformSettings creates test platform settings
func NewTestPlatformSettings() *platform.PlatformSettings {
	return &platform.PlatformSettings{
		ID:                 primitive.NewObjectID(),
		SettingsID:         "settings_global",
		PlatformName:       "VHV Platform",
		PlatformLogo:       "https://example.com/logo.png",
		SupportedLanguages: []string{"en", "vi", "es", "fr", "zh", "ja", "ko"},
		DefaultLanguage:    "en",
		Theme: platform.PlatformTheme{
			PrimaryColor:    "#6366f1",
			BackgroundColor: "#fafafa",
			FontFamily:      "Inter",
		},
		Features: platform.PlatformFeatures{
			Authentication: true,
			UserManagement: true,
			I18n:           true,
			DarkMode:       true,
		},
		UpdatedAt: time.Now(),
	}
}

// NewTestNavigationItem creates a test navigation item
func NewTestNavigationItem() *platform.NavigationItem {
	return &platform.NavigationItem{
		ID:           primitive.NewObjectID(),
		NavigationID: "nav_test123",
		Label:        "Dashboard",
		Path:         "/dashboard",
		Icon:         "dashboard",
		Order:        1,
		ParentID:     "",
		IsVisible:    true,
		RequiredRole: "user",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
}

// TestUsers returns a list of test users
func TestUsers() []auth.User {
	return []auth.User{
		{
			ID:           primitive.NewObjectID(),
			UserID:       "usr_001",
			FirstName:    "Alice",
			LastName:     "Smith",
			EmailAddress: "alice@example.com",
			Role:         "admin",
			Status:       "active",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           primitive.NewObjectID(),
			UserID:       "usr_002",
			FirstName:    "Bob",
			LastName:     "Johnson",
			EmailAddress: "bob@example.com",
			Role:         "user",
			Status:       "active",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
		{
			ID:           primitive.NewObjectID(),
			UserID:       "usr_003",
			FirstName:    "Charlie",
			LastName:     "Brown",
			EmailAddress: "charlie@example.com",
			Role:         "user",
			Status:       "inactive",
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
	}
}
