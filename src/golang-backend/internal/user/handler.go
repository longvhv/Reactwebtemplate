package user

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/vhvplatform/go-shared/logger"
)

// Handler handles HTTP requests for users
type Handler struct {
	service *Service
	logger  *logger.Logger
}

// NewHandler creates a new user handler
func NewHandler(service *Service, logger *logger.Logger) *Handler {
	return &Handler{
		service: service,
		logger:  logger,
	}
}

// GetCurrentUser gets the current authenticated user
func (h *Handler) GetCurrentUser(c *gin.Context) {
	userID := c.GetString("userId") // Set by auth middleware

	user, err := h.service.GetByID(c.Request.Context(), userID)
	if err != nil {
		if err == ErrUserNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "USER_NOT_FOUND",
					"message": "User not found",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}

		h.logger.Error("Failed to get user", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to get user",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"data":      user,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// UpdateCurrentUser updates the current user's profile
func (h *Handler) UpdateCurrentUser(c *gin.Context) {
	userID := c.GetString("userId")

	var req UpdateUserRequest
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

	user, err := h.service.Update(c.Request.Context(), userID, &req)
	if err != nil {
		if err == ErrUserNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "USER_NOT_FOUND",
					"message": "User not found",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}

		h.logger.Error("Failed to update user", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to update user",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"data":      user,
		"message":   "Profile updated successfully",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// ChangePassword changes the current user's password
func (h *Handler) ChangePassword(c *gin.Context) {
	userID := c.GetString("userId")

	var req ChangePasswordRequest
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

	if err := h.service.ChangePassword(c.Request.Context(), userID, &req); err != nil {
		if err == ErrInvalidPassword {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "INVALID_CURRENT_PASSWORD",
					"message": "Current password is incorrect",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}

		h.logger.Error("Failed to change password", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to change password",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"message":   "Password changed successfully",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// ListUsers lists all users (admin only)
func (h *Handler) ListUsers(c *gin.Context) {
	var params ListUsersParams
	if err := c.ShouldBindQuery(&params); err != nil {
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

	users, pagination, err := h.service.List(c.Request.Context(), &params)
	if err != nil {
		h.logger.Error("Failed to list users", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to list users",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"data":       users,
		"pagination": pagination,
		"timestamp":  time.Now().Format(time.RFC3339),
	})
}

// GetUser gets a user by ID (admin only)
func (h *Handler) GetUser(c *gin.Context) {
	userID := c.Param("id")

	user, err := h.service.GetByID(c.Request.Context(), userID)
	if err != nil {
		if err == ErrUserNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "USER_NOT_FOUND",
					"message": "User not found",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}

		h.logger.Error("Failed to get user", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to get user",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"data":      user,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// UpdateUser updates a user (admin only)
func (h *Handler) UpdateUser(c *gin.Context) {
	userID := c.Param("id")

	var req UpdateUserRequest
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

	user, err := h.service.Update(c.Request.Context(), userID, &req)
	if err != nil {
		if err == ErrUserNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "USER_NOT_FOUND",
					"message": "User not found",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}

		h.logger.Error("Failed to update user", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to update user",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"data":      user,
		"message":   "User updated successfully",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// DeleteUser deletes a user (admin only)
func (h *Handler) DeleteUser(c *gin.Context) {
	userID := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), userID); err != nil {
		if err == ErrUserNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "USER_NOT_FOUND",
					"message": "User not found",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}

		h.logger.Error("Failed to delete user", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to delete user",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"message":   "User deleted successfully",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}
