import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data } = await api.get('/properties');
      return data.data || [];
    },
  });
}

export function useAddProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProperty: any) => {
      const { data } = await api.post('/properties', newProperty);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
