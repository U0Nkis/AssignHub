package models

import (
	"time"
)

type Assignment struct {
	ID          uint         `gorm:"primarykey" json:"id"`
	CreatedAt   time.Time    `json:"created_at"`
	UpdatedAt   time.Time    `json:"updated_at"`
	Title       string       `gorm:"size:255;not null" json:"title"`
	Description string       `gorm:"type:text" json:"description"`
	DueDate     time.Time    `json:"due_date"`
	TeacherID   uint         `gorm:"not null" json:"teacher_id"`
	Teacher     User         `gorm:"foreignKey:TeacherID" json:"teacher"`
	Files       []File       `gorm:"many2many:assignment_files;" json:"files"`
	Submissions []Submission `json:"submissions"`
	Status      string       `gorm:"size:50;default:'active'" json:"status"`
	MaxScore    int          `gorm:"default:100" json:"max_score"`
	Type        string       `gorm:"size:50;default:'homework'" json:"type"` // homework, quiz, project
}

type File struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Name      string    `gorm:"size:255;not null" json:"name"`
	Path      string    `gorm:"size:255;not null" json:"path"`
	Type      string    `gorm:"size:50" json:"type"`
	Size      int64     `json:"size"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"user"`
}

type Submission struct {
	ID           uint       `gorm:"primarykey" json:"id"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
	AssignmentID uint       `gorm:"not null" json:"assignment_id"`
	Assignment   Assignment `gorm:"foreignKey:AssignmentID" json:"assignment"`
	StudentID    uint       `gorm:"not null" json:"student_id"`
	Student      User       `gorm:"foreignKey:StudentID" json:"student"`
	Files        []File     `gorm:"many2many:submission_files;" json:"files"`
	Score        int        `json:"score"`
	Feedback     string     `gorm:"type:text" json:"feedback"`
	Status       string     `gorm:"size:50;default:'submitted'" json:"status"` // submitted, graded, late
	SubmittedAt  time.Time  `json:"submitted_at"`
}
