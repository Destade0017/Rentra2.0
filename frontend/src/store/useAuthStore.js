import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api') + '/auth';

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Login action
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/login`, { email, password });
          if (response.data.success) {
            const userData = response.data.data;
            set({ 
              user: { 
                id: userData._id, 
                name: userData.name, 
                email: userData.email, 
                role: userData.role 
              }, 
              token: userData.token,
              isAuthenticated: true,
              loading: false 
            });
            return { success: true };
          }
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Login failed', 
            loading: false 
          });
          return { success: false, message: get().error };
        }
      },

      // Register action
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/register`, userData);
          if (response.data.success) {
            const registeredUser = response.data.data;
            set({ 
              user: { 
                id: registeredUser._id, 
                name: registeredUser.name, 
                email: registeredUser.email, 
                role: registeredUser.role 
              }, 
              token: registeredUser.token,
              isAuthenticated: true,
              loading: false 
            });
            return { success: true };
          }
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Registration failed', 
            loading: false 
          });
          return { success: false, message: get().error };
        }
      },

      // Fetch current user (Production-ready sync)
      fetchMe: async () => {
        const { token } = get();
        if (!token) return;
        
        try {
          const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            set({ user: response.data.data, isAuthenticated: true });
          }
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      // Logout action
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
        localStorage.removeItem('auth-storage');
      },

      // Clear Errors
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);
