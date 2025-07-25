import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Note, InsertNote } from '@shared/schema';

export function useNotes(userId: string) {
  return useQuery({
    queryKey: ['/api/notes', userId],
    queryFn: () => apiRequest(`/notes?userId=${userId}`),
    enabled: !!userId,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ['/api/notes', id],
    queryFn: () => apiRequest(`/notes/${id}`),
    enabled: !!id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (note: InsertNote) =>
      apiRequest('/notes', {
        method: 'POST',
        body: JSON.stringify(note),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: Partial<InsertNote> }) =>
      apiRequest(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(note),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes', data.id] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/notes/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    },
  });
}