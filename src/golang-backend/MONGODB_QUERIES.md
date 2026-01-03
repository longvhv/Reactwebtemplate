# MongoDB Query Examples - VHV Platform API

Tài liệu hướng dẫn sử dụng MongoDB queries với `github.com/vhvplatform/go-shared/mongodb` trong VHV Platform API.

## 📚 Table of Contents

1. [Basic CRUD Operations](#basic-crud-operations)
2. [Query Builder](#query-builder)
3. [Search & Filter](#search--filter)
4. [Pagination](#pagination)
5. [Aggregation](#aggregation)
6. [Transactions](#transactions)
7. [Advanced Queries](#advanced-queries)

---

## 1. Basic CRUD Operations

### Create (Insert)

```go
import "github.com/vhvplatform/react-framework-api/pkg/database"

// Create repository
userRepo := database.NewBaseRepository(db, "user_accounts")

// Insert one document
user := &User{
    UserID:       "usr_123",
    FirstName:    "John",
    LastName:     "Doe",
    EmailAddress: "john@example.com",
    CreatedAt:    time.Now(),
}

result, err := userRepo.InsertOne(ctx, user)
if err != nil {
    if err == database.ErrDuplicateKey {
        return errors.New("user already exists")
    }
    return err
}
```

### Read (Find)

```go
// Find one by specific field
var user User
err := userRepo.FindByField(ctx, "emailAddress", "john@example.com", &user)
if err != nil {
    if err == database.ErrNotFound {
        return errors.New("user not found")
    }
    return err
}

// Find by ObjectID
objectID, _ := primitive.ObjectIDFromHex("507f1f77bcf86cd799439011")
err := userRepo.FindByID(ctx, objectID, &user)

// Find multiple
filter := bson.M{"status": "active"}
var users []User
err := userRepo.Find(ctx, filter, &users)
```

### Update

```go
// Update by field
update := bson.M{
    "firstName": "John Updated",
    "lastName": "Doe Updated",
}

_, err := userRepo.UpdateByField(
    ctx,
    "userId",
    "usr_123",
    bson.M{"$set": update},
)

// Find and update (returns updated document)
var updatedUser User
err := userRepo.FindOneAndUpdate(
    ctx,
    bson.M{"userId": "usr_123"},
    bson.M{"$set": update},
    &updatedUser,
)
```

### Delete

```go
// Delete by field
_, err := userRepo.DeleteByField(ctx, "userId", "usr_123")

// Delete by ObjectID
_, err := userRepo.DeleteByID(ctx, objectID)

// Delete many
filter := bson.M{"status": "inactive"}
_, err := userRepo.DeleteMany(ctx, filter)
```

---

## 2. Query Builder

### Basic Query

```go
// Build query với fluent interface
qb := database.NewQueryBuilder().
    Filter("status", "active").
    Filter("role", "admin").
    Sort("createdAt", false).  // false = descending
    Skip(10).
    Limit(20)

filter, opts := qb.Build()

var users []User
err := userRepo.Find(ctx, *filter, &users, opts)
```

### Multiple Filters

```go
qb := database.NewQueryBuilder().
    Filter("status", "active").
    Filter("role", "user").
    FilterRange("age", 18, 65).
    Sort("firstName", true).  // true = ascending
    Limit(100)

filter, opts := qb.Build()
```

### Regex Search

```go
qb := database.NewQueryBuilder().
    FilterRegex("emailAddress", "gmail.com", true)  // case insensitive

filter, opts := qb.Build()
```

### IN Query

```go
roles := []interface{}{"admin", "moderator", "user"}

qb := database.NewQueryBuilder().
    FilterIn("role", roles).
    Sort("createdAt", false)

filter, opts := qb.Build()
```

### Projection (Select Fields)

```go
qb := database.NewQueryBuilder().
    Filter("status", "active").
    Project(map[string]int{
        "firstName": 1,
        "lastName": 1,
        "emailAddress": 1,
        "password": 0,  // exclude password
    })

filter, opts := qb.Build()
```

---

## 3. Search & Filter

### Text Search Across Multiple Fields

```go
import "github.com/vhvplatform/react-framework-api/pkg/database"

searchTerm := "john"
filter := database.SearchFilter(searchTerm, "firstName", "lastName", "emailAddress")

var users []User
err := userRepo.Find(ctx, filter, &users)

// Result: finds users where firstName, lastName, or emailAddress contains "john"
```

### Date Range Query

```go
from := time.Now().AddDate(0, -1, 0)  // 1 month ago
to := time.Now()

filter := database.DateRangeFilter("createdAt", from, to)

var users []User
err := userRepo.Find(ctx, filter, &users)
```

### Complex Filter Combination

```go
// Combine multiple filters with AND
filters := []bson.M{
    database.SearchFilter("john", "firstName", "lastName"),
    bson.M{"status": "active"},
    bson.M{"role": "user"},
    database.DateRangeFilter("createdAt", from, to),
}

finalFilter := database.AndFilter(filters...)

var users []User
err := userRepo.Find(ctx, finalFilter, &users)
```

### OR Filter

```go
// Users who are admin OR moderator
filters := []bson.M{
    bson.M{"role": "admin"},
    bson.M{"role": "moderator"},
}

filter := database.OrFilter(filters...)

var users []User
err := userRepo.Find(ctx, filter, &users)
```

---

## 4. Pagination

### Simple Pagination

```go
page := 1
pageSize := 20

qb := database.NewQueryBuilder().
    Filter("status", "active").
    Sort("createdAt", false).
    Skip(int64((page - 1) * pageSize)).
    Limit(int64(pageSize))

filter, opts := qb.Build()

// Get total count
total, err := userRepo.Count(ctx, *filter)

// Get paginated results
var users []User
err = userRepo.Find(ctx, *filter, &users, opts)
```

### Using PaginationQuery Helper

```go
pq := &database.PaginationQuery{
    Page:     1,
    PageSize: 20,
    SortBy:   "createdAt",
    SortDesc: true,
}

qb := database.NewQueryBuilder().
    Filter("status", "active").
    Skip(pq.GetSkip()).
    Limit(pq.GetLimit())

filter, opts := qb.Build()

total, _ := userRepo.Count(ctx, *filter)

var users []User
err := userRepo.Find(ctx, *filter, &users, opts)

// Calculate total pages
totalPages := int(math.Ceil(float64(total) / float64(pq.PageSize)))
```

### Pagination with Search

```go
func (r *UserRepository) SearchWithPagination(
    ctx context.Context,
    searchTerm string,
    page, pageSize int,
) ([]User, int64, error) {
    // Build search filter
    searchFilter := database.SearchFilter(
        searchTerm,
        "firstName",
        "lastName",
        "emailAddress",
    )
    
    // Count total
    total, err := r.base.Count(ctx, searchFilter)
    if err != nil {
        return nil, 0, err
    }
    
    // Build query with pagination
    qb := database.NewQueryBuilder().
        Skip(int64((page - 1) * pageSize)).
        Limit(int64(pageSize)).
        Sort("createdAt", false)
    
    // Merge search filter
    for key, value := range searchFilter {
        qb.Filter(key, value)
    }
    
    filter, opts := qb.Build()
    
    // Find users
    var users []User
    err = r.base.Find(ctx, *filter, &users, opts)
    if err != nil {
        return nil, 0, err
    }
    
    return users, total, nil
}
```

---

## 5. Aggregation

### Group By

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

// Result: [
//   {"_id": "admin", "count": 10, "avgAge": 35},
//   {"_id": "user", "count": 100, "avgAge": 28}
// ]
```

### Lookup (Join)

```go
// Join users with their profiles
pipeline := database.NewAggregationPipeline().
    Lookup("user_profiles", "userId", "userId", "profile").
    Unwind("$profile", true).  // preserveNullAndEmptyArrays
    Match(bson.M{"status": "active"}).
    Project(bson.M{
        "firstName": 1,
        "lastName": 1,
        "emailAddress": 1,
        "profile": 1,
    }).
    Build()

var results []bson.M
err := userRepo.Aggregate(ctx, pipeline, &results)
```

### Statistics Aggregation

```go
pipeline := database.NewAggregationPipeline().
    Match(bson.M{"status": "active"}).
    Group(nil, bson.M{
        "totalUsers": bson.M{"$sum": 1},
        "avgAge": bson.M{"$avg": "$age"},
        "minAge": bson.M{"$min": "$age"},
        "maxAge": bson.M{"$max": "$age"},
    }).
    Build()

var stats []bson.M
err := userRepo.Aggregate(ctx, pipeline, &stats)
```

### Faceted Search

```go
pipeline := database.NewAggregationPipeline().
    Match(bson.M{"status": "active"}).
    Facet(map[string][]bson.M{
        "byRole": {
            {"$group": bson.M{
                "_id": "$role",
                "count": bson.M{"$sum": 1},
            }},
        },
        "byAge": {
            {"$bucket": bson.M{
                "groupBy": "$age",
                "boundaries": []int{0, 18, 30, 50, 100},
                "default": "other",
            }},
        },
    }).
    Build()

var results []bson.M
err := userRepo.Aggregate(ctx, pipeline, &results)
```

---

## 6. Transactions

### Basic Transaction

```go
err := database.Transaction(ctx, client, func(sessCtx mongo.SessionContext) error {
    userRepo := database.NewBaseRepository(db, "user_accounts")
    
    // Operation 1
    _, err := userRepo.UpdateByField(sessCtx, "userId", "usr_A", bson.M{
        "$inc": bson.M{"balance": -100},
    })
    if err != nil {
        return err  // Rollback
    }
    
    // Operation 2
    _, err = userRepo.UpdateByField(sessCtx, "userId", "usr_B", bson.M{
        "$inc": bson.M{"balance": 100},
    })
    if err != nil {
        return err  // Rollback
    }
    
    return nil  // Commit
})
```

### Transaction with Multiple Collections

```go
err := database.Transaction(ctx, client, func(sessCtx mongo.SessionContext) error {
    userRepo := database.NewBaseRepository(db, "user_accounts")
    orderRepo := database.NewBaseRepository(db, "orders")
    
    // Update user
    _, err := userRepo.UpdateByField(sessCtx, "userId", "usr_123", bson.M{
        "$inc": bson.M{"orderCount": 1},
    })
    if err != nil {
        return err
    }
    
    // Create order
    order := &Order{
        OrderID: "ord_456",
        UserID: "usr_123",
        Amount: 100,
    }
    _, err = orderRepo.InsertOne(sessCtx, order)
    if err != nil {
        return err
    }
    
    return nil
})
```

---

## 7. Advanced Queries

### Increment Field

```go
// Increment login count
update := database.IncrementField("loginCount", 1)
_, err := userRepo.UpdateByField(ctx, "userId", "usr_123", update)

// Also update last login
update := bson.M{
    "$inc": bson.M{"loginCount": 1},
    "$set": bson.M{"lastLoginAt": time.Now()},
}
_, err := userRepo.UpdateByField(ctx, "userId", "usr_123", update)
```

### Array Operations

```go
// Push to array
update := database.PushToArray("tags", "premium")
_, err := userRepo.UpdateByField(ctx, "userId", "usr_123", update)

// Pull from array
update := database.PullFromArray("tags", "basic")
_, err := userRepo.UpdateByField(ctx, "userId", "usr_123", update)

// Add to set (unique)
update := database.AddToSet("interests", "coding")
_, err := userRepo.UpdateByField(ctx, "userId", "usr_123", update)

// Push multiple
update := bson.M{
    "$push": bson.M{
        "tags": bson.M{
            "$each": []string{"tag1", "tag2", "tag3"},
        },
    },
}
_, err := userRepo.UpdateOne(ctx, filter, update)
```

### Bulk Operations

```go
// Prepare bulk write models
models := []mongo.WriteModel{
    mongo.NewUpdateOneModel().
        SetFilter(bson.M{"userId": "usr_1"}).
        SetUpdate(bson.M{"$set": bson.M{"status": "active"}}),
        
    mongo.NewUpdateOneModel().
        SetFilter(bson.M{"userId": "usr_2"}).
        SetUpdate(bson.M{"$set": bson.M{"status": "inactive"}}),
        
    mongo.NewInsertOneModel().
        SetDocument(bson.M{
            "userId": "usr_3",
            "firstName": "New",
            "lastName": "User",
        }),
        
    mongo.NewDeleteOneModel().
        SetFilter(bson.M{"userId": "usr_4"}),
}

result, err := userRepo.BulkWrite(ctx, models)

fmt.Printf("Inserted: %d\n", result.InsertedCount)
fmt.Printf("Modified: %d\n", result.ModifiedCount)
fmt.Printf("Deleted: %d\n", result.DeletedCount)
```

### Exists Check

```go
// Check if user exists
exists, err := userRepo.ExistsByField(ctx, "emailAddress", "john@example.com")
if exists {
    return errors.New("email already registered")
}

// Custom exists check
exists, err := userRepo.Exists(ctx, bson.M{
    "emailAddress": "john@example.com",
    "status": "active",
})
```

### Count with Filter

```go
// Count active users
count, err := userRepo.Count(ctx, bson.M{"status": "active"})

// Count users by role
adminCount, _ := userRepo.Count(ctx, bson.M{"role": "admin"})
userCount, _ := userRepo.Count(ctx, bson.M{"role": "user"})
```

---

## Real-World Examples

### User Repository with All Features

```go
type UserRepository struct {
    base *database.BaseRepository
}

func NewUserRepository(db *mongo.Database) *UserRepository {
    return &UserRepository{
        base: database.NewBaseRepository(db, "user_accounts"),
    }
}

// Find by email
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

// Search with pagination
func (r *UserRepository) Search(
    ctx context.Context,
    searchTerm, role, status string,
    page, pageSize int,
) ([]User, int64, error) {
    // Build filters
    filters := []bson.M{}
    
    if searchTerm != "" {
        filters = append(filters, database.SearchFilter(
            searchTerm,
            "firstName",
            "lastName",
            "emailAddress",
        ))
    }
    
    if role != "" {
        filters = append(filters, bson.M{"role": role})
    }
    
    if status != "" {
        filters = append(filters, bson.M{"status": status})
    }
    
    filter := database.AndFilter(filters...)
    
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

// Get user statistics
func (r *UserRepository) GetStats(ctx context.Context) (*UserStats, error) {
    pipeline := database.NewAggregationPipeline().
        Group("$role", bson.M{
            "count": bson.M{"$sum": 1},
        }).
        Build()
    
    var results []bson.M
    err := r.base.Aggregate(ctx, pipeline, &results)
    if err != nil {
        return nil, err
    }
    
    stats := &UserStats{
        ByRole: make(map[string]int),
    }
    
    for _, result := range results {
        role := result["_id"].(string)
        count := int(result["count"].(int32))
        stats.ByRole[role] = count
    }
    
    return stats, nil
}
```

---

## Performance Tips

1. **Use Indexes** - Create indexes for frequently queried fields
2. **Projection** - Only select fields you need
3. **Limit Results** - Always use pagination
4. **Avoid `$where`** - Use native MongoDB operators
5. **Batch Operations** - Use bulk writes for multiple updates
6. **Connection Pooling** - Configure proper pool size
7. **Monitor Queries** - Use MongoDB profiler

---

## See Also

- [pkg/database/README.md](./pkg/database/README.md) - Complete API documentation
- [pkg/database/examples.go](./pkg/database/examples.go) - More code examples
- [MongoDB Documentation](https://docs.mongodb.com/manual/)
