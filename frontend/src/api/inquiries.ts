import apiClient from './client'
import type { PaginatedResponse } from '../types/api'
import type { CreateViewingRequestData, ViewingRequest } from '../types/inquiry'

export function createViewingRequest(data: CreateViewingRequestData) {
  return apiClient.post<ViewingRequest>('/inquiries/', data).then((r) => r.data)
}

export function getMyViewingRequests() {
  return apiClient
    .get<PaginatedResponse<ViewingRequest>>('/inquiries/mine/')
    .then((r) => r.data.results)
}
