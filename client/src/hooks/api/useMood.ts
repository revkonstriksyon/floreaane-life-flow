import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { MoodEntry, InsertMoodEntry } from '@shared/schema';

export function useMoodEntries(userId: string) {
  return useQuery({
    queryKey: ['/api/mood', userId],
    queryFn: () => apiRequest(`/mood?userId=${userId}`),
    enabled: !!userId,
  });
}

export function useCreateMoodEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (moodEntry: InsertMoodEntry) =>
      apiRequest('/mood', {
        method: 'POST',
        body: JSON.stringify(moodEntry),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood'] });
    },
  });
}