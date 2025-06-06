package handlers

import (
	"AssignHub/models"
	"bytes"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
)

func RunCode(c *gin.Context) {
	var req models.JudgeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	judgeReqBody := map[string]interface{}{
		"source_code": req.SourceCode,
		"language_id": req.LanguageID,
		"stdin":       req.Stdin,
	}

	body, err := json.Marshal(judgeReqBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal request"})
		return
	}

	resp, err := http.Post(os.Getenv("JUDGE0_API_URL")+"/submissions?base64_encoded=false", "application/json", bytes.NewBuffer(body))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request to Judge0"})
		return
	}
	defer resp.Body.Close()

	var judgeResp models.JudgeResponse
	if err := json.NewDecoder(resp.Body).Decode(&judgeResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse Judge0 response"})
		return
	}

	c.JSON(http.StatusOK, judgeResp)
}
