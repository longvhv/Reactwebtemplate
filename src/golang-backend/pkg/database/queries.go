package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Common query filters and helpers

// SearchFilter creates a text search filter for multiple fields
func SearchFilter(searchTerm string, fields ...string) bson.M {
	if searchTerm == "" {
		return bson.M{}
	}

	orConditions := make([]bson.M, len(fields))
	for i, field := range fields {
		orConditions[i] = bson.M{
			field: bson.M{
				"$regex":   searchTerm,
				"$options": "i",
			},
		}
	}

	return bson.M{"$or": orConditions}
}

// DateRangeFilter creates a date range filter
func DateRangeFilter(field string, from, to time.Time) bson.M {
	filter := bson.M{}
	
	if !from.IsZero() && !to.IsZero() {
		filter[field] = bson.M{
			"$gte": from,
			"$lte": to,
		}
	} else if !from.IsZero() {
		filter[field] = bson.M{"$gte": from}
	} else if !to.IsZero() {
		filter[field] = bson.M{"$lte": to}
	}
	
	return filter
}

// InFilter creates an $in filter
func InFilter(field string, values []interface{}) bson.M {
	if len(values) == 0 {
		return bson.M{}
	}
	return bson.M{field: bson.M{"$in": values}}
}

// NotInFilter creates a $nin filter
func NotInFilter(field string, values []interface{}) bson.M {
	if len(values) == 0 {
		return bson.M{}
	}
	return bson.M{field: bson.M{"$nin": values}}
}

// ExistsFilter checks if a field exists
func ExistsFilter(field string, exists bool) bson.M {
	return bson.M{field: bson.M{"$exists": exists}}
}

// RegexFilter creates a regex filter
func RegexFilter(field, pattern string, caseInsensitive bool) bson.M {
	options := ""
	if caseInsensitive {
		options = "i"
	}
	return bson.M{
		field: bson.M{
			"$regex":   pattern,
			"$options": options,
		},
	}
}

// AndFilter combines multiple filters with AND
func AndFilter(filters ...bson.M) bson.M {
	nonEmpty := []bson.M{}
	for _, filter := range filters {
		if len(filter) > 0 {
			nonEmpty = append(nonEmpty, filter)
		}
	}
	
	if len(nonEmpty) == 0 {
		return bson.M{}
	}
	if len(nonEmpty) == 1 {
		return nonEmpty[0]
	}
	
	return bson.M{"$and": nonEmpty}
}

// OrFilter combines multiple filters with OR
func OrFilter(filters ...bson.M) bson.M {
	nonEmpty := []bson.M{}
	for _, filter := range filters {
		if len(filter) > 0 {
			nonEmpty = append(nonEmpty, filter)
		}
	}
	
	if len(nonEmpty) == 0 {
		return bson.M{}
	}
	if len(nonEmpty) == 1 {
		return nonEmpty[0]
	}
	
	return bson.M{"$or": nonEmpty}
}

// MergeFilters merges multiple filters into one
func MergeFilters(filters ...bson.M) bson.M {
	result := bson.M{}
	for _, filter := range filters {
		for key, value := range filter {
			result[key] = value
		}
	}
	return result
}

// PaginationQuery helper for pagination queries
type PaginationQuery struct {
	Page     int
	PageSize int
	SortBy   string
	SortDesc bool
}

// GetSkip returns the skip value for pagination
func (pq *PaginationQuery) GetSkip() int64 {
	if pq.Page < 1 {
		pq.Page = 1
	}
	return int64((pq.Page - 1) * pq.PageSize)
}

// GetLimit returns the limit value for pagination
func (pq *PaginationQuery) GetLimit() int64 {
	if pq.PageSize < 1 || pq.PageSize > 100 {
		pq.PageSize = 20
	}
	return int64(pq.PageSize)
}

// GetSort returns the sort value
func (pq *PaginationQuery) GetSort() bson.D {
	if pq.SortBy == "" {
		pq.SortBy = "createdAt"
	}
	
	order := 1
	if pq.SortDesc {
		order = -1
	}
	
	return bson.D{{Key: pq.SortBy, Value: order}}
}

// AggregationPipeline helper for building aggregation pipelines
type AggregationPipeline struct {
	stages []bson.M
}

// NewAggregationPipeline creates a new aggregation pipeline
func NewAggregationPipeline() *AggregationPipeline {
	return &AggregationPipeline{
		stages: []bson.M{},
	}
}

// Match adds a $match stage
func (ap *AggregationPipeline) Match(filter bson.M) *AggregationPipeline {
	ap.stages = append(ap.stages, bson.M{"$match": filter})
	return ap
}

// Lookup adds a $lookup stage (join)
func (ap *AggregationPipeline) Lookup(from, localField, foreignField, as string) *AggregationPipeline {
	ap.stages = append(ap.stages, bson.M{
		"$lookup": bson.M{
			"from":         from,
			"localField":   localField,
			"foreignField": foreignField,
			"as":           as,
		},
	})
	return ap
}

// Unwind adds an $unwind stage
func (ap *AggregationPipeline) Unwind(path string, preserveNull bool) *AggregationPipeline {
	ap.stages = append(ap.stages, bson.M{
		"$unwind": bson.M{
			"path":                       path,
			"preserveNullAndEmptyArrays": preserveNull,
		},
	})
	return ap
}

// Group adds a $group stage
func (ap *AggregationPipeline) Group(id interface{}, fields bson.M) *AggregationPipeline {
	groupStage := bson.M{"_id": id}
	for key, value := range fields {
		groupStage[key] = value
	}
	ap.stages = append(ap.stages, bson.M{"$group": groupStage})
	return ap
}

// Sort adds a $sort stage
func (ap *AggregationPipeline) Sort(field string, ascending bool) *AggregationPipeline {
	order := 1
	if !ascending {
		order = -1
	}
	ap.stages = append(ap.stages, bson.M{
		"$sort": bson.M{field: order},
	})
	return ap
}

// Skip adds a $skip stage
func (ap *AggregationPipeline) Skip(skip int64) *AggregationPipeline {
	if skip > 0 {
		ap.stages = append(ap.stages, bson.M{"$skip": skip})
	}
	return ap
}

// Limit adds a $limit stage
func (ap *AggregationPipeline) Limit(limit int64) *AggregationPipeline {
	if limit > 0 {
		ap.stages = append(ap.stages, bson.M{"$limit": limit})
	}
	return ap
}

// Project adds a $project stage
func (ap *AggregationPipeline) Project(fields bson.M) *AggregationPipeline {
	ap.stages = append(ap.stages, bson.M{"$project": fields})
	return ap
}

// AddFields adds an $addFields stage
func (ap *AggregationPipeline) AddFields(fields bson.M) *AggregationPipeline {
	ap.stages = append(ap.stages, bson.M{"$addFields": fields})
	return ap
}

// Count adds a $count stage
func (ap *AggregationPipeline) Count(field string) *AggregationPipeline {
	ap.stages = append(ap.stages, bson.M{"$count": field})
	return ap
}

// Facet adds a $facet stage
func (ap *AggregationPipeline) Facet(facets map[string][]bson.M) *AggregationPipeline {
	ap.stages = append(ap.stages, bson.M{"$facet": facets})
	return ap
}

// Build returns the pipeline
func (ap *AggregationPipeline) Build() []bson.M {
	return ap.stages
}

// Execute runs the aggregation pipeline
func (ap *AggregationPipeline) Execute(ctx context.Context, repo *BaseRepository, results interface{}) error {
	return repo.Aggregate(ctx, ap.stages, results)
}

// Common update operations

// IncrementField creates an increment update
func IncrementField(field string, value int) bson.M {
	return bson.M{"$inc": bson.M{field: value}}
}

// PushToArray creates a push update
func PushToArray(field string, value interface{}) bson.M {
	return bson.M{"$push": bson.M{field: value}}
}

// PullFromArray creates a pull update
func PullFromArray(field string, condition interface{}) bson.M {
	return bson.M{"$pull": bson.M{field: condition}}
}

// AddToSet creates an addToSet update
func AddToSet(field string, value interface{}) bson.M {
	return bson.M{"$addToSet": bson.M{field: value}}
}

// SetField creates a set update
func SetField(field string, value interface{}) bson.M {
	return bson.M{"$set": bson.M{field: value}}
}

// UnsetField creates an unset update
func UnsetField(field string) bson.M {
	return bson.M{"$unset": bson.M{field: ""}}
}

// ObjectIDFromHex converts hex string to ObjectID
func ObjectIDFromHex(hex string) (primitive.ObjectID, error) {
	return primitive.ObjectIDFromHex(hex)
}

// IsValidObjectID checks if a string is a valid ObjectID
func IsValidObjectID(hex string) bool {
	_, err := primitive.ObjectIDFromHex(hex)
	return err == nil
}

// NewObjectID generates a new ObjectID
func NewObjectID() primitive.ObjectID {
	return primitive.NewObjectID()
}

// TimeToObjectID converts a time to ObjectID (for time-based queries)
func TimeToObjectID(t time.Time) primitive.ObjectID {
	return primitive.NewObjectIDFromTimestamp(t)
}

// ObjectIDToTime extracts timestamp from ObjectID
func ObjectIDToTime(id primitive.ObjectID) time.Time {
	return id.Timestamp()
}
