package platform

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Repository handles database operations for platform
type Repository struct {
	db         *mongo.Database
	settings   *mongo.Collection
	navigation *mongo.Collection
}

// NewRepository creates a new platform repository
func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		db:         db,
		settings:   db.Collection("platform_settings"),
		navigation: db.Collection("navigation_items"),
	}
}

// GetSettings gets platform settings
func (r *Repository) GetSettings(ctx context.Context) (*PlatformSettings, error) {
	var settings PlatformSettings
	err := r.settings.FindOne(ctx, bson.M{"settingsId": "settings_global"}).Decode(&settings)
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

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	var settings PlatformSettings

	err := r.settings.FindOneAndUpdate(
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
	opts := options.Find().SetSort(bson.M{"order": 1})
	cursor, err := r.navigation.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var items []NavigationItem
	if err := cursor.All(ctx, &items); err != nil {
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

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	var item NavigationItem

	err := r.navigation.FindOneAndUpdate(
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
