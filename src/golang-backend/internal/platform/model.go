package platform

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// PlatformSettings represents platform configuration
type PlatformSettings struct {
	ID                 primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	SettingsID         string             `json:"settingsId" bson:"settingsId"`
	PlatformName       string             `json:"platformName" bson:"platformName"`
	PlatformLogo       string             `json:"platformLogo" bson:"platformLogo"`
	SupportedLanguages []string           `json:"supportedLanguages" bson:"supportedLanguages"`
	DefaultLanguage    string             `json:"defaultLanguage" bson:"defaultLanguage"`
	Theme              PlatformTheme      `json:"theme" bson:"theme"`
	Features           PlatformFeatures   `json:"features" bson:"features"`
	UpdatedAt          time.Time          `json:"updatedAt" bson:"updatedAt"`
}

// PlatformTheme represents theme configuration
type PlatformTheme struct {
	PrimaryColor    string `json:"primaryColor" bson:"primaryColor"`
	BackgroundColor string `json:"backgroundColor" bson:"backgroundColor"`
	FontFamily      string `json:"fontFamily" bson:"fontFamily"`
}

// PlatformFeatures represents enabled features
type PlatformFeatures struct {
	Authentication  bool `json:"authentication" bson:"authentication"`
	UserManagement  bool `json:"userManagement" bson:"userManagement"`
	I18n            bool `json:"i18n" bson:"i18n"`
	DarkMode        bool `json:"darkMode" bson:"darkMode"`
}

// NavigationItem represents a navigation menu item
type NavigationItem struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	NavigationID string             `json:"navigationId" bson:"navigationId"`
	Title        string             `json:"title" bson:"title"`
	Path         string             `json:"path" bson:"path"`
	Icon         string             `json:"icon" bson:"icon"`
	Order        int                `json:"order" bson:"order"`
	IsActive     bool               `json:"isActive" bson:"isActive"`
	Permission   string             `json:"permission,omitempty" bson:"permission,omitempty"`
	ParentID     string             `json:"parentId,omitempty" bson:"parentId,omitempty"`
	CreatedAt    time.Time          `json:"createdAt,omitempty" bson:"createdAt"`
	UpdatedAt    time.Time          `json:"updatedAt,omitempty" bson:"updatedAt"`
}

// NavigationItemWithChildren includes nested children
type NavigationItemWithChildren struct {
	NavigationItem
	Children []NavigationItemWithChildren `json:"children,omitempty"`
}

// UpdatePlatformSettingsRequest represents settings update request
type UpdatePlatformSettingsRequest struct {
	PlatformName       *string                  `json:"platformName,omitempty"`
	PlatformLogo       *string                  `json:"platformLogo,omitempty"`
	SupportedLanguages []string                 `json:"supportedLanguages,omitempty"`
	DefaultLanguage    *string                  `json:"defaultLanguage,omitempty"`
	Theme              *PlatformTheme           `json:"theme,omitempty"`
	Features           *PlatformFeatures        `json:"features,omitempty"`
}

// CreateNavigationRequest represents navigation creation request
type CreateNavigationRequest struct {
	Title      string `json:"title" binding:"required"`
	Path       string `json:"path" binding:"required"`
	Icon       string `json:"icon" binding:"required"`
	Order      int    `json:"order" binding:"required"`
	IsActive   bool   `json:"isActive"`
	Permission string `json:"permission,omitempty"`
	ParentID   string `json:"parentId,omitempty"`
}

// UpdateNavigationRequest represents navigation update request
type UpdateNavigationRequest struct {
	Title      *string `json:"title,omitempty"`
	Path       *string `json:"path,omitempty"`
	Icon       *string `json:"icon,omitempty"`
	Order      *int    `json:"order,omitempty"`
	IsActive   *bool   `json:"isActive,omitempty"`
	Permission *string `json:"permission,omitempty"`
}
