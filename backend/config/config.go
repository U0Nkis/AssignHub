package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Judge0   Judge0Config
	File     FileConfig
}

type ServerConfig struct {
	Port         string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type JWTConfig struct {
	Secret          string
	ExpirationHours int
	RefreshHours    int
}

type Judge0Config struct {
	APIURL     string
	MaxWorkers int
	Timeout    time.Duration
}

type FileConfig struct {
	UploadDir    string
	MaxFileSize  int64
	AllowedTypes []string
}

func LoadConfig() (*Config, error) {
	config := &Config{
		Server: ServerConfig{
			Port:         getEnv("SERVER_PORT", "8080"),
			ReadTimeout:  getDurationEnv("SERVER_READ_TIMEOUT", 5*time.Second),
			WriteTimeout: getDurationEnv("SERVER_WRITE_TIMEOUT", 10*time.Second),
			IdleTimeout:  getDurationEnv("SERVER_IDLE_TIMEOUT", 120*time.Second),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "0000"),
			Name:     getEnv("DB_NAME", "homework_db"),
			SSLMode:  getEnv("DB_SSL_MODE", "disable"),
		},
		JWT: JWTConfig{
			Secret:          getEnv("JWT_SECRET", "your-secret-key"),
			ExpirationHours: getIntEnv("JWT_EXPIRATION_HOURS", 24),
			RefreshHours:    getIntEnv("JWT_REFRESH_HOURS", 72),
		},
		Judge0: Judge0Config{
			APIURL:     getEnv("JUDGE0_API_URL", "http://judge0:2358"),
			MaxWorkers: getIntEnv("JUDGE0_MAX_WORKERS", 10),
			Timeout:    getDurationEnv("JUDGE0_TIMEOUT", 30*time.Second),
		},
		File: FileConfig{
			UploadDir:    getEnv("FILE_UPLOAD_DIR", "uploads"),
			MaxFileSize:  getInt64Env("FILE_MAX_SIZE", 10<<20), // 10MB
			AllowedTypes: getStringSliceEnv("FILE_ALLOWED_TYPES", []string{"pdf", "doc", "docx", "txt", "zip", "rar", "jpg", "jpeg", "png"}),
		},
	}

	return config, nil
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getIntEnv(key string, defaultValue int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getInt64Env(key string, defaultValue int64) int64 {
	if value, exists := os.LookupEnv(key); exists {
		if intValue, err := strconv.ParseInt(value, 10, 64); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getDurationEnv(key string, defaultValue time.Duration) time.Duration {
	if value, exists := os.LookupEnv(key); exists {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}

func getStringSliceEnv(key string, defaultValue []string) []string {
	if value, exists := os.LookupEnv(key); exists {
		return strings.Split(value, ",")
	}
	return defaultValue
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.Database.Host,
		c.Database.Port,
		c.Database.User,
		c.Database.Password,
		c.Database.Name,
		c.Database.SSLMode,
	)
}

func (c *Config) GetServerAddr() string {
	return ":" + c.Server.Port
}
