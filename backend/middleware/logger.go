package middleware

import (
	"AssignHub/logger"
	"github.com/gin-gonic/gin"
	"time"
)

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()

		// Process request
		c.Next()

		// Stop timer
		duration := time.Since(start)

		// Get status code
		statusCode := c.Writer.Status()

		// Get client IP
		clientIP := c.ClientIP()

		// Get method and path
		method := c.Request.Method
		path := c.Request.URL.Path

		// Log request
		logger.Info("Request processed",
			"method", method,
			"path", path,
			"status", statusCode,
			"duration", duration,
			"client_ip", clientIP,
		)
	}
}
