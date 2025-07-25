import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Asset, InsertAsset } from '@shared/schema';

export function useAssets(userId: string) {
  return useQuery({
    queryKey: ['/api/assets', userId],
    queryFn: () => apiRequest(`/assets?userId=${userId}`),
    enabled: !!userId,
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ['/api/assets', id],
    queryFn: () => apiRequest(`/assets/${id}`),
    enabled: !!id,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (asset: InsertAsset) =>
      apiRequest('/assets', {
        method: 'POST',
        body: JSON.stringify(asset),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, asset }: { id: string; asset: Partial<InsertAsset> }) =>
      apiRequest(`/assets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(asset),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/assets', data.id] });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/assets/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets'] });
    },
  });
}