import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAssignments: 0,
    pendingSubmissions: 0,
    completedAssignments: 0,
    averageScore: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setStats(data.stats);
        setRecentActivities(data.recentActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName}!</h1>
        <p>Here's what's happening with your assignments</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-info">
            <h3>Total Assignments</h3>
            <p>{stats.totalAssignments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>Pending Submissions</h3>
            <p>{stats.pendingSubmissions}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>Completed</h3>
            <p>{stats.completedAssignments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <h3>Average Score</h3>
            <p>{stats.averageScore}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-activities">
          <div className="section-header">
            <h2>Recent Activities</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activities-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <i className={`fas ${activity.icon}`}></i>
                </div>
                <div className="activity-info">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="upcoming-deadlines">
          <div className="section-header">
            <h2>Upcoming Deadlines</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="deadlines-list">
            {stats.upcomingDeadlines?.map((deadline, index) => (
              <div key={index} className="deadline-item">
                <div className="deadline-info">
                  <h4>{deadline.title}</h4>
                  <p>{deadline.course}</p>
                </div>
                <div className="deadline-date">
                  <span className="date">{deadline.date}</span>
                  <span className="time-left">{deadline.timeLeft}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 