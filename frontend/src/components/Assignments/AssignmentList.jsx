import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchAssignments();
  }, [filters]);

  const fetchAssignments = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(`/api/assignments?${params.toString()}`);
      setAssignments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch assignments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="assignment-list">
      <div className="filters">
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
        >
          <option value="">All Types</option>
          <option value="homework">Homework</option>
          <option value="project">Project</option>
          <option value="quiz">Quiz</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
        </select>

        {user.role === 'teacher' && (
          <Link to="/assignments/new" className="button">
            Create Assignment
          </Link>
        )}
      </div>

      <div className="assignments">
        {assignments.map(assignment => (
          <div key={assignment.id} className="assignment-card">
            <h3>{assignment.title}</h3>
            <p>{assignment.description}</p>
            <div className="assignment-meta">
              <span className="type">{assignment.type}</span>
              <span className="status">{assignment.status}</span>
              <span className="due-date">
                Due: {new Date(assignment.due_date).toLocaleDateString()}
              </span>
            </div>
            <div className="assignment-actions">
              <Link to={`/assignments/${assignment.id}`} className="button">
                View Details
              </Link>
              {user.role === 'teacher' && assignment.teacher_id === user.id && (
                <>
                  <Link
                    to={`/assignments/${assignment.id}/edit`}
                    className="button"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(assignment.id)}
                    className="button delete"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 