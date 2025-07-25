import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Asset, InsertAsset } from '@shared/schema';

export function useAssets(userId: string) {
  return useQuery({
    queryKey: ['/api/assets', userId],
    queryFn: () => apiRequest(`/api/assets?userId=${userId}`),
    enabled: !!userId,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (asset: InsertAsset) => 
      apiRequest('/api/assets', {
        method: 'POST',
        body: JSON.stringify(asset),
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets', variables.userId] });
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, asset }: { id: string; asset: Partial<Asset> }) =>
      apiRequest(`/api/assets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(asset),
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/assets/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
    },
  });
}