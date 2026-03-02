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
    e.preventDefault()
    if (!isAuthenticated) return
    toggleFavorite.mutate(property.id)
  }

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block rounded-2xl bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border-0"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {property.cover_image ? (
          <>
            <img
              src={property.cover_image}
              alt={property.property_name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Bottom gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        {/* Favorite button */}
        {isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            aria-label={property.is_favorite ? t('property.unfavorite') : t('property.favorite')}
            className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-colors backdrop-blur-sm"
          >
            <svg
              className={`h-4 w-4 ${property.is_favorite ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-400'}`}
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

        {/* Location with pin icon */}
        <p className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <svg className="h-3 w-3 shrink-0 text-[#b8ca80]" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.07-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 0 0-16 0c0 3.63 1.556 6.326 3.5 8.327a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.144.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>
          {property.city_name} {property.ward_name}
        </p>

        {/* Station info */}
        <p className="text-xs text-gray-400 mb-3">
          {property.line} {property.station} {t('property.walk')}{property.walk_minute}{t('property.minutes')}
        </p>

        {/* Rent — sage green accent */}
        <div className="flex items-baseline gap-1">
          {property.min_rent != null ? (
            <>
              <span className="text-lg font-bold" style={{ color: '#1a1f2e' }}>
                ¥{property.min_rent.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400">/月〜</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </div>
      </div>
    </Link>
  )
}
