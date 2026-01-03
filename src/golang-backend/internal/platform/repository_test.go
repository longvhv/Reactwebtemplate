package platform

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/vhvplatform/react-framework-api/pkg/testutil"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func TestRepository_GetSettings(t *testing.T) {
	tests := []struct {
		name    string
		mockFn  func(*testutil.MockMongoRepository)
		wantErr bool
	}{
		{
			name: "settings found",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"settingsId": "settings_global"}, mock.Anything).
					Run(func(args mock.Arguments) {
						settings := args.Get(2).(*PlatformSettings)
						*settings = *testutil.NewTestPlatformSettings()
					}).
					Return(nil)
			},
			wantErr: false,
		},
		{
			name: "settings not found - create default",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"settingsId": "settings_global"}, mock.Anything).
					Return(mongo.ErrNoDocuments)
				m.On("InsertOne", mock.Anything, mock.Anything).
					Return(&mongo.InsertOneResult{}, nil)
			},
			wantErr: false,
		},
		{
			name: "database error",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"settingsId": "settings_global"}, mock.Anything).
					Return(errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSettings := testutil.NewMockMongoRepository(t)
			mockNavigation := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				settings:   mockSettings,
				navigation: mockNavigation,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockSettings)
			}

			settings, err := repo.GetSettings(context.Background())

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, settings)
				assert.Equal(t, "settings_global", settings.SettingsID)
			}

			mockSettings.AssertExpectations(t)
		})
	}
}

func TestRepository_GetNavigation(t *testing.T) {
	tests := []struct {
		name    string
		mockFn  func(*testutil.MockMongoRepository)
		want    int
		wantErr bool
	}{
		{
			name: "successful get navigation",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("Find", mock.Anything, bson.M{}, mock.Anything, mock.Anything).
					Run(func(args mock.Arguments) {
						items := args.Get(2).(*[]NavigationItem)
						*items = []NavigationItem{
							*testutil.NewTestNavigationItem(),
						}
					}).
					Return(nil)
			},
			want:    1,
			wantErr: false,
		},
		{
			name: "empty navigation",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("Find", mock.Anything, bson.M{}, mock.Anything, mock.Anything).
					Run(func(args mock.Arguments) {
						items := args.Get(2).(*[]NavigationItem)
						*items = []NavigationItem{}
					}).
					Return(nil)
			},
			want:    0,
			wantErr: false,
		},
		{
			name: "database error",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("Find", mock.Anything, bson.M{}, mock.Anything, mock.Anything).
					Return(errors.New("database error"))
			},
			want:    0,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSettings := testutil.NewMockMongoRepository(t)
			mockNavigation := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				settings:   mockSettings,
				navigation: mockNavigation,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockNavigation)
			}

			items, err := repo.GetNavigation(context.Background())

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Len(t, items, tt.want)
			}

			mockNavigation.AssertExpectations(t)
		})
	}
}

func TestRepository_CreateNavigation(t *testing.T) {
	tests := []struct {
		name    string
		item    *NavigationItem
		mockFn  func(*testutil.MockMongoRepository)
		wantErr bool
	}{
		{
			name: "successful create",
			item: testutil.NewTestNavigationItem(),
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("InsertOne", mock.Anything, mock.Anything).
					Return(&mongo.InsertOneResult{}, nil)
			},
			wantErr: false,
		},
		{
			name: "database error",
			item: testutil.NewTestNavigationItem(),
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("InsertOne", mock.Anything, mock.Anything).
					Return(nil, errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSettings := testutil.NewMockMongoRepository(t)
			mockNavigation := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				settings:   mockSettings,
				navigation: mockNavigation,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockNavigation)
			}

			err := repo.CreateNavigation(context.Background(), tt.item)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			mockNavigation.AssertExpectations(t)
		})
	}
}

func TestRepository_DeleteNavigation(t *testing.T) {
	tests := []struct {
		name         string
		navigationID string
		mockFn       func(*testutil.MockMongoRepository)
		wantErr      bool
	}{
		{
			name:         "successful delete",
			navigationID: "nav_test123",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("DeleteOne", mock.Anything, bson.M{"navigationId": "nav_test123"}).
					Return(&mongo.DeleteResult{DeletedCount: 1}, nil)
			},
			wantErr: false,
		},
		{
			name:         "database error",
			navigationID: "nav_error",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("DeleteOne", mock.Anything, bson.M{"navigationId": "nav_error"}).
					Return(nil, errors.New("database error"))
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSettings := testutil.NewMockMongoRepository(t)
			mockNavigation := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				settings:   mockSettings,
				navigation: mockNavigation,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockNavigation)
			}

			err := repo.DeleteNavigation(context.Background(), tt.navigationID)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			mockNavigation.AssertExpectations(t)
		})
	}
}

func TestRepository_FindNavigationByID(t *testing.T) {
	tests := []struct {
		name         string
		navigationID string
		mockFn       func(*testutil.MockMongoRepository)
		want         *NavigationItem
		wantErr      bool
	}{
		{
			name:         "item found",
			navigationID: "nav_test123",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"navigationId": "nav_test123"}, mock.Anything).
					Run(func(args mock.Arguments) {
						item := args.Get(2).(*NavigationItem)
						*item = *testutil.NewTestNavigationItem()
					}).
					Return(nil)
			},
			want:    testutil.NewTestNavigationItem(),
			wantErr: false,
		},
		{
			name:         "item not found",
			navigationID: "nav_notfound",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"navigationId": "nav_notfound"}, mock.Anything).
					Return(mongo.ErrNoDocuments)
			},
			want:    nil,
			wantErr: false,
		},
		{
			name:         "database error",
			navigationID: "nav_error",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, bson.M{"navigationId": "nav_error"}, mock.Anything).
					Return(errors.New("database error"))
			},
			want:    nil,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSettings := testutil.NewMockMongoRepository(t)
			mockNavigation := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				settings:   mockSettings,
				navigation: mockNavigation,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockNavigation)
			}

			item, err := repo.FindNavigationByID(context.Background(), tt.navigationID)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				if tt.want != nil {
					assert.NotNil(t, item)
					assert.Equal(t, tt.want.NavigationID, item.NavigationID)
				} else {
					assert.Nil(t, item)
				}
			}

			mockNavigation.AssertExpectations(t)
		})
	}
}

func TestRepository_GetNavigationByParent(t *testing.T) {
	tests := []struct {
		name     string
		parentID string
		mockFn   func(*testutil.MockMongoRepository)
		want     int
		wantErr  bool
	}{
		{
			name:     "successful get by parent",
			parentID: "nav_parent",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("Find", mock.Anything, bson.M{"parentId": "nav_parent"}, mock.Anything, mock.Anything).
					Run(func(args mock.Arguments) {
						items := args.Get(2).(*[]NavigationItem)
						*items = []NavigationItem{
							*testutil.NewTestNavigationItem(),
							*testutil.NewTestNavigationItem(),
						}
					}).
					Return(nil)
			},
			want:    2,
			wantErr: false,
		},
		{
			name:     "no items found",
			parentID: "nav_empty",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("Find", mock.Anything, bson.M{"parentId": "nav_empty"}, mock.Anything, mock.Anything).
					Run(func(args mock.Arguments) {
						items := args.Get(2).(*[]NavigationItem)
						*items = []NavigationItem{}
					}).
					Return(nil)
			},
			want:    0,
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockSettings := testutil.NewMockMongoRepository(t)
			mockNavigation := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				settings:   mockSettings,
				navigation: mockNavigation,
			}

			if tt.mockFn != nil {
				tt.mockFn(mockNavigation)
			}

			items, err := repo.GetNavigationByParent(context.Background(), tt.parentID)

			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Len(t, items, tt.want)
			}

			mockNavigation.AssertExpectations(t)
		})
	}
}

func TestRepository_CountNavigation(t *testing.T) {
	mockSettings := testutil.NewMockMongoRepository(t)
	mockNavigation := testutil.NewMockMongoRepository(t)

	repo := &Repository{
		settings:   mockSettings,
		navigation: mockNavigation,
	}

	filter := bson.M{"isVisible": true}
	mockNavigation.On("Count", mock.Anything, filter).
		Return(int64(10), nil)

	count, err := repo.CountNavigation(context.Background(), filter)

	assert.NoError(t, err)
	assert.Equal(t, int64(10), count)
	mockNavigation.AssertExpectations(t)
}
