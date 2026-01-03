package middleware

import (
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// RateLimiter manages rate limiting for clients
type RateLimiter struct {
	clients map[string]*rate.Limiter
	mu      sync.RWMutex
	r       rate.Limit
	b       int
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter(r rate.Limit, b int) *RateLimiter {
	return &RateLimiter{
		clients: make(map[string]*rate.Limiter),
		r:       r,
		b:       b,
	}
}

// GetLimiter returns a rate limiter for a client
func (rl *RateLimiter) GetLimiter(key string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	limiter, exists := rl.clients[key]
	if !exists {
		limiter = rate.NewLimiter(rl.r, rl.b)
		rl.clients[key] = limiter
	}

	return limiter
}

// CleanupClients removes old clients periodically
func (rl *RateLimiter) CleanupClients() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.mu.Lock()
		// Clear all clients (in production, you might want to be more selective)
		rl.clients = make(map[string]*rate.Limiter)
		rl.mu.Unlock()
	}
}

// RateLimit is a middleware that limits requests
func RateLimit(requestsPerMinute int) gin.HandlerFunc {
	limiter := NewRateLimiter(rate.Limit(requestsPerMinute)/60, requestsPerMinute)

	// Start cleanup goroutine
	go limiter.CleanupClients()

	return func(c *gin.Context) {
		ip := c.ClientIP()
		clientLimiter := limiter.GetLimiter(ip)

		if !clientLimiter.Allow() {
			c.JSON(429, gin.H{
				"success": false,
				"error": gin.H{
					"code":    "RATE_LIMIT_EXCEEDED",
					"message": "Too many requests. Please try again later.",
				},
				"timestamp": time.Now().Format(time.RFC3339),
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
