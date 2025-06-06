import axios from './axios';

// Auth API
export const login = async (username, password) => {
  const response = await axios.post('/api/login', { username, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await axios.post('/api/register', userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await axios.get('/api/profile');
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await axios.put('/api/profile', userData);
  return response.data;
};

export const updatePassword = async (passwordData) => {
  const response = await axios.put('/api/profile/password', passwordData);
  return response.data;
};

export const deleteProfile = async () => {
  const response = await axios.delete('/api/profile');
  return response.data;
};

// Assignment API
export const getAssignments = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await axios.get(`/api/assignments?${params.toString()}`);
  return response.data;
};

export const getAssignment = async (id) => {
  const response = await axios.get(`/api/assignments/${id}`);
  return response.data;
};

export const createAssignment = async (assignmentData) => {
  const response = await axios.post('/api/assignments', assignmentData);
  return response.data;
};

export const updateAssignment = async (id, assignmentData) => {
  const response = await axios.put(`/api/assignments/${id}`, assignmentData);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await axios.delete(`/api/assignments/${id}`);
  return response.data;
};

// Submission API
export const getSubmissions = async (assignmentId) => {
  const response = await axios.get(`/api/assignments/${assignmentId}/submissions`);
  return response.data;
};

export const getSubmission = async (id) => {
  const response = await axios.get(`/api/submissions/${id}`);
  return response.data;
};

export const submitAssignment = async (assignmentId, submissionData) => {
  const formData = new FormData();
  formData.append('content', submissionData.content);
  if (submissionData.file) {
    formData.append('file', submissionData.file);
  }

  const response = await axios.post(`/api/assignments/${assignmentId}/submit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const gradeSubmission = async (id, gradeData) => {
  const response = await axios.put(`/api/submissions/${id}/grade`, gradeData);
  return response.data;
};

export const addFeedback = async (id, feedbackData) => {
  const response = await axios.post(`/api/submissions/${id}/feedback`, feedbackData);
  return response.data;
};

// File API
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getFile = async (id) => {
  const response = await axios.get(`/api/files/${id}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const deleteFile = async (id) => {
  const response = await axios.delete(`/api/files/${id}`);
  return response.data;
};

// Code API
export const runCode = async (codeData) => {
  const response = await axios.post('/api/code/run', codeData);
  return response.data;
};

export const getCodeResult = async (token) => {
  const response = await axios.get(`/api/code/result/${token}`);
  return response.data;
}; 