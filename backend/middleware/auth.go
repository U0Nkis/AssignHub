package middleware

import (
	"AssignHub/models"
	"AssignHub/utils"
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			if err.Error() == "token has expired" {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has expired"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			}
			c.Abort()
			return
		}

		// Check if token is about to expire (within 5 minutes)
		if time.Until(time.Unix(claims.ExpiresAt, 0)) < 5*time.Minute {
			// Generate new token
			newToken, err := utils.GenerateToken(claims.UserID, claims.Role)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to refresh token"})
				c.Abort()
				return
			}
			c.Header("X-New-Token", newToken)
		}

		// Set user info in context
		c.Set("userID", claims.UserID)
		c.Set("role", claims.Role)

		// Add user info to request context
		ctx := context.WithValue(c.Request.Context(), "user", &models.User{
			ID:   claims.UserID,
			Role: claims.Role,
		})
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}

func RoleMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User role not found"})
			c.Abort()
			return
		}

		hasRole := false
		for _, role := range roles {
			if role == userRole {
				hasRole = true
				break
			}
		}

		if !hasRole {
			c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
			c.Abort()
			return
		}

		c.Next()
	}
}
