export type ViewingRequestStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface ViewingRequest {
  id: number
  unit: number
  unit_room_number: string
  property_name: string
  preferred_date: string
  message: string
  status: ViewingRequestStatus
  status_display: string
  created_at: string
}

export interface CreateViewingRequestData {
  unit: number
  preferred_date: string
  message?: string
}
