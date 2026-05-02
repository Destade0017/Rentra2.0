import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Property {
  _id: string;
  name: string;
  address: string;
  images: string[];
}

export function useProperties() {
  return useQuery<Property[]>({
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
    mutationFn: async (newProperty: Partial<Property>) => {
      const { data } = await api.post('/properties', newProperty);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
