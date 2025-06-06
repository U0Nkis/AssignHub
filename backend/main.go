package main

import (
	"AssignHub/db"
	"AssignHub/handlers"
	"AssignHub/logger"
	"AssignHub/middleware"
	"g
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize logger
	logger.InitLogger()

	// Initialize database
	if err := db.InitDB(); err != nil {
		logger.Error("Failed to initialize database", err)
		os.Exit(1)
	}

	// Set Gin mode
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Global middleware
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())
	r.Use(middleware.Recovery())
	r.Use(middleware.RateLimit())

	// File upload size limit
	maxSize, _ := strconv.ParseInt(os.Getenv("MAX_UPLOAD_SIZE"), 10, 64)
	r.MaxMultipartMemory = maxSize

	// Health check
	r.GET("/health", handlers.HealthCheck)

	// Public routes
	public := r.Group("/api")
	{
		public.POST("/login", handlers.Login)
		public.POST("/register", handlers.Register)
		public.POST("/refresh-token", handlers.RefreshToken)
	}

	// Protected routes
	authorized := r.Group("/api")
	authorized.Use(middleware.AuthMiddleware())
	{
		// User management
		authorized.GET("/profile", handlers.GetProfile)
		authorized.PUT("/profile", handlers.UpdateProfile)

		// Assignment management
		assignments := authorized.Group("/assignments")
		{
			assignments.GET("", handlers.GetAssignments)
			assignments.POST("", handlers.CreateAssignment)
			assignments.GET("/:id", handlers.GetAssignment)
			assignments.PUT("/:id", handlers.UpdateAssignment)
			assignments.DELETE("/:id", handlers.DeleteAssignment)
			assignments.POST("/:id/submit", handlers.SubmitAssignment)
		}

		// Submission management
		submissions := authorized.Group("/submissions")
		{
			submissions.GET("", handlers.GetSubmissions)
			submissions.GET("/:id", handlers.GetSubmission)
			submissions.PUT("/:id/grade", handlers.GradeSubmission)
			submissions.POST("/:id/run", handlers.RunCode)
		}

		// File management
		authorized.POST("/upload", handlers.UploadFile)
		authorized.GET("/files/:id", handlers.GetFile)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	logger.Info("Server starting on port " + port)
	if err := server.ListenAndServe(); err != nil {
		logger.Error("Failed to start server", err)
		os.Exit(1)
	}
}
