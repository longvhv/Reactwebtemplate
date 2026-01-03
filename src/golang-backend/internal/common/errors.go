package common

import (
	"errors"
)

var (
	// Common errors
	ErrInternalServer = errors.New("internal server error")
	ErrBadRequest     = errors.New("bad request")
	ErrUnauthorized   = errors.New("unauthorized")
	ErrForbidden      = errors.New("forbidden")
	ErrNotFound       = errors.New("not found")
	ErrConflict       = errors.New("resource already exists")

	// Validation errors
	ErrValidationFailed = errors.New("validation failed")
	ErrInvalidInput     = errors.New("invalid input")
	ErrInvalidEmail     = errors.New("invalid email address")
	ErrInvalidPassword  = errors.New("invalid password")
	ErrPasswordTooWeak  = errors.New("password is too weak")

	// Authentication errors
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrInvalidToken       = errors.New("invalid token")
	ErrTokenExpired       = errors.New("token expired")
	ErrTokenMissing       = errors.New("token missing")

	// User errors
	ErrUserNotFound      = errors.New("user not found")
	ErrUserAlreadyExists = errors.New("user already exists")
	ErrUserInactive      = errors.New("user account is inactive")
	ErrUserLocked        = errors.New("user account is locked")

	// Database errors
	ErrDatabaseConnection = errors.New("database connection failed")
	ErrDatabaseQuery      = errors.New("database query failed")
	ErrDatabaseInsert     = errors.New("failed to insert record")
	ErrDatabaseUpdate     = errors.New("failed to update record")
	ErrDatabaseDelete     = errors.New("failed to delete record")

	// Resource errors
	ErrResourceNotFound      = errors.New("resource not found")
	ErrResourceAlreadyExists = errors.New("resource already exists")
)

// AppError represents an application error with code and message
type AppError struct {
	Code    string
	Message string
	Err     error
}

// Error implements the error interface
func (e *AppError) Error() string {
	if e.Err != nil {
		return e.Message + ": " + e.Err.Error()
	}
	return e.Message
}

// Unwrap implements the errors.Unwrap interface
func (e *AppError) Unwrap() error {
	return e.Err
}

// NewAppError creates a new application error
func NewAppError(code string, message string, err error) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

// NewBadRequestError creates a bad request error
func NewBadRequestError(message string) *AppError {
	return NewAppError("BAD_REQUEST", message, ErrBadRequest)
}

// NewUnauthorizedError creates an unauthorized error
func NewUnauthorizedError(message string) *AppError {
	return NewAppError("UNAUTHORIZED", message, ErrUnauthorized)
}

// NewForbiddenError creates a forbidden error
func NewForbiddenError(message string) *AppError {
	return NewAppError("FORBIDDEN", message, ErrForbidden)
}

// NewNotFoundError creates a not found error
func NewNotFoundError(message string) *AppError {
	return NewAppError("NOT_FOUND", message, ErrNotFound)
}

// NewConflictError creates a conflict error
func NewConflictError(message string) *AppError {
	return NewAppError("CONFLICT", message, ErrConflict)
}

// NewValidationError creates a validation error
func NewValidationError(message string) *AppError {
	return NewAppError("VALIDATION_ERROR", message, ErrValidationFailed)
}

// NewInternalError creates an internal server error
func NewInternalError(message string, err error) *AppError {
	return NewAppError("INTERNAL_ERROR", message, err)
}
