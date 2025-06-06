import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const SubmitAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    file: null,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const response = await axios.get(`/api/assignments/${id}`);
      setAssignment(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch assignment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('content', formData.content);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      await axios.post(`/api/assignments/${id}/submit`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/assignments/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!assignment) return <div>Assignment not found</div>;

  return (
    <div className="submit-assignment">
      <h2>Submit Assignment: {assignment.title}</h2>

      <div className="assignment-info">
        <p><strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleString()}</p>
        <p><strong>Instructions:</strong> {assignment.instructions}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Your Submission</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Enter your submission text here..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload File (Optional)</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.txt"
          />
          <small>Accepted formats: PDF, DOC, DOCX, TXT</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/assignments/${id}`)}
            className="button secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="button primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}; 