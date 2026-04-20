import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// Robust BASE_URL logic
let baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Ensure /api suffix
if (baseURL.startsWith('http') && !baseURL.endsWith('/api') && !baseURL.includes('/api/')) {
  baseURL = baseURL.endsWith('/') ? `${baseURL}api` : `${baseURL}/api`;
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching JWT
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand store via getState to avoid hook rules
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on unauthorized
      const { logout } = useAuthStore.getState();
      logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
