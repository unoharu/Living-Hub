import { useTranslation } from 'react-i18next'
import { useFavorites } from '../hooks/useProperties'
import { useMyViewingRequests } from '../hooks/useInquiries'
import { useMe } from '../hooks/useAuth'
import PropertyCard from '../components/property/PropertyCard'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import type { ViewingRequestStatus } from '../types/inquiry'

const statusBadgeColor: Record<ViewingRequestStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function MyPage() {
  const { t } = useTranslation()
  const { data: user } = useMe()
  const { data: favorites, isLoading: favLoading, isError: favError } = useFavorites()
  const { data: viewingRequests, isLoading: vrLoading, isError: vrError } = useMyViewingRequests()

  return (
    <div className="space-y-10">
      {/* Profile section */}
      <section>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('nav.mypage')}</h1>
        {user && (
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-gray-700">
              {user.last_name} {user.first_name}
            </p>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
        )}
      </section>

      {/* Viewing requests section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('viewing.sectionTitle')}
        </h2>

        {vrLoading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {vrError && <ErrorMessage message={t('error.serverError')} />}

        {viewingRequests && viewingRequests.length === 0 && (
          <p className="text-gray-500 text-sm">{t('viewing.empty')}</p>
        )}

        {viewingRequests && viewingRequests.length > 0 && (
          <div className="space-y-3">
            {viewingRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl border border-gray-200 bg-white p-4 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-gray-900 text-sm">{req.property_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('viewing.unit')}: {req.unit_room_number}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('viewing.date')}: {req.preferred_date}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeColor[req.status]}`}
                >
                  {req.status_display}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Favorites section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('nav.favorites')}
        </h2>

        {favLoading && (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        )}

        {favError && <ErrorMessage message={t('error.serverError')} />}

        {favorites && favorites.results.length === 0 && (
          <p className="text-gray-500 text-sm">
            お気に入りに登録した物件はありません
          </p>
        )}

        {favorites && favorites.results.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.results.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
