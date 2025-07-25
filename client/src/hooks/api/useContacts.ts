import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Contact, InsertContact } from '@shared/schema';

export function useContacts(userId: string) {
  return useQuery({
    queryKey: ['/api/contacts', userId],
    queryFn: () => apiRequest(`/contacts?userId=${userId}`),
    enabled: !!userId,
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ['/api/contacts', id],
    queryFn: () => apiRequest(`/contacts/${id}`),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (contact: InsertContact) =>
      apiRequest('/contacts', {
        method: 'POST',
        body: JSON.stringify(contact),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, contact }: { id: string; contact: Partial<InsertContact> }) =>
      apiRequest(`/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(contact),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contacts', data.id] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/contacts/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
  });
}