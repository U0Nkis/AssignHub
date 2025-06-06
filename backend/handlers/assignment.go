package handlers

import (
	"AssignHub/db"
	"AssignHub/logger"
	"AssignHub/models"
	"AssignHub/utils"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

type AssignmentInput struct {
	Title        string    `json:"title" binding:"required,min=3,max=100"`
	Description  string    `json:"description" binding:"required,min=10"`
	Type         string    `json:"type" binding:"required,oneof=homework project quiz programming"`
	Status       string    `json:"status" binding:"required,oneof=draft active completed"`
	DueDate      time.Time `json:"due_date" binding:"required"`
	MaxScore     int       `json:"max_score" binding:"required,min=1,max=100"`
	Instructions string    `json:"instructions" binding:"required,min=10"`
}

func CreateAssignment(c *gin.Context) {
	var input AssignmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.FormatValidationError(err)})
		return
	}

	// Validate due date
	if input.DueDate.Before(time.Now()) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Due date cannot be in the past"})
		return
	}

	userID := c.GetUint("userID")
	assignment := models.Assignment{
		Title:        input.Title,
		Description:  input.Description,
		Type:         input.Type,
		Status:       input.Status,
		DueDate:      input.DueDate,
		MaxScore:     input.MaxScore,
		Instructions: input.Instructions,
		TeacherID:    userID,
	}

	if err := db.DB.Create(&assignment).Error; err != nil {
		logger.Error("Failed to create assignment", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create assignment"})
		return
	}

	c.JSON(http.StatusCreated, assignment)
}

func GetAssignments(c *gin.Context) {
	var assignments []models.Assignment
	query := db.DB.Model(&models.Assignment{})

	// Add filters
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}
	if assignmentType := c.Query("type"); assignmentType != "" {
		query = query.Where("type = ?", assignmentType)
	}

	// Add pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var total int64
	query.Count(&total)

	if err := query.Offset(offset).Limit(limit).Find(&assignments).Error; err != nil {
		logger.Error("Failed to fetch assignments", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch assignments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": assignments,
		"meta": gin.H{
			"total":  total,
			"page":   page,
			"limit":  limit,
			"offset": offset,
		},
	})
}

func GetAssignment(c *gin.Context) {
	id := c.Param("id")
	var assignment models.Assignment

	if err := db.DB.Preload("Teacher").First(&assignment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	c.JSON(http.StatusOK, assignment)
}

func UpdateAssignment(c *gin.Context) {
	id := c.Param("id")
	var input AssignmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.FormatValidationError(err)})
		return
	}

	var assignment models.Assignment
	if err := db.DB.First(&assignment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	// Check if user is the teacher who created the assignment
	userID := c.GetUint("userID")
	if assignment.TeacherID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to update this assignment"})
		return
	}

	// Update assignment
	assignment.Title = input.Title
	assignment.Description = input.Description
	assignment.Type = input.Type
	assignment.Status = input.Status
	assignment.DueDate = input.DueDate
	assignment.MaxScore = input.MaxScore
	assignment.Instructions = input.Instructions

	if err := db.DB.Save(&assignment).Error; err != nil {
		logger.Error("Failed to update assignment", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update assignment"})
		return
	}

	c.JSON(http.StatusOK, assignment)
}

func DeleteAssignment(c *gin.Context) {
	id := c.Param("id")
	var assignment models.Assignment

	if err := db.DB.First(&assignment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	// Check if user is the teacher who created the assignment
	userID := c.GetUint("userID")
	if assignment.TeacherID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to delete this assignment"})
		return
	}

	if err := db.DB.Delete(&assignment).Error; err != nil {
		logger.Error("Failed to delete assignment", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete assignment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Assignment deleted successfully"})
}
