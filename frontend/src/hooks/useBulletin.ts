import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createArticle, getArticles } from '../api/bulletin'

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: getArticles,
  })
}

export function useCreateArticle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}
