# MongoDB Database Package

This package provides a comprehensive wrapper around MongoDB operations using `github.com/vhvplatform/go-shared/mongodb`.

## Features

- ✅ **BaseRepository** - Generic repository with common CRUD operations
- ✅ **QueryBuilder** - Fluent interface for building queries
- ✅ **AggregationPipeline** - Easy aggregation pipeline builder
- ✅ **Helper Functions** - Common filters and operations
- ✅ **Transaction Support** - MongoDB transactions
- ✅ **Error Handling** - Consistent error handling

## Installation

```go
import "github.com/vhvplatform/react-framework-api/pkg/database"
```

## Usage

### 1. Basic Repository

```go
// Create a repository
userRepo := database.NewBaseRepository(db, "user_accounts")

// Insert one
user := &User{...}
result, err := userRepo.InsertOne(ctx, user)

// Find one by field
var user User
err := userRepo.FindByField(ctx, "emailAddress", "john@example.com", &user)

// Update by field
update := bson.M{"firstName": "John Updated"}
_, err := userRepo.UpdateByField(ctx, "userId", "usr_123", bson.M{"$set": update})

// Delete by field
_, err := userRepo.DeleteByField(ctx, "userId", "usr_123")

// Count documents
count, err := userRepo.Count(ctx, bson.M{"status": "active"})

// Check existence
exists, err := userRepo.ExistsByField(ctx, "emailAddress", "john@example.com")
```

### 2. Query Builder

```go
// Build a complex query
qb := database.NewQueryBuilder().
    Filter("status", "active").
    Filter("role", "admin").
    Sort("createdAt", false).  // false = descending
    Skip(20).
    Limit(10).
    Project(map[string]int{
        "password": 0,  // exclude password
    })

filter, opts := qb.Build()

// Use with Find
var users []User
err := userRepo.Find(ctx, *filter, &users, opts)
```

### 3. Search Filter

```go
// Search across multiple fields
searchTerm := "john"
filter := database.SearchFilter(searchTerm, "firstName", "lastName", "emailAddress")

var users []User
err := userRepo.Find(ctx, filter, &users)
```

### 4. Date Range Query

```go
from := time.Now().AddDate(0, -1, 0)  // 1 month ago
to := time.Now()

filter := database.DateRangeFilter("createdAt", from, to)

var users []User
err := userRepo.Find(ctx, filter, &users)
```

### 5. IN Query

```go
roles := []interface{}{"admin", "moderator", "user"}
filter := database.InFilter("role", roles)

var users []User
err := userRepo.Find(ctx, filter, &users)
```

### 6. Aggregation Pipeline

```go
// Count users by role
pipeline := database.NewAggregationPipeline().
    Match(bson.M{"status": "active"}).
    Group("$role", bson.M{
        "count": bson.M{"$sum": 1},
        "avgAge": bson.M{"$avg": "$age"},
    }).
    Sort("count", false).
    Build()

var results []bson.M
err := userRepo.Aggregate(ctx, pipeline, &results)
```

### 7. Lookup (Join)

```go
pipeline := database.NewAggregationPipeline().
    Lookup("user_profiles", "userId", "userId", "profile").
    Unwind("$profile", true).  // preserveNullAndEmptyArrays
    Match(bson.M{"status": "active"}).
    Project(bson.M{
        "firstName": 1,
        "lastName": 1,
        "profile": 1,
    }).
    Build()

var results []bson.M
err := userRepo.Aggregate(ctx, pipeline, &results)
```

### 8. Complex Filter Combination

```go
// Combine multiple filters
filters := []bson.M{
    database.SearchFilter("john", "firstName", "lastName"),
    bson.M{"status": "active"},
    database.DateRangeFilter("createdAt", from, to),
}

finalFilter := database.AndFilter(filters...)

var users []User
err := userRepo.Find(ctx, finalFilter, &users)
```

### 9. Update Operations

```go
// Increment a field
update := database.IncrementField("loginCount", 1)
_, err := userRepo.UpdateByField(ctx, "userId", "usr_123", update)

// Push to array
update := database.PushToArray("tags", "premium")
_, err := userRepo.UpdateByField(ctx, "userId", "usr_123", update)

// Pull from array
update := database.PullFromArray("tags", "basic")
_, err := userRepo.UpdateByField(ctx, "userId", "usr_123", update)

// Add to set (unique)
update := database.AddToSet("interests", "coding")
_, err := userRepo.UpdateByField(ctx, "userId", "usr_123", update)

// Set multiple fields
update := bson.M{
    "$set": bson.M{
        "firstName": "John",
        "lastName": "Doe",
        "updatedAt": time.Now(),
    },
}
_, err := userRepo.UpdateOne(ctx, filter, update)
```

### 10. Transactions

```go
err := database.Transaction(ctx, client, func(sessCtx mongo.SessionContext) error {
    // All operations in this function are part of the transaction
    
    // Deduct from user A
    _, err := userRepo.UpdateByField(sessCtx, "userId", "usr_A", bson.M{
        "$inc": bson.M{"balance": -100},
    })
    if err != nil {
        return err  // Transaction will rollback
    }
    
    // Add to user B
    _, err = userRepo.UpdateByField(sessCtx, "userId", "usr_B", bson.M{
        "$inc": bson.M{"balance": 100},
    })
    if err != nil {
        return err  // Transaction will rollback
    }
    
    return nil  // Transaction will commit
})
```

### 11. Pagination Helper

```go
pq := &database.PaginationQuery{
    Page:     1,
    PageSize: 20,
    SortBy:   "createdAt",
    SortDesc: true,
}

// Build query with pagination
qb := database.NewQueryBuilder().
    Filter("status", "active").
    Skip(pq.GetSkip()).
    Limit(pq.GetLimit())

// Apply sort from pagination
sort := pq.GetSort()

filter, opts := qb.Build()

// Find with pagination
var users []User
err := userRepo.Find(ctx, *filter, &users, opts)

// Count total
total, err := userRepo.Count(ctx, *filter)
```

### 12. Bulk Operations

```go
// Prepare bulk write models
models := []mongo.WriteModel{
    mongo.NewUpdateOneModel().
        SetFilter(bson.M{"userId": "usr_1"}).
        SetUpdate(bson.M{"$set": bson.M{"status": "active"}}),
        
    mongo.NewUpdateOneModel().
        SetFilter(bson.M{"userId": "usr_2"}).
        SetUpdate(bson.M{"$set": bson.M{"status": "inactive"}}),
        
    mongo.NewDeleteOneModel().
        SetFilter(bson.M{"userId": "usr_3"}),
}

result, err := userRepo.BulkWrite(ctx, models)
```

### 13. Indexes

```go
// Create unique index
indexName, err := userRepo.CreateUniqueIndex(ctx, "emailAddress")

// Create compound index
indexName, err := userRepo.CreateIndex(ctx,
    bson.D{
        {Key: "firstName", Value: 1},
        {Key: "lastName", Value: 1},
    },
)

// Drop index
err := userRepo.DropIndex(ctx, indexName)
```

## Common Patterns

### Repository Pattern

```go
type UserRepository struct {
    base *database.BaseRepository
}

func NewUserRepository(db *mongo.Database) *UserRepository {
    return &UserRepository{
        base: database.NewBaseRepository(db, "user_accounts"),
    }
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
    var user User
    err := r.base.FindByField(ctx, "emailAddress", email, &user)
    if err != nil {
        if err == database.ErrNotFound {
            return nil, nil
        }
        return nil, err
    }
    return &user, nil
}

func (r *UserRepository) CreateUser(ctx context.Context, user *User) error {
    user.ID = primitive.NewObjectID()
    user.CreatedAt = time.Now()
    user.UpdatedAt = time.Now()
    
    _, err := r.base.InsertOne(ctx, user)
    if err != nil {
        if err == database.ErrDuplicateKey {
            return errors.New("user already exists")
        }
        return err
    }
    return nil
}
```

### Search with Pagination

```go
func (r *UserRepository) Search(ctx context.Context, searchTerm string, page, pageSize int) ([]User, int64, error) {
    // Build filter
    filter := database.SearchFilter(searchTerm, "firstName", "lastName", "emailAddress")
    
    // Count total
    total, err := r.base.Count(ctx, filter)
    if err != nil {
        return nil, 0, err
    }
    
    // Build query with pagination
    qb := database.NewQueryBuilder().
        Skip(int64((page - 1) * pageSize)).
        Limit(int64(pageSize)).
        Sort("createdAt", false)
    
    // Merge filters
    for key, value := range filter {
        qb.Filter(key, value)
    }
    
    finalFilter, opts := qb.Build()
    
    // Find users
    var users []User
    err = r.base.Find(ctx, *finalFilter, &users, opts)
    if err != nil {
        return nil, 0, err
    }
    
    return users, total, nil
}
```

## Error Handling

```go
import "github.com/vhvplatform/react-framework-api/pkg/database"

err := repo.FindByField(ctx, "userId", "usr_123", &user)
if err != nil {
    if err == database.ErrNotFound {
        // Handle not found
        return nil, errors.New("user not found")
    }
    if err == database.ErrDuplicateKey {
        // Handle duplicate
        return nil, errors.New("user already exists")
    }
    // Handle other errors
    return nil, err
}
```

## Best Practices

1. **Always use context** - Pass context to all database operations
2. **Handle errors** - Check for `ErrNotFound` and `ErrDuplicateKey`
3. **Use indexes** - Create indexes for frequently queried fields
4. **Pagination** - Always paginate large result sets
5. **Transactions** - Use transactions for multi-document operations
6. **Query Builder** - Use QueryBuilder for complex queries
7. **Projection** - Use projection to exclude sensitive fields
8. **Validation** - Validate data before inserting

## Examples

See `examples.go` for comprehensive usage examples.
