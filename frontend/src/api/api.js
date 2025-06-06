import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const errorMessages = {
    'Invalid input': 'Неверные данные',
    'Only teachers can create assignments': 'Только преподаватели могут создавать задания',
    'Only students can submit assignments': 'Только студенты могут отправлять решения',
    'Only teachers can grade submissions': 'Только преподаватели могут выставлять оценки',
    'Invalid assignment ID': 'Неверный идентификатор задания',
    'Invalid submission ID': 'Неверный идентификатор решения',
    'Grade must be between 0 and 100': 'Оценка должна быть от 0 до 100',
    'Failed to save file': 'Не удалось сохранить файл',
    'Failed to fetch assignments': 'Не удалось загрузить задания',
    'Failed to fetch submissions': 'Не удалось загрузить решения',
    'You are not assigned to this assignment': 'Вы не назначены на это задание',
    'Invalid token': 'Неверный токен',
    'Authorization header required': 'Требуется заголовок авторизации',
    'Invalid authorization header': 'Неверный заголовок авторизации',
    'Failed to send request to Judge0': 'Не удалось отправить запрос в Judge0',
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || 'Произошла ошибка';
        throw new Error(errorMessages[message] || message);
    }
);

export const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
};

export const register = async (user) => {
    const response = await api.post('/register', user);
    return response.data;
};

export const getAssignments = async (page, limit) => {
    const response = await api.get('/assignments', { params: { page, limit } });
    return response.data;
};

export const createAssignment = async (formData) => {
    const response = await api.post('/assignments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateAssignment = async (id, assignment) => {
    const response = await api.put(`/assignments/${id}`, assignment);
    return response.data;
};

export const deleteAssignment = async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
};

export const getSubmissions = async (page, limit) => {
    const response = await api.get('/submissions', { params: { page, limit } });
    return response.data;
};

export const submitAssignment = async (assignmentId, submission) => {
    const response = await api.post(`/assignments/${assignmentId}/submit`, submission);
    return response.data;
};

export const gradeSubmission = async (submissionId, grade) => {
    const response = await api.put(`/submissions/${submissionId}/grade`, grade);
    return response.data;
};

export const runCode = async (judgeRequest) => {
    const response = await api.post(`/submissions/run`, judgeRequest);
    return response.data;
};

export const getStudents = async () => {
    const response = await api.get('/users/students');
    return response.data;
};