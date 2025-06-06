package handlers

import (
	"AssignHub/db"
	"AssignHub/logger"
	"AssignHub/models"
	"AssignHub/utils"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	MaxFileSize    = 10 << 20 // 10MB
	AllowedTypes   = "pdf,doc,docx,txt,zip,rar,jpg,jpeg,png"
	UploadBasePath = "uploads"
)

func UploadFile(c *gin.Context) {
	userID := c.GetUint("userID")

	// Create uploads directory if it doesn't exist
	if err := os.MkdirAll(UploadBasePath, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file provided"})
		return
	}

	// Validate file size
	if file.Size > MaxFileSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("File size exceeds maximum limit of %dMB", MaxFileSize>>20)})
		return
	}

	// Validate file type
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !strings.Contains(AllowedTypes, strings.TrimPrefix(ext, ".")) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File type not allowed"})
		return
	}

	// Generate unique filename
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), file.Filename)
	filepath := filepath.Join(UploadBasePath, filename)

	// Save file
	if err := c.SaveUploadedFile(file, filepath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Create file record in database
	fileRecord := models.File{
		UserID:      userID,
		Filename:    file.Filename,
		Filepath:    filepath,
		ContentType: file.Header.Get("Content-Type"),
		Size:        file.Size,
		UploadedAt:  time.Now(),
	}

	if err := db.DB.Create(&fileRecord).Error; err != nil {
		// Clean up file if database operation fails
		os.Remove(filepath)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file record"})
		return
	}

	c.JSON(http.StatusCreated, fileRecord)
}

func GetFile(c *gin.Context) {
	fileID := c.Param("id")
	userID := c.GetUint("userID")
	role := c.GetString("role")

	var file models.File
	if err := db.DB.First(&file, fileID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// Check if user has permission to access the file
	if role == "student" && file.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to access this file"})
		return
	}

	// Check if file exists
	if _, err := os.Stat(file.Filepath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found on server"})
		return
	}

	c.File(file.Filepath)
}

func DeleteFile(c *gin.Context) {
	fileID := c.Param("id")
	userID := c.GetUint("userID")

	var file models.File
	if err := db.DB.First(&file, fileID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// Check if user owns the file
	if file.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to delete this file"})
		return
	}

	// Delete file from storage
	if err := os.Remove(file.Filepath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file from storage"})
		return
	}

	// Delete file record from database
	if err := db.DB.Delete(&file).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete file record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "File deleted successfully"})
}

func GetUserFiles(c *gin.Context) {
	userID := c.GetUint("userID")

	var files []models.File
	query := db.DB.Where("user_id = ?", userID)

	// Add pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var total int64
	query.Count(&total)

	if err := query.Offset(offset).Limit(limit).Find(&files).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch files"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": files,
		"meta": gin.H{
			"total":  total,
			"page":   page,
			"limit":  limit,
			"offset": offset,
		},
	})
}
