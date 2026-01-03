# MongoDB Query Examples - VHV Platform API

Tài liệu hướng dẫn sử dụng MongoDB queries với `github.com/vhvplatform/go-shared/mongodb` trong VHV Platform API.

## 📚 Table of Contents

1. [Basic CRUD Operations](#basic-crud-operations)
2. [Advanced Queries](#advanced-queries)
3. [Pagination](#pagination)
4. [Aggregation](#aggregation)
5. [Repository Pattern](#repository-pattern)

---

## 1. Basic CRUD Operations

### Create (Insert)

```go
import "github.com/vhvplatform/go-shared/mongodb"

// Create repository
userRepo := mongodb.NewRepository(db, "user_accounts")

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
    if mongo.IsDuplicateKeyError(err) {
        return errors.New("user already exists")
    }
    return err
}
```

### Read (Find)

```go
// Find one by filter
var user User
err := userRepo.FindOne(ctx, bson.M{"emailAddress": "john@example.com"}, &user)
if err != nil {
    if errors.Is(err, mongo.ErrNoDocuments) {
        return errors.New("user not found")
    }
    return err
}

// Find multiple
filter := bson.M{"status": "active"}
var users []User
err := userRepo.Find(ctx, filter, &users)
```

### Update

```go
// Update one
update := bson.M{
    "firstName": "John Updated",
    "lastName": "Doe Updated",
    "updatedAt": time.Now(),
}

_, err := userRepo.UpdateOne(
    ctx,
    bson.M{"userId": "usr_123"},
    bson.M{"$set": update},
)

// Find and update (returns updated document)
var updatedUser User
opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

err := userRepo.Collection().FindOneAndUpdate(
    ctx,
    bson.M{"userId": "usr_123"},
    bson.M{"$set": update},
    opts,
).Decode(&updatedUser)
```

### Delete

```go
// Delete one
_, err := userRepo.DeleteOne(ctx, bson.M{"userId": "usr_123"})

// Delete many
filter := bson.M{"status": "inactive"}
_, err := userRepo.DeleteMany(ctx, filter)
```

---

## 2. Advanced Queries

### Text Search Across Multiple Fields

```go
// Search filter
searchTerm := "john"
filter := bson.M{
    "$or": []bson.M{
        {"firstName": bson.M{"$regex": searchTerm, "$options": "i"}},
        {"lastName": bson.M{"$regex": searchTerm, "$options": "i"}},
        {"emailAddress": bson.M{"$regex": searchTerm, "$options": "i"}},
    },
}

var users []User
err := userRepo.Find(ctx, filter, &users)
```

### Date Range Query

```go
from := time.Now().AddDate(0, -1, 0)  // 1 month ago
to := time.Now()

filter := bson.M{
    "createdAt": bson.M{
        "$gte": from,
        "$lte": to,
    },
}

var users []User
err := userRepo.Find(ctx, filter, &users)
```

### Complex Filter Combination

```go
// Combine multiple filters
filter := bson.M{
    "$and": []bson.M{
        {"status": "active"},
        {"role": "user"},
        {"$or": []bson.M{
            {"firstName": bson.M{"$regex": "john", "$options": "i"}},
            {"lastName": bson.M{"$regex": "john", "$options": "i"}},
        }},
        {"createdAt": bson.M{
            "$gte": from,
            "$lte": to,
        }},
    },
}

var users []User
err := userRepo.Find(ctx, filter, &users)
```

### IN Query

```go
filter := bson.M{
    "role": bson.M{
        "$in": []string{"admin", "moderator", "user"},
    },
}

var users []User
err := userRepo.Find(ctx, filter, &users)
```

### Exists Check

```go
// Count matching documents
count, err := userRepo.Count(ctx, bson.M{"emailAddress": "john@example.com"})
if err != nil {
    return err
}

exists := count > 0
```

---

## 3. Pagination

### Simple Pagination

```go
page := 1
pageSize := 20

filter := bson.M{"status": "active"}

// Count total
total, err := userRepo.Count(ctx, filter)
if err != nil {
    return err
}

// Build options
opts := options.Find()
opts.SetSort(bson.D{{Key: "createdAt", Value: -1}})  // -1 = descending
opts.SetSkip(int64((page - 1) * pageSize))
opts.SetLimit(int64(pageSize))

// Find with pagination
var users []User
err = userRepo.Find(ctx, filter, &users, opts)
if err != nil {
    return err
}

// Calculate total pages
totalPages := int(math.Ceil(float64(total) / float64(pageSize)))
```

### Pagination with Search

```go
func (r *UserRepository) SearchWithPagination(
    ctx context.Context,
    searchTerm string,
    page, pageSize int,
) ([]User, int64, error) {
    // Build search filter
    filter := bson.M{}
    
    if searchTerm != "" {
        filter["$or"] = []bson.M{
            {"firstName": bson.M{"$regex": searchTerm, "$options": "i"}},
            {"lastName": bson.M{"$regex": searchTerm, "$options": "i"}},
            {"emailAddress": bson.M{"$regex": searchTerm, "$options": "i"}},
        }
    }
    
    // Count total
    total, err := r.users.Count(ctx, filter)
    if err != nil {
        return nil, 0, err
    }
    
    // Build options
    opts := options.Find()
    opts.SetSort(bson.D{{Key: "createdAt", Value: -1}})
    opts.SetSkip(int64((page - 1) * pageSize))
    opts.SetLimit(int64(pageSize))
    
    // Find users
    var users []User
    err = r.users.Find(ctx, filter, &users, opts)
    if err != nil {
        return nil, 0, err
    }
    
    return users, total, nil
}
```

---

## 4. Aggregation

### Group By

```go
// Count users by role
pipeline := mongo.Pipeline{
    {{Key: "$match", Value: bson.M{"status": "active"}}},
    {{Key: "$group", Value: bson.M{
        "_id": "$role",
        "count": bson.M{"$sum": 1},
        "avgAge": bson.M{"$avg": "$age"},
    }}},
    {{Key: "$sort", Value: bson.M{"count": -1}}},
}

cursor, err := userRepo.Collection().Aggregate(ctx, pipeline)
if err != nil {
    return err
}
defer cursor.Close(ctx)

var results []bson.M
if err = cursor.All(ctx, &results); err != nil {
    return err
}

// Result: [
//   {"_id": "admin", "count": 10, "avgAge": 35},
//   {"_id": "user", "count": 100, "avgAge": 28}
// ]
```

### Lookup (Join)

```go
// Join users with their profiles
pipeline := mongo.Pipeline{
    {{Key: "$lookup", Value: bson.M{
        "from":         "user_profiles",
        "localField":   "userId",
        "foreignField": "userId",
        "as":           "profile",
    }}},
    {{Key: "$unwind", Value: bson.M{
        "path": "$profile",
        "preserveNullAndEmptyArrays": true,
    }}},
    {{Key: "$match", Value: bson.M{"status": "active"}}},
    {{Key: "$project", Value: bson.M{
        "firstName": 1,
        "lastName": 1,
        "emailAddress": 1,
        "profile": 1,
    }}},
}

cursor, err := userRepo.Collection().Aggregate(ctx, pipeline)
if err != nil {
    return err
}
defer cursor.Close(ctx)

var results []bson.M
if err = cursor.All(ctx, &results); err != nil {
    return err
}
```

### Statistics Aggregation

```go
pipeline := mongo.Pipeline{
    {{Key: "$match", Value: bson.M{"status": "active"}}},
    {{Key: "$group", Value: bson.M{
        "_id": nil,
        "totalUsers": bson.M{"$sum": 1},
        "avgAge": bson.M{"$avg": "$age"},
        "minAge": bson.M{"$min": "$age"},
        "maxAge": bson.M{"$max": "$age"},
    }}},
}

cursor, err := userRepo.Collection().Aggregate(ctx, pipeline)
if err != nil {
    return err
}
defer cursor.Close(ctx)

var stats []bson.M
if err = cursor.All(ctx, &stats); err != nil {
    return err
}
```

---

## 5. Repository Pattern

### Complete User Repository Example

```go
package user

import (
    "context"
    "errors"
    "time"

    "github.com/vhvplatform/go-shared/mongodb"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

type UserRepository struct {
    users *mongodb.Repository
}

func NewUserRepository(db *mongo.Database) *UserRepository {
    return &UserRepository{
        users: mongodb.NewRepository(db, "user_accounts"),
    }
}

// FindByEmail finds a user by email
func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
    var user User
    err := r.users.FindOne(ctx, bson.M{"emailAddress": email}, &user)
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            return nil, nil
        }
        return nil, err
    }
    return &user, nil
}

// Create creates a new user
func (r *UserRepository) Create(ctx context.Context, user *User) error {
    user.ID = primitive.NewObjectID()
    user.CreatedAt = time.Now()
    user.UpdatedAt = time.Now()
    
    _, err := r.users.InsertOne(ctx, user)
    if err != nil {
        if mongo.IsDuplicateKeyError(err) {
            return errors.New("user already exists")
        }
        return err
    }
    return nil
}

// Update updates a user
func (r *UserRepository) Update(ctx context.Context, userID string, update bson.M) (*User, error) {
    update["updatedAt"] = time.Now()
    
    var user User
    opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
    
    err := r.users.Collection().FindOneAndUpdate(
        ctx,
        bson.M{"userId": userID},
        bson.M{"$set": update},
        opts,
    ).Decode(&user)
    
    if err != nil {
        if errors.Is(err, mongo.ErrNoDocuments) {
            return nil, nil
        }
        return nil, err
    }
    
    return &user, nil
}

// List returns paginated users
func (r *UserRepository) List(ctx context.Context, page, pageSize int, searchTerm, role string) ([]User, int64, error) {
    // Build filter
    filter := bson.M{}
    
    if searchTerm != "" {
        filter["$or"] = []bson.M{
            {"firstName": bson.M{"$regex": searchTerm, "$options": "i"}},
            {"lastName": bson.M{"$regex": searchTerm, "$options": "i"}},
            {"emailAddress": bson.M{"$regex": searchTerm, "$options": "i"}},
        }
    }
    
    if role != "" {
        filter["role"] = role
    }
    
    // Count total
    total, err := r.users.Count(ctx, filter)
    if err != nil {
        return nil, 0, err
    }
    
    // Build options
    opts := options.Find()
    opts.SetSort(bson.D{{Key: "createdAt", Value: -1}})
    opts.SetSkip(int64((page - 1) * pageSize))
    opts.SetLimit(int64(pageSize))
    
    // Find users
    var users []User
    err = r.users.Find(ctx, filter, &users, opts)
    if err != nil {
        return nil, 0, err
    }
    
    return users, total, nil
}

// Delete deletes a user
func (r *UserRepository) Delete(ctx context.Context, userID string) error {
    _, err := r.users.DeleteOne(ctx, bson.M{"userId": userID})
    return err
}

// Exists checks if a user exists
func (r *UserRepository) Exists(ctx context.Context, email string) (bool, error) {
    count, err := r.users.Count(ctx, bson.M{"emailAddress": email})
    if err != nil {
        return false, err
    }
    return count > 0, nil
}

// GetStats gets user statistics
func (r *UserRepository) GetStats(ctx context.Context) (*UserStats, error) {
    pipeline := mongo.Pipeline{
        {{Key: "$group", Value: bson.M{
            "_id": "$role",
            "count": bson.M{"$sum": 1},
        }}},
    }
    
    cursor, err := r.users.Collection().Aggregate(ctx, pipeline)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(ctx)
    
    var results []bson.M
    if err = cursor.All(ctx, &results); err != nil {
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

## Common Query Patterns

### 1. Find One or Create

```go
func (r *UserRepository) FindOrCreate(ctx context.Context, email string) (*User, error) {
    // Try to find
    user, err := r.FindByEmail(ctx, email)
    if err != nil {
        return nil, err
    }
    
    // If found, return
    if user != nil {
        return user, nil
    }
    
    // Otherwise create
    newUser := &User{
        EmailAddress: email,
        Status: "pending",
    }
    
    err = r.Create(ctx, newUser)
    if err != nil {
        return nil, err
    }
    
    return newUser, nil
}
```

### 2. Increment Field

```go
func (r *UserRepository) IncrementLoginCount(ctx context.Context, userID string) error {
    update := bson.M{
        "$inc": bson.M{"loginCount": 1},
        "$set": bson.M{"lastLoginAt": time.Now()},
    }
    
    _, err := r.users.UpdateOne(
        ctx,
        bson.M{"userId": userID},
        update,
    )
    return err
}
```

### 3. Array Operations

```go
// Push to array
func (r *UserRepository) AddTag(ctx context.Context, userID string, tag string) error {
    update := bson.M{
        "$push": bson.M{"tags": tag},
    }
    
    _, err := r.users.UpdateOne(ctx, bson.M{"userId": userID}, update)
    return err
}

// Pull from array
func (r *UserRepository) RemoveTag(ctx context.Context, userID string, tag string) error {
    update := bson.M{
        "$pull": bson.M{"tags": tag},
    }
    
    _, err := r.users.UpdateOne(ctx, bson.M{"userId": userID}, update)
    return err
}

// Add to set (unique)
func (r *UserRepository) AddInterest(ctx context.Context, userID string, interest string) error {
    update := bson.M{
        "$addToSet": bson.M{"interests": interest},
    }
    
    _, err := r.users.UpdateOne(ctx, bson.M{"userId": userID}, update)
    return err
}
```

---

## Performance Tips

1. **Use Indexes** - Create indexes for frequently queried fields
2. **Projection** - Only select fields you need with `$project`
3. **Limit Results** - Always use pagination
4. **Avoid `$where`** - Use native MongoDB operators
5. **Connection Pooling** - Configure proper pool size
6. **Monitor Queries** - Use MongoDB profiler

---

## See Also

- [MongoDB Go Driver Documentation](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo)
- [go-shared/mongodb Repository](https://github.com/vhvplatform/go-shared/tree/main/mongodb)