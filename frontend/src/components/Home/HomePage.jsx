import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Welcome to AssignHub</h1>
        <p>A modern platform for managing homework assignments</p>
      </div>

      {!user ? (
        <div className="auth-buttons">
          <Link to="/login" className="button primary">
            Login
          </Link>
          <Link to="/register" className="button secondary">
            Register
          </Link>
        </div>
      ) : (
        <div className="dashboard-preview">
          <h2>Quick Access</h2>
          <div className="quick-links">
            <Link to="/assignments" className="card">
              <h3>View Assignments</h3>
              <p>Check your current assignments and submissions</p>
            </Link>

            {user.role === 'teacher' && (
              <Link to="/assignments/new" className="card">
                <h3>Create Assignment</h3>
                <p>Create a new assignment for your students</p>
              </Link>
            )}

            <Link to="/profile" className="card">
              <h3>Profile Settings</h3>
              <p>Manage your account settings</p>
            </Link>
          </div>
        </div>
      )}

      <div className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Assignment Management</h3>
            <p>Create, edit, and manage assignments with ease</p>
          </div>

          <div className="feature-card">
            <h3>File Submissions</h3>
            <p>Support for various file formats in submissions</p>
          </div>

          <div className="feature-card">
            <h3>Code Execution</h3>
            <p>Run and test code submissions in real-time</p>
          </div>

          <div className="feature-card">
            <h3>Grading System</h3>
            <p>Efficient grading and feedback system</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 