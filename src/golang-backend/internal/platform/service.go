package platform

import (
	"context"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

var (
	// ErrNavigationNotFound is returned when navigation item is not found
	ErrNavigationNotFound = errors.New("navigation item not found")
)

// Service handles platform business logic
type Service struct {
	repo *Repository
}

// NewService creates a new platform service
func NewService(repo *Repository) *Service {
	return &Service{
		repo: repo,
	}
}

// GetSettings gets platform settings
func (s *Service) GetSettings(ctx context.Context) (*PlatformSettings, error) {
	return s.repo.GetSettings(ctx)
}

// UpdateSettings updates platform settings
func (s *Service) UpdateSettings(ctx context.Context, req *UpdatePlatformSettingsRequest) (*PlatformSettings, error) {
	update := bson.M{}

	if req.PlatformName != nil {
		update["platformName"] = *req.PlatformName
	}
	if req.PlatformLogo != nil {
		update["platformLogo"] = *req.PlatformLogo
	}
	if req.SupportedLanguages != nil {
		update["supportedLanguages"] = req.SupportedLanguages
	}
	if req.DefaultLanguage != nil {
		update["defaultLanguage"] = *req.DefaultLanguage
	}
	if req.Theme != nil {
		if req.Theme.PrimaryColor != "" {
			update["theme.primaryColor"] = req.Theme.PrimaryColor
		}
		if req.Theme.BackgroundColor != "" {
			update["theme.backgroundColor"] = req.Theme.BackgroundColor
		}
		if req.Theme.FontFamily != "" {
			update["theme.fontFamily"] = req.Theme.FontFamily
		}
	}
	if req.Features != nil {
		update["features.authentication"] = req.Features.Authentication
		update["features.userManagement"] = req.Features.UserManagement
		update["features.i18n"] = req.Features.I18n
		update["features.darkMode"] = req.Features.DarkMode
	}

	return s.repo.UpdateSettings(ctx, update)
}

// GetNavigation gets navigation items with hierarchy
func (s *Service) GetNavigation(ctx context.Context) ([]NavigationItemWithChildren, error) {
	items, err := s.repo.GetNavigation(ctx)
	if err != nil {
		return nil, err
	}

	// Build hierarchy
	itemMap := make(map[string]*NavigationItemWithChildren)
	var rootItems []NavigationItemWithChildren

	// First pass: create all items
	for _, item := range items {
		itemWithChildren := NavigationItemWithChildren{
			NavigationItem: item,
			Children:       []NavigationItemWithChildren{},
		}
		itemMap[item.NavigationID] = &itemWithChildren

		if item.ParentID == "" {
			rootItems = append(rootItems, itemWithChildren)
		}
	}

	// Second pass: build hierarchy
	for _, item := range items {
		if item.ParentID != "" {
			if parent, ok := itemMap[item.ParentID]; ok {
				parent.Children = append(parent.Children, *itemMap[item.NavigationID])
			}
		}
	}

	return rootItems, nil
}

// CreateNavigation creates a new navigation item
func (s *Service) CreateNavigation(ctx context.Context, req *CreateNavigationRequest) (*NavigationItem, error) {
	item := &NavigationItem{
		NavigationID: generateNavigationID(),
		Title:        req.Title,
		Path:         req.Path,
		Icon:         req.Icon,
		Order:        req.Order,
		IsActive:     req.IsActive,
		Permission:   req.Permission,
		ParentID:     req.ParentID,
	}

	if err := s.repo.CreateNavigation(ctx, item); err != nil {
		return nil, err
	}

	return item, nil
}

// UpdateNavigation updates a navigation item
func (s *Service) UpdateNavigation(ctx context.Context, navigationID string, req *UpdateNavigationRequest) (*NavigationItem, error) {
	update := bson.M{}

	if req.Title != nil {
		update["title"] = *req.Title
	}
	if req.Path != nil {
		update["path"] = *req.Path
	}
	if req.Icon != nil {
		update["icon"] = *req.Icon
	}
	if req.Order != nil {
		update["order"] = *req.Order
	}
	if req.IsActive != nil {
		update["isActive"] = *req.IsActive
	}
	if req.Permission != nil {
		update["permission"] = *req.Permission
	}

	item, err := s.repo.UpdateNavigation(ctx, navigationID, update)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return nil, ErrNavigationNotFound
	}

	return item, nil
}

// DeleteNavigation deletes a navigation item
func (s *Service) DeleteNavigation(ctx context.Context, navigationID string) error {
	return s.repo.DeleteNavigation(ctx, navigationID)
}

// generateNavigationID generates a unique navigation ID
func generateNavigationID() string {
	return fmt.Sprintf("nav_%d", time.Now().UnixNano())
}
