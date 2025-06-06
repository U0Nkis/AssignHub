package middleware

import (
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"
)

var (
	limiters = make(map[string]*rate.Limiter)
	mu       sync.Mutex
)

func RateLimit() gin.HandlerFunc {
	requests, _ := strconv.Atoi(os.Getenv("RATE_LIMIT_REQUESTS"))
	duration, _ := time.ParseDuration(os.Getenv("RATE_LIMIT_DURATION"))

	if requests == 0 {
		requests = 100 // default
	}
	if duration == 0 {
		duration = time.Minute // default
	}

	return func(c *gin.Context) {
		ip := c.ClientIP()

		mu.Lock()
		limiter, exists := limiters[ip]
		if !exists {
			limiter = rate.NewLimiter(rate.Every(duration/time.Duration(requests)), requests)
			limiters[ip] = limiter
		}
		mu.Unlock()

		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Rate limit exceeded",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
