import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchFavorites,
  fetchProperties,
  fetchPropertyDetail,
  toggleFavorite,
} from '../api/properties'
import type { PaginatedResponse, Property, PropertyFilterParams } from '../types/api'

export function useProperties(params?: PropertyFilterParams) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => fetchProperties(params),
  })
}

export function usePropertyDetail(id: number) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchPropertyDetail(id),
    enabled: id > 0,
  })
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (propertyId: number) => toggleFavorite(propertyId),

    // Optimistic update: flip is_favorite immediately for better UX
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: ['properties'] })

      const snapshots = queryClient
        .getQueriesData<PaginatedResponse<Property>>({ queryKey: ['properties'] })

      queryClient.setQueriesData<PaginatedResponse<Property>>(
        { queryKey: ['properties'] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            results: old.results.map((p) =>
              p.id === propertyId ? { ...p, is_favorite: !p.is_favorite } : p
            ),
          }
        }
      )

      return { snapshots }
    },

    onError: (_err, _propertyId, context) => {
      // Roll back optimistic update on failure
      if (context?.snapshots) {
        for (const [queryKey, data] of context.snapshots) {
          queryClient.setQueryData(queryKey, data)
        }
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
