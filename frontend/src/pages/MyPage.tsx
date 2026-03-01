import { useTranslation } from 'react-i18next'
import { useFavorites } from '../hooks/useProperties'
import { useMe } from '../hooks/useAuth'
import PropertyCard from '../components/property/PropertyCard'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function MyPage() {
  const { t } = useTranslation()
  const { data: user } = useMe()
  const { data: favorites, isLoading, isError } = useFavorites()

  return (
    <div className="space-y-8">
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

      {/* Favorites section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {t('nav.favorites')}
        </h2>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        )}

        {isError && <ErrorMessage message={t('error.serverError')} />}

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
