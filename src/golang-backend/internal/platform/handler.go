package platform

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/vhvplatform/go-shared/logger"
)

// Handler handles HTTP requests for platform
type Handler struct {
	service *Service
	logger  *logger.Logger
}

// NewHandler creates a new platform handler
func NewHandler(service *Service, logger *logger.Logger) *Handler {
	return &Handler{
		service: service,
		logger:  logger,
	}
}

// GetSettings gets platform settings
func (h *Handler) GetSettings(c *gin.Context) {
	settings, err := h.service.GetSettings(c.Request.Context())
	if err != nil {
		h.logger.Error("Failed to get settings", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to get settings",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"data":      settings,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// UpdateSettings updates platform settings
func (h *Handler) UpdateSettings(c *gin.Context) {
	var req UpdatePlatformSettingsRequest
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

	settings, err := h.service.UpdateSettings(c.Request.Context(), &req)
	if err != nil {
		h.logger.Error("Failed to update settings", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to update settings",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"data":      settings,
		"message":   "Settings updated successfully",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// GetNavigation gets navigation items
func (h *Handler) GetNavigation(c *gin.Context) {
	navigation, err := h.service.GetNavigation(c.Request.Context())
	if err != nil {
		h.logger.Error("Failed to get navigation", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to get navigation",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"data":      navigation,
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// CreateNavigation creates a new navigation item
func (h *Handler) CreateNavigation(c *gin.Context) {
	var req CreateNavigationRequest
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

	item, err := h.service.CreateNavigation(c.Request.Context(), &req)
	if err != nil {
		h.logger.Error("Failed to create navigation", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to create navigation",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success":   true,
		"data":      item,
		"message":   "Navigation item created",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// UpdateNavigation updates a navigation item
func (h *Handler) UpdateNavigation(c *gin.Context) {
	navigationID := c.Param("id")

	var req UpdateNavigationRequest
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

	item, err := h.service.UpdateNavigation(c.Request.Context(), navigationID, &req)
	if err != nil {
		if err == ErrNavigationNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "NOT_FOUND",
					"message": "Navigation item not found",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}

		h.logger.Error("Failed to update navigation", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to update navigation",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"data":      item,
		"message":   "Navigation item updated",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// DeleteNavigation deletes a navigation item
func (h *Handler) DeleteNavigation(c *gin.Context) {
	navigationID := c.Param("id")

	if err := h.service.DeleteNavigation(c.Request.Context(), navigationID); err != nil {
		h.logger.Error("Failed to delete navigation", "error", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error": gin.H{
				"code":    "INTERNAL_ERROR",
				"message": "Failed to delete navigation",
			},
			"timestamp": time.Now().Format(time.RFC3339),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"message":   "Navigation item deleted",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}
