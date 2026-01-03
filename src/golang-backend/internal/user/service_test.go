package user

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/vhvplatform/react-framework-api/internal/auth"
	"github.com/vhvplatform/react-framework-api/pkg/testutil"
	"go.mongodb.org/mongo-driver/bson"
)

// MockRepository is a mock implementation of user Repository
type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) FindByID(ctx context.Context, userID string) (*auth.User, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*auth.User), args.Error(1)
}

func (m *MockRepository) Update(ctx context.Context, userID string, update bson.M) (*auth.User, error) {
	args := m.Called(ctx, userID, update)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*auth.User), args.Error(1)
}

func (m *MockRepository) UpdatePassword(ctx context.Context, userID string, hashedPassword string) error {
	args := m.Called(ctx, userID, hashedPassword)
	return args.Error(0)
}

func (m *MockRepository) List(ctx context.Context, params *ListUsersParams) ([]auth.User, int64, error) {
	args := m.Called(ctx, params)
	return args.Get(0).([]auth.User), args.Get(1).(int64), args.Error(2)
}

func (m *MockRepository) Delete(ctx context.Context, userID string) error {
	args := m.Called(ctx, userID)
	return args.Error(0)
}

func (m *MockRepository) Exists(ctx context.Context, userID string) (bool, error) {
	args := m.Called(ctx, userID)
	return args.Bool(0), args.Error(1)
}

func TestService_GetProfile(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		mockFn  func(*MockRepository)
		wantErr bool
		errMsg  string
	}{
		{
			name:   "successful get profile",
			userID: "usr_test123",
			mockFn: func(m *MockRepository) {
				m.On("FindByID", mock.Anything, "usr_test123").
					Return(testutil.NewTestUser(), nil)
			},
			wantErr: false,
		},
		{
			name:   "user not found",
			userID: "usr_notfound",
			mockFn: func(m *MockRepository) {
				m.On("FindByID", mock.Anything, "usr_notfound").
					Return(nil, nil)
			},
			wantErr: true,
			errMsg:  "user not found",
		},
		{
			name:   "database error",
			userID: "usr_error",
			mockFn: func(m *MockRepository) {
				m.On("FindByID", mock.Anything, "usr_error").
					Return(nil, errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo)

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			user, err := service.GetProfile(context.Background(), tt.userID)

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
				assert.Nil(t, user)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, user)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestService_UpdateProfile(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		req     *UpdateProfileRequest
		mockFn  func(*MockRepository)
		wantErr bool
		errMsg  string
	}{
		{
			name:   "successful update",
			userID: "usr_test123",
			req: &UpdateProfileRequest{
				FirstName: "Jane",
				LastName:  "Smith",
			},
			mockFn: func(m *MockRepository) {
				updatedUser := testutil.NewTestUser()
				updatedUser.FirstName = "Jane"
				updatedUser.LastName = "Smith"
				m.On("Update", mock.Anything, "usr_test123", mock.Anything).
					Return(updatedUser, nil)
			},
			wantErr: false,
		},
		{
			name:   "user not found",
			userID: "usr_notfound",
			req: &UpdateProfileRequest{
				FirstName: "Jane",
			},
			mockFn: func(m *MockRepository) {
				m.On("Update", mock.Anything, "usr_notfound", mock.Anything).
					Return(nil, nil)
			},
			wantErr: true,
			errMsg:  "user not found",
		},
		{
			name:   "database error",
			userID: "usr_error",
			req: &UpdateProfileRequest{
				FirstName: "Jane",
			},
			mockFn: func(m *MockRepository) {
				m.On("Update", mock.Anything, "usr_error", mock.Anything).
					Return(nil, errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo)

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			user, err := service.UpdateProfile(context.Background(), tt.userID, tt.req)

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
				assert.Nil(t, user)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, user)
				assert.Equal(t, tt.req.FirstName, user.FirstName)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestService_ChangePassword(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		req     *ChangePasswordRequest
		mockFn  func(*MockRepository)
		wantErr bool
		errMsg  string
	}{
		{
			name:   "password mismatch",
			userID: "usr_test123",
			req: &ChangePasswordRequest{
				NewPassword:     "NewPassword123!",
				ConfirmPassword: "DifferentPassword123!",
			},
			mockFn:  nil,
			wantErr: true,
			errMsg:  "passwords do not match",
		},
		{
			name:   "user not found",
			userID: "usr_notfound",
			req: &ChangePasswordRequest{
				NewPassword:     "NewPassword123!",
				ConfirmPassword: "NewPassword123!",
			},
			mockFn: func(m *MockRepository) {
				m.On("FindByID", mock.Anything, "usr_notfound").
					Return(nil, nil)
			},
			wantErr: true,
			errMsg:  "user not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo)

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			err := service.ChangePassword(context.Background(), tt.userID, tt.req)

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
			} else {
				assert.NoError(t, err)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestService_ListUsers(t *testing.T) {
	tests := []struct {
		name    string
		params  *ListUsersParams
		mockFn  func(*MockRepository)
		want    int
		total   int64
		wantErr bool
	}{
		{
			name: "successful list",
			params: &ListUsersParams{
				Page:      1,
				PageSize:  10,
				SortBy:    "createdAt",
				SortOrder: "desc",
			},
			mockFn: func(m *MockRepository) {
				testUsers := testutil.TestUsers()
				m.On("List", mock.Anything, mock.Anything).
					Return(testUsers, int64(25), nil)
			},
			want:    3,
			total:   25,
			wantErr: false,
		},
		{
			name: "list with search",
			params: &ListUsersParams{
				Page:      1,
				PageSize:  10,
				SortBy:    "firstName",
				SortOrder: "asc",
				Search:    "john",
			},
			mockFn: func(m *MockRepository) {
				users := []auth.User{*testutil.NewTestUser()}
				m.On("List", mock.Anything, mock.Anything).
					Return(users, int64(1), nil)
			},
			want:    1,
			total:   1,
			wantErr: false,
		},
		{
			name: "database error",
			params: &ListUsersParams{
				Page:     1,
				PageSize: 10,
			},
			mockFn: func(m *MockRepository) {
				m.On("List", mock.Anything, mock.Anything).
					Return([]auth.User{}, int64(0), errors.New("database error"))
			},
			want:    0,
			total:   0,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo)

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			resp, err := service.ListUsers(context.Background(), tt.params)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, resp)
				assert.Len(t, resp.Users, tt.want)
				assert.Equal(t, tt.total, resp.Total)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestService_DeleteUser(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		mockFn  func(*MockRepository)
		wantErr bool
		errMsg  string
	}{
		{
			name:   "successful delete",
			userID: "usr_test123",
			mockFn: func(m *MockRepository) {
				m.On("Exists", mock.Anything, "usr_test123").
					Return(true, nil)
				m.On("Delete", mock.Anything, "usr_test123").
					Return(nil)
			},
			wantErr: false,
		},
		{
			name:   "user not found",
			userID: "usr_notfound",
			mockFn: func(m *MockRepository) {
				m.On("Exists", mock.Anything, "usr_notfound").
					Return(false, nil)
			},
			wantErr: true,
			errMsg:  "user not found",
		},
		{
			name:   "database error",
			userID: "usr_error",
			mockFn: func(m *MockRepository) {
				m.On("Exists", mock.Anything, "usr_error").
					Return(true, nil)
				m.On("Delete", mock.Anything, "usr_error").
					Return(errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo)

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			err := service.DeleteUser(context.Background(), tt.userID)

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
			} else {
				assert.NoError(t, err)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestService_GetUser(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		mockFn  func(*MockRepository)
		wantErr bool
	}{
		{
			name:   "user found",
			userID: "usr_test123",
			mockFn: func(m *MockRepository) {
				m.On("FindByID", mock.Anything, "usr_test123").
					Return(testutil.NewTestUser(), nil)
			},
			wantErr: false,
		},
		{
			name:   "user not found",
			userID: "usr_notfound",
			mockFn: func(m *MockRepository) {
				m.On("FindByID", mock.Anything, "usr_notfound").
					Return(nil, nil)
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo)

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			user, err := service.GetUser(context.Background(), tt.userID)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, user)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}
