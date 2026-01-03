package utils

import "math"

// PaginationParams represents pagination parameters
type PaginationParams struct {
	Page     int `form:"page,default=1"`
	PageSize int `form:"pageSize,default=20"`
}

// PaginationResult represents pagination result
type PaginationResult struct {
	Page       int `json:"page"`
	PageSize   int `json:"pageSize"`
	TotalItems int `json:"totalItems"`
	TotalPages int `json:"totalPages"`
}

// CalculatePagination calculates pagination values
func CalculatePagination(page, pageSize, totalItems int) PaginationResult {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}

	totalPages := int(math.Ceil(float64(totalItems) / float64(pageSize)))

	return PaginationResult{
		Page:       page,
		PageSize:   pageSize,
		TotalItems: totalItems,
		TotalPages: totalPages,
	}
}

// GetOffset calculates the offset for database queries
func GetOffset(page, pageSize int) int {
	if page < 1 {
		page = 1
	}
	return (page - 1) * pageSize
}

// GetLimit returns the limit for database queries
func GetLimit(pageSize int) int {
	if pageSize < 1 || pageSize > 100 {
		return 20
	}
	return pageSize
}
