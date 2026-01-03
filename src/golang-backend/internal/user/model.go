package user

import "time"

// UpdateUserRequest represents a request to update user information
type UpdateUserRequest struct {
	FirstName   *string          `json:"firstName,omitempty"`
	LastName    *string          `json:"lastName,omitempty"`
	Avatar      *string          `json:"avatar,omitempty"`
	Preferences *UserPreferences `json:"preferences,omitempty"`
}

// UserPreferences represents user preferences
type UserPreferences struct {
	Language      string `json:"language" bson:"language"`
	Theme         string `json:"theme" bson:"theme"`
	Notifications bool   `json:"notifications" bson:"notifications"`
}

// ChangePasswordRequest represents a request to change password
type ChangePasswordRequest struct {
	CurrentPassword string `json:"currentPassword" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required,min=8"`
}

// ListUsersParams represents parameters for listing users
type ListUsersParams struct {
	Page      int    `form:"page,default=1"`
	PageSize  int    `form:"pageSize,default=20"`
	Search    string `form:"search"`
	Role      string `form:"role"`
	SortBy    string `form:"sortBy,default=createdAt"`
	SortOrder string `form:"sortOrder,default=desc"`
}

// PaginationMeta represents pagination metadata
type PaginationMeta struct {
	Page       int `json:"page"`
	PageSize   int `json:"pageSize"`
	TotalItems int `json:"totalItems"`
	TotalPages int `json:"totalPages"`
}

// ListUsersResponse represents paginated users response
type ListUsersResponse struct {
	Success    bool           `json:"success"`
	Data       []interface{}  `json:"data"`
	Pagination PaginationMeta `json:"pagination"`
	Timestamp  string         `json:"timestamp"`
}
