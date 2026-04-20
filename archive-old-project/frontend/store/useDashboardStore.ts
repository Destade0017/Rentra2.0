import { create } from 'zustand';
import api from '@/lib/axios';
import { useAuthStore } from './useAuthStore';

export interface DashboardStats {
  totalRevenue: number;
  propertiesCount: number;
  tenantsCount: number;
  paidTenants: number;
  owingTenants: number;
  openComplaints: number;
  occupancyRate: number;
  vacantUnits: number;
  outstandingRevenue?: number;
}

export interface Tenant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  rentStatus: 'paid' | 'unpaid' | 'overdue' | 'part-payment';
  rent: number;
  nextRentDate: string;
  property: { _id: string; name: string };
  isDemo?: boolean;
}

export interface Payment {
  _id: string;
  amount: number;
  method: string;
  status: string;
  paymentDate: string;
  tenant: { _id: string; name: string };
  property?: { _id: string; name: string };
  isDemo?: boolean;
}

export interface Complaint {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  property: { _id: string; name: string; address: string };
  tenant: { _id: string; name: string; email: string };
  unit?: string;
  createdAt: string;
}

interface DashboardState {
  stats: DashboardStats | null;
  tenants: Tenant[];
  payments: Payment[];
  complaints: Complaint[];
  loading: boolean;
  isDemoActive: boolean;
  error: string | null;
  
  fetchDashboard: () => Promise<void>;
  fetchTenants: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  fetchComplaints: () => Promise<void>;
  fetchPaymentStats: () => Promise<void>;
  recordPayment: (paymentData: any) => Promise<{ success: boolean; message?: string }>;
  submitComplaint: (complaintData: any) => Promise<{ success: boolean; message?: string }>;
  updateComplaint: (id: string, updateData: any) => Promise<{ success: boolean; message?: string }>;
  loadDemoData: () => Promise<{ success: boolean; message?: string }>;
  clearDemoData: () => Promise<{ success: boolean; message?: string }>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  tenants: [],
  payments: [],
  complaints: [],
  loading: false,
  isDemoActive: false,
  error: null,

  fetchComplaints: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/complaints');
      if (res.data.success) {
        set({ complaints: res.data.data, loading: false });
      }
    } catch (err: any) {
      set({ loading: false });
      console.error('Fetch complaints error:', err);
    }
  },

  submitComplaint: async (complaintData) => {
    set({ loading: true });
    try {
      const res = await api.post('/complaints', complaintData);
      if (res.data.success) {
        await get().fetchComplaints();
        await get().fetchDashboard();
        set({ loading: false });
        return { success: true };
      }
      return { success: false, message: 'Failed to submit' };
    } catch (err: any) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || 'Error submitting complaint' };
    }
  },

  updateComplaint: async (id, updateData) => {
    set({ loading: true });
    try {
      const res = await api.patch(`/complaints/${id}`, updateData);
      if (res.data.success) {
        await get().fetchComplaints();
        set({ loading: false });
        return { success: true };
      }
      return { success: false, message: 'Update failed' };
    } catch (err: any) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || 'Error updating complaint' };
    }
  },

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        set({ stats: res.data.data, loading: false });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch stats', loading: false });
    }
  },

  fetchTenants: async () => {
    try {
      const res = await api.get('/tenants');
      if (res.data.success) {
        const tenantsList = res.data.data;
        const hasDemo = tenantsList.some((t: any) => t.isDemo === true);
        set({ tenants: tenantsList, isDemoActive: hasDemo || get().isDemoActive });
      }
    } catch (err: any) {
      console.error(err);
    }
  },

  fetchPayments: async () => {
    set({ loading: true });
    try {
      const role = useAuthStore.getState().user?.role;
      const endpoint = role === 'tenant' ? '/payments/me' : '/payments';
      const res = await api.get(endpoint);
      
      if (res.data.success) {
        set({ payments: res.data.data, loading: false });
      }
    } catch (err: any) {
      set({ loading: false });
      console.error('Fetch payments error:', err);
    }
  },

  fetchPaymentStats: async () => {
    try {
      const res = await api.get('/payments/stats/summary');
      if (res.data.success) {
        const paymentStats = res.data.data;
        set((state) => ({
          stats: state.stats ? { ...state.stats, outstandingRevenue: paymentStats.outstandingRevenue } : null
        }));
      }
    } catch (err: any) {
      console.error(err);
    }
  },

  recordPayment: async (paymentData) => {
    set({ loading: true });
    try {
      const res = await api.post('/payments', paymentData);
      if (res.data.success) {
        await get().fetchPayments();
        await get().fetchDashboard();
        set({ loading: false });
        return { success: true };
      }
      return { success: false, message: 'Failed to record payment' };
    } catch (err: any) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || 'Error recording payment' };
    }
  },

  loadDemoData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/demo/load');
      if (res.data.success) {
        set({ isDemoActive: true });
        await get().fetchDashboard();
        await get().fetchTenants();
        await get().fetchPayments();
        return { success: true, message: res.data.message };
      }
      return { success: false, message: 'Failed to load demo data' };
    } catch (err: any) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || 'Error loading demo data' };
    }
  },

  clearDemoData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/demo/clear');
      if (res.data.success) {
        set({ isDemoActive: false });
        await get().fetchDashboard();
        await get().fetchTenants();
        await get().fetchPayments();
        return { success: true, message: res.data.message };
      }
      return { success: false, message: 'Failed to clear demo data' };
    } catch (err: any) {
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || 'Error clearing demo data' };
    }
  }
}));
