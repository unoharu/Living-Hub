import apiClient from './client'
import type {
  FavoriteToggleResponse,
  PaginatedResponse,
  Property,
  PropertyDetail,
  PropertyFilterParams,
} from '../types/api'

export async function fetchProperties(
  params?: PropertyFilterParams
): Promise<PaginatedResponse<Property>> {
  const { data } = await apiClient.get<PaginatedResponse<Property>>(
    '/properties/',
    { params }
  )
  return data
}

export async function fetchPropertyDetail(id: number): Promise<PropertyDetail> {
  const { data } = await apiClient.get<PropertyDetail>(`/properties/${id}/`)
  return data
}

export async function toggleFavorite(
  propertyId: number
): Promise<FavoriteToggleResponse> {
  const { data } = await apiClient.post<FavoriteToggleResponse>(
    '/interactions/favorites/toggle/',
    { property_id: propertyId }
  )
  return data
}

export async function fetchFavorites(): Promise<PaginatedResponse<Property>> {
  const { data } = await apiClient.get<PaginatedResponse<Property>>(
    '/interactions/favorites/'
  )
  return data
}
