package utils

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrInvalidToken = errors.New("invalid token")
	ErrExpiredToken = errors.New("token has expired")
)

// JWT claims structure
type Claims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateToken creates a new JWT token
func GenerateToken(userID uint, role string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "your-secret-key" // Default secret key for development
	}

	claims := Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ValidateToken validates a JWT token
func ValidateToken(tokenString string) (*Claims, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "your-secret-key" // Default secret key for development
	}

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	if !token.Valid {
		return nil, ErrInvalidToken
	}

	return claims, nil
}

// FormatValidationError formats validation errors into a readable string
func FormatValidationError(err error) string {
	if err == nil {
		return ""
	}

	// Check if it's a validation error
	if ve, ok := err.(validator.ValidationErrors); ok {
		var errors []string
		for _, e := range ve {
			field := e.Field()
			tag := e.Tag()
			param := e.Param()

			switch tag {
			case "required":
				errors = append(errors, fmt.Sprintf("%s is required", field))
			case "email":
				errors = append(errors, fmt.Sprintf("%s must be a valid email address", field))
			case "min":
				errors = append(errors, fmt.Sprintf("%s must be at least %s characters long", field, param))
			case "max":
				errors = append(errors, fmt.Sprintf("%s must not exceed %s characters", field, param))
			case "oneof":
				errors = append(errors, fmt.Sprintf("%s must be one of: %s", field, param))
			default:
				errors = append(errors, fmt.Sprintf("%s failed validation: %s", field, tag))
			}
		}
		return strings.Join(errors, "; ")
	}

	return err.Error()
}

// StringToUint converts a string to uint
func StringToUint(s string) uint {
	i, err := strconv.ParseUint(s, 10, 32)
	if err != nil {
		return 0
	}
	return uint(i)
}

// RegisterCustomValidators registers custom validators
func RegisterCustomValidators() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		// Add custom validators here if needed
		_ = v
	}
}

// FormatDate formats a time.Time to a string
func FormatDate(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

// ParseDate parses a string to time.Time
func ParseDate(s string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04:05", s)
}

// IsValidFileType checks if a file type is allowed
func IsValidFileType(filename string, allowedTypes []string) bool {
	ext := strings.ToLower(strings.TrimPrefix(filepath.Ext(filename), "."))
	for _, t := range allowedTypes {
		if t == ext {
			return true
		}
	}
	return false
}

// FormatFileSize formats a file size in bytes to a human-readable string
func FormatFileSize(size int64) string {
	const unit = 1024
	if size < unit {
		return fmt.Sprintf("%d B", size)
	}
	div, exp := int64(unit), 0
	for n := size / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(size)/float64(div), "KMGTPE"[exp])
}
