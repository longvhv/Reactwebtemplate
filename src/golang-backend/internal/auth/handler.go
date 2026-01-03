package auth

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/vhvplatform/go-shared/logger"
)

// Handler handles HTTP requests for authentication
type Handler struct {
	service *Service
	logger  *logger.Logger
}

// NewHandler creates a new auth handler
func NewHandler(service *Service, logger *logger.Logger) *Handler {
	return &Handler{
		service: service,
		logger:  logger,
	}
}

// Register handles user registration
func (h *Handler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	user, err := h.service.Register(c.Request.Context(), &req)
	if err != nil {
		if err == ErrUserAlreadyExists {
			c.JSON(http.StatusConflict, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "EMAIL_ALREADY_EXISTS",
					"message": "Email already registered",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}

		h.logger.Error("Failed to register user", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to register user",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data": gin.H{
			"userId":       user.UserID,
			"emailAddress": user.EmailAddress,
			"firstName":    user.FirstName,
			"lastName":     user.LastName,
			"createdAt":    user.CreatedAt.Format(time.RFC3339),
		},
		"message":   "Registration successful",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// Login handles user login
func (h *Handler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	response, err := h.service.Login(c.Request.Context(), &req)
	if err != nil {
		if err == ErrInvalidCredentials {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "INVALID_CREDENTIALS",
					"message": "Invalid email or password",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}

		if err == ErrAccountNotActive {
			c.JSON(http.StatusForbidden, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "ACCOUNT_NOT_ACTIVE",
					"message": "Account is not active",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}

		h.logger.Error("Failed to login", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to login",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"data":      response,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// RefreshToken handles token refresh
func (h *Handler) RefreshToken(c *gin.Context) {
	var req RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	accessToken, err := h.service.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INVALID_REFRESH_TOKEN",
				"message": "Invalid or expired refresh token",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"accessToken": accessToken,
			"expiresIn":   86400,
			"tokenType":   "Bearer",
		},
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// Logout handles user logout
func (h *Handler) Logout(c *gin.Context) {
	userID := c.GetString("userId") // Set by auth middleware

	if err := h.service.Logout(c.Request.Context(), userID); err != nil {
		h.logger.Error("Failed to logout", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to logout",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"message":   "Logout successful",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// ForgotPassword handles forgot password requests
func (h *Handler) ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	// TODO: Implement password reset logic
	// - Generate reset token
	// - Send email with reset link
	// - Store reset token with expiration

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"message":   "Password reset email sent",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// ResetPassword handles password reset
func (h *Handler) ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "VALIDATION_ERROR",
				"message": err.Error(),
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	// TODO: Implement password reset logic
	// - Validate reset token
	// - Hash new password
	// - Update user password
	// - Invalidate reset token

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"message":   "Password reset successful",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}
