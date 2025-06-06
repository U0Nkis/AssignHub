package middleware

import (
	"AssignHub/config"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// SecurityMiddleware содержит все middleware для безопасности
type SecurityMiddleware struct {
	config *config.Config
}

// NewSecurityMiddleware создает новый экземпляр SecurityMiddleware
func NewSecurityMiddleware(config *config.Config) *SecurityMiddleware {
	return &SecurityMiddleware{
		config: config,
	}
}

// CORS настраивает CORS middleware
func (m *SecurityMiddleware) CORS() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     m.config.Security.CORSAllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	})
}

// RateLimit настраивает rate limiting
func (m *SecurityMiddleware) RateLimit() gin.HandlerFunc {
	limiter := rate.NewLimiter(rate.Limit(m.config.Security.RateLimitRequests), m.config.Security.RateLimitRequests)

	return func(c *gin.Context) {
		if !limiter.Allow() {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests",
			})
			c.Abort()
			return
		}
		c.Next()
	}
}

// SecurityHeaders добавляет security headers
func (m *SecurityMiddleware) SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		c.Header("Content-Security-Policy", "default-src 'self'")
		c.Next()
	}
}

// MaxBodySize ограничивает размер тела запроса
func (m *SecurityMiddleware) MaxBodySize() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, m.config.Security.MaxUploadSize)
		c.Next()
	}
}
