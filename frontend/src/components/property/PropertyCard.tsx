import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { Property } from '../../types/api'
import useAuthStore from '../../stores/authStore'
import { useToggleFavorite } from '../../hooks/useProperties'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const toggleFavorite = useToggleFavorite()

  function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault() // Prevent card link navigation
    if (!isAuthenticated) return
    toggleFavorite.mutate(property.id)
  }

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {property.cover_image ? (
          <img
            src={property.cover_image}
            alt={property.property_name}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        {/* Favorite button — only for authenticated users */}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            aria-label={
              property.is_favorite ? t('property.unfavorite') : t('property.favorite')
            }
            className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white transition-colors"
          >
            <svg
              className={`h-5 w-5 ${property.is_favorite ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-400'}`}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Property name */}
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
          {property.property_name}
        </h3>

        {/* Location */}
        <p className="text-xs text-gray-500 mb-2">
          {property.city_name} {property.ward_name}
        </p>

        {/* Station info */}
        <p className="text-xs text-gray-500 mb-3">
          {property.line} {property.station}{' '}
          {t('property.walk')}
          {property.walk_minute}
          {t('property.minutes')}
        </p>

        {/* Rent */}
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-gray-500">{t('property.rent')}</span>
          {property.min_rent !== null ? (
            <span className="text-base font-bold text-gray-900">
              ¥{property.min_rent.toLocaleString()}
              <span className="text-xs font-normal text-gray-500">/月〜</span>
            </span>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </div>
      </div>
    </Link>
  )
}
