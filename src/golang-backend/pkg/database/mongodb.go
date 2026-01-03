package database

import (
	"context"
	"errors"
	"time"

	"github.com/vhvplatform/go-shared/mongodb"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	// ErrNotFound is returned when a document is not found
	ErrNotFound = errors.New("document not found")
	// ErrDuplicateKey is returned when a duplicate key error occurs
	ErrDuplicateKey = errors.New("duplicate key error")
)

// BaseRepository provides common database operations
type BaseRepository struct {
	Collection *mongo.Collection
}

// NewBaseRepository creates a new base repository
func NewBaseRepository(db *mongo.Database, collectionName string) *BaseRepository {
	return &BaseRepository{
		Collection: db.Collection(collectionName),
	}
}

// InsertOne inserts a single document
func (r *BaseRepository) InsertOne(ctx context.Context, document interface{}) (*mongo.InsertOneResult, error) {
	result, err := r.Collection.InsertOne(ctx, document)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return nil, ErrDuplicateKey
		}
		return nil, err
	}
	return result, nil
}

// FindOne finds a single document by filter
func (r *BaseRepository) FindOne(ctx context.Context, filter interface{}, result interface{}) error {
	err := r.Collection.FindOne(ctx, filter).Decode(result)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return ErrNotFound
		}
		return err
	}
	return nil
}

// FindByID finds a document by ObjectID
func (r *BaseRepository) FindByID(ctx context.Context, id primitive.ObjectID, result interface{}) error {
	return r.FindOne(ctx, bson.M{"_id": id}, result)
}

// FindByField finds a single document by a specific field
func (r *BaseRepository) FindByField(ctx context.Context, fieldName string, value interface{}, result interface{}) error {
	return r.FindOne(ctx, bson.M{fieldName: value}, result)
}

// Find finds multiple documents
func (r *BaseRepository) Find(ctx context.Context, filter interface{}, results interface{}, opts ...*options.FindOptions) error {
	cursor, err := r.Collection.Find(ctx, filter, opts...)
	if err != nil {
		return err
	}
	defer cursor.Close(ctx)

	return cursor.All(ctx, results)
}

// UpdateOne updates a single document
func (r *BaseRepository) UpdateOne(ctx context.Context, filter interface{}, update interface{}) (*mongo.UpdateResult, error) {
	// Add updatedAt timestamp
	if updateDoc, ok := update.(bson.M); ok {
		if setDoc, ok := updateDoc["$set"].(bson.M); ok {
			setDoc["updatedAt"] = time.Now()
		}
	}

	result, err := r.Collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}
	return result, nil
}

// UpdateByID updates a document by ObjectID
func (r *BaseRepository) UpdateByID(ctx context.Context, id primitive.ObjectID, update interface{}) (*mongo.UpdateResult, error) {
	return r.UpdateOne(ctx, bson.M{"_id": id}, update)
}

// UpdateByField updates a document by a specific field
func (r *BaseRepository) UpdateByField(ctx context.Context, fieldName string, value interface{}, update interface{}) (*mongo.UpdateResult, error) {
	return r.UpdateOne(ctx, bson.M{fieldName: value}, update)
}

// FindOneAndUpdate finds and updates a single document
func (r *BaseRepository) FindOneAndUpdate(ctx context.Context, filter interface{}, update interface{}, result interface{}) error {
	// Add updatedAt timestamp
	if updateDoc, ok := update.(bson.M); ok {
		if setDoc, ok := updateDoc["$set"].(bson.M); ok {
			setDoc["updatedAt"] = time.Now()
		}
	}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	err := r.Collection.FindOneAndUpdate(ctx, filter, update, opts).Decode(result)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return ErrNotFound
		}
		return err
	}
	return nil
}

// DeleteOne deletes a single document
func (r *BaseRepository) DeleteOne(ctx context.Context, filter interface{}) (*mongo.DeleteResult, error) {
	return r.Collection.DeleteOne(ctx, filter)
}

// DeleteByID deletes a document by ObjectID
func (r *BaseRepository) DeleteByID(ctx context.Context, id primitive.ObjectID) (*mongo.DeleteResult, error) {
	return r.DeleteOne(ctx, bson.M{"_id": id})
}

// DeleteByField deletes a document by a specific field
func (r *BaseRepository) DeleteByField(ctx context.Context, fieldName string, value interface{}) (*mongo.DeleteResult, error) {
	return r.DeleteOne(ctx, bson.M{fieldName: value})
}

// DeleteMany deletes multiple documents
func (r *BaseRepository) DeleteMany(ctx context.Context, filter interface{}) (*mongo.DeleteResult, error) {
	return r.Collection.DeleteMany(ctx, filter)
}

// Count counts documents matching the filter
func (r *BaseRepository) Count(ctx context.Context, filter interface{}) (int64, error) {
	return r.Collection.CountDocuments(ctx, filter)
}

// Exists checks if a document exists
func (r *BaseRepository) Exists(ctx context.Context, filter interface{}) (bool, error) {
	count, err := r.Count(ctx, filter)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// ExistsByField checks if a document exists by a specific field
func (r *BaseRepository) ExistsByField(ctx context.Context, fieldName string, value interface{}) (bool, error) {
	return r.Exists(ctx, bson.M{fieldName: value})
}

// Aggregate performs an aggregation pipeline
func (r *BaseRepository) Aggregate(ctx context.Context, pipeline interface{}, results interface{}) error {
	cursor, err := r.Collection.Aggregate(ctx, pipeline)
	if err != nil {
		return err
	}
	defer cursor.Close(ctx)

	return cursor.All(ctx, results)
}

// BulkWrite performs bulk write operations
func (r *BaseRepository) BulkWrite(ctx context.Context, models []mongo.WriteModel) (*mongo.BulkWriteResult, error) {
	return r.Collection.BulkWrite(ctx, models)
}

// CreateIndex creates an index
func (r *BaseRepository) CreateIndex(ctx context.Context, keys bson.D, opts ...*options.IndexOptions) (string, error) {
	indexModel := mongo.IndexModel{
		Keys:    keys,
		Options: options.Index(),
	}

	if len(opts) > 0 {
		indexModel.Options = opts[0]
	}

	return r.Collection.Indexes().CreateOne(ctx, indexModel)
}

// CreateUniqueIndex creates a unique index
func (r *BaseRepository) CreateUniqueIndex(ctx context.Context, fieldName string) (string, error) {
	return r.CreateIndex(
		ctx,
		bson.D{{Key: fieldName, Value: 1}},
		options.Index().SetUnique(true),
	)
}

// DropIndex drops an index
func (r *BaseRepository) DropIndex(ctx context.Context, name string) error {
	_, err := r.Collection.Indexes().DropOne(ctx, name)
	return err
}

// Transaction executes a function within a transaction
func Transaction(ctx context.Context, client *mongo.Client, fn func(sessCtx mongo.SessionContext) error) error {
	session, err := client.StartSession()
	if err != nil {
		return err
	}
	defer session.EndSession(ctx)

	_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
		return nil, fn(sessCtx)
	})

	return err
}

// QueryBuilder provides a fluent interface for building queries
type QueryBuilder struct {
	filter  bson.M
	sort    bson.D
	skip    int64
	limit   int64
	project bson.M
}

// NewQueryBuilder creates a new query builder
func NewQueryBuilder() *QueryBuilder {
	return &QueryBuilder{
		filter: bson.M{},
	}
}

// Filter adds a filter condition
func (qb *QueryBuilder) Filter(field string, value interface{}) *QueryBuilder {
	qb.filter[field] = value
	return qb
}

// FilterRange adds a range filter ($gte and $lte)
func (qb *QueryBuilder) FilterRange(field string, from, to interface{}) *QueryBuilder {
	qb.filter[field] = bson.M{
		"$gte": from,
		"$lte": to,
	}
	return qb
}

// FilterIn adds an $in filter
func (qb *QueryBuilder) FilterIn(field string, values []interface{}) *QueryBuilder {
	qb.filter[field] = bson.M{"$in": values}
	return qb
}

// FilterRegex adds a regex filter
func (qb *QueryBuilder) FilterRegex(field string, pattern string, caseInsensitive bool) *QueryBuilder {
	options := ""
	if caseInsensitive {
		options = "i"
	}
	qb.filter[field] = bson.M{
		"$regex":   pattern,
		"$options": options,
	}
	return qb
}

// Sort adds sorting
func (qb *QueryBuilder) Sort(field string, ascending bool) *QueryBuilder {
	order := 1
	if !ascending {
		order = -1
	}
	qb.sort = append(qb.sort, bson.E{Key: field, Value: order})
	return qb
}

// Skip sets the skip value
func (qb *QueryBuilder) Skip(skip int64) *QueryBuilder {
	qb.skip = skip
	return qb
}

// Limit sets the limit value
func (qb *QueryBuilder) Limit(limit int64) *QueryBuilder {
	qb.limit = limit
	return qb
}

// Project adds field projection
func (qb *QueryBuilder) Project(fields map[string]int) *QueryBuilder {
	qb.project = bson.M{}
	for field, value := range fields {
		qb.project[field] = value
	}
	return qb
}

// Build builds the find options
func (qb *QueryBuilder) Build() (*bson.M, *options.FindOptions) {
	opts := options.Find()

	if len(qb.sort) > 0 {
		opts.SetSort(qb.sort)
	}

	if qb.skip > 0 {
		opts.SetSkip(qb.skip)
	}

	if qb.limit > 0 {
		opts.SetLimit(qb.limit)
	}

	if len(qb.project) > 0 {
		opts.SetProjection(qb.project)
	}

	return &qb.filter, opts
}

// GetFilter returns the filter
func (qb *QueryBuilder) GetFilter() bson.M {
	return qb.filter
}
