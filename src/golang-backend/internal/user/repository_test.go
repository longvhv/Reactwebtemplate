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
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func TestRepository_FindByID(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		mockFn  func(*testutil.MockMongoRepository)
		want    *auth.User
		wantErr bool
	}{
		{
			name:   "user found",
			userID: "usr_test123",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"userId": "usr_test123"}, mock.Anything).
					Run(func(args mock.Arguments) {
						user := args.Get(2).(*auth.User)
						*user = *testutil.NewTestUser()
					}).
					Return(nil)
			},
			want:    testutil.NewTestUser(),
			wantErr: false,
		},
		{
			name:   "user not found",
			userID: "usr_notfound",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"userId": "usr_notfound"}, mock.Anything).
					Return(mongo.ErrNoDocuments)
			},
			want:    nil,
			wantErr: false,
		},
		{
			name:   "database error",
			userID: "usr_error",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"userId": "usr_error"}, mock.Anything).
					Return(errors.New("database error"))
			},
			want:    nil,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users: mockUsers,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockUsers)
			}

			got, err := repo.FindByID(context.Background(), tt.userID)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				if tt.want != nil {
					assert.NotNil(t, got)
					assert.Equal(t, tt.want.UserID, got.UserID)
				} else {
					assert.Nil(t, got)
				}
			}

			mockUsers.AssertExpectations(t)
		})
	}
}

func TestRepository_UpdatePassword(t *testing.T) {
	tests := []struct {
		name           string
		userID         string
		hashedPassword string
		mockFn         func(*testutil.MockMongoRepository)
		wantErr        bool
	}{
		{
			name:           "successful password update",
			userID:         "usr_test123",
			hashedPassword: "$2a$10$newhashedpassword",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("UpdateOne", mock.Anything, bson.M{"userId": "usr_test123"}, mock.Anything).
					Return(&mongo.UpdateResult{ModifiedCount: 1}, nil)
			},
			wantErr: false,
		},
		{
			name:           "database error",
			userID:         "usr_test123",
			hashedPassword: "$2a$10$newhashedpassword",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("UpdateOne", mock.Anything, bson.M{"userId": "usr_test123"}, mock.Anything).
					Return(nil, errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users: mockUsers,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockUsers)
			}

			err := repo.UpdatePassword(context.Background(), tt.userID, tt.hashedPassword)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			mockUsers.AssertExpectations(t)
		})
	}
}

func TestRepository_List(t *testing.T) {
	tests := []struct {
		name    string
		params  *ListUsersParams
		mockFn  func(*testutil.MockMongoRepository)
		want    int
		total   int64
		wantErr bool
	}{
		{
			name: "successful list with pagination",
			params: &ListUsersParams{
				Page:      1,
				PageSize:  10,
				SortBy:    "createdAt",
				SortOrder: "desc",
				Search:    "",
				Role:      "",
			},
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("Count", mock.Anything, mock.Anything).
					Return(int64(25), nil)
				m.On("Find", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
					Run(func(args mock.Arguments) {
						users := args.Get(2).(*[]auth.User)
						testUsers := testutil.TestUsers()
						*users = testUsers
					}).
					Return(nil)
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
				Role:      "",
			},
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("Count", mock.Anything, mock.Anything).
					Return(int64(1), nil)
				m.On("Find", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
					Run(func(args mock.Arguments) {
						users := args.Get(2).(*[]auth.User)
						*users = []auth.User{*testutil.NewTestUser()}
					}).
					Return(nil)
			},
			want:    1,
			total:   1,
			wantErr: false,
		},
		{
			name: "list with role filter",
			params: &ListUsersParams{
				Page:      1,
				PageSize:  10,
				SortBy:    "createdAt",
				SortOrder: "desc",
				Search:    "",
				Role:      "admin",
			},
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("Count", mock.Anything, mock.Anything).
					Return(int64(5), nil)
				m.On("Find", mock.Anything, mock.Anything, mock.Anything, mock.Anything).
					Run(func(args mock.Arguments) {
						users := args.Get(2).(*[]auth.User)
						admin := testutil.NewTestAdmin()
						*users = []auth.User{*admin}
					}).
					Return(nil)
			},
			want:    1,
			total:   5,
			wantErr: false,
		},
		{
			name: "count error",
			params: &ListUsersParams{
				Page:      1,
				PageSize:  10,
				SortBy:    "createdAt",
				SortOrder: "desc",
			},
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("Count", mock.Anything, mock.Anything).
					Return(int64(0), errors.New("database error"))
			},
			want:    0,
			total:   0,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users: mockUsers,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockUsers)
			}

			users, total, err := repo.List(context.Background(), tt.params)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Len(t, users, tt.want)
				assert.Equal(t, tt.total, total)
			}

			mockUsers.AssertExpectations(t)
		})
	}
}

func TestRepository_Delete(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		mockFn  func(*testutil.MockMongoRepository)
		wantErr bool
	}{
		{
			name:   "successful delete",
			userID: "usr_test123",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("DeleteOne", mock.Anything, bson.M{"userId": "usr_test123"}).
					Return(&mongo.DeleteResult{DeletedCount: 1}, nil)
			},
			wantErr: false,
		},
		{
			name:   "database error",
			userID: "usr_test123",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("DeleteOne", mock.Anything, bson.M{"userId": "usr_test123"}).
					Return(nil, errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users: mockUsers,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockUsers)
			}

			err := repo.Delete(context.Background(), tt.userID)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			mockUsers.AssertExpectations(t)
		})
	}
}

func TestRepository_Exists(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		count   int64
		want    bool
		wantErr bool
	}{
		{
			name:    "user exists",
			userID:  "usr_test123",
			count:   1,
			want:    true,
			wantErr: false,
		},
		{
			name:    "user does not exist",
			userID:  "usr_notfound",
			count:   0,
			want:    false,
			wantErr: false,
		},
		{
			name:    "database error",
			userID:  "usr_error",
			count:   0,
			want:    false,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users: mockUsers,
			}

			if tt.wantErr {
				mockUsers.On("Count", mock.Anything, bson.M{"userId": tt.userID}).
					Return(tt.count, errors.New("database error"))
			} else {
				mockUsers.On("Count", mock.Anything, bson.M{"userId": tt.userID}).
					Return(tt.count, nil)
			}

			exists, err := repo.Exists(context.Background(), tt.userID)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.want, exists)
			}

			mockUsers.AssertExpectations(t)
		})
	}
}
