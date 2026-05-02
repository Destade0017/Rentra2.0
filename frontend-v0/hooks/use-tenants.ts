import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useTenants() {
  return useQuery({
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
    mutationFn: async (newTenant: any) => {
      const { data } = await api.post('/tenants', newTenant);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
    },
  });
}
