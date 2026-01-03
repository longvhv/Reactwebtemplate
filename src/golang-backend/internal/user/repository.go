package user

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/vhvplatform/react-framework-api/internal/auth"
)

// Repository handles database operations for users
type Repository struct {
	db    *mongo.Database
	users *mongo.Collection
}

// NewRepository creates a new user repository
func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		db:    db,
		users: db.Collection("user_accounts"),
	}
}

// FindByID finds a user by user ID
func (r *Repository) FindByID(ctx context.Context, userID string) (*auth.User, error) {
	var user auth.User
	err := r.users.FindOne(ctx, bson.M{"userId": userID}).Decode(&user)
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

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	var user auth.User

	err := r.users.FindOneAndUpdate(
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
	_, err := r.users.UpdateOne(
		ctx,
		bson.M{"userId": userID},
		bson.M{"$set": bson.M{
			"password":  hashedPassword,
			"updatedAt": time.Now(),
		}},
	)
	return err
}

// List returns a paginated list of users
func (r *Repository) List(ctx context.Context, params *ListUsersParams) ([]auth.User, int64, error) {
	// Build filter
	filter := bson.M{}

	if params.Search != "" {
		filter["$or"] = []bson.M{
			{"firstName": bson.M{"$regex": params.Search, "$options": "i"}},
			{"lastName": bson.M{"$regex": params.Search, "$options": "i"}},
			{"emailAddress": bson.M{"$regex": params.Search, "$options": "i"}},
		}
	}

	if params.Role != "" {
		filter["role"] = params.Role
	}

	// Count total
	total, err := r.users.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	// Build options
	opts := options.Find()
	opts.SetSkip(int64((params.Page - 1) * params.PageSize))
	opts.SetLimit(int64(params.PageSize))

	// Sort
	sortOrder := 1
	if params.SortOrder == "desc" {
		sortOrder = -1
	}
	opts.SetSort(bson.M{params.SortBy: sortOrder})

	// Find users
	cursor, err := r.users.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var users []auth.User
	if err := cursor.All(ctx, &users); err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// Delete deletes a user
func (r *Repository) Delete(ctx context.Context, userID string) error {
	_, err := r.users.DeleteOne(ctx, bson.M{"userId": userID})
	return err
}
