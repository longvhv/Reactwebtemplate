package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// Example usage of database helpers

// ExampleUserRepository demonstrates advanced queries
type ExampleUserRepository struct {
	users *BaseRepository
}

// FindActiveUsers finds all active users with pagination
func (r *ExampleUserRepository) FindActiveUsers(ctx context.Context, page, pageSize int) ([]interface{}, int64, error) {
	// Build query
	qb := NewQueryBuilder().
		Filter("status", "active").
		Sort("createdAt", false). // descending
		Skip(int64((page - 1) * pageSize)).
		Limit(int64(pageSize))

	filter, opts := qb.Build()

	// Count total
	total, err := r.users.Count(ctx, *filter)
	if err != nil {
		return nil, 0, err
	}

	// Find users
	var users []interface{}
	err = r.users.Find(ctx, *filter, &users, opts)
	if err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// SearchUsers demonstrates text search
func (r *ExampleUserRepository) SearchUsers(ctx context.Context, searchTerm string) ([]interface{}, error) {
	// Create search filter for multiple fields
	filter := SearchFilter(searchTerm, "firstName", "lastName", "emailAddress")

	var users []interface{}
	err := r.users.Find(ctx, filter, &users)
	if err != nil {
		return nil, err
	}

	return users, nil
}

// FindUsersByDateRange demonstrates date range queries
func (r *ExampleUserRepository) FindUsersByDateRange(ctx context.Context, from, to time.Time) ([]interface{}, error) {
	filter := DateRangeFilter("createdAt", from, to)

	var users []interface{}
	err := r.users.Find(ctx, filter, &users)
	if err != nil {
		return nil, err
	}

	return users, nil
}

// FindUsersByRoles demonstrates IN query
func (r *ExampleUserRepository) FindUsersByRoles(ctx context.Context, roles []string) ([]interface{}, error) {
	// Convert to []interface{}
	rolesInterface := make([]interface{}, len(roles))
	for i, role := range roles {
		rolesInterface[i] = role
	}

	filter := InFilter("role", rolesInterface)

	var users []interface{}
	err := r.users.Find(ctx, filter, &users)
	if err != nil {
		return nil, err
	}

	return users, nil
}

// GetUserStats demonstrates aggregation
func (r *ExampleUserRepository) GetUserStats(ctx context.Context) (map[string]interface{}, error) {
	// Build aggregation pipeline
	pipeline := NewAggregationPipeline().
		Group("$role", bson.M{
			"count": bson.M{"$sum": 1},
			"avgAge": bson.M{"$avg": "$age"},
		}).
		Sort("count", false).
		Build()

	var results []map[string]interface{}
	err := r.users.Aggregate(ctx, pipeline, &results)
	if err != nil {
		return nil, err
	}

	if len(results) > 0 {
		return results[0], nil
	}

	return nil, nil
}

// GetUsersWithPagination demonstrates complete pagination
func (r *ExampleUserRepository) GetUsersWithPagination(ctx context.Context, pq *PaginationQuery, filter bson.M) ([]interface{}, int64, error) {
	// Count total
	total, err := r.users.Count(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	// Build query with pagination
	qb := NewQueryBuilder().
		Skip(pq.GetSkip()).
		Limit(pq.GetLimit())

	// Apply sort
	if pq.SortBy != "" {
		qb.Sort(pq.SortBy, !pq.SortDesc)
	}

	// Merge with existing filter
	for key, value := range filter {
		qb.Filter(key, value)
	}

	filterResult, opts := qb.Build()

	// Find users
	var users []interface{}
	err = r.users.Find(ctx, *filterResult, &users, opts)
	if err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// GetUsersWithJoin demonstrates lookup (join)
func (r *ExampleUserRepository) GetUsersWithJoin(ctx context.Context, db *mongo.Database) ([]interface{}, error) {
	// Create aggregation with lookup
	pipeline := NewAggregationPipeline().
		Lookup("user_profiles", "userId", "userId", "profile").
		Unwind("$profile", true).
		Match(bson.M{"status": "active"}).
		Project(bson.M{
			"userId":    1,
			"firstName": 1,
			"lastName":  1,
			"email":     1,
			"profile":   1,
		}).
		Build()

	var results []interface{}
	err := r.users.Aggregate(ctx, pipeline, &results)
	if err != nil {
		return nil, err
	}

	return results, nil
}

// UpdateUserStatus demonstrates update operations
func (r *ExampleUserRepository) UpdateUserStatus(ctx context.Context, userID string, status string) error {
	update := bson.M{
		"$set": bson.M{
			"status":    status,
			"updatedAt": time.Now(),
		},
	}

	_, err := r.users.UpdateByField(ctx, "userId", userID, update)
	return err
}

// IncrementUserLoginCount demonstrates increment operation
func (r *ExampleUserRepository) IncrementUserLoginCount(ctx context.Context, userID string) error {
	update := bson.M{
		"$inc": bson.M{
			"loginCount": 1,
		},
		"$set": bson.M{
			"lastLoginAt": time.Now(),
		},
	}

	_, err := r.users.UpdateByField(ctx, "userId", userID, update)
	return err
}

// AddUserTag demonstrates array push operation
func (r *ExampleUserRepository) AddUserTag(ctx context.Context, userID string, tag string) error {
	update := PushToArray("tags", tag)

	_, err := r.users.UpdateByField(ctx, "userId", userID, update)
	return err
}

// RemoveUserTag demonstrates array pull operation
func (r *ExampleUserRepository) RemoveUserTag(ctx context.Context, userID string, tag string) error {
	update := PullFromArray("tags", tag)

	_, err := r.users.UpdateByField(ctx, "userId", userID, update)
	return err
}

// BulkUpdateUsers demonstrates bulk operations
func (r *ExampleUserRepository) BulkUpdateUsers(ctx context.Context, updates map[string]string) error {
	var models []mongo.WriteModel

	for userID, status := range updates {
		model := mongo.NewUpdateOneModel().
			SetFilter(bson.M{"userId": userID}).
			SetUpdate(bson.M{"$set": bson.M{"status": status}})

		models = append(models, model)
	}

	_, err := r.users.BulkWrite(ctx, models)
	return err
}

// ComplexSearchQuery demonstrates combining multiple filters
func (r *ExampleUserRepository) ComplexSearchQuery(ctx context.Context, searchTerm, role, status string, from, to time.Time) ([]interface{}, error) {
	// Build complex filter
	filters := []bson.M{}

	// Search filter
	if searchTerm != "" {
		filters = append(filters, SearchFilter(searchTerm, "firstName", "lastName", "emailAddress"))
	}

	// Role filter
	if role != "" {
		filters = append(filters, bson.M{"role": role})
	}

	// Status filter
	if status != "" {
		filters = append(filters, bson.M{"status": status})
	}

	// Date range filter
	if !from.IsZero() || !to.IsZero() {
		filters = append(filters, DateRangeFilter("createdAt", from, to))
	}

	// Combine all filters
	finalFilter := AndFilter(filters...)

	var users []interface{}
	err := r.users.Find(ctx, finalFilter, &users)
	if err != nil {
		return nil, err
	}

	return users, nil
}

// TransactionExample demonstrates transaction usage
func TransactionExample(ctx context.Context, client *mongo.Client, userID, targetID string) error {
	return Transaction(ctx, client, func(sessCtx mongo.SessionContext) error {
		// Update user balance
		usersRepo := NewBaseRepository(client.Database("mydb"), "users")

		_, err := usersRepo.UpdateByField(sessCtx, "userId", userID, bson.M{
			"$inc": bson.M{"balance": -100},
		})
		if err != nil {
			return err
		}

		// Update target balance
		_, err = usersRepo.UpdateByField(sessCtx, "userId", targetID, bson.M{
			"$inc": bson.M{"balance": 100},
		})
		if err != nil {
			return err
		}

		return nil
	})
}
