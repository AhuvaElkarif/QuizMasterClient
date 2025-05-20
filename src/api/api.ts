import axios from 'axios';
import { User, Question, Quiz, QuizResult } from '../types';

// בפרויקט אמיתי נשתמש בכתובת השרת האמיתית
const API_URL = 'https://localhost:7104/';

const api = axios.create({
  baseURL: 'https://localhost:7104',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// פונקציות לאותנטיקציה
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (username: string, email: string, password: string, role: string) => {
    const response = await api.post('/auth/register', { username, email, password, role });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: () => {
    setAuthToken(null);
  }
};

// פונקציות לניהול שאלות (למורים)
export const questionsAPI = {
  getQuestions: async () => {
    const response = await api.get('/questions');
    console.log("tttt", response)
    return response.data;
  },
  getQuestion: async (id: string) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },
  createQuestion: async (question: Omit<Question, 'id' | 'createdAt' | 'createdBy'>) => {
    const response = await api.post('/questions', question);
    console.log("רקדפםמדקקק",response)
    return response.data;
  },
  updateQuestion: async (id: string, questionData: Partial<Question>) => {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  },
  deleteQuestion: async (id: string) => {
    const response = await api.delete(`/questions/${id}`);
    return response.data;
  }
};

// פונקציות לניהול מבחנים (לתלמידים)
export const quizAPI = {
  getRandomQuiz: async (questionCount: number = 10) => {
    const response = await api.get(`/quiz/random?count=${questionCount}`);
    return response.data;
  },
  submitQuiz: async (quizId: string, answers: Record<string, string>) => {
    const response = await api.post(`/quiz/${quizId}/submit`, { answers });
    return response.data;
  },
  getQuizResults: async (quizId: string) => {
    const response = await api.get(`/quiz/${quizId}/results`);
    return response.data;
  },
  getStudentResults: async () => {
    const response = await api.get('/quiz/my-results');
    return response.data;
  }
};

export default api;