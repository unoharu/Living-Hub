import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createViewingRequest, getMyViewingRequests } from '../api/inquiries'

export function useMyViewingRequests() {
  return useQuery({
    queryKey: ['viewingRequests'],
    queryFn: getMyViewingRequests,
  })
}

export function useCreateViewingRequest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createViewingRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['viewingRequests'] })
    },
  })
}
