package common

import (
	"regexp"
	"unicode"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()

	// Register custom validators
	validate.RegisterValidation("password", validatePassword)
	validate.RegisterValidation("username", validateUsername)
}

// ValidateStruct validates a struct using validator tags
func ValidateStruct(s interface{}) error {
	return validate.Struct(s)
}

// GetValidator returns the validator instance
func GetValidator() *validator.Validate {
	return validate
}

// validatePassword validates password strength
func validatePassword(fl validator.FieldLevel) bool {
	password := fl.Field().String()

	// Minimum 8 characters
	if len(password) < 8 {
		return false
	}

	var (
		hasUpper   = false
		hasLower   = false
		hasNumber  = false
		hasSpecial = false
	)

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	// Require at least 3 out of 4 character types
	count := 0
	if hasUpper {
		count++
	}
	if hasLower {
		count++
	}
	if hasNumber {
		count++
	}
	if hasSpecial {
		count++
	}

	return count >= 3
}

// validateUsername validates username format
func validateUsername(fl validator.FieldLevel) bool {
	username := fl.Field().String()

	// Username must be 3-20 characters, alphanumeric and underscore
	match, _ := regexp.MatchString(`^[a-zA-Z0-9_]{3,20}$`, username)
	return match
}

// IsValidEmail checks if email is valid
func IsValidEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

// IsValidPassword checks if password meets requirements
func IsValidPassword(password string) bool {
	if len(password) < 8 {
		return false
	}

	var (
		hasUpper   = false
		hasLower   = false
		hasNumber  = false
		hasSpecial = false
	)

	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	// At least 3 out of 4 types
	count := 0
	if hasUpper {
		count++
	}
	if hasLower {
		count++
	}
	if hasNumber {
		count++
	}
	if hasSpecial {
		count++
	}

	return count >= 3
}

// IsValidUsername checks if username is valid
func IsValidUsername(username string) bool {
	if len(username) < 3 || len(username) > 20 {
		return false
	}
	match, _ := regexp.MatchString(`^[a-zA-Z0-9_]+$`, username)
	return match
}

// SanitizeInput removes potentially dangerous characters
func SanitizeInput(input string) string {
	// Remove HTML tags
	re := regexp.MustCompile(`<[^>]*>`)
	return re.ReplaceAllString(input, "")
}
