package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/vhvplatform/go-shared/logger"
)

// ErrorHandler is a middleware that handles errors
func ErrorHandler(logger *logger.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			err := c.Errors.Last()
			logger.Error("Request error", "error", err.Error())

			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "INTERNAL_ERROR",
					"message": "Internal server error",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
		}
	}
}
