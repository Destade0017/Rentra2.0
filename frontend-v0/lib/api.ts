import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rentra_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    
    if (error.response?.status === 401) {
      // Avoid infinite loops if checkAuth fails
      const isCheckAuthRequest = error.config.url.includes('/auth/me');
      
      if (!isCheckAuthRequest) {
        localStorage.removeItem('rentra_token');
        toast.error('Session expired. Please login again.');
        window.location.href = '/auth/login';
      }
    } else {
      // Optional: Auto-toast errors for all requests except specific ones
      // toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
