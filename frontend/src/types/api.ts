// API response types matching Django REST Framework serializers

export interface PropertyImage {
  id: number
  image: string
  order: number
}

export interface UnitImage {
  id: number
  image: string
  order: number
}

export interface Amenity {
  id: number
  name: string
}

export interface AmenityGroup {
  category_id: number
  category: string
  items: Amenity[]
}

export type UnitAvailability = 'available' | 'reserved' | 'contracted'

export interface Unit {
  id: number
  room_number: string
  floor: number
  layout: string
  layout_image: string | null
  area: string
  rent: number
  management_fee: number
  deposit_months: number
  key_money_months: number
  credit_card_ok: boolean
  parking: boolean
  pet_allowed: boolean
  position: string
  remarks: string
  tour_url: string
  has_3d_model: boolean
  availability: UnitAvailability
  images: UnitImage[]
  amenities_by_category: AmenityGroup[]
}

// Lightweight property for list pages
export interface Property {
  id: number
  property_name: string
  ward_name: string
  city_name: string
  station: string
  line: string
  walk_minute: number
  year_built: number
  cover_image: string | null
  property_type_name: string
  min_rent: number | null
  is_favorite: boolean
}

// Full property detail with nested images and units
export interface PropertyDetail extends Property {
  address: string
  phone_number: string
  images: PropertyImage[]
  units: Unit[]
}

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface PropertyFilterParams {
  ward?: string
  city?: string
  min_rent?: number
  max_rent?: number
  layout?: string
  page?: number
  search?: string
}

export interface FavoriteToggleResponse {
  added: boolean
  property_id: number
}

export interface RegisterData {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
}
