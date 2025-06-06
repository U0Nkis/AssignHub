package handlers

import (
	"AssignHub/db"
	"AssignHub/logger"
	"AssignHub/models"
	"AssignHub/utils"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type SubmissionInput struct {
	Content string `json:"content" binding:"required,min=1"`
	FileURL string `json:"file_url"`
}

func CreateSubmission(c *gin.Context) {
	assignmentID := c.Param("id")
	userID := c.GetUint("userID")

	// Check if assignment exists and is active
	var assignment models.Assignment
	if err := db.DB.First(&assignment, assignmentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	if assignment.Status != "active" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Assignment is not active"})
		return
	}

	// Check if due date has passed
	if time.Now().After(assignment.DueDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Assignment due date has passed"})
		return
	}

	// Check if user has already submitted
	var existingSubmission models.Submission
	if err := db.DB.Where("assignment_id = ? AND student_id = ?", assignmentID, userID).First(&existingSubmission).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You have already submitted this assignment"})
		return
	}

	var input SubmissionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.FormatValidationError(err)})
		return
	}

	submission := models.Submission{
		AssignmentID: utils.StringToUint(assignmentID),
		StudentID:    userID,
		Content:      input.Content,
		FileURL:      input.FileURL,
		SubmittedAt:  time.Now(),
		Status:       "submitted",
	}

	if err := db.DB.Create(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create submission"})
		return
	}

	c.JSON(http.StatusCreated, submission)
}

func GetSubmissions(c *gin.Context) {
	assignmentID := c.Param("id")
	userID := c.GetUint("userID")
	role := c.GetString("role")

	var submissions []models.Submission
	query := db.DB.Model(&models.Submission{}).Where("assignment_id = ?", assignmentID)

	// If user is a student, only show their submissions
	if role == "student" {
		query = query.Where("student_id = ?", userID)
	}

	// Add pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var total int64
	query.Count(&total)

	if err := query.Preload("Student").Offset(offset).Limit(limit).Find(&submissions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch submissions"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": submissions,
		"meta": gin.H{
			"total":  total,
			"page":   page,
			"limit":  limit,
			"offset": offset,
		},
	})
}

func GetSubmission(c *gin.Context) {
	submissionID := c.Param("id")
	userID := c.GetUint("userID")
	role := c.GetString("role")

	var submission models.Submission
	if err := db.DB.Preload("Student").First(&submission, submissionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Submission not found"})
		return
	}

	// Check if user has permission to view this submission
	if role == "student" && submission.StudentID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to view this submission"})
		return
	}

	c.JSON(http.StatusOK, submission)
}

func GradeSubmission(c *gin.Context) {
	submissionID := c.Param("id")
	userID := c.GetUint("userID")

	var submission models.Submission
	if err := db.DB.First(&submission, submissionID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Submission not found"})
		return
	}

	// Check if user is the teacher of the assignment
	var assignment models.Assignment
	if err := db.DB.First(&assignment, submission.AssignmentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	if assignment.TeacherID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to grade this submission"})
		return
	}

	var input struct {
		Score    int    `json:"score" binding:"required,min=0,max=100"`
		Feedback string `json:"feedback" binding:"required,min=1"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.FormatValidationError(err)})
		return
	}

	// Validate score against assignment max score
	if input.Score > assignment.MaxScore {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Score cannot exceed maximum score of %d", assignment.MaxScore)})
		return
	}

	submission.Score = input.Score
	submission.Feedback = input.Feedback
	submission.Status = "graded"
	submission.GradedAt = time.Now()

	if err := db.DB.Save(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to grade submission"})
		return
	}

	c.JSON(http.StatusOK, submission)
}
