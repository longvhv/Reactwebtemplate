package testutil

import (
	"context"
	"testing"

	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MockMongoRepository is a mock implementation of mongodb.Repository
type MockMongoRepository struct {
	mock.Mock
}

// InsertOne mocks InsertOne
func (m *MockMongoRepository) InsertOne(ctx context.Context, document interface{}) (*mongo.InsertOneResult, error) {
	args := m.Called(ctx, document)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*mongo.InsertOneResult), args.Error(1)
}

// FindOne mocks FindOne
func (m *MockMongoRepository) FindOne(ctx context.Context, filter interface{}, result interface{}) error {
	args := m.Called(ctx, filter, result)
	return args.Error(0)
}

// Find mocks Find
func (m *MockMongoRepository) Find(ctx context.Context, filter interface{}, results interface{}, opts ...*options.FindOptions) error {
	args := m.Called(ctx, filter, results, opts)
	return args.Error(0)
}

// UpdateOne mocks UpdateOne
func (m *MockMongoRepository) UpdateOne(ctx context.Context, filter interface{}, update interface{}) (*mongo.UpdateResult, error) {
	args := m.Called(ctx, filter, update)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*mongo.UpdateResult), args.Error(1)
}

// DeleteOne mocks DeleteOne
func (m *MockMongoRepository) DeleteOne(ctx context.Context, filter interface{}) (*mongo.DeleteResult, error) {
	args := m.Called(ctx, filter)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*mongo.DeleteResult), args.Error(1)
}

// DeleteMany mocks DeleteMany
func (m *MockMongoRepository) DeleteMany(ctx context.Context, filter interface{}) (*mongo.DeleteResult, error) {
	args := m.Called(ctx, filter)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*mongo.DeleteResult), args.Error(1)
}

// Count mocks Count
func (m *MockMongoRepository) Count(ctx context.Context, filter interface{}) (int64, error) {
	args := m.Called(ctx, filter)
	return args.Get(0).(int64), args.Error(1)
}

// Collection mocks Collection
func (m *MockMongoRepository) Collection() *mongo.Collection {
	args := m.Called()
	if args.Get(0) == nil {
		return nil
	}
	return args.Get(0).(*mongo.Collection)
}

// NewMockMongoRepository creates a new mock repository
func NewMockMongoRepository(t *testing.T) *MockMongoRepository {
	mock := &MockMongoRepository{}
	mock.Test(t)
	return mock
}
