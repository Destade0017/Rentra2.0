import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Tenant {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  property: string | any;
  rentAmount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'pending';
  profileImage?: string;
}

export function useTenants() {
  return useQuery<Tenant[]>({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data } = await api.get('/tenants');
      return data.data || [];
    },
  });
}

export function useAddTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTenant: Partial<Tenant>) => {
      const { data } = await api.post('/tenants', newTenant);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Tenant added successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add tenant');
    },
  });
}

export function useMarkPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tenantId: string) => {
      const { data } = await api.patch(`/tenants/${tenantId}/status`, { status: 'paid' });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      toast.success('Marked as paid');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Could not update payment status');
    },
  });
}
