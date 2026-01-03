# Test Guide - VHV Platform API

Comprehensive testing guide for Golang backend với MongoDB.

## 📚 Table of Contents

1. [Test Structure](#test-structure)
2. [Running Tests](#running-tests)
3. [Writing Tests](#writing-tests)
4. [Test Patterns](#test-patterns)
5. [Coverage](#coverage)
6. [Best Practices](#best-practices)

---

## Test Structure

```
golang-backend/
├── internal/
│   ├── auth/
│   │   ├── repository.go
│   │   ├── repository_test.go      # ✅ Repository tests
│   │   ├── service.go
│   │   └── service_test.go          # ✅ Service tests
│   ├── user/
│   │   ├── repository.go
│   │   ├── repository_test.go      # ✅ Repository tests
│   │   ├── service.go
│   │   └── service_test.go          # ✅ Service tests
│   └── platform/
│       ├── repository.go
│       └── repository_test.go      # ✅ Repository tests
├── pkg/
│   └── testutil/
│       ├── mongo_mock.go           # ✅ MongoDB mocks
│       └── fixtures.go             # ✅ Test fixtures
└── Makefile                        # ✅ Test commands
```

---

## Running Tests

### All Tests

```bash
# Run all tests
make test

# Run all tests with verbose output
make test-verbose

# Run tests in short mode
make test-short
```

### Package-Specific Tests

```bash
# Run auth tests only
make test-auth

# Run user tests only
make test-user

# Run platform tests only
make test-platform

# Run unit tests only
make test-unit
```

### Coverage

```bash
# Run tests with coverage
make test-coverage

# This will generate:
# - coverage.out (coverage data)
# - coverage.html (HTML report)
```

### Individual Test

```bash
# Run specific test
go test -v -run TestRepository_CreateUser ./internal/auth/

# Run specific test with coverage
go test -v -run TestRepository_CreateUser -cover ./internal/auth/
```

---

## Writing Tests

### 1. Repository Tests

```go
package auth

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/vhvplatform/react-framework-api/pkg/testutil"
	"go.mongodb.org/mongo-driver/bson"
)

func TestRepository_CreateUser(t *testing.T) {
	// Table-driven tests
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
					Return(&mongo.InsertOneResult{}, nil)
			},
			wantErr: false,
		},
		// More test cases...
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Setup mock
			mockUsers := testutil.NewMockMongoRepository(t)
			mockSessions := testutil.NewMockMongoRepository(t)

			repo := &Repository{
				users:    mockUsers,
				sessions: mockSessions,
			}

			// Setup expectations
			if tt.mockFn != nil {
				tt.mockFn(mockUsers)
			}

			// Execute
			err := repo.CreateUser(context.Background(), tt.user)

			// Assert
			if tt.wantErr {
				assert.Error(t, err)
				if tt.errMsg != "" {
					assert.Contains(t, err.Error(), tt.errMsg)
				}
			} else {
				assert.NoError(t, err)
			}

			// Verify mock expectations
			mockUsers.AssertExpectations(t)
		})
	}
}
```

### 2. Service Tests

```go
package auth

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Create mock repository
type MockRepository struct {
	mock.Mock
}

func (m *MockRepository) CreateUser(ctx context.Context, user *User) error {
	args := m.Called(ctx, user)
	return args.Error(0)
}

// Test service method
func TestService_Register(t *testing.T) {
	tests := []struct {
		name    string
		req     *RegisterRequest
		mockFn  func(*MockRepository)
		wantErr bool
	}{
		{
			name: "successful registration",
			req: &RegisterRequest{
				FirstName:       "John",
				LastName:        "Doe",
				EmailAddress:    "john@example.com",
				Password:        "SecurePassword123!",
				ConfirmPassword: "SecurePassword123!",
			},
			mockFn: func(m *MockRepository) {
				m.On("UserExists", mock.Anything, "john@example.com").
					Return(false, nil)
				m.On("CreateUser", mock.Anything, mock.Anything).
					Return(nil)
			},
			wantErr: false,
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
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, resp)
			}

			mockRepo.AssertExpectations(t)
		})
	}
}
```

### 3. Using Test Fixtures

```go
import "github.com/vhvplatform/react-framework-api/pkg/testutil"

func TestSomething(t *testing.T) {
	// Create test user
	user := testutil.NewTestUser()
	
	// Create test admin
	admin := testutil.NewTestAdmin()
	
	// Create test session
	session := testutil.NewTestSession()
	
	// Create test platform settings
	settings := testutil.NewTestPlatformSettings()
	
	// Get list of test users
	users := testutil.TestUsers()
}
```

---

## Test Patterns

### 1. Table-Driven Tests

```go
func TestFunction(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		want    string
		wantErr bool
	}{
		{"case 1", "input1", "output1", false},
		{"case 2", "input2", "output2", false},
		{"error case", "bad", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Function(tt.input)
			
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.want, got)
			}
		})
	}
}
```

### 2. Mock Setup Pattern

```go
func setupTest(t *testing.T) (*Repository, *testutil.MockMongoRepository) {
	mockUsers := testutil.NewMockMongoRepository(t)
	
	repo := &Repository{
		users: mockUsers,
	}
	
	return repo, mockUsers
}

func TestWithSetup(t *testing.T) {
	repo, mockUsers := setupTest(t)
	
	mockUsers.On("FindOne", mock.Anything, mock.Anything, mock.Anything).
		Return(nil)
	
	// Test logic...
	
	mockUsers.AssertExpectations(t)
}
```

### 3. Context Pattern

```go
func TestWithContext(t *testing.T) {
	ctx := context.Background()
	
	// Or with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	
	// Use context in tests
	result, err := repo.FindByID(ctx, "usr_123")
}
```

### 4. Error Testing Pattern

```go
func TestErrorCases(t *testing.T) {
	tests := []struct {
		name   string
		mockFn func(*testutil.MockMongoRepository)
		errMsg string
	}{
		{
			name: "not found error",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, mock.Anything, mock.Anything).
					Return(mongo.ErrNoDocuments)
			},
			errMsg: "not found",
		},
		{
			name: "database error",
			mockFn: func(m *testutil.MockMongoRepository) {
				m.On("FindOne", mock.Anything, mock.Anything, mock.Anything).
					Return(errors.New("database error"))
			},
			errMsg: "database error",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mock := testutil.NewMockMongoRepository(t)
			tt.mockFn(mock)
			
			// Test logic...
			
			assert.Error(t, err)
			assert.Contains(t, err.Error(), tt.errMsg)
		})
	}
}
```

---

## Coverage

### View Coverage Report

```bash
# Generate and open coverage report
make test-coverage

# This will:
# 1. Run all tests with coverage
# 2. Generate coverage.html
# 3. Open in browser (on some systems)
```

### Coverage by Package

```bash
# Auth package coverage
go test -cover ./internal/auth/

# User package coverage
go test -cover ./internal/user/

# All packages coverage
go test -cover ./...
```

### Detailed Coverage

```bash
# Get detailed coverage per function
go test -coverprofile=coverage.out ./...
go tool cover -func=coverage.out

# Example output:
# internal/auth/repository.go:30: CreateUser        100.0%
# internal/auth/repository.go:40: FindUserByEmail   90.0%
```

---

## Best Practices

### 1. Test Naming

```go
// ✅ Good - describes what is being tested
func TestRepository_CreateUser_SuccessfulCreation(t *testing.T) {}
func TestRepository_CreateUser_DuplicateEmail(t *testing.T) {}
func TestRepository_CreateUser_DatabaseError(t *testing.T) {}

// ❌ Bad - not descriptive
func TestCreateUser1(t *testing.T) {}
func TestCreateUser2(t *testing.T) {}
```

### 2. Arrange-Act-Assert Pattern

```go
func TestFunction(t *testing.T) {
	// Arrange - setup test data and mocks
	mockRepo := testutil.NewMockMongoRepository(t)
	mockRepo.On("FindOne", mock.Anything, mock.Anything, mock.Anything).
		Return(nil)
	
	// Act - execute the function being tested
	result, err := repo.FindByID(ctx, "usr_123")
	
	// Assert - verify the results
	assert.NoError(t, err)
	assert.NotNil(t, result)
	mockRepo.AssertExpectations(t)
}
```

### 3. Test Independence

```go
// ✅ Good - each test is independent
func TestA(t *testing.T) {
	mock := setupMock(t)
	// Test A logic
}

func TestB(t *testing.T) {
	mock := setupMock(t)
	// Test B logic
}

// ❌ Bad - tests depend on shared state
var sharedMock *MockRepo  // Don't do this

func TestA(t *testing.T) {
	sharedMock.DoSomething()  // Test order matters
}
```

### 4. Mock Assertions

```go
func TestWithMock(t *testing.T) {
	mock := testutil.NewMockMongoRepository(t)
	
	// ✅ Use specific matchers
	mock.On("FindOne", 
		mock.Anything,  // context
		bson.M{"userId": "usr_123"},  // exact filter
		mock.Anything,  // result pointer
	).Return(nil)
	
	// ❌ Too generic
	mock.On("FindOne", 
		mock.Anything,
		mock.Anything,
		mock.Anything,
	).Return(nil)
}
```

### 5. Error Messages

```go
// ✅ Good - descriptive assertions
assert.NoError(t, err, "CreateUser should not return error for valid input")
assert.Equal(t, expected, actual, "User ID should match expected value")

// ❌ Bad - no context
assert.NoError(t, err)
assert.Equal(t, expected, actual)
```

### 6. Test Data

```go
// ✅ Good - use test fixtures
user := testutil.NewTestUser()
user.EmailAddress = "custom@example.com"

// ✅ Good - clear test data
tests := []struct {
	name  string
	email string
}{
	{"valid email", "valid@example.com"},
	{"invalid email", "invalid"},
}

// ❌ Bad - magic values
user := &User{
	UserID: "usr_abc123xyz",
	EmailAddress: "test@test.com",
}
```

---

## CI Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'
      
      - name: Install dependencies
        run: make deps
      
      - name: Run tests
        run: make test-coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.out
```

---

## Test Commands Reference

```bash
# Run all tests
make test

# Run with verbose output
make test-verbose

# Run specific package
make test-auth
make test-user
make test-platform

# Run with coverage
make test-coverage

# Run short tests
make test-short

# Format code
make fmt

# Run linter
make vet

# Run all CI checks
make ci
```

---

## Troubleshooting

### Mock Not Called

```go
// Problem: Mock method not being called
mock.On("FindOne", mock.Anything, mock.Anything, mock.Anything).
	Return(nil)

// Solution: Check method signature matches
mock.On("FindOne",
	mock.MatchedBy(func(ctx context.Context) bool { return true }),
	mock.MatchedBy(func(filter interface{}) bool { return true }),
	mock.Anything,
).Return(nil)
```

### Race Condition

```bash
# Run with race detector
go test -race ./...

# Or use Makefile
make test  # Already includes -race flag
```

### Coverage Not Updating

```bash
# Clean and regenerate
make clean
make test-coverage
```

---

## Resources

- [Testing in Go](https://golang.org/pkg/testing/)
- [Testify Documentation](https://github.com/stretchr/testify)
- [Table-Driven Tests](https://github.com/golang/go/wiki/TableDrivenTests)
- [Go Testing Best Practices](https://github.com/golang/go/wiki/TestComments)
