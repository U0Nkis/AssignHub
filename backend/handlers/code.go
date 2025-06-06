package handlers

import (
	"AssignHub/db"
	"AssignHub/models"
	"AssignHub/utils"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	Judge0APIURL = "http://judge0:2358"
	MaxCodeSize  = 100 * 1024 // 100KB
)

type CodeExecutionRequest struct {
	SourceCode string `json:"source_code" binding:"required,max=100000"`
	LanguageID int    `json:"language_id" binding:"required"`
	Input      string `json:"input"`
}

type CodeExecutionResponse struct {
	Token         string `json:"token"`
	Stdout        string `json:"stdout"`
	Stderr        string `json:"stderr"`
	CompileOutput string `json:"compile_output"`
	Status        string `json:"status"`
}

func ExecuteCode(c *gin.Context) {
	userID := c.GetUint("userID")
	assignmentID := c.Param("id")

	// Check if assignment exists and is active
	var assignment models.Assignment
	if err := db.DB.First(&assignment, assignmentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	if assignment.Type != "programming" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "This assignment is not a programming assignment"})
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

	var req CodeExecutionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": utils.FormatValidationError(err)})
		return
	}

	// Validate code size
	if len(req.SourceCode) > MaxCodeSize {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Code size exceeds maximum limit of %dKB", MaxCodeSize/1024)})
		return
	}

	// Create submission record
	submission := models.Submission{
		AssignmentID: utils.StringToUint(assignmentID),
		StudentID:    userID,
		Content:      req.SourceCode,
		Status:       "submitted",
		SubmittedAt:  time.Now(),
	}

	if err := db.DB.Create(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create submission"})
		return
	}

	// Send code to Judge0
	judge0Req := map[string]interface{}{
		"source_code": req.SourceCode,
		"language_id": req.LanguageID,
		"stdin":       req.Input,
	}

	jsonData, err := json.Marshal(judge0Req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare code execution request"})
		return
	}

	resp, err := http.Post(Judge0APIURL+"/submissions", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to code execution service"})
		return
	}
	defer resp.Body.Close()

	var judge0Resp CodeExecutionResponse
	if err := json.NewDecoder(resp.Body).Decode(&judge0Resp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse code execution response"})
		return
	}

	// Update submission with execution results
	submission.Status = judge0Resp.Status
	submission.Output = judge0Resp.Stdout
	submission.Error = judge0Resp.Stderr
	submission.CompileOutput = judge0Resp.CompileOutput

	if err := db.DB.Save(&submission).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update submission with execution results"})
		return
	}

	c.JSON(http.StatusOK, judge0Resp)
}

func GetSupportedLanguages(c *gin.Context) {
	resp, err := http.Get(Judge0APIURL + "/languages")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch supported languages"})
		return
	}
	defer resp.Body.Close()

	var languages []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&languages); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse languages response"})
		return
	}

	c.JSON(http.StatusOK, languages)
}
