import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),

  // Articles
  getFeed: () => api.get('/articles/feed'),
  getArticlesByAuthor: (authorId: string) => api.get(`/articles/author/${authorId}`),
  createArticle: (data: any) => api.post('/articles', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),
  getArticleById:(id: string) => api.get(`/articles/${id}`),
  updateArticle: (id: string, data: any) => api.patch(`/articles/${id}`, data),
  deleteArticle: (id: string) => api.delete(`/articles/${id}`),
  addReaction: (id: string, type: string) => api.post(`/articles/${id}/reactions`, { type }),
  removeReaction: (id: string, type: string) => api.delete(`/articles/${id}/reactions`, { data: { type } }),

  // User
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: FormData) => {
   
    return api.patch('/users/profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updatePassword: (data: any) => api.patch('/users/password', data),
  updatePreferences: (data: any) => api.post('/users/preferences', data),
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp && decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

export default api; 