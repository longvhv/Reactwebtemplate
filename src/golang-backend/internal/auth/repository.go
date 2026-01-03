package auth

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Repository handles database operations for authentication
type Repository struct {
	db       *mongo.Database
	users    *mongo.Collection
	sessions *mongo.Collection
}

// NewRepository creates a new auth repository
func NewRepository(db *mongo.Database) *Repository {
	return &Repository{
		db:       db,
		users:    db.Collection("user_accounts"),
		sessions: db.Collection("auth_sessions"),
	}
}

// CreateUser creates a new user in the database
func (r *Repository) CreateUser(ctx context.Context, user *User) error {
	user.ID = primitive.NewObjectID()
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	_, err := r.users.InsertOne(ctx, user)
	return err
}

// FindUserByEmail finds a user by email address
func (r *Repository) FindUserByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	err := r.users.FindOne(ctx, bson.M{"emailAddress": email}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// FindUserByID finds a user by user ID
func (r *Repository) FindUserByID(ctx context.Context, userID string) (*User, error) {
	var user User
	err := r.users.FindOne(ctx, bson.M{"userId": userID}).Decode(&user)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

// UpdateUser updates user information
func (r *Repository) UpdateUser(ctx context.Context, userID string, update bson.M) error {
	update["updatedAt"] = time.Now()
	
	_, err := r.users.UpdateOne(
		ctx,
		bson.M{"userId": userID},
		bson.M{"$set": update},
	)
	return err
}

// CreateSession creates a new authentication session
func (r *Repository) CreateSession(ctx context.Context, session *Session) error {
	session.ID = primitive.NewObjectID()
	session.CreatedAt = time.Now()

	_, err := r.sessions.InsertOne(ctx, session)
	return err
}

// FindSessionByRefreshToken finds a session by refresh token
func (r *Repository) FindSessionByRefreshToken(ctx context.Context, refreshToken string) (*Session, error) {
	var session Session
	err := r.sessions.FindOne(ctx, bson.M{
		"refreshToken": refreshToken,
		"expiresAt":    bson.M{"$gt": time.Now()},
	}).Decode(&session)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &session, nil
}

// DeleteSession deletes a session by session ID
func (r *Repository) DeleteSession(ctx context.Context, sessionID string) error {
	_, err := r.sessions.DeleteOne(ctx, bson.M{"sessionId": sessionID})
	return err
}

// DeleteUserSessions deletes all sessions for a user
func (r *Repository) DeleteUserSessions(ctx context.Context, userID string) error {
	_, err := r.sessions.DeleteMany(ctx, bson.M{"userId": userID})
	return err
}

// CleanExpiredSessions removes expired sessions
func (r *Repository) CleanExpiredSessions(ctx context.Context) error {
	_, err := r.sessions.DeleteMany(ctx, bson.M{
		"expiresAt": bson.M{"$lt": time.Now()},
	})
	return err
}
