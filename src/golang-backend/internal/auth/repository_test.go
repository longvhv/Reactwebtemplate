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
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func TestRepository_CreateUser(t *testing.T) {
	tests := []struct {
		name    string
		user    *User
		mockFn  func(*testutil.MockMongoRepository)
		wantErr bool
		errMsg  string
	}{
		{
			name: "successful user creation",
			user: testutil.NewTestUser(),
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("InsertOne", mock.Anything, mock.Anything).
					Return(&mongo.InsertOneResult{InsertedID: primitive.NewObjectID()}, nil)
			},
			wantErr: false,
		},
		{
			name: "duplicate email error",
			user: testutil.NewTestUser(),
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("InsertOne", mock.Anything, mock.Anything).
					Return(nil, mongo.WriteException{
						WriteErrors: mongo.WriteErrors{
							mongo.WriteError{Code: 11000},
						},
					})
			},
			wantErr: true,
			errMsg:  "user already exists",
		},
		{
			name: "database error",
			user: testutil.NewTestUser(),
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("InsertOne", mock.Anything, mock.Anything).
					Return(nil, errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)
			mockSessions := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users:    mockUsers,
				sessions: mockSessions,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockUsers)
			}

			err := repo.CreateUser(context.Background(), tt.user)

			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Equal(t, tt.errMsg, err.Error())
				}
			} else {
				assert.NoError(t, err)
				assert.NotEqual(t, primitive.NilObjectID, tt.user.ID)
				assert.NotZero(t, tt.user.CreatedAt)
				assert.NotZero(t, tt.user.UpdatedAt)
			}

			mockUsers.AssertExpectations(t)
		})
	}
}

func TestRepository_FindUserByEmail(t *testing.T) {
	tests := []struct {
		name    string
		email   string
		mockFn  func(*testutil.MockMongoRepository)
		want    *User
		wantErr bool
	}{
		{
			name:  "user found",
			email: "john.doe@example.com",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"emailAddress": "john.doe@example.com"}, mock.Anything).
					Run(func(args mock.Arguments) {
						user := args.Get(2).(*User)
						*user = *testutil.NewTestUser()
					}).
					Return(nil)
			},
			want:    testutil.NewTestUser(),
			wantErr: false,
		},
		{
			name:  "user not found",
			email: "notfound@example.com",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"emailAddress": "notfound@example.com"}, mock.Anything).
					Return(mongo.ErrNoDocuments)
			},
			want:    nil,
			wantErr: false,
		},
		{
			name:  "database error",
			email: "error@example.com",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"emailAddress": "error@example.com"}, mock.Anything).
					Return(errors.New("database error"))
			},
			want:    nil,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)
			mockSessions := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users:    mockUsers,
				sessions: mockSessions,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockUsers)
			}

			got, err := repo.FindUserByEmail(context.Background(), tt.email)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				if tt.want != nil {
					assert.NotNil(t, got)
					assert.Equal(t, tt.want.EmailAddress, got.EmailAddress)
				} else {
					assert.Nil(t, got)
				}
			}

			mockUsers.AssertExpectations(t)
		})
	}
}

func TestRepository_FindUserByID(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		mockFn  func(*testutil.MockMongoRepository)
		want    *User
		wantErr bool
	}{
		{
			name:   "user found",
			userID: "usr_test123",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"userId": "usr_test123"}, mock.Anything).
					Run(func(args mock.Arguments) {
						user := args.Get(2).(*User)
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
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)
			mockSessions := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users:    mockUsers,
				sessions: mockSessions,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockUsers)
			}

			got, err := repo.FindUserByID(context.Background(), tt.userID)

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

func TestRepository_UpdateUser(t *testing.T) {
	tests := []struct {
		name    string
		userID  string
		update  bson.M
		mockFn  func(*testutil.MockMongoRepository)
		wantErr bool
	}{
		{
			name:   "successful update",
			userID: "usr_test123",
			update: bson.M{"firstName": "Jane"},
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("UpdateOne", mock.Anything, bson.M{"userId": "usr_test123"}, mock.Anything).
					Return(&mongo.UpdateResult{ModifiedCount: 1}, nil)
			},
			wantErr: false,
		},
		{
			name:   "database error",
			userID: "usr_test123",
			update: bson.M{"firstName": "Jane"},
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
			mockSessions := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users:    mockUsers,
				sessions: mockSessions,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockUsers)
			}

			err := repo.UpdateUser(context.Background(), tt.userID, tt.update)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			mockUsers.AssertExpectations(t)
		})
	}
}

func TestRepository_CreateSession(t *testing.T) {
	tests := []struct {
		name    string
		session *Session
		mockFn  func(*testutil.MockMongoRepository)
		wantErr bool
	}{
		{
			name:    "successful session creation",
			session: testutil.NewTestSession(),
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("InsertOne", mock.Anything, mock.Anything).
					Return(&mongo.InsertOneResult{InsertedID: primitive.NewObjectID()}, nil)
			},
			wantErr: false,
		},
		{
			name:    "database error",
			session: testutil.NewTestSession(),
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("InsertOne", mock.Anything, mock.Anything).
					Return(nil, errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)
			mockSessions := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users:    mockUsers,
				sessions: mockSessions,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockSessions)
			}

			err := repo.CreateSession(context.Background(), tt.session)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.NotEqual(t, primitive.NilObjectID, tt.session.ID)
				assert.NotZero(t, tt.session.CreatedAt)
			}

			mockSessions.AssertExpectations(t)
		})
	}
}

func TestRepository_FindSessionByRefreshToken(t *testing.T) {
	tests := []struct {
		name         string
		refreshToken string
		mockFn       func(*testutil.MockMongoRepository)
		want         *Session
		wantErr      bool
	}{
		{
			name:         "session found",
			refreshToken: "valid_refresh_token",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, mock.Anything, mock.Anything).
					Run(func(args mock.Arguments) {
						session := args.Get(2).(*Session)
						*session = *testutil.NewTestSession()
					}).
					Return(nil)
			},
			want:    testutil.NewTestSession(),
			wantErr: false,
		},
		{
			name:         "session not found",
			refreshToken: "invalid_token",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, mock.Anything, mock.Anything).
					Return(mongo.ErrNoDocuments)
			},
			want:    nil,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)
			mockSessions := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users:    mockUsers,
				sessions: mockSessions,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockSessions)
			}

			got, err := repo.FindSessionByRefreshToken(context.Background(), tt.refreshToken)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				if tt.want != nil {
					assert.NotNil(t, got)
					assert.Equal(t, tt.want.SessionID, got.SessionID)
				} else {
					assert.Nil(t, got)
				}
			}

			mockSessions.AssertExpectations(t)
		})
	}
}

func TestRepository_DeleteSession(t *testing.T) {
	mockUsers := testutil.NewMockMongoRepository(t)
	mockSessions := testutil.NewMockMongoRepository(t)

	repo := &Repository{
		users:    mockUsers,
		sessions: mockSessions,
	}

	mockSessions.On("DeleteOne", mock.Anything, bson.M{"sessionId": "sess_test123"}).
		Return(&mongo.DeleteResult{DeletedCount: 1}, nil)

	err := repo.DeleteSession(context.Background(), "sess_test123")

	assert.NoError(t, err)
	mockSessions.AssertExpectations(t)
}

func TestRepository_DeleteUserSessions(t *testing.T) {
	mockUsers := testutil.NewMockMongoRepository(t)
	mockSessions := testutil.NewMockMongoRepository(t)

	repo := &Repository{
		users:    mockUsers,
		sessions: mockSessions,
	}

	mockSessions.On("DeleteMany", mock.Anything, bson.M{"userId": "usr_test123"}).
		Return(&mongo.DeleteResult{DeletedCount: 3}, nil)

	err := repo.DeleteUserSessions(context.Background(), "usr_test123")

	assert.NoError(t, err)
	mockSessions.AssertExpectations(t)
}

func TestRepository_CleanExpiredSessions(t *testing.T) {
	mockUsers := testutil.NewMockMongoRepository(t)
	mockSessions := testutil.NewMockMongoRepository(t)

	repo := &Repository{
		users:    mockUsers,
		sessions: mockSessions,
	}

	mockSessions.On("DeleteMany", mock.Anything, mock.MatchedBy(func(filter bson.M) bool {
		// Verify that the filter contains expiresAt field
		_, ok := filter["expiresAt"]
		return ok
	})).Return(&mongo.DeleteResult{DeletedCount: 5}, nil)

	err := repo.CleanExpiredSessions(context.Background())

	assert.NoError(t, err)
	mockSessions.AssertExpectations(t)
}

func TestRepository_UserExists(t *testing.T) {
	tests := []struct {
		name    string
		email   string
		count   int64
		want    bool
		wantErr bool
	}{
		{
			name:    "user exists",
			email:   "john.doe@example.com",
			count:   1,
			want:    true,
			wantErr: false,
		},
		{
			name:    "user does not exist",
			email:   "notfound@example.com",
			count:   0,
			want:    false,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUsers := testutil.NewMockMongoRepository(t)
			mockSessions := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users:    mockUsers,
				sessions: mockSessions,
			}

			mockUsers.On("Count", mock.Anything, bson.M{"emailAddress": tt.email}).
				Return(tt.count, nil)

			got, err := repo.UserExists(context.Background(), tt.email)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.want, got)
			}

			mockUsers.AssertExpectations(t)
		})
	}
}

func TestRepository_CountUsers(t *testing.T) {
	mockUsers := testutil.NewMockMongoRepository(t)
	mockSessions := testutil.NewMockMongoRepository(t)

	repo := &Repository{
		users:    mockUsers,
		sessions: mockSessions,
	}

	filter := bson.M{"status": "active"}
	mockUsers.On("Count", mock.Anything, filter).
		Return(int64(42), nil)

	count, err := repo.CountUsers(context.Background(), filter)

	assert.NoError(t, err)
	assert.Equal(t, int64(42), count)
	mockUsers.AssertExpectations(t)
}
