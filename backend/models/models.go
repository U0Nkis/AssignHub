package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"not null" json:"-"`
	FirstName string    `gorm:"not null" json:"first_name"`
	LastName  string    `gorm:"not null" json:"last_name"`
	Role      string    `gorm:"not null;check:role IN ('student', 'teacher')" json:"role"`
	CreatedAt time.Time `gorm:"not null" json:"created_at"`
	UpdatedAt time.Time `gorm:"not null" json:"updated_at"`

	// Relationships
	Assignments []Assignment `gorm:"foreignKey:TeacherID" json:"assignments,omitempty"`
	Submissions []Submission `gorm:"foreignKey:StudentID" json:"submissions,omitempty"`
	Files       []File       `gorm:"foreignKey:UserID" json:"files,omitempty"`
}

type Assignment struct {
	ID           uint      `gorm:"primarykey" json:"id"`
	Title        string    `gorm:"not null" json:"title"`
	Description  string    `gorm:"not null" json:"description"`
	Type         string    `gorm:"not null;check:type IN ('homework', 'project', 'quiz', 'programming')" json:"type"`
	Status       string    `gorm:"not null;check:status IN ('draft', 'active', 'completed')" json:"status"`
	DueDate      time.Time `gorm:"not null" json:"due_date"`
	MaxScore     int       `gorm:"not null;check:max_score > 0" json:"max_score"`
	Instructions string    `gorm:"not null" json:"instructions"`
	TeacherID    uint      `gorm:"not null" json:"teacher_id"`
	CreatedAt    time.Time `gorm:"not null" json:"created_at"`
	UpdatedAt    time.Time `gorm:"not null" json:"updated_at"`

	// Relationships
	Teacher     User         `gorm:"foreignKey:TeacherID" json:"teacher"`
	Submissions []Submission `gorm:"foreignKey:AssignmentID" json:"submissions,omitempty"`
	Files       []File       `gorm:"many2many:assignment_files;" json:"files,omitempty"`
}

type Submission struct {
	ID            uint      `gorm:"primarykey" json:"id"`
	AssignmentID  uint      `gorm:"not null" json:"assignment_id"`
	StudentID     uint      `gorm:"not null" json:"student_id"`
	Content       string    `gorm:"type:text" json:"content"`
	FileURL       string    `json:"file_url"`
	Status        string    `gorm:"not null;check:status IN ('submitted', 'graded', 'returned')" json:"status"`
	Score         int       `json:"score"`
	Feedback      string    `gorm:"type:text" json:"feedback"`
	Output        string    `gorm:"type:text" json:"output"`
	Error         string    `gorm:"type:text" json:"error"`
	CompileOutput string    `gorm:"type:text" json:"compile_output"`
	SubmittedAt   time.Time `gorm:"not null" json:"submitted_at"`
	GradedAt      time.Time `json:"graded_at"`

	// Relationships
	Assignment Assignment `gorm:"foreignKey:AssignmentID" json:"assignment"`
	Student    User       `gorm:"foreignKey:StudentID" json:"student"`
}

type File struct {
	ID          uint      `gorm:"primarykey" json:"id"`
	UserID      uint      `gorm:"not null" json:"user_id"`
	Filename    string    `gorm:"not null" json:"filename"`
	Filepath    string    `gorm:"not null" json:"filepath"`
	ContentType string    `gorm:"not null" json:"content_type"`
	Size        int64     `gorm:"not null" json:"size"`
	UploadedAt  time.Time `gorm:"not null" json:"uploaded_at"`

	// Relationships
	User        User         `gorm:"foreignKey:UserID" json:"user"`
	Assignments []Assignment `gorm:"many2many:assignment_files;" json:"assignments,omitempty"`
}

// BeforeCreate hooks
func (u *User) BeforeCreate(tx *gorm.DB) error {
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	return nil
}

func (a *Assignment) BeforeCreate(tx *gorm.DB) error {
	a.CreatedAt = time.Now()
	a.UpdatedAt = time.Now()
	return nil
}

// BeforeUpdate hooks
func (u *User) BeforeUpdate(tx *gorm.DB) error {
	u.UpdatedAt = time.Now()
	return nil
}

func (a *Assignment) BeforeUpdate(tx *gorm.DB) error {
	a.UpdatedAt = time.Now()
	return nil
}
