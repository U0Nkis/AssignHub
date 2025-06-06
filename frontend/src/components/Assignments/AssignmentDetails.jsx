import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [id]);

  const fetchAssignmentDetails = async () => {
    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        axios.get(`/api/assignments/${id}`),
        axios.get(`/api/assignments/${id}/submissions`)
      ]);

      setAssignment(assignmentRes.data);
      setSubmissions(submissionsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch assignment details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      await axios.delete(`/api/assignments/${id}`);
      navigate('/assignments');
    } catch (err) {
      setError('Failed to delete assignment');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!assignment) return <div>Assignment not found</div>;

  return (
    <div className="assignment-details">
      <div className="assignment-header">
        <h2>{assignment.title}</h2>
        <div className="assignment-meta">
          <span className="type">{assignment.type}</span>
          <span className="status">{assignment.status}</span>
          <span className="due-date">
            Due: {new Date(assignment.due_date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="assignment-content">
        <div className="description">
          <h3>Description</h3>
          <p>{assignment.description}</p>
        </div>

        <div className="instructions">
          <h3>Instructions</h3>
          <p>{assignment.instructions}</p>
        </div>

        <div className="submissions">
          <h3>Submissions</h3>
          {submissions.length === 0 ? (
            <p>No submissions yet</p>
          ) : (
            <div className="submissions-list">
              {submissions.map(submission => (
                <div key={submission.id} className="submission-card">
                  <div className="submission-header">
                    <span className="student">
                      {submission.student.first_name} {submission.student.last_name}
                    </span>
                    <span className="submitted-at">
                      Submitted: {new Date(submission.submitted_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="submission-content">
                    <p>{submission.content}</p>
                    {submission.file_url && (
                      <a
                        href={submission.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Submitted File
                      </a>
                    )}
                  </div>
                  {user.role === 'teacher' && (
                    <div className="submission-grading">
                      <input
                        type="number"
                        min="0"
                        max={assignment.max_score}
                        value={submission.score || ''}
                        onChange={async (e) => {
                          try {
                            await axios.put(`/api/submissions/${submission.id}/grade`, {
                              score: e.target.value
                            });
                            fetchAssignmentDetails();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        placeholder="Enter score"
                      />
                      <button
                        onClick={async () => {
                          try {
                            await axios.post(`/api/submissions/${submission.id}/feedback`, {
                              feedback: 'Great work!'
                            });
                            fetchAssignmentDetails();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        Add Feedback
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="assignment-actions">
        {user.role === 'teacher' && assignment.teacher_id === user.id && (
          <>
            <button
              onClick={() => navigate(`/assignments/${id}/edit`)}
              className="button"
            >
              Edit Assignment
            </button>
            <button
              onClick={handleDelete}
              className="button delete"
            >
              Delete Assignment
            </button>
          </>
        )}
        {user.role === 'student' && (
          <div className="assignment-actions">
            <button
              onClick={() => navigate(`/assignments/${id}/submit`)}
              className="button primary"
            >
              Submit Assignment
            </button>
            {assignment.type === 'programming' && (
              <button
                onClick={() => navigate(`/assignments/${id}/code`)}
                className="button secondary"
              >
                Open Code Editor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 