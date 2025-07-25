import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Project, InsertProject } from '@shared/schema';

export function useProjects(userId: string) {
  return useQuery({
    queryKey: ['/api/projects', userId],
    queryFn: () => apiRequest(`/projects?userId=${userId}`),
    enabled: !!userId,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['/api/projects', id],
    queryFn: () => apiRequest(`/projects/${id}`),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: InsertProject) =>
      apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(project),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, project }: { id: string; project: Partial<InsertProject> }) =>
      apiRequest(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(project),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', data.id] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/projects/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}