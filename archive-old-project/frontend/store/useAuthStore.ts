import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'landlord' | 'tenant';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: any) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message?: string }>;
  fetchMe: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<{ success: boolean; message?: string }>;
  changePassword: (passwordData: any) => Promise<{ success: boolean; message?: string }>;
  updatePreferences: (preferences: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
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
           return { success: false, message: 'Login failed' };
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed';
          set({ 
            error: message, 
            loading: false 
          });
          return { success: false, message: message };
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
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
          return { success: false, message: 'Registration failed' };
        } catch (error: any) {
          const message = error.response?.data?.message || 'Registration failed';
          set({ 
            error: message, 
            loading: false 
          });
          return { success: false, message: message };
        }
      },

      forgotPassword: async (email) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/forgot-password', { email });
          set({ loading: false });
          return response.data;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Request failed';
          set({ 
            error: message, 
            loading: false 
          });
          return { success: false, message: message };
        }
      },

      resetPassword: async (token, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.put(`/auth/reset-password/${token}`, { password });
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
          return { success: false, message: 'Reset failed' };
        } catch (error: any) {
          const message = error.response?.data?.message || 'Reset failed';
          set({ 
            error: message, 
            loading: false 
          });
          return { success: false, message: message };
        }
      },

      fetchMe: async () => {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            const userData = response.data.data;
            set({ 
              user: { 
                id: userData._id, 
                name: userData.name, 
                email: userData.email, 
                role: userData.role,
                preferences: userData.preferences
              } as any, 
              isAuthenticated: true 
            });
          }
        } catch (error) {
          // If 401, the axios interceptor already handles logout
        }
      },

      updateProfile: async (profileData) => {
        set({ loading: true });
        try {
          const res = await api.put('/auth/profile', profileData);
          if (res.data.success) {
            const userData = res.data.data;
            set({ 
              user: { 
                id: userData._id, 
                name: userData.name, 
                email: userData.email, 
                role: userData.role 
              },
              loading: false 
            });
            return { success: true };
          }
          return { success: false, message: 'Update failed' };
        } catch (error: any) {
          set({ loading: false });
          return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
      },

      changePassword: async (passwordData) => {
        set({ loading: true });
        try {
          const res = await api.put('/auth/change-password', passwordData);
          set({ loading: false });
          return res.data;
        } catch (error: any) {
          set({ loading: false });
          return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
      },

      updatePreferences: async (preferences) => {
        try {
          const res = await api.put('/auth/preferences', preferences);
          if (res.data.success) {
            set((state: any) => ({
              user: state.user ? { ...state.user, preferences: res.data.data } : null
            }));
            return { success: true };
          }
          return { success: false };
        } catch (error: any) {
          return { success: false };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
