package platform

import (
	"context"
	"errors"
	"time"

	"github.com/vhvplatform/go-shared/mongodb"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Repository handles database operations for platform
type Repository struct {
	db         *mongo.Database
	settings   *mongodb.Repository
	navigation *mongodb.Repository
}

// NewRepository creates a new platform repository
func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		db:         db,
		settings:   mongodb.NewRepository(db, "platform_settings"),
		navigation: mongodb.NewRepository(db, "navigation_items"),
	}
}

// GetSettings gets platform settings
func (r *Repository) GetSettings(ctx context.Context) (*PlatformSettings, error) {
	var settings PlatformSettings
	err := r.settings.FindOne(ctx, bson.M{"settingsId": "settings_global"}, &settings)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return r.createDefaultSettings(ctx)
		}
		return nil, err
	}
	return &settings, nil
}

// UpdateSettings updates platform settings
func (r *Repository) UpdateSettings(ctx context.Context, update bson.M) (*PlatformSettings, error) {
	update["updatedAt"] = time.Now()
	
	var settings PlatformSettings
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	
	err := r.settings.Collection().FindOneAndUpdate(
		ctx,
		bson.M{"settingsId": "settings_global"},
		bson.M{"$set": update},
		opts,
	).Decode(&settings)
	
	if err != nil {
		return nil, err
	}
	
	return &settings, nil
}

// createDefaultSettings creates default platform settings
func (r *Repository) createDefaultSettings(ctx context.Context) (*PlatformSettings, error) {
	settings := &PlatformSettings{
		ID:                 primitive.NewObjectID(),
		SettingsID:         "settings_global",
		PlatformName:       "VHV Platform",
		PlatformLogo:       "https://example.com/logo.png",
		SupportedLanguages: []string{"en", "vi", "es", "fr", "zh", "ja", "ko"},
		DefaultLanguage:    "en",
		Theme: PlatformTheme{
			PrimaryColor:    "#6366f1",
			BackgroundColor: "#fafafa",
			FontFamily:      "Inter",
		},
		Features: PlatformFeatures{
			Authentication: true,
			UserManagement: true,
			I18n:           true,
			DarkMode:       true,
		},
		UpdatedAt: time.Now(),
	}

	_, err := r.settings.InsertOne(ctx, settings)
	if err != nil {
		return nil, err
	}

	return settings, nil
}

// GetNavigation gets all navigation items
func (r *Repository) GetNavigation(ctx context.Context) ([]NavigationItem, error) {
	filter := bson.M{}
	opts := options.Find().SetSort(bson.D{{Key: "order", Value: 1}})
	
	var items []NavigationItem
	err := r.navigation.Find(ctx, filter, &items, opts)
	if err != nil {
		return nil, err
	}
	
	return items, nil
}

// CreateNavigation creates a new navigation item
func (r *Repository) CreateNavigation(ctx context.Context, item *NavigationItem) error {
	item.ID = primitive.NewObjectID()
	item.CreatedAt = time.Now()
	item.UpdatedAt = time.Now()

	_, err := r.navigation.InsertOne(ctx, item)
	return err
}

// UpdateNavigation updates a navigation item
func (r *Repository) UpdateNavigation(ctx context.Context, navigationID string, update bson.M) (*NavigationItem, error) {
	update["updatedAt"] = time.Now()
	
	var item NavigationItem
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	
	err := r.navigation.Collection().FindOneAndUpdate(
		ctx,
		bson.M{"navigationId": navigationID},
		bson.M{"$set": update},
		opts,
	).Decode(&item)
	
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	
	return &item, nil
}

// DeleteNavigation deletes a navigation item
func (r *Repository) DeleteNavigation(ctx context.Context, navigationID string) error {
	_, err := r.navigation.DeleteOne(ctx, bson.M{"navigationId": navigationID})
	return err
}

// FindNavigationByID finds a navigation item by ID
func (r *Repository) FindNavigationByID(ctx context.Context, navigationID string) (*NavigationItem, error) {
	var item NavigationItem
	err := r.navigation.FindOne(ctx, bson.M{"navigationId": navigationID}, &item)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &item, nil
}

// GetNavigationByParent gets navigation items by parent ID
func (r *Repository) GetNavigationByParent(ctx context.Context, parentID string) ([]NavigationItem, error) {
	filter := bson.M{"parentId": parentID}
	opts := options.Find().SetSort(bson.D{{Key: "order", Value: 1}})
	
	var items []NavigationItem
	err := r.navigation.Find(ctx, filter, &items, opts)
	if err != nil {
		return nil, err
	}
	
	return items, nil
}

// CountNavigation counts navigation items
func (r *Repository) CountNavigation(ctx context.Context, filter bson.M) (int64, error) {
	return r.navigation.Count(ctx, filter)
}