package auth

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/vhvplatform/react-framework-api/pkg/testutil"
	"go.mongodb.org/mongo-driver/bson"
)

// MockRepository is a mock implementation of Repository
type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) CreateUser(ctx context.Context, user *User) error {
	args := m.Called(ctx, user)
	return args.Error(0)
}

func (m *MockRepository) FindUserByEmail(ctx context.Context, email string) (*User, error) {
	args := m.Called(ctx, email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*User), args.Error(1)
}

func (m *MockRepository) FindUserByID(ctx context.Context, userID string) (*User, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*User), args.Error(1)
}

func (m *MockRepository) UpdateUser(ctx context.Context, userID string, update bson.M) error {
	args := m.Called(ctx, userID, update)
	return args.Error(0)
}

func (m *MockRepository) CreateSession(ctx context.Context, session *Session) error {
	args := m.Called(ctx, session)
	return args.Error(0)
}

func (m *MockRepository) FindSessionByRefreshToken(ctx context.Context, refreshToken string) (*Session, error) {
	args := m.Called(ctx, refreshToken)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*Session), args.Error(1)
}

func (m *MockRepository) DeleteSession(ctx context.Context, sessionID string) error {
	args := m.Called(ctx, sessionID)
	return args.Error(0)
}

func (m *MockRepository) DeleteUserSessions(ctx context.Context, userID string) error {
	args := m.Called(ctx, userID)
	return args.Error(0)
}

func (m *MockRepository) CleanExpiredSessions(ctx context.Context) error {
	args := m.Called(ctx)
	return args.Error(0)
}

func (m *MockRepository) UserExists(ctx context.Context, email string) (bool, error) {
	args := m.Called(ctx, email)
	return args.Bool(0), args.Error(1)
}

func (m *MockRepository) CountUsers(ctx context.Context, filter bson.M) (int64, error) {
	args := m.Called(ctx, filter)
	return args.Get(0).(int64), args.Error(1)
}

func TestService_Register(t *testing.T) {
	tests := []struct {
		name    string
		req     *RegisterRequest
		mockFn  func(*MockRepository)
		wantErr bool
		errMsg  string
	}{
		{
			name: "successful registration",
			req: &RegisterRequest{
				FirstName:       "John",
				LastName:        "Doe",
				EmailAddress:    "john.doe@example.com",
				Password:        "SecurePassword123!",
				ConfirmPassword: "SecurePassword123!",
			},
			mockFn: func(m *MockRepository) {
				m.On("UserExists", mock.Anything, "john.doe@example.com").
					Return(false, nil)
				m.On("CreateUser", mock.Anything, mock.Anything).
					Return(nil)
			},
			wantErr: false,
		},
		{
			name: "password mismatch",
			req: &RegisterRequest{
				FirstName:       "John",
				LastName:        "Doe",
				EmailAddress:    "john.doe@example.com",
				Password:        "Password123!",
				ConfirmPassword: "DifferentPassword123!",
			},
			mockFn:  nil,
			wantErr: true,
			errMsg:  "passwords do not match",
		},
		{
			name: "user already exists",
			req: &RegisterRequest{
				FirstName:       "John",
				LastName:        "Doe",
				EmailAddress:    "existing@example.com",
				Password:        "SecurePassword123!",
				ConfirmPassword: "SecurePassword123!",
			},
			mockFn: func(m *MockRepository) {
				m.On("UserExists", mock.Anything, "existing@example.com").
					Return(true, nil)
			},
			wantErr: true,
			errMsg:  "user already exists",
		},
		{
			name: "database error on user exists check",
			req: &RegisterRequest{
				FirstName:       "John",
				LastName:        "Doe",
				EmailAddress:    "john.doe@example.com",
				Password:        "SecurePassword123!",
				ConfirmPassword: "SecurePassword123!",
			},
			mockFn: func(m *MockRepository) {
				m.On("UserExists", mock.Anything, "john.doe@example.com").
					Return(false, errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo, "test-secret", "test-refresh-secret")

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			resp, err := service.Register(context.Background(), tt.req)

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
				assert.Nil(t, resp)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, resp)
				assert.NotEmpty(t, resp.UserID)
				assert.Equal(t, tt.req.EmailAddress, resp.EmailAddress)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestService_Login(t *testing.T) {
	// Create a test user with hashed password
	testUser := testutil.NewTestUser()
	hashedPassword := "$2a$10$YourHashedPasswordHere" // This should be a real bcrypt hash

	tests := []struct {
		name    string
		req     *LoginRequest
		mockFn  func(*MockRepository)
		wantErr bool
		errMsg  string
	}{
		{
			name: "user not found",
			req: &LoginRequest{
				EmailAddress: "notfound@example.com",
				Password:     "password123",
			},
			mockFn: func(m *MockRepository) {
				m.On("FindUserByEmail", mock.Anything, "notfound@example.com").
					Return(nil, nil)
			},
			wantErr: true,
			errMsg:  "invalid credentials",
		},
		{
			name: "inactive user",
			req: &LoginRequest{
				EmailAddress: "inactive@example.com",
				Password:     "password123",
			},
			mockFn: func(m *MockRepository) {
				user := testutil.NewTestUser()
				user.Status = "inactive"
				m.On("FindUserByEmail", mock.Anything, "inactive@example.com").
					Return(user, nil)
			},
			wantErr: true,
			errMsg:  "user account is not active",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo, "test-secret", "test-refresh-secret")

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			resp, err := service.Login(context.Background(), tt.req)

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
				assert.Nil(t, resp)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, resp)
				assert.NotEmpty(t, resp.AccessToken)
				assert.NotEmpty(t, resp.RefreshToken)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestService_ValidateToken(t *testing.T) {
	mockRepo := new(MockRepository)
	service := NewService(mockRepo, "test-secret", "test-refresh-secret")

	// Generate a valid token
	testUser := testutil.NewTestUser()
	token, err := service.GenerateAccessToken(testUser)
	assert.NoError(t, err)

	tests := []struct {
		name    string
		token   string
		wantErr bool
	}{
		{
			name:    "valid token",
			token:   token,
			wantErr: false,
		},
		{
			name:    "invalid token",
			token:   "invalid.token.here",
			wantErr: true,
		},
		{
			name:    "empty token",
			token:   "",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			claims, err := service.ValidateToken(tt.token)

			if tt.wantErr {
				assert.Error(t, err)
				assert.Nil(t, claims)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, claims)
				assert.Equal(t, testUser.UserID, claims.UserID)
			}
		})
	}
}

func TestService_RefreshToken(t *testing.T) {
	tests := []struct {
		name    string
		token   string
		mockFn  func(*MockRepository)
		wantErr bool
		errMsg  string
	}{
		{
			name:  "session not found",
			token: "invalid_refresh_token",
			mockFn: func(m *MockRepository) {
				m.On("FindSessionByRefreshToken", mock.Anything, "invalid_refresh_token").
					Return(nil, nil)
			},
			wantErr: true,
			errMsg:  "invalid refresh token",
		},
		{
			name:  "user not found",
			token: "valid_refresh_token",
			mockFn: func(m *MockRepository) {
				session := testutil.NewTestSession()
				m.On("FindSessionByRefreshToken", mock.Anything, "valid_refresh_token").
					Return(session, nil)
				m.On("FindUserByID", mock.Anything, session.UserID).
					Return(nil, nil)
			},
			wantErr: true,
			errMsg:  "user not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo, "test-secret", "test-refresh-secret")

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			resp, err := service.RefreshToken(context.Background(), &RefreshTokenRequest{
				RefreshToken: tt.token,
			})

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
				assert.Nil(t, resp)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, resp)
				assert.NotEmpty(t, resp.AccessToken)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestService_Logout(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		mockFn  func(*MockRepository)
		wantErr bool
	}{
		{
			name:   "successful logout",
			userID: "usr_test123",
			mockFn: func(m *MockRepository) {
				m.On("DeleteUserSessions", mock.Anything, "usr_test123").
					Return(nil)
			},
			wantErr: false,
		},
		{
			name:   "database error",
			userID: "usr_test123",
			mockFn: func(m *MockRepository) {
				m.On("DeleteUserSessions", mock.Anything, "usr_test123").
					Return(errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo, "test-secret", "test-refresh-secret")

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			err := service.Logout(context.Background(), tt.userID)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}

func TestService_GenerateAccessToken(t *testing.T) {
	mockRepo := new(MockRepository)
	service := NewService(mockRepo, "test-secret", "test-refresh-secret")

	testUser := testutil.NewTestUser()

	token, err := service.GenerateAccessToken(testUser)

	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Validate the generated token
	claims, err := service.ValidateToken(token)
	assert.NoError(t, err)
	assert.Equal(t, testUser.UserID, claims.UserID)
	assert.Equal(t, testUser.EmailAddress, claims.Email)
	assert.Equal(t, testUser.Role, claims.Role)
}

func TestService_GenerateRefreshToken(t *testing.T) {
	mockRepo := new(MockRepository)
	service := NewService(mockRepo, "test-secret", "test-refresh-secret")

	testUser := testutil.NewTestUser()

	token, err := service.GenerateRefreshToken(testUser)

	assert.NoError(t, err)
	assert.NotEmpty(t, token)
	assert.Len(t, token, 64) // SHA256 hex string length
}

func TestService_GetCurrentUser(t *testing.T) {
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
				m.On("FindUserByID", mock.Anything, "usr_test123").
					Return(testutil.NewTestUser(), nil)
			},
			wantErr: false,
		},
		{
			name:   "user not found",
			userID: "usr_notfound",
			mockFn: func(m *MockRepository) {
				m.On("FindUserByID", mock.Anything, "usr_notfound").
					Return(nil, nil)
			},
			wantErr: true,
			errMsg:  "user not found",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockRepo := new(MockRepository)
			service := NewService(mockRepo, "test-secret", "test-refresh-secret")

			if tt.mockFn != nil {
				tt.mockFn(mockRepo)
			}

			user, err := service.GetCurrentUser(context.Background(), tt.userID)

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
