package user

import (
	"context"
	"errors"
	"math"

	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"

	"github.com/vhvplatform/react-framework-api/internal/auth"
)

var (
	// ErrUserNotFound is returned when user is not found
	ErrUserNotFound = errors.New("user not found")
	// ErrInvalidPassword is returned when current password is incorrect
	ErrInvalidPassword = errors.New("invalid current password")
)

// Service handles user business logic
type Service struct {
	repo *Repository
}

// NewService creates a new user service
func NewService(repo *Repository) *Service {
	return &Service{
		repo: repo,
	}
}

// GetByID gets a user by ID
func (s *Service) GetByID(ctx context.Context, userID string) (*auth.User, error) {
	user, err := s.repo.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}
	return user, nil
}

// Update updates user information
func (s *Service) Update(ctx context.Context, userID string, req *UpdateUserRequest) (*auth.User, error) {
	update := bson.M{}

	if req.FirstName != nil {
		update["firstName"] = *req.FirstName
	}
	if req.LastName != nil {
		update["lastName"] = *req.LastName
	}
	if req.Avatar != nil {
		update["avatar"] = *req.Avatar
	}
	if req.Preferences != nil {
		if req.Preferences.Language != "" {
			update["preferences.language"] = req.Preferences.Language
		}
		if req.Preferences.Theme != "" {
			update["preferences.theme"] = req.Preferences.Theme
		}
		update["preferences.notifications"] = req.Preferences.Notifications
	}

	user, err := s.repo.Update(ctx, userID, update)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}

	return user, nil
}

// ChangePassword changes user password
func (s *Service) ChangePassword(ctx context.Context, userID string, req *ChangePasswordRequest) error {
	// Get user
	user, err := s.repo.FindByID(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return ErrUserNotFound
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		return ErrInvalidPassword
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	// Update password
	return s.repo.UpdatePassword(ctx, userID, string(hashedPassword))
}

// List returns a paginated list of users
func (s *Service) List(ctx context.Context, params *ListUsersParams) ([]auth.User, *PaginationMeta, error) {
	// Set defaults
	if params.Page < 1 {
		params.Page = 1
	}
	if params.PageSize < 1 || params.PageSize > 100 {
		params.PageSize = 20
	}
	if params.SortBy == "" {
		params.SortBy = "createdAt"
	}
	if params.SortOrder == "" {
		params.SortOrder = "desc"
	}

	users, total, err := s.repo.List(ctx, params)
	if err != nil {
		return nil, nil, err
	}

	totalPages := int(math.Ceil(float64(total) / float64(params.PageSize)))

	pagination := &PaginationMeta{
		Page:       params.Page,
		PageSize:   params.PageSize,
		TotalItems: int(total),
		TotalPages: totalPages,
	}

	return users, pagination, nil
}

// Delete deletes a user
func (s *Service) Delete(ctx context.Context, userID string) error {
	user, err := s.repo.FindByID(ctx, userID)
	if err != nil {
		return err
	}
	if user == nil {
		return ErrUserNotFound
	}

	return s.repo.Delete(ctx, userID)
}
