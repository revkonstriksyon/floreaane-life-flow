import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Task, InsertTask } from '@shared/schema';

export function useTasks(userId: string, projectId?: string) {
  return useQuery({
    queryKey: ['/api/tasks', userId, projectId],
    queryFn: () => {
      const params = new URLSearchParams({ userId });
      if (projectId) params.append('projectId', projectId);
      return apiRequest(`/tasks?${params.toString()}`);
    },
    enabled: !!userId,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['/api/tasks', id],
    queryFn: () => apiRequest(`/tasks/${id}`),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (task: InsertTask) =>
      apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: Partial<InsertTask> }) =>
      apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(task),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks', data.id] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/tasks/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
  });
}