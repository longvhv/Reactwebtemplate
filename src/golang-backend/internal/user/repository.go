package user

import (
	"context"
	"errors"
	"time"

	"github.com/vhvplatform/go-shared/mongodb"
	"github.com/vhvplatform/react-framework-api/internal/auth"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Repository handles database operations for users
type Repository struct {
	db    *mongo.Database
	users *mongodb.Repository
}

// NewRepository creates a new user repository
func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		db:    db,
		users: mongodb.NewRepository(db, "user_accounts"),
	}
}

// FindByID finds a user by user ID
func (r *Repository) FindByID(ctx context.Context, userID string) (*auth.User, error) {
	var user auth.User
	err := r.users.FindOne(ctx, bson.M{"userId": userID}, &user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// Update updates user information
func (r *Repository) Update(ctx context.Context, userID string, update bson.M) (*auth.User, error) {
	update["updatedAt"] = time.Now()
	
	var user auth.User
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	
	err := r.users.Collection().FindOneAndUpdate(
		ctx,
		bson.M{"userId": userID},
		bson.M{"$set": update},
		opts,
	).Decode(&user)
	
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	
	return &user, nil
}

// UpdatePassword updates user password
func (r *Repository) UpdatePassword(ctx context.Context, userID string, hashedPassword string) error {
	update := bson.M{
		"password":  hashedPassword,
		"updatedAt": time.Now(),
	}
	
	_, err := r.users.UpdateOne(
		ctx,
		bson.M{"userId": userID},
		bson.M{"$set": update},
	)
	return err
}

// List returns a paginated list of users
func (r *Repository) List(ctx context.Context, params *ListUsersParams) ([]auth.User, int64, error) {
	// Build filter
	filter := bson.M{}
	
	// Search filter
	if params.Search != "" {
		filter["$or"] = []bson.M{
			{"firstName": bson.M{"$regex": params.Search, "$options": "i"}},
			{"lastName": bson.M{"$regex": params.Search, "$options": "i"}},
			{"emailAddress": bson.M{"$regex": params.Search, "$options": "i"}},
		}
	}
	
	// Role filter
	if params.Role != "" {
		filter["role"] = params.Role
	}
	
	// Count total
	total, err := r.users.Count(ctx, filter)
	if err != nil {
		return nil, 0, err
	}
	
	// Build options
	opts := options.Find()
	
	// Sorting
	sortOrder := 1
	if params.SortOrder == "desc" {
		sortOrder = -1
	}
	opts.SetSort(bson.D{{Key: params.SortBy, Value: sortOrder}})
	
	// Pagination
	skip := int64((params.Page - 1) * params.PageSize)
	opts.SetSkip(skip)
	opts.SetLimit(int64(params.PageSize))
	
	// Find users
	var users []auth.User
	err = r.users.Find(ctx, filter, &users, opts)
	if err != nil {
		return nil, 0, err
	}
	
	return users, total, nil
}

// Delete deletes a user
func (r *Repository) Delete(ctx context.Context, userID string) error {
	_, err := r.users.DeleteOne(ctx, bson.M{"userId": userID})
	return err
}

// Exists checks if a user exists
func (r *Repository) Exists(ctx context.Context, userID string) (bool, error) {
	count, err := r.users.Count(ctx, bson.M{"userId": userID})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}