package common

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// APIResponse represents a standard API response
type APIResponse struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data,omitempty"`
	Error     *APIError   `json:"error,omitempty"`
	Message   string      `json:"message,omitempty"`
	Timestamp string      `json:"timestamp"`
}

// APIError represents an error response
type APIError struct {
	Code    string                 `json:"code"`
	Message string                 `json:"message"`
	Details map[string]interface{} `json:"details,omitempty"`
}

// PaginationMeta represents pagination metadata
type PaginationMeta struct {
	Page       int `json:"page"`
	PageSize   int `json:"pageSize"`
	TotalItems int `json:"totalItems"`
	TotalPages int `json:"totalPages"`
}

// PaginatedResponse represents a paginated API response
type PaginatedResponse struct {
	Success    bool           `json:"success"`
	Data       interface{}    `json:"data"`
	Pagination PaginationMeta `json:"pagination"`
	Timestamp  string         `json:"timestamp"`
}

// SuccessResponse sends a success response
func SuccessResponse(c *gin.Context, statusCode int, data interface{}, message ...string) {
	msg := ""
	if len(message) > 0 {
		msg = message[0]
	}

	c.JSON(statusCode, APIResponse{
		Success:   true,
		Data:      data,
		Message:   msg,
		Timestamp: time.Now().Format(time.RFC3339),
	})
}

// ErrorResponse sends an error response
func ErrorResponse(c *gin.Context, statusCode int, code string, message string, details ...map[string]interface{}) {
	var errorDetails map[string]interface{}
	if len(details) > 0 {
		errorDetails = details[0]
	}

	c.JSON(statusCode, APIResponse{
		Success: false,
		Error: &APIError{
			Code:    code,
			Message: message,
			Details: errorDetails,
		},
		Timestamp: time.Now().Format(time.RFC3339),
	})
}

// PaginatedSuccessResponse sends a paginated success response
func PaginatedSuccessResponse(c *gin.Context, data interface{}, pagination PaginationMeta) {
	c.JSON(http.StatusOK, PaginatedResponse{
		Success:    true,
		Data:       data,
		Pagination: pagination,
		Timestamp:  time.Now().Format(time.RFC3339),
	})
}

// BadRequestError sends a 400 bad request error
func BadRequestError(c *gin.Context, message string, details ...map[string]interface{}) {
	ErrorResponse(c, http.StatusBadRequest, "BAD_REQUEST", message, details...)
}

// UnauthorizedError sends a 401 unauthorized error
func UnauthorizedError(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusUnauthorized, "UNAUTHORIZED", message)
}

// ForbiddenError sends a 403 forbidden error
func ForbiddenError(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusForbidden, "FORBIDDEN", message)
}

// NotFoundError sends a 404 not found error
func NotFoundError(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusNotFound, "NOT_FOUND", message)
}

// ConflictError sends a 409 conflict error
func ConflictError(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusConflict, "CONFLICT", message)
}

// ValidationError sends a 400 validation error
func ValidationError(c *gin.Context, message string, details map[string]interface{}) {
	ErrorResponse(c, http.StatusBadRequest, "VALIDATION_ERROR", message, details)
}

// InternalServerError sends a 500 internal server error
func InternalServerError(c *gin.Context, message string) {
	ErrorResponse(c, http.StatusInternalServerError, "INTERNAL_ERROR", message)
}

// CreatedResponse sends a 201 created response
func CreatedResponse(c *gin.Context, data interface{}, message ...string) {
	SuccessResponse(c, http.StatusCreated, data, message...)
}

// OKResponse sends a 200 OK response
func OKResponse(c *gin.Context, data interface{}, message ...string) {
	SuccessResponse(c, http.StatusOK, data, message...)
}

// NoContentResponse sends a 204 no content response
func NoContentResponse(c *gin.Context) {
	c.Status(http.StatusNoContent)
}
